import { Base64 } from 'js-base64';

export { textToBase64, base64ToText, isValidBase64, removePotentialDataAndMimePrefix };

function textToBase64(str: string, { makeUrlSafe = false }: { makeUrlSafe?: boolean } = {}) {
  const encoded = Base64.encode(str);
  return makeUrlSafe ? makeUriSafe(encoded) : encoded;
}

function base64ToText(str: string, { makeUrlSafe = false }: { makeUrlSafe?: boolean } = {}) {
  if (!isValidBase64(str, { makeUrlSafe })) {
    throw new Error('Incorrect base64 string');
  }

  let cleanStr = removePotentialDataAndMimePrefix(str);
  if (makeUrlSafe) {
    cleanStr = unURI(cleanStr);
  }

  try {
    return Base64.decode(cleanStr);
  }
  catch (_) {
    throw new Error('Incorrect base64 string');
  }
}

function removePotentialDataAndMimePrefix(str: string) {
  return str.replace(/^data:.*?;base64,/, '');
}

function isValidBase64(str: string, { makeUrlSafe = false }: { makeUrlSafe?: boolean } = {}) {
  let cleanStr = removePotentialDataAndMimePrefix(str);
  if (makeUrlSafe) {
    cleanStr = unURI(cleanStr);
  }

  try {
    const reEncodedBase64 = Base64.fromUint8Array(Base64.toUint8Array(cleanStr));
    if (makeUrlSafe) {
      return removePotentialPadding(reEncodedBase64) === cleanStr;
    }
    return reEncodedBase64 === cleanStr.replace(/\s/g, '');
  }
  catch (err) {
    return false;
  }
}

function makeUriSafe(encoded: string) {
  return encoded.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function unURI(encoded: string): string {
  return encoded
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .replace(/[^A-Za-z0-9+/]/g, '');
}

function removePotentialPadding(str: string) {
  return str.replace(/=/g, '');
}
