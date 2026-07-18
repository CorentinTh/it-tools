import Ajv, { type ErrorObject, type Options, type ValidateFunction } from 'ajv';
import Ajv2019 from 'ajv/dist/2019.js';
import Ajv2020 from 'ajv/dist/2020.js';
import {
  type Node as JsonNode,
  type ParseError,
  getNodeValue,
  parseTree,
  printParseErrorCode,
} from 'jsonc-parser';
import {
  JSON_INSTANCE_MAX_DEPTH,
  JSON_INSTANCE_MAX_NODES,
  JSON_SCHEMA_ALL_ERRORS_MAX_INSTANCE_NODES,
  JSON_SCHEMA_MAX_DEPTH,
  JSON_SCHEMA_MAX_ERRORS,
  JSON_SCHEMA_MAX_NODES,
  type JsonSchemaDraft,
  JsonSchemaTaskError,
  type JsonSchemaValidationError,
  type JsonSchemaValidationResult,
  type JsonSchemaValidationTask,
  type JsonSchemaWarning,
  sanitizeJsonSchemaMessage,
} from './json-schema-validator.worker.protocol';
import { isUnknownRecord } from '@/utils/worker-protocol';

interface ParsedJsonDocument {
  root: JsonNode
  value: unknown
  nodeCount: number
  hasImpreciseNumber: boolean
}

interface DocumentLimits {
  label: 'JSON Schema' | 'JSON instance'
  maxDepth: number
  maxNodes: number
}

interface SchemaInspection {
  hasFormat: boolean
}

interface AjvCompiler {
  compile: (schema: object | boolean) => ValidateFunction
}

export interface JsonSchemaValidationDependencies {
  createCompiler?: (draft: JsonSchemaDraft, allErrors: boolean) => AjvCompiler
}

const ALLOWED_SCHEMA_URIS: Record<JsonSchemaDraft, ReadonlySet<string>> = {
  draft7: new Set([
    'http://json-schema.org/draft-07/schema',
    'http://json-schema.org/draft-07/schema#',
  ]),
  draft2019: new Set([
    'https://json-schema.org/draft/2019-09/schema',
    'https://json-schema.org/draft/2019-09/schema#',
  ]),
  draft2020: new Set([
    'https://json-schema.org/draft/2020-12/schema',
    'https://json-schema.org/draft/2020-12/schema#',
  ]),
};

const SAFE_CONST_KEYWORD = '$itToolsSafeConst';
const SAFE_ENUM_KEYWORD = '$itToolsSafeEnum';
const SAFE_UNIQUE_ITEMS_KEYWORD = '$itToolsSafeUniqueItems';
const JSON_SCHEMA_ALL_ERRORS_MAX_NODE_PAIRS = 20_000;

function isCollection(node: JsonNode): boolean {
  return node.type === 'object' || node.type === 'array';
}

function propertyParts(property: JsonNode): { key: string; value: JsonNode } {
  const keyNode = property.children?.[0];
  const valueNode = property.children?.[1];
  if (
    property.type !== 'property'
    || keyNode?.type !== 'string'
    || typeof keyNode.value !== 'string'
    || valueNode === undefined
  ) {
    throw new JsonSchemaTaskError('operation', 'The parsed JSON property structure is invalid.');
  }

  return { key: keyNode.value, value: valueNode };
}

function boundedText(value: string, fallback: string): string {
  return sanitizeJsonSchemaMessage(value, fallback);
}

function boundedPath(value: string): string {
  return sanitizeJsonSchemaMessage(value, '', false);
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? boundedText(error.message, fallback) : fallback;
}

