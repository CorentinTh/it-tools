function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^./, s => s.toUpperCase());
}

function inferTsType(value: unknown, name: string, interfaces: Map<string, string>): string {
  if (value === null) {
    return 'null';
  }

  switch (typeof value) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    default:
      break;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'unknown[]';
    }
    const elementTypes = new Set(value.map(item => inferTsType(item, `${name}Item`, interfaces)));
    const uniqueTypes = [...elementTypes];
    if (uniqueTypes.length === 1) {
      return `${uniqueTypes[0]}[]`;
    }
    return `(${uniqueTypes.join(' | ')})[]`;
  }

  if (typeof value === 'object') {
    const interfaceName = capitalize(toPascalCase(name));
    const entries = Object.entries(value as Record<string, unknown>);
    const fields = entries.map(([key, val]) => {
      const type = inferTsType(val, key, interfaces);
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
      return `  ${safeKey}: ${type};`;
    });
    interfaces.set(interfaceName, `interface ${interfaceName} {\n${fields.join('\n')}\n}`);
    return interfaceName;
  }

  return 'unknown';
}

export function jsonToTypeScript(json: unknown, rootName: string = 'RootType'): string {
  const interfaces = new Map<string, string>();
  inferTsType(json, rootName, interfaces);

  if (interfaces.size === 0) {
    const simpleType = inferTsType(json, rootName, interfaces);
    return `type ${toPascalCase(rootName)} = ${simpleType};`;
  }

  return [...interfaces.values()].reverse().join('\n\n');
}

function inferGoType(value: unknown, name: string, structs: Map<string, string>): string {
  if (value === null) {
    return 'interface{}';
  }

  switch (typeof value) {
    case 'string':
      return 'string';
    case 'number':
      return Number.isInteger(value) ? 'int64' : 'float64';
    case 'boolean':
      return 'bool';
    default:
      break;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]interface{}';
    }
    const elementType = inferGoType(value[0], `${name}Item`, structs);
    return `[]${elementType}`;
  }

  if (typeof value === 'object') {
    const structName = toPascalCase(name);
    const entries = Object.entries(value as Record<string, unknown>);
    const fields = entries.map(([key, val]) => {
      const goType = inferGoType(val, key, structs);
      const fieldName = toPascalCase(key);
      return `\t${fieldName} ${goType} \`json:"${key}"\``;
    });
    structs.set(structName, `type ${structName} struct {\n${fields.join('\n')}\n}`);
    return structName;
  }

  return 'interface{}';
}

export function jsonToGoStruct(json: unknown, rootName: string = 'RootType'): string {
  const structs = new Map<string, string>();
  inferGoType(json, rootName, structs);

  if (structs.size === 0) {
    const simpleType = inferGoType(json, rootName, structs);
    return `type ${toPascalCase(rootName)} ${simpleType}`;
  }

  return [...structs.values()].reverse().join('\n\n');
}
