import { pack, unpack } from 'byte-data';

export type Conversion = 'dec' | 'bin' | 'hex' | 'char';

export function cleanHex(hex: string): string {
  return hex.replace(/\\x|0x/g, '');
}

export function decodeNumber(n: number, bits: number, conv: Conversion) {
  if (conv === 'bin') {
    return n.toString(2).padStart(bits, '0');
  }
  if (conv === 'hex') {
    return n.toString(16).padStart(bits / 4, '0');
  }
  if (conv === 'char') {
    return String.fromCodePoint(n);
  }
  return n;
}

export function parseNumber(input: string | number): number | number[] {
  if (!input) {
    return 0;
  }
  if (typeof input === 'number') {
    return input;
  }

  if (/^0x[0-9a-fA-F]+$/.test(input)) {
    return Number.parseInt(input.substring(2), 16); // Parse as hexadecimal
  }
  else if (/^0b[01]+$/.test(input)) {
    return Number.parseInt(input.substring(2), 2); // Parse as binary
  }

  return [...input].map(c => c.codePointAt(0) || 0);
}

function mergeModelAndObject(model: Record<string, any>, object: Record<string, any>): Record<string, any> {
  const merged: Record<string, any> = {};

  for (const key in model) {
    if (Object.prototype.hasOwnProperty.call(model, key)) {
      if (Array.isArray(object[key])) {
        merged[key] = [model[key], object[key].map(parseNumber)];
      }
      else if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
        merged[key] = mergeModelAndObject(model[key], object[key]);
      }
      else {
        merged[key] = [model[key], parseNumber(object[key])];
      }
    }
  }

  return merged;
}

interface CoderOption {
  type: {
    bits: number
    fp?: boolean
    be?: boolean
    signed?: boolean
  }
  size: number
  formatter: (n: number, bits: number) => string | number
  join?: boolean
};

export function getCoderFromTypeName(typeName: string): CoderOption {
  if (typeName.includes('[]')) {
    throw new Error(`Unsupported unsized array: ${typeName}`);
  }
  const [, prefix, baseTypeName, bigEndian, arraySize] = /^((?:0x|0b)?)(u?int\d+|w?char|half|float|double)(be)?(?:\[(\d+)\])?$/.exec(typeName) || [];
  let conv = 'dec';
  if (prefix === '0x') {
    conv = 'hex';
  }
  if (prefix === '0b') {
    conv = 'bin';
  }

  const arraySizeNumber = Number.isNaN(Number(arraySize)) ? 1 : Number(arraySize);
  if (baseTypeName === 'char' || baseTypeName === 'wchar') {
    return {
      type: {
        bits: baseTypeName === 'char' ? 8 : 16,
        be: !!bigEndian,
      },
      size: arraySizeNumber,
      formatter: n => String.fromCodePoint(n),
      join: true,
    };
  }
  if (baseTypeName === 'float' || baseTypeName === 'double' || baseTypeName === 'half') {
    return {
      type: {
        bits: baseTypeName === 'float' ? 32 : (baseTypeName === 'double' ? 64 : 16),
        be: !!bigEndian,
        fp: true,
      },
      size: arraySizeNumber,
      formatter: n => n,
    };
  }

  const [, unsigned, bits] = /^(u?)int(\d+)$/.exec(baseTypeName || '') || [];
  return {
    type: {
      bits: Number(bits),
      be: !!bigEndian,
      signed: !unsigned,
    },
    size: arraySizeNumber,
    formatter: (n, bits) => decodeNumber(n, bits, conv as Conversion),
  };
}

export function decodeStruct({ struct, hexArray }: { struct: object; hexArray: Uint8Array }) {
  let offset = 0;
  const readMember = (obj: any) => {
    const result: Record<string, any> = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (Array.isArray(obj[key])) {
          throw new TypeError(`Cannot decode a struct with array (key=${key}). Must be expressed as string with fixed length`);
        }
        else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          result[key] = readMember(obj[key]);
        }
        else {
          const coderOption = getCoderFromTypeName(obj[key]);
          const arr = [];
          for (let i = 0; i < coderOption.size; i++) {
            const dataSize = Math.ceil(coderOption.type.bits / 8);
            if (offset + dataSize > hexArray.length) {
              throw new Error(`Bad buffer length reading ${key}(${obj[key]}) at offset ${offset}`);
            }
            arr.push(coderOption.formatter(unpack(hexArray, coderOption.type, offset), coderOption.type.bits));
            offset += dataSize;
          }
          if (coderOption.join) {
            result[key] = arr.join('');
          }
          else {
            result[key] = coderOption.size > 1 ? arr : arr[0];
          }
        }
      }
    }

    return result;
  };
  return readMember(struct);
}

export function encodeStruct({ struct, jsonObject }: { struct: object; jsonObject: object }): Uint8Array {
  const mergedObject = mergeModelAndObject(struct, jsonObject);

  let buffer: Array<number> = [];
  const writeMember = (obj: any) => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          writeMember(obj[key]);
        }
        else if (Array.isArray(obj[key])) {
          const [typeName, value] = obj[key];
          const coderOption = getCoderFromTypeName(typeName);
          if (coderOption.size > 1 && !Array.isArray(value)) {
            throw new TypeError(`Unexpected non array '${key}'='${value}'`);
          }
          if (Array.isArray(value) && value.length !== coderOption.size) {
            throw new TypeError(`Unexpected array size '${key}'='${value}' expected ${coderOption.size} elements`);
          }
          const valueArr = !Array.isArray(value) ? [value] : value;
          for (let i = 0; i < coderOption.size; i++) {
            buffer = [...buffer, ...pack(valueArr[i], coderOption.type)];
          }
        }
        else {
          throw new TypeError(`Unexpected '${key}'='${obj[key]}'`);
        }
      }
    }
  };
  writeMember(mergedObject);

  return new Uint8Array(buffer);
}
