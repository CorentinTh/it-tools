import { describe, expect, it } from 'vitest';
import { cleanHex, decodeNumber, decodeStruct, encodeStruct, getCoderFromTypeName, parseNumber } from './hex-converter.service';

describe('cleanHex', () => {
  it('should remove 0x and \\x prefixes from a hex string', () => {
    expect(cleanHex('0x1234')).toBe('1234');
    expect(cleanHex('\\x1234')).toBe('1234');
    expect(cleanHex('1234')).toBe('1234');
  });
});

describe('decodeNumber', () => {
  it('should convert a number to binary', () => {
    expect(decodeNumber(10, 8, 'bin')).toBe('00001010');
  });

  it('should convert a number to hex', () => {
    expect(decodeNumber(10, 8, 'hex')).toBe('0a');
  });

  it('should convert a number to character', () => {
    expect(decodeNumber(65, 8, 'char')).toBe('A');
  });

  it('should return the number itself for decimal conversion', () => {
    expect(decodeNumber(10, 8, 'dec')).toBe(10);
  });
});

describe('parseNumber', () => {
  it('should parse hexadecimal input correctly', () => {
    expect(parseNumber('0x1F')).toBe(31);
  });

  it('should parse binary input correctly', () => {
    expect(parseNumber('0b1101')).toBe(13);
  });

  it('should parse string input correctly into code points', () => {
    expect(parseNumber('abc')).toEqual([97, 98, 99]);
  });

  it('should return number when input is already a number', () => {
    expect(parseNumber(42)).toBe(42);
  });

  it('should return 0 for falsy input', () => {
    expect(parseNumber('')).toBe(0);
  });
});

describe('getCoderFromTypeName', () => {
  it('should return correct coder options for a basic integer type', () => {
    const result = getCoderFromTypeName('uint16');
    expect(result.type.bits).toBe(16);
    expect(result.type.signed).toBe(false);
    expect(result.size).toBe(1);
  });

  it('should handle big-endian types correctly', () => {
    const result = getCoderFromTypeName('int32be');
    expect(result.type.bits).toBe(32);
    expect(result.type.be).toBe(true);
  });

  it('should return correct coder options for a float type', () => {
    const result = getCoderFromTypeName('float');
    expect(result.type.bits).toBe(32);
    expect(result.type.fp).toBe(true);
  });

  it('should return correct coder options for a character type', () => {
    const result = getCoderFromTypeName('char[4]');
    expect(result.type.bits).toBe(8);
    expect(result.size).toBe(4);
    expect(result.formatter(65, 8)).toBe('A');
  });
});

describe('decodeStruct', () => {
  it('should decode a flat struct correctly from a hex array', () => {
    const struct = {
      field1: 'uint16',
      field2: 'char[3]',
    };
    const hexArray = new Uint8Array([0x01, 0x0, 0x61, 0x62, 0x63]);

    const result = decodeStruct({ struct, hexArray });
    expect(result.field1).toBe(1);
    expect(result.field2).toBe('abc');
  });

  it('should decode a nested struct correctly', () => {
    const struct = {
      type: 'int8',
      header: {
        version: 'uint8',
        type: 'uint16be',
      },
      payload: {
        value: 'floatbe',
      },
    };
    const hexArray = new Uint8Array([0xFF, 0x01, 0x00, 0x02, 0x3F, 0x80, 0x0, 0x0]); // float 1.0

    const result = decodeStruct({ struct, hexArray });
    expect(result).toEqual({
      type: -1,
      header: { version: 1, type: 2 },
      payload: { value: 1.0 },
    });
  });

  it('should throw on bad buffer length', () => {
    const struct = {
      type: 'int8',
      header: {
        version: 'uint8',
        type: 'uint16be',
      },
      payload: {
        value: 'floatbe',
      },
    };
    const hexArray = new Uint8Array([0xFF, 0x01, 0x00, 0x02, 0x3F, 0x80]); // missing last two bytes

    expect(() => decodeStruct({ struct, hexArray })).toThrowError(
      'Bad buffer length reading value(floatbe) at offset 4',
    );
  });

  it('should throw an error when decoding an unsupported array type', () => {
    const struct = {
      list: ['uint8'],
    };
    const hexArray = new Uint8Array([0x01, 0x02, 0x03]);

    expect(() => decodeStruct({ struct, hexArray })).toThrowError(
      'Cannot decode a struct with array',
    );
  });
  it('should throw an error when decoding an unsized array type', () => {
    const struct = {
      list: 'uint8[]',
    };
    const hexArray = new Uint8Array([0x01, 0x02, 0x03]);

    expect(() => decodeStruct({ struct, hexArray })).toThrowError(
      'Unsupported unsized array: uint8[]',
    );
  });
});

describe('encodeStruct', () => {
  it('should encode a flat struct correctly', () => {
    const struct = {
      field1: 'uint8',
      field2: 'char[3]',
    };
    const jsonObject = {
      field1: 1,
      field2: 'abc',
    };

    const result = encodeStruct({ struct, jsonObject });
    expect(result).toEqual(new Uint8Array([0x01, 0x61, 0x62, 0x63]));
  });

  it('should encode a nested struct correctly', () => {
    const struct = {
      type: 'int8',
      header: {
        version: 'uint8',
        type: 'uint16be',
      },
      payload: {
        value: 'floatbe',
      },
    };
    const jsonObject = {
      type: -1,
      header: { version: 1, type: 2 },
      payload: { value: 1.0 },
    };

    const result = encodeStruct({ struct, jsonObject });
    expect(result).toEqual(new Uint8Array([0xFF, 0x01, 0x00, 0x02, 0x3F, 0x80, 0x0, 0x0]));
  });

  it('should throw an error if array size is incorrect', () => {
    const struct = {
      field1: 'uint8',
      field2: 'char[3]',
    };
    const jsonObject = {
      field1: 1,
      field2: 'abcd', // Too long
    };

    expect(() => encodeStruct({ struct, jsonObject })).toThrowError(
      'Unexpected array size \'field2\'=\'97,98,99,100\' expected 3 elements',
    );
  });

  it('should throw an error if value type is incorrect', () => {
    const struct = {
      field1: 'uint8',
      field2: 'char[3]',
    };
    const jsonObject = {
      field1: 1,
      field2: 123, // Invalid type
    };

    expect(() => encodeStruct({ struct, jsonObject })).toThrowError(
      'Unexpected non array \'field2\'=\'123\'',
    );
  });

  it('should throw an error if value type is incorrect', () => {
    const struct = {
      field1: 'uint8',
      field2: 'int16',
    };
    const jsonObject = {
      field1: 1,
      field2: '123', // Invalid type
    };

    expect(() => encodeStruct({ struct, jsonObject })).toThrowError(
      'Unexpected array size \'field2\'=\'49,50,51\' expected 1 elements',
    );
  });

  it('should encode multiple integer types correctly', () => {
    const struct = {
      a: 'uint8',
      b: 'uint16',
      c: 'uint32',
    };
    const jsonObject = {
      a: 1,
      b: 513,
      c: 67305985,
    };

    const result = encodeStruct({ struct, jsonObject });
    expect(result).toEqual(new Uint8Array([0x01, 0x01, 0x02, 0x01, 0x02, 0x03, 0x04]));
  });
});