function parseStrictDocument(source: string, limits: DocumentLimits): ParsedJsonDocument {
  const errors: ParseError[] = [];
  let root: JsonNode | undefined;

  try {
    root = parseTree(source, errors, {
      allowEmptyContent: false,
      allowTrailingComma: false,
      disallowComments: true,
    });
  }
  catch (error) {
    throw new JsonSchemaTaskError(
      'syntax',
      errorMessage(error, `${limits.label} is not valid strict JSON.`),
    );
  }

  if (root === undefined || errors.length > 0) {
    const firstError = errors[0];
    const detail = firstError === undefined
      ? ''
      : ` (${printParseErrorCode(firstError.error)} at character ${firstError.offset + 1})`;
    throw new JsonSchemaTaskError('syntax', `${limits.label} is not valid strict JSON${detail}.`);
  }

  const stack: Array<{ node: JsonNode; collectionDepth: number }> = [{
    node: root,
    collectionDepth: isCollection(root) ? 1 : 0,
  }];
  let nodeCount = 0;
  let hasImpreciseNumber = false;

  while (stack.length > 0) {
    const current = stack.pop();
    if (current === undefined) {
      break;
    }

    nodeCount += 1;
    if (nodeCount > limits.maxNodes) {
      throw new JsonSchemaTaskError(
        'limit',
        `${limits.label} is limited to ${limits.maxNodes.toLocaleString('en')} syntax nodes.`,
      );
    }

    if (current.collectionDepth > limits.maxDepth) {
      throw new JsonSchemaTaskError(
        'limit',
        `${limits.label} nesting is limited to ${limits.maxDepth.toLocaleString('en')} collection levels.`,
      );
    }

    if (current.node.type === 'object') {
      const seenKeys = new Set<string>();
      for (const property of current.node.children ?? []) {
        const { key } = propertyParts(property);
        if (seenKeys.has(key)) {
          throw new JsonSchemaTaskError(
            'syntax',
            `${limits.label} does not allow duplicate decoded object keys.`,
          );
        }
        seenKeys.add(key);
      }
    }

    if (current.node.type === 'number') {
      const lexeme = source.slice(current.node.offset, current.node.offset + current.node.length);
      const value = current.node.value;
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new JsonSchemaTaskError(
          'syntax',
          `${limits.label} contains a number outside the finite JavaScript range.`,
        );
      }

      if (/[.eE]/u.test(lexeme)) {
        hasImpreciseNumber = true;
      }
      else if (!Number.isSafeInteger(value)) {
        throw new JsonSchemaTaskError(
          'syntax',
          `${limits.label} contains an integer outside the JavaScript safe range.`,
        );
      }
    }

    for (const child of current.node.children ?? []) {
      stack.push({
        node: child,
        collectionDepth: current.collectionDepth + (isCollection(child) ? 1 : 0),
      });
    }
  }

  return {
    root,
    value: getNodeValue(root),
    nodeCount,
    hasImpreciseNumber,
  };
}

