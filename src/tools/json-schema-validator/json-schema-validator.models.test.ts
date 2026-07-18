import { describe, expect, it } from 'vitest';
import { validateJsonSchema } from './json-schema-validator.models';
import {
  JSON_INSTANCE_MAX_DEPTH,
  JSON_INSTANCE_MAX_NODES,
  JSON_SCHEMA_ALL_ERRORS_MAX_INSTANCE_NODES,
  JSON_SCHEMA_MAX_DEPTH,
  JSON_SCHEMA_MAX_ERRORS,
  JSON_SCHEMA_MAX_ERROR_CHARACTERS,
  JSON_SCHEMA_MAX_NODES,
  type JsonSchemaDraft,
  JsonSchemaTaskError,
} from './json-schema-validator.worker.protocol';

function json(value: unknown): string {
  const source = JSON.stringify(value);
  if (source === undefined) {
    throw new Error('The test fixture is not JSON serializable.');
  }
  return source;
}

function validateValues(
  schema: unknown,
  instance: unknown,
  draft: JsonSchemaDraft = 'draft2020',
) {
  return validateJsonSchema({
    schemaSource: json(schema),
    instanceSource: json(instance),
    draft,
  });
}

function expectTaskError(
  action: () => unknown,
  code: JsonSchemaTaskError['code'],
): JsonSchemaTaskError {
  try {
    action();
    throw new Error('Expected JSON Schema validation to fail.');
  }
  catch (error) {
    expect(error).toBeInstanceOf(JsonSchemaTaskError);
    expect((error as JsonSchemaTaskError).code).toBe(code);
    return error as JsonSchemaTaskError;
  }
}

