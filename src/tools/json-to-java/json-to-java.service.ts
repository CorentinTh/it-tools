const equivalence: { [key: string]: string } = {
  number: 'Long',
};

export function convert(className: string, data: string | null) {
  if (data === null) {
    return '';
  }
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }
  if (className === '') {
    className = 'Result';
  }
  const keys = Object.keys(data);
  const objects: { [key: string]: any } = {};
  className = capitalizeFirstLetter(className);
  let result = `public class ${className} {\n`;
  for (const i in keys) {
    const key = keys[i];
    const value = data[key];
    let type = typeof value as string;
    if (Array.isArray(value)) {
      const typeName = capitalizeFirstLetter(fixListClass(key));
      type = `List<${typeName}>`;
      objects[typeName] = value[0];
    }
    else if (type === 'object') {
      type = capitalizeFirstLetter(key);
      objects[type] = value;
    }
    else if (equivalence[type] !== undefined) {
      type = equivalence[type];
    }
    else {
      type = capitalizeFirstLetter(type);
    }
    result += `\tpublic ${type} ${key};\n`;
  }
  result += '}\n';
  for (const clazzname in objects) {
    result += convert(clazzname, objects[clazzname]);
  }
  return result;
}

function fixListClass(string: string) {
  if (string.endsWith('s')) {
    return string.substring(0, string.length - 1);
  }
  return string;
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