function inspectSchema(root: JsonNode, draft: JsonSchemaDraft): SchemaInspection {
  if (root.type !== 'object' && root.type !== 'boolean') {
    throw new JsonSchemaTaskError('schema', 'A JSON Schema must be an object or a boolean.');
  }

  if (root.type === 'boolean') {
    return { hasFormat: false };
  }

  let hasFormat = false;
  const stack: JsonNode[] = [root];

  const pushSchema = (node: JsonNode): void => {
    if (node.type === 'object' || node.type === 'boolean') {
      stack.push(node);
    }
  };

  const pushSchemaCollection = (node: JsonNode): void => {
    if (node.type === 'array') {
      for (const child of node.children ?? []) {
        pushSchema(child);
      }
    }
  };

  const pushSchemaMap = (node: JsonNode): void => {
    if (node.type === 'object') {
      for (const property of node.children ?? []) {
        pushSchema(propertyParts(property).value);
      }
    }
  };

  while (stack.length > 0) {
    const node = stack.pop();
    if (node === undefined) {
      break;
    }

    if (node.type === 'boolean') {
      continue;
    }

    for (const property of node.children ?? []) {
      const { key, value } = propertyParts(property);

      if (key === 'format') {
        hasFormat = true;
      }

      if (key === '$async' && value.type === 'boolean' && value.value === true) {
        throw new JsonSchemaTaskError('schema', 'Asynchronous JSON Schemas are not supported.');
      }

      if (key === '$ref' || key === '$recursiveRef' || key === '$dynamicRef') {
        if (value.type === 'string' && typeof value.value === 'string' && !value.value.startsWith('#')) {
          throw new JsonSchemaTaskError(
            'schema',
            'Only fragment-local JSON Schema references are supported; remote and relative references are disabled.',
          );
        }
      }

      if (key === '$vocabulary' && value.type === 'object') {
        for (const vocabulary of value.children ?? []) {
          const parts = propertyParts(vocabulary);
          if (
            parts.key.endsWith('/vocab/format-assertion')
            && parts.value.type === 'boolean'
            && parts.value.value === true
          ) {
            throw new JsonSchemaTaskError(
              'schema',
              'The required format-assertion vocabulary is not supported because format validation is disabled.',
            );
          }
        }
      }

      if (key === '$schema' && value.type === 'string' && typeof value.value === 'string') {
        const uri = value.value;
        if (!ALLOWED_SCHEMA_URIS[draft].has(uri)) {
          throw new JsonSchemaTaskError(
            'schema',
            'The schema declares a meta-schema that does not match the selected draft.',
          );
        }
      }

      if (
        key === '$defs'
        || key === 'definitions'
        || key === 'properties'
        || key === 'patternProperties'
        || key === 'dependentSchemas'
      ) {
        pushSchemaMap(value);
      }
      else if (
        key === 'allOf'
        || key === 'anyOf'
        || key === 'oneOf'
        || key === 'prefixItems'
      ) {
        pushSchemaCollection(value);
      }
      else if (key === 'items') {
        if (value.type === 'array') {
          pushSchemaCollection(value);
        }
        else {
          pushSchema(value);
        }
      }
      else if (key === 'dependencies' && value.type === 'object') {
        for (const dependency of value.children ?? []) {
          const dependencyValue = propertyParts(dependency).value;
          if (dependencyValue.type !== 'array') {
            pushSchema(dependencyValue);
          }
        }
      }
      else if (
        key === 'additionalItems'
        || key === 'additionalProperties'
        || key === 'contains'
        || key === 'contentSchema'
        || key === 'else'
        || key === 'if'
        || key === 'not'
        || key === 'propertyNames'
        || key === 'then'
        || key === 'unevaluatedItems'
        || key === 'unevaluatedProperties'
      ) {
        pushSchema(value);
      }
    }
  }

  return { hasFormat };
}

function ajvOptions(allErrors: boolean): Options {
  return {
    strictSchema: true,
    strictNumbers: true,
    strictTypes: false,
    strictTuples: false,
    strictRequired: false,
    allowMatchingProperties: true,
    validateSchema: true,
    validateFormats: false,
    allErrors,
    inlineRefs: false,
    loopEnum: 50,
    loopRequired: 50,
    coerceTypes: false,
    useDefaults: false,
    removeAdditional: false,
    ownProperties: true,
    verbose: false,
    logger: false,
  };
}

function safeJsonEqual(left: unknown, right: unknown): boolean {
  const stack: Array<[unknown, unknown]> = [[left, right]];

  while (stack.length > 0) {
    const pair = stack.pop();
    if (pair === undefined) {
      break;
    }
    const [leftValue, rightValue] = pair;
    if (leftValue === rightValue) {
      continue;
    }
    if (
      typeof leftValue !== 'object'
      || leftValue === null
      || typeof rightValue !== 'object'
      || rightValue === null
    ) {
      return false;
    }

    const leftIsArray = Array.isArray(leftValue);
    if (leftIsArray !== Array.isArray(rightValue)) {
      return false;
    }

    if (leftIsArray) {
      const rightArray = rightValue as unknown[];
      if (leftValue.length !== rightArray.length) {
        return false;
      }
      for (let index = 0; index < leftValue.length; index += 1) {
        stack.push([leftValue[index], rightArray[index]]);
      }
      continue;
    }

    const leftKeys = Object.keys(leftValue);
    const rightRecord = rightValue as Record<string, unknown>;
    if (leftKeys.length !== Object.keys(rightRecord).length) {
      return false;
    }
    for (const key of leftKeys) {
      if (!Object.prototype.hasOwnProperty.call(rightRecord, key)) {
        return false;
      }
      stack.push([
        (leftValue as Record<string, unknown>)[key],
        rightRecord[key],
      ]);
    }
  }

  return true;
}

function hasSafeJsonDuplicates(values: unknown[]): boolean {
  return !hasUniqueJsonItems(values);
}