describe('JSON Schema validation model', () => {
  describe('strict JSON documents', () => {
    it.each([
      ['JSON Schema', '{"type":"number",}', '0'],
      ['JSON Schema', '{/* comment */"type":"number"}', '0'],
      ['JSON instance', '{"type":"number"}', '[1,]'],
      ['JSON instance', '{"type":"number"}', '// comment\n1'],
    ])('rejects non-strict %s syntax', (_label, schemaSource, instanceSource) => {
      expectTaskError(
        () => validateJsonSchema({ schemaSource, instanceSource, draft: 'draft2020' }),
        'syntax',
      );
    });

    it.each([
      ['{"type":"number","\\u0074ype":"string"}', '0'],
      ['{"type":"object"}', '{"x":1,"\\u0078":2}'],
    ])('rejects duplicate decoded object keys', (schemaSource, instanceSource) => {
      const error = expectTaskError(
        () => validateJsonSchema({ schemaSource, instanceSource, draft: 'draft2020' }),
        'syntax',
      );
      expect(error.message).toContain('duplicate decoded object keys');
    });

    it.each(['null', '[]', '"string"', '42'])('accepts only object or boolean schemas: %s', (schemaSource) => {
      expectTaskError(
        () => validateJsonSchema({ schemaSource, instanceSource: 'null', draft: 'draft2020' }),
        'schema',
      );
    });

    it('implements both boolean-schema outcomes and an ordinary object schema', () => {
      expect(validateValues(true, { value: 1 })).toMatchObject({ valid: true, errors: [] });
      expect(validateValues(false, { value: 1 })).toMatchObject({ valid: false, completeErrorList: true });
      expect(validateValues({ type: 'integer' }, 1)).toMatchObject({ valid: true, errors: [] });
      expect(validateValues({ type: 'integer' }, '1')).toMatchObject({ valid: false });
    });
  });

  describe('real Ajv draft behavior', () => {
    it('supports Draft 7 definitions and fragment-local references', () => {
      const schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        definitions: {
          positiveInteger: { type: 'integer', minimum: 1 },
        },
        $ref: '#/definitions/positiveInteger',
      };

      expect(validateValues(schema, 2, 'draft7').valid).toBe(true);
      expect(validateValues(schema, 0, 'draft7')).toMatchObject({ valid: false });
    });

    it('supports Draft 2019-09 recursive references and unevaluated properties', () => {
      const schema = {
        $schema: 'https://json-schema.org/draft/2019-09/schema',
        $recursiveAnchor: true,
        type: 'object',
        properties: {
          value: { type: 'integer' },
          next: { $recursiveRef: '#' },
        },
        required: ['value'],
        unevaluatedProperties: false,
      };

      expect(validateValues(schema, { value: 1, next: { value: 2 } }, 'draft2019').valid).toBe(true);
      expect(validateValues(schema, { value: 1, next: { value: 2, extra: true } }, 'draft2019'))
        .toMatchObject({ valid: false });
    });

    it('supports Draft 2020-12 prefixItems and $defs', () => {
      const schema = {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $defs: {
          identifier: { type: 'integer', minimum: 1 },
        },
        type: 'array',
        prefixItems: [
          { $ref: '#/$defs/identifier' },
          { type: 'string' },
        ],
        items: false,
      };

      expect(validateValues(schema, [1, 'ready'], 'draft2020').valid).toBe(true);
      expect(validateValues(schema, ['1', 'ready'], 'draft2020').valid).toBe(false);
      expect(validateValues(schema, [1, 'ready', true], 'draft2020').valid).toBe(false);
    });

    it.each([
      ['draft7', 'https://json-schema.org/draft/2020-12/schema'],
      ['draft2019', 'http://json-schema.org/draft-07/schema#'],
      ['draft2020', 'https://json-schema.org/draft/2019-09/schema'],
    ] as const)('rejects a meta-schema that does not match %s', (draft, declaredSchema) => {
      expectTaskError(
        () => validateValues({ $schema: declaredSchema }, null, draft),
        'schema',
      );
    });
  });

  describe('bounded local reference policy', () => {
    it('resolves escaped JSON Pointer segments and local anchors', () => {
      const escapedPointerSchema = {
        $defs: {
          'a/b~c': { const: 42 },
        },
        $ref: '#/$defs/a~1b~0c',
      };
      const anchoredSchema = {
        $defs: {
          positive: {
            $anchor: 'positive',
            type: 'integer',
            minimum: 1,
          },
        },
        $ref: '#positive',
      };

      expect(validateValues(escapedPointerSchema, 42).valid).toBe(true);
      expect(validateValues(escapedPointerSchema, 41).valid).toBe(false);
      expect(validateValues(anchoredSchema, 1).valid).toBe(true);
      expect(validateValues(anchoredSchema, 0).valid).toBe(false);
    });

    it.each([
      ['$ref', 'https://example.com/schema.json'],
      ['$ref', 'other-schema.json#/$defs/value'],
      ['$recursiveRef', 'recursive.json#'],
      ['$dynamicRef', '//example.com/schema.json#node'],
    ])('rejects non-local %s value %s before compilation', (keyword, reference) => {
      expectTaskError(
        () => validateValues({ [keyword]: reference }, null),
        'schema',
      );
    });

    it('does not interpret schema-shaped keys inside const data as executable schema keywords', () => {
      const data = {
        $ref: 'https://example.com/not-a-schema-reference',
        $async: true,
        format: 'email',
      };
      const result = validateValues({ const: data }, data);

      expect(result).toMatchObject({ valid: true, warnings: [], errors: [] });
    });

    it('uses prototype-safe equality for const, enum, and uniqueItems object values', () => {
      const constResult = validateJsonSchema({
        schemaSource: '{"const":{"valueOf":"data","__proto__":true}}',
        instanceSource: '{"valueOf":"data","__proto__":true}',
        draft: 'draft2020',
      });
      const enumResult = validateJsonSchema({
        schemaSource: '{"enum":[{"toString":"first"},{"valueOf":"second"}]}',
        instanceSource: '{"valueOf":"second"}',
        draft: 'draft2020',
      });
      const duplicateResult = validateJsonSchema({
        schemaSource: '{"type":"array","uniqueItems":true}',
        instanceSource: '[{"valueOf":1},{"valueOf":1}]',
        draft: 'draft2020',
      });
      const constMismatch = validateJsonSchema({
        schemaSource: '{"const":{"valueOf":"expected"}}',
        instanceSource: '{"valueOf":"actual"}',
        draft: 'draft2020',
      });
      const enumMismatch = validateJsonSchema({
        schemaSource: '{"enum":[{"toString":"expected"}]}',
        instanceSource: '{"toString":"actual"}',
        draft: 'draft2020',
      });

      expect(constResult.valid).toBe(true);
      expect(enumResult.valid).toBe(true);
      expect(constMismatch.errors).toContainEqual(expect.objectContaining({
        keyword: 'const',
        schemaPath: '#/const',
      }));
      expect(enumMismatch.errors).toContainEqual(expect.objectContaining({
        keyword: 'enum',
        schemaPath: '#/enum',
      }));
      expect(duplicateResult.errors).toContainEqual(expect.objectContaining({
        keyword: 'uniqueItems',
        schemaPath: '#/uniqueItems',
      }));
    });

    it('rejects duplicate enum values before Ajv compilation', () => {
      expectTaskError(
        () => validateJsonSchema({
          schemaSource: '{"enum":[{"valueOf":1},{"valueOf":1}]}',
          instanceSource: 'null',
          draft: 'draft2020',
        }),
        'schema',
      );
    });
  });

  describe('unsupported execution semantics', () => {
    it('treats format as an annotation and exposes a warning', () => {
      const result = validateValues({ type: 'string', format: 'email' }, 'not-an-email');

      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('format-not-validated');
    });

    it('rejects a required 2020-12 format-assertion vocabulary', () => {
      const schema = {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $vocabulary: {
          'https://json-schema.org/draft/2020-12/vocab/core': true,
          'https://json-schema.org/draft/2020-12/vocab/format-assertion': true,
        },
        type: 'string',
        format: 'email',
      };

      expectTaskError(() => validateValues(schema, 'person@example.com'), 'schema');
    });

    it.each([
      { $async: true, type: 'string' },
      { allOf: [{ $async: true, type: 'string' }] },
    ])('rejects asynchronous schemas', (schema) => {
      expectTaskError(() => validateValues(schema, 'value'), 'schema');
    });

    it('maps blocked runtime code generation to an unavailable error', () => {
      const error = expectTaskError(
        () => validateJsonSchema(
          { schemaSource: '{}', instanceSource: 'null', draft: 'draft2020' },
          {
            createCompiler: () => {
              throw new EvalError('unsafe-eval is blocked');
            },
          },
        ),
        'unavailable',
      );

      expect(error.message).not.toContain('unsafe-eval is blocked');
    });
  });

  describe('number safety and non-mutating options', () => {
    it.each([
      ['{"const":9007199254740992}', '0'],
      ['{}', '9007199254740992'],
      ['{"maximum":1e400}', '0'],
      ['{}', '1e400'],
    ])('rejects unsafe integer or non-finite number lexemes', (schemaSource, instanceSource) => {
      expectTaskError(
        () => validateJsonSchema({ schemaSource, instanceSource, draft: 'draft2020' }),
        'syntax',
      );
    });

    it('allows decimal and exponent lexemes with one IEEE-754 warning', () => {
      const result = validateJsonSchema({
        schemaSource: '{"type":"number","minimum":0.1}',
        instanceSource: '1e0',
        draft: 'draft2020',
      });

      expect(result.valid).toBe(true);
      expect(result.warnings.filter(warning => warning === 'ieee-754-numbers')).toHaveLength(1);
    });

    it('does not coerce values, apply defaults, or remove additional properties', () => {
      expect(validateValues({ type: 'integer' }, '1').valid).toBe(false);
      expect(validateValues({
        type: 'object',
        properties: { count: { type: 'integer', default: 1 } },
        required: ['count'],
      }, {}).valid).toBe(false);
      expect(validateValues({
        type: 'object',
        properties: { known: { type: 'boolean' } },
        additionalProperties: false,
      }, { known: true, extra: 1 }).valid).toBe(false);
    });
  });

  describe('error normalization and source locations', () => {
    it('reports code-point columns on CRLF input containing astral Unicode', () => {
      const result = validateJsonSchema({
        schemaSource: '{"type":"object","properties":{"target":{"type":"number"}}}',
        instanceSource: '{\r\n  "😀": "ok", "target": "bad"\r\n}',
        draft: 'draft2020',
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({
        instancePath: '/target',
        keyword: 'type',
        line: 2,
        column: 24,
      }));
    });

    it('keeps escaped instance paths and maps them to the matching value node', () => {
      const result = validateValues({
        type: 'object',
        properties: {
          'a/b~c': { type: 'number' },
        },
      }, { 'a/b~c': 'wrong' });

      expect(result.errors).toContainEqual(expect.objectContaining({
        instancePath: '/a~1b~0c',
        line: 1,
      }));
    });

    it('caps normalized instance and schema paths without splitting a surrogate pair', () => {
      const longProperty = `property-${'😀'.repeat(JSON_SCHEMA_MAX_ERROR_CHARACTERS)}`;
      const result = validateValues({
        type: 'object',
        properties: {
          [longProperty]: { type: 'number' },
        },
      }, { [longProperty]: 'wrong' });
      const error = result.errors[0];

      expect(error.instancePath.length).toBeLessThanOrEqual(JSON_SCHEMA_MAX_ERROR_CHARACTERS);
      expect(error.schemaPath.length).toBeLessThanOrEqual(JSON_SCHEMA_MAX_ERROR_CHARACTERS);
      expect(error.instancePath).not.toMatch(/[\uD800-\uDBFF]$/u);
      expect(error.schemaPath).not.toMatch(/[\uD800-\uDBFF]$/u);
    });
  });

  describe('resource limits and fail-fast behavior', () => {
    it('rejects schema and instance collection depth beyond their independent caps', () => {
      const deepSchema = `{"x":${'['.repeat(JSON_SCHEMA_MAX_DEPTH)}0${']'.repeat(JSON_SCHEMA_MAX_DEPTH)}}`;
      const deepInstance = `${'['.repeat(JSON_INSTANCE_MAX_DEPTH + 1)}0${']'.repeat(JSON_INSTANCE_MAX_DEPTH + 1)}`;

      expectTaskError(
        () => validateJsonSchema({ schemaSource: deepSchema, instanceSource: 'null', draft: 'draft2020' }),
        'limit',
      );
      expectTaskError(
        () => validateJsonSchema({ schemaSource: '{}', instanceSource: deepInstance, draft: 'draft2020' }),
        'limit',
      );
    });

    it('rejects documents beyond the schema and instance syntax-node caps', () => {
      const oversizedSchema = `{"enum":[${Array.from({ length: JSON_SCHEMA_MAX_NODES }, () => '0').join(',')}]}`;
      const oversizedInstance = `[${Array.from({ length: JSON_INSTANCE_MAX_NODES }, () => '0').join(',')}]`;

      expectTaskError(
        () => validateJsonSchema({ schemaSource: oversizedSchema, instanceSource: '0', draft: 'draft2020' }),
        'limit',
      );
      expectTaskError(
        () => validateJsonSchema({ schemaSource: '{}', instanceSource: oversizedInstance, draft: 'draft2020' }),
        'limit',
      );
    });

    it('caps a real Ajv all-errors result and marks it incomplete', () => {
      const schema = {
        allOf: Array.from({ length: JSON_SCHEMA_MAX_ERRORS + 1 }, (_, minimum) => ({ minimum })),
      };
      const result = validateValues(schema, -1);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(JSON_SCHEMA_MAX_ERRORS);
      expect(result.completeErrorList).toBe(false);
      expect(result.warnings).toContain('incomplete-error-list');
    });

    it('uses fail-fast validation above the bounded all-errors node threshold', () => {
      const instance = Array.from(
        { length: JSON_SCHEMA_ALL_ERRORS_MAX_INSTANCE_NODES },
        () => 'not-an-integer',
      );
      const result = validateValues({
        type: 'array',
        items: { type: 'integer' },
      }, instance);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.completeErrorList).toBe(false);
      expect(result.warnings).toContain('incomplete-error-list');
    });

    it('uses fail-fast validation when schema and instance complexity amplify each other', () => {
      const repeatedArraySchema = {
        type: 'array',
        items: { type: 'integer' },
      };
      const result = validateValues({
        allOf: Array.from({ length: 15 }, () => repeatedArraySchema),
      }, Array.from({ length: 200 }, () => 'not-an-integer'));

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.completeErrorList).toBe(false);
      expect(result.warnings).toContain('incomplete-error-list');
    });
  });

  describe('prototype-shaped keys', () => {
    it('validates own __proto__, constructor, and prototype properties without pollution', () => {
      const result = validateJsonSchema({
        schemaSource: '{"type":"object","properties":{"__proto__":{"const":"safe"},"constructor":{"type":"string"},"prototype":{"type":"boolean"}},"required":["__proto__","constructor","prototype"],"additionalProperties":false}',
        instanceSource: '{"__proto__":"safe","constructor":"value","prototype":true}',
        draft: 'draft2020',
      });

      expect(result).toMatchObject({ valid: true, errors: [] });
      expect(Object.prototype).not.toHaveProperty('safe');
    });

    it('resolves a $defs entry named __proto__ as an own schema property', () => {
      const result = validateJsonSchema({
        schemaSource: '{"$defs":{"__proto__":{"type":"string"}},"$ref":"#/$defs/__proto__"}',
        instanceSource: '"safe"',
        draft: 'draft2020',
      });

      expect(result.valid).toBe(true);
    });

    it('preserves a pattern literally named __proto__ without prototype access', () => {
      const result = validateJsonSchema({
        schemaSource: '{"type":"object","patternProperties":{"__proto__":{"type":"string"}},"additionalProperties":false}',
        instanceSource: '{"__proto__":"safe"}',
        draft: 'draft2020',
      });

      expect(result).toMatchObject({ valid: true, errors: [] });
    });

    it('enforces a Draft 7 dependency declared for own __proto__ data', () => {
      const schemaSource = '{"type":"object","dependencies":{"__proto__":["peer"]}}';
      const missingPeer = validateJsonSchema({
        schemaSource,
        instanceSource: '{"__proto__":true}',
        draft: 'draft7',
      });
      const withPeer = validateJsonSchema({
        schemaSource,
        instanceSource: '{"__proto__":true,"peer":1}',
        draft: 'draft7',
      });

      expect(missingPeer.valid).toBe(false);
      expect(withPeer.valid).toBe(true);
    });
  });
});
