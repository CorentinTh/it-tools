import { camelCase as convertToCamelCase, pascalCase as convertToPascalCase } from 'change-case';
import JSON5 from 'json5';

function normalize(src: string, firstUpper = true) {
  // return /^\d$/.test(src.charAt(0))
  //   ? `N${pascalCase(src)}`
  //   : pascalCase(src);
  return /^\d$/.test(src.charAt(0))
    ? `N${src}`
    : (firstUpper ? src.charAt(0).toUpperCase() + src.slice(1) : src);
}

export function isDate(src: string) {
  return /^(\d{4})(-(0[1-9]|1[0-2])(-([12]\d|0[1-9]|3[01]))([T\s]((([01]\d|2[0-3])((:)[0-5]\d))([\:]\d+)?)?(:[0-5]\d([\.]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)$/.test(
    src,
  );
}

interface Prop { type: string; name: string; isArray?: boolean; canBeNullable?: boolean }

export function getPrimitiveProp(obj: any, key: string): Prop {
  const type = typeof obj;
  switch (type) {
    case 'string':
      // eslint-disable-next-line no-case-declarations
      const isObjDate = isDate(obj);
      return { type: isObjDate ? 'DateTime' : 'string', name: key, canBeNullable: isObjDate };
    case 'number':
      return { type: Number.isInteger(obj) ? 'int' : 'double', name: key, canBeNullable: true };
    case 'boolean':
      return { type: 'bool', name: key, canBeNullable: true };
    default:
      throw new Error(`Unexpected key '${key}' of type ${type}`);
  }
}

interface ClassType { key: string; props: Array<Prop> }

function handleObject(
  classes: Array<ClassType>,
  obj: any,
  key: string,
  skip: boolean = false) {
  const normalizedKey = normalize(key);
  let target: ClassType = classes.find(x => x.key === normalizedKey) as never;
  if (!target) {
    target = { key: normalizedKey, props: [] };
    if (!skip) {
      classes.push(target);
    }
  }

  if (obj != null) {
    Object.keys(obj).forEach((k) => {
      const keyName = Number.isNaN(Number(k)) ? k : `${normalizedKey}Item`;
      let prop: Prop | null = null;
      if (typeof obj[k] == 'object') {
        if (Array.isArray(obj[k])) {
          if (Array.from(obj[k]).length > 0) {
            if (typeof obj[k][0] == 'object') {
              handleObject(classes, obj[k], keyName, true);
              prop = {
                type: normalize(`${keyName}Item`),
                name: keyName,
                isArray: true,
              };
            }
            else {
              prop = getPrimitiveProp(obj[k][0], keyName);
              prop.isArray = true;
            }
          }
        }
        else {
          handleObject(classes, obj[k], keyName);
          prop = { type: normalize(keyName), name: keyName };
        }
      }
      else {
        prop = getPrimitiveProp(obj[k], keyName);
      }

      if (prop && !target.props.some(x => x.name === prop?.name)) {
        target.props.push(prop);
      }
    });
  }
}

export function json2classes(src: object, rootTypeName: string = 'Root') {
  const classes: Array<ClassType> = [];
  handleObject(classes, src, rootTypeName);
  return classes;
}

export function json2csharp(
  {
    src,
    rootTypeName = 'Root',
    pascalCase = true,
    nullValueHandlingIgnore = true,
    addJsonPropertyName = true,
    useReadonlyLists,
    useRecordTypes,
    addJsonProperty,
    generateImmutableClasses,
    useFields,
    useNullable,
  }: {
    src: any
    rootTypeName?: string
    pascalCase?: boolean
    useFields?: boolean
    useNullable?: boolean
    addJsonProperty?: boolean
    nullValueHandlingIgnore?: boolean
    addJsonPropertyName?: boolean
    generateImmutableClasses?: boolean
    useRecordTypes?: boolean
    useReadonlyLists?: boolean
  }) {
  const normalizeCase = (s: string) => {
    const normalized = normalize(s, pascalCase);
    return pascalCase ? convertToPascalCase(normalized) : normalized;
  };

  const getPropType = (p: Prop) => {
    let type = p.type;
    if (p.isArray) {
      if (useReadonlyLists) {
        type = useRecordTypes ? `IReadonlyList<${type}>` : `List<${type}>`;
      }
      else {
        type = `${type}[]`;
      }
    }
    const nullable = useNullable && p.canBeNullable ? '?' : '';
    return { type, nullable };
  };

  const srcObj = typeof src === 'string' ? JSON5.parse(src) : src;
  const classes = json2classes(
    Array.isArray(srcObj) ? srcObj[0] : srcObj,
    Array.isArray(srcObj) ? `${rootTypeName}Item` : rootTypeName);
  let result = '';
  result += 'using System;\n';
  result += addJsonProperty ? 'using Newtonsoft.Json;\n' : '';
  result += addJsonPropertyName ? 'using System.Text.Json;\n' : '';
  result += '\n';
  classes.forEach((c) => {
    if (useRecordTypes) {
      result += `public record ${normalizeCase(c.key)}(\n`;
    }
    else {
      result += `public class ${normalizeCase(c.key)}\n`;
      result += '{\n';
    }
    if (!useRecordTypes && generateImmutableClasses) {
      result += `\tpublic ${normalizeCase(c.key)}(\n`;
      c.props.forEach((p) => {
        const propType = getPropType(p);
        result += `\t\t${propType.type}${propType.nullable} ${convertToCamelCase(p.name)},\n`;
      });
      result = result.replace(/,\n$/, '\n');
      result += '\t){\n';
      c.props.forEach((p) => {
        result += `\t\tthis.${normalizeCase(p.name)} = ${convertToCamelCase(p.name)};\n`;
      });
      result += '\t}\n\n';
    }
    c.props.forEach((p) => {
      const scope = useRecordTypes ? 'property: ' : '';
      if (addJsonProperty) {
        if (nullValueHandlingIgnore) {
          result += `\t[${scope}JsonProperty("${p.name}", NullValueHandling = NullValueHandling.Ignore)]\n`;
        }
        else {
          result += `\t[${scope}JsonProperty("${p.name}")]\n`;
        }
      }
      if (addJsonPropertyName) {
        result += `\t[${scope}JsonPropertyName("${p.name}")]\n`;
      }

      const propType = getPropType(p);
      if (useRecordTypes) {
        result += `\t${propType.type}${propType.nullable} ${normalizeCase(p.name)},\n`;
      }
      else {
        const newList = useReadonlyLists && p.isArray ? ` = new ${propType.type};` : '';
        if (useFields) {
          result += `\tpublic ${propType.type}${propType.nullable} ${normalizeCase(p.name)}${(newList || ';')}`;
        }
        else if (generateImmutableClasses || (p.isArray && useReadonlyLists)) {
          result += `\tpublic ${propType.type}${propType.nullable} ${normalizeCase(p.name)} { get; }${newList}`;
        }
        else {
          result += `\tpublic ${propType.type}${propType.nullable} ${normalizeCase(p.name)} { get; set; }${newList}`;
        }
        result += '\n';
      }
    });
    if (useRecordTypes) {
      result = result.replace(/,\n$/, '\n');
      result += ');\n\n';
    }
    else {
      result += '}\n\n';
    }
  });

  return result.trim();
}

export default json2csharp;