function hasUniqueJsonItems(data: unknown): boolean {
  if (!Array.isArray(data)) {
    return true;
  }

  const primitives = new Set<string>();
  const objects: unknown[] = [];
  for (const value of data) {
    if (typeof value === 'object' && value !== null) {
      if (objects.some(previous => safeJsonEqual(value, previous))) {
        return false;
      }
      objects.push(value);
      continue;
    }

    const key = `${value === null ? 'null' : typeof value}:${String(value)}`;
    if (primitives.has(key)) {
      return false;
    }
    primitives.add(key);
  }

  return true;
}

function configureCompiler<T extends Ajv | Ajv2019 | Ajv2020>(
  compiler: T,
  supportsStaticAnchors: boolean,
): T {
  if (supportsStaticAnchors) {
    // Ajv resolves static anchors internally but does not register the
    // annotation keyword in its strict known-keyword set.
    compiler.addKeyword({ keyword: '$anchor', schemaType: 'string' });
  }
  compiler.addKeyword({
    keyword: SAFE_CONST_KEYWORD,
    errors: false,
    validate: (schema: unknown, data: unknown) => safeJsonEqual(schema, data),
  });
  compiler.addKeyword({
    keyword: SAFE_ENUM_KEYWORD,
    schemaType: 'array',
    errors: false,
    validate: (schema: unknown[], data: unknown) => schema.some(value => safeJsonEqual(value, data)),
  });
  compiler.addKeyword({
    keyword: SAFE_UNIQUE_ITEMS_KEYWORD,
    schemaType: 'boolean',
    errors: false,
    validate: (enabled: boolean, data: unknown) => !enabled || hasUniqueJsonItems(data),
  });
  return compiler;
}

function createCompiler(draft: JsonSchemaDraft, allErrors: boolean): AjvCompiler {
  const options = ajvOptions(allErrors);
  if (draft === 'draft2019') {
    return configureCompiler(new Ajv2019(options), true);
  }
  if (draft === 'draft2020') {
    return configureCompiler(new Ajv2020(options), true);
  }
  return configureCompiler(new Ajv(options), false);
}

