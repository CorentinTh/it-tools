export { textToBase64, base64ToText, isValidBase64, removePotentialDataAndMimePrefix };

function textToBase64(str: string, urlSafe = false) {
  const encoded = window.btoa(str);
  return urlSafe ? makeUriSafe(encoded) : encoded;
}

function base64ToText(str: string, urlSafe = false) {
  if (!isValidBase64(str, urlSafe)) {
    throw new Error('Incorrect base64 string');
  }

  let cleanStr = removePotentialDataAndMimePrefix(str);
  if (urlSafe) {
    cleanStr = unURI(cleanStr);
  }

  try {
    return window.atob(cleanStr);
  } catch (_) {
    throw new Error('Incorrect base64 string');
  }
}

function removePotentialDataAndMimePrefix(str: string) {
  return str.replace(/^data:.*?;base64,/, '');
}

function isValidBase64(str: string, urlSafe = false) {
  let cleanStr = removePotentialDataAndMimePrefix(str);
  if (urlSafe) {
    cleanStr = unURI(cleanStr);
  }

  try {
    if (urlSafe) {
      return removePotentialPadding(window.btoa(window.atob(cleanStr))) === cleanStr;
    }
    return window.btoa(window.atob(cleanStr)) === cleanStr;
  } catch (err) {
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
