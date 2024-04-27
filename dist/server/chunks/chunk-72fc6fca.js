function textToBase64(str, { makeUrlSafe = false } = {}) {
  const encoded = window.btoa(str);
  return makeUrlSafe ? makeUriSafe(encoded) : encoded;
}
function base64ToText(str, { makeUrlSafe = false } = {}) {
  if (!isValidBase64(str, { makeUrlSafe })) {
    throw new Error("Incorrect base64 string");
  }
  let cleanStr = removePotentialDataAndMimePrefix(str);
  if (makeUrlSafe) {
    cleanStr = unURI(cleanStr);
  }
  try {
    return window.atob(cleanStr);
  } catch (_) {
    throw new Error("Incorrect base64 string");
  }
}
function removePotentialDataAndMimePrefix(str) {
  return str.replace(/^data:.*?;base64,/, "");
}
function isValidBase64(str, { makeUrlSafe = false } = {}) {
  let cleanStr = removePotentialDataAndMimePrefix(str);
  if (makeUrlSafe) {
    cleanStr = unURI(cleanStr);
  }
  try {
    if (makeUrlSafe) {
      return removePotentialPadding(window.btoa(window.atob(cleanStr))) === cleanStr;
    }
    return window.btoa(window.atob(cleanStr)) === cleanStr;
  } catch (err) {
    return false;
  }
}
function makeUriSafe(encoded) {
  return encoded.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function unURI(encoded) {
  return encoded.replace(/-/g, "+").replace(/_/g, "/").replace(/[^A-Za-z0-9+/]/g, "");
}
function removePotentialPadding(str) {
  return str.replace(/=/g, "");
}

export { base64ToText as b, isValidBase64 as i, textToBase64 as t };