function normalizeSchemaForAjv(root: object | boolean): void {
  const stack: unknown[] = [root];

  const pushSchema = (value: unknown): void => {
    if (typeof value === 'boolean' || isUnknownRecord(value)) {
      stack.push(value);
    }
  };

  const pushSchemaMap = (value: unknown): void => {
    if (isUnknownRecord(value)) {
      Object.values(value).forEach(pushSchema);
    }
  };

  const pushSchemaCollection = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(pushSchema);
    }
  };

  while (stack.length > 0) {
    const schema = stack.pop();
    if (!isUnknownRecord(schema)) {
      continue;
    }

    for (const reservedKeyword of [SAFE_CONST_KEYWORD, SAFE_ENUM_KEYWORD, SAFE_UNIQUE_ITEMS_KEYWORD]) {
      if (Object.prototype.hasOwnProperty.call(schema, reservedKeyword)) {
        throw new JsonSchemaTaskError('schema', 'The schema uses a reserved internal validation keyword.');
      }
    }

    if (Object.prototype.hasOwnProperty.call(schema, 'const')) {
      schema[SAFE_CONST_KEYWORD] = schema.const;
      Reflect.deleteProperty(schema, 'const');
    }

    if (Object.prototype.hasOwnProperty.call(schema, 'enum') && Array.isArray(schema.enum)) {
      if (schema.enum.length === 0 || hasSafeJsonDuplicates(schema.enum)) {
        throw new JsonSchemaTaskError('schema', 'A JSON Schema enum must contain at least one unique value.');
      }
      schema[SAFE_ENUM_KEYWORD] = schema.enum;
      Reflect.deleteProperty(schema, 'enum');
    }

    if (schema.uniqueItems === true) {
      schema[SAFE_UNIQUE_ITEMS_KEYWORD] = true;
      Reflect.deleteProperty(schema, 'uniqueItems');
    }

    const declaredPatterns = schema.patternProperties;
    if (isUnknownRecord(declaredPatterns) && Object.prototype.hasOwnProperty.call(declaredPatterns, '__proto__')) {
      const safeEquivalentPattern = '(?:__proto__)';
      const prototypePatternSchema = Reflect.get(declaredPatterns, '__proto__');
      if (Object.prototype.hasOwnProperty.call(declaredPatterns, safeEquivalentPattern)) {
        const compound: Record<string, unknown> = Object.create(null);
        compound.allOf = [declaredPatterns[safeEquivalentPattern], prototypePatternSchema];
        declaredPatterns[safeEquivalentPattern] = compound;
      }
      else {
        declaredPatterns[safeEquivalentPattern] = prototypePatternSchema;
      }
      Reflect.deleteProperty(declaredPatterns, '__proto__');
    }

    const dependencies = schema.dependencies;
    if (isUnknownRecord(dependencies) && Object.prototype.hasOwnProperty.call(dependencies, '__proto__')) {
      const prototypeDependency = Reflect.get(dependencies, '__proto__');
      const existingAllOf = schema.allOf;
      if (
        (Array.isArray(prototypeDependency) || typeof prototypeDependency === 'boolean' || isUnknownRecord(prototypeDependency))
        && (existingAllOf === undefined || Array.isArray(existingAllOf))
      ) {
        const condition: Record<string, unknown> = Object.create(null);
        condition.required = ['__proto__'];
        const consequence: unknown = Array.isArray(prototypeDependency)
          ? Object.assign(Object.create(null), { required: prototypeDependency })
          : prototypeDependency;
        const guardedDependency: Record<string, unknown> = Object.create(null);
        guardedDependency.if = condition;
        guardedDependency.then = consequence;
        schema.allOf = existingAllOf === undefined
          ? [guardedDependency]
          : [...existingAllOf, guardedDependency];
        Reflect.deleteProperty(dependencies, '__proto__');
      }
    }

    const properties = schema.properties;
    if (isUnknownRecord(properties) && Object.prototype.hasOwnProperty.call(properties, '__proto__')) {
      const existingPatterns = schema.patternProperties;
      if (existingPatterns === undefined || isUnknownRecord(existingPatterns)) {
        const patterns: Record<string, unknown> = isUnknownRecord(existingPatterns)
          ? existingPatterns
          : Object.create(null);
        const prototypeSchema = Reflect.get(properties, '__proto__');
        const exactPattern = '^__proto__$';

        if (Object.prototype.hasOwnProperty.call(patterns, exactPattern)) {
          const compound: Record<string, unknown> = Object.create(null);
          compound.allOf = [patterns[exactPattern], prototypeSchema];
          patterns[exactPattern] = compound;
        }
        else {
          patterns[exactPattern] = prototypeSchema;
        }

        schema.patternProperties = patterns;
        Reflect.deleteProperty(properties, '__proto__');
      }
    }

    for (const [key, value] of Object.entries(schema)) {
      if (
        key === '$defs'
        || key === 'definitions'
        || key === 'dependentSchemas'
        || key === 'patternProperties'
        || key === 'properties'
      ) {
        pushSchemaMap(value);
      }
      else if (key === 'allOf' || key === 'anyOf' || key === 'oneOf' || key === 'prefixItems') {
        pushSchemaCollection(value);
      }
      else if (key === 'items') {
        if (Array.isArray(value)) {
          pushSchemaCollection(value);
        }
        else {
          pushSchema(value);
        }
      }
      else if (key === 'dependencies' && isUnknownRecord(value)) {
        for (const dependency of Object.values(value)) {
          if (!Array.isArray(dependency)) {
            pushSchema(dependency);
          }
        }
      }
      else if (
        key === 'additionalItems'
        || key === 'additionalProperties'
        || key === 'contains'
        || key === 'contentSchema'
        || key === 'else'
        || key === 'if'
        || key === 'not'
        || key === 'propertyNames'
        || key === 'then'
        || key === 'unevaluatedItems'
        || key === 'unevaluatedProperties'
      ) {
        pushSchema(value);
      }
    }
  }
}

function decodePointerSegment(value: string): string | undefined {
  let decoded = '';
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (character !== '~') {
      decoded += character;
      continue;
    }

    const escaped = value[index + 1];
    if (escaped === '0') {
      decoded += '~';
    }
    else if (escaped === '1') {
      decoded += '/';
    }
    else {
      return undefined;
    }
    index += 1;
  }
  return decoded;
}

function findNodeAtPointer(root: JsonNode, pointer: string): JsonNode {
  if (pointer === '') {
    return root;
  }

  if (!pointer.startsWith('/')) {
    return root;
  }

  let node = root;
  for (const encodedSegment of pointer.slice(1).split('/')) {
    const segment = decodePointerSegment(encodedSegment);
    if (segment === undefined) {
      return root;
    }

    if (node.type === 'object') {
      const property = (node.children ?? []).find((candidate) => {
        try {
          return propertyParts(candidate).key === segment;
        }
        catch {
          return false;
        }
      });
      if (property === undefined) {
        return node;
      }
      node = propertyParts(property).value;
      continue;
    }

    if (node.type === 'array' && /^(?:0|[1-9]\d*)$/u.test(segment)) {
      const index = Number(segment);
      if (!Number.isSafeInteger(index) || node.children?.[index] === undefined) {
        return node;
      }
      node = node.children[index];
      continue;
    }

    return node;
  }

  return node;
}

function sourceLocations(
  source: string,
  offsets: number[],
): Map<number, { line: number; column: number }> {
  const targets = [...new Set(offsets)].sort((left, right) => left - right);
  const locations = new Map<number, { line: number; column: number }>();
  let targetIndex = 0;
  let line = 1;
  let column = 1;
  let previousWasCarriageReturn = false;

  for (let index = 0; index <= source.length && targetIndex < targets.length; index += 1) {
    while (targets[targetIndex] === index) {
      locations.set(index, { line, column });
      targetIndex += 1;
    }

    if (index === source.length) {
      break;
    }

    const codeUnit = source.charCodeAt(index);
    if (codeUnit === 0x0D) {
      line += 1;
      column = 1;
      previousWasCarriageReturn = true;
    }
    else if (codeUnit === 0x0A) {
      if (!previousWasCarriageReturn) {
        line += 1;
        column = 1;
      }
      previousWasCarriageReturn = false;
    }
    else {
      previousWasCarriageReturn = false;
      if (
        codeUnit >= 0xDC00
        && codeUnit <= 0xDFFF
        && index > 0
        && source.charCodeAt(index - 1) >= 0xD800
        && source.charCodeAt(index - 1) <= 0xDBFF
      ) {
        continue;
      }
      column += 1;
    }
  }

  return locations;
}

function normalizedAjvErrors(
  errors: ErrorObject[] | null | undefined,
  instanceRoot: JsonNode,
  instanceSource: string,
): JsonSchemaValidationError[] {
  const selected = (errors ?? []).slice(0, JSON_SCHEMA_MAX_ERRORS);
  if (selected.length === 0) {
    selected.push({
      keyword: 'validation',
      instancePath: '',
      schemaPath: '',
      params: {},
      message: 'does not satisfy the selected schema',
    });
  }

  const nodes = selected.map(error => findNodeAtPointer(instanceRoot, error.instancePath));
  const locations = sourceLocations(instanceSource, nodes.map(node => node.offset));
  const replaceSchemaKeyword = (path: string, internalKeyword: string, publicKeyword: string): string => {
    const suffix = `/${internalKeyword}`;
    return path.endsWith(suffix)
      ? `${path.slice(0, -suffix.length)}/${publicKeyword}`
      : path;
  };

  return selected.map((error, index) => {
    const location = locations.get(nodes[index].offset) ?? { line: 1, column: 1 };
    const publicKeyword = error.keyword === SAFE_CONST_KEYWORD
      ? 'const'
      : error.keyword === SAFE_ENUM_KEYWORD
        ? 'enum'
        : error.keyword === SAFE_UNIQUE_ITEMS_KEYWORD
          ? 'uniqueItems'
          : error.keyword;
    const publicMessage = error.keyword === SAFE_CONST_KEYWORD
      ? 'must be equal to the constant value'
      : error.keyword === SAFE_ENUM_KEYWORD
        ? 'must be equal to one of the allowed values'
        : error.keyword === SAFE_UNIQUE_ITEMS_KEYWORD
          ? 'must NOT contain duplicate items'
          : error.message;
    const publicSchemaPath = error.keyword === SAFE_CONST_KEYWORD
      ? replaceSchemaKeyword(error.schemaPath, SAFE_CONST_KEYWORD, 'const')
      : error.keyword === SAFE_ENUM_KEYWORD
        ? replaceSchemaKeyword(error.schemaPath, SAFE_ENUM_KEYWORD, 'enum')
        : error.keyword === SAFE_UNIQUE_ITEMS_KEYWORD
          ? replaceSchemaKeyword(error.schemaPath, SAFE_UNIQUE_ITEMS_KEYWORD, 'uniqueItems')
          : error.schemaPath;
    return {
      instancePath: boundedPath(error.instancePath),
      schemaPath: boundedPath(publicSchemaPath),
      keyword: boundedText(publicKeyword, 'validation'),
      message: boundedText(publicMessage ?? '', 'does not satisfy the selected schema'),
      line: location.line,
      column: location.column,
    };
  });
}

export function validateJsonSchema(
  task: JsonSchemaValidationTask,
  dependencies: JsonSchemaValidationDependencies = {},
): JsonSchemaValidationResult {
  const schemaDocument = parseStrictDocument(task.schemaSource, {
    label: 'JSON Schema',
    maxDepth: JSON_SCHEMA_MAX_DEPTH,
    maxNodes: JSON_SCHEMA_MAX_NODES,
  });
  const instanceDocument = parseStrictDocument(task.instanceSource, {
    label: 'JSON instance',
    maxDepth: JSON_INSTANCE_MAX_DEPTH,
    maxNodes: JSON_INSTANCE_MAX_NODES,
  });
  const inspection = inspectSchema(schemaDocument.root, task.draft);

  if (
    typeof schemaDocument.value !== 'boolean'
    && (typeof schemaDocument.value !== 'object' || schemaDocument.value === null)
  ) {
    throw new JsonSchemaTaskError('schema', 'A JSON Schema must be an object or a boolean.');
  }

  normalizeSchemaForAjv(schemaDocument.value);

  // Ajv can emit roughly one error for every schema/instance evaluation pair.
  // Bounding only the instance still lets a branch-heavy schema accumulate a
  // large internal error array before the public 200-error projection runs.
  const allErrors = instanceDocument.nodeCount <= JSON_SCHEMA_ALL_ERRORS_MAX_INSTANCE_NODES
    && schemaDocument.nodeCount * instanceDocument.nodeCount <= JSON_SCHEMA_ALL_ERRORS_MAX_NODE_PAIRS;
  let validator: ValidateFunction;

  try {
    const compiler = (dependencies.createCompiler ?? createCompiler)(task.draft, allErrors);
    validator = compiler.compile(schemaDocument.value);
  }
  catch (error) {
    if (error instanceof EvalError) {
      throw new JsonSchemaTaskError(
        'unavailable',
        'JSON Schema compilation is unavailable under the current browser security policy.',
      );
    }
    throw new JsonSchemaTaskError(
      'schema',
      `JSON Schema compilation failed: ${errorMessage(error, 'the schema is not supported')}`,
    );
  }

  if ('$async' in validator && validator.$async === true) {
    throw new JsonSchemaTaskError('schema', 'Asynchronous JSON Schemas are not supported.');
  }

  let valid: boolean;
  try {
    valid = validator(instanceDocument.value) === true;
  }
  catch (error) {
    throw new JsonSchemaTaskError(
      'operation',
      `JSON Schema validation failed: ${errorMessage(error, 'the validator stopped unexpectedly')}`,
    );
  }

  const ajvErrors = validator.errors ?? [];
  const completeErrorList = valid
    || (allErrors && ajvErrors.length <= JSON_SCHEMA_MAX_ERRORS);
  const warnings: JsonSchemaWarning[] = [];
  if (inspection.hasFormat) {
    warnings.push('format-not-validated');
  }
  if (schemaDocument.hasImpreciseNumber || instanceDocument.hasImpreciseNumber) {
    warnings.push('ieee-754-numbers');
  }
  if (!completeErrorList) {
    warnings.push('incomplete-error-list');
  }

  return {
    valid,
    completeErrorList,
    warnings,
    errors: valid
      ? []
      : normalizedAjvErrors(ajvErrors, instanceDocument.root, task.instanceSource),
  };
}
