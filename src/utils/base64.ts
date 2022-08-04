export { textToBase64, base64ToText, isValidBase64, removePotentialDataAndMimePrefix };

function textToBase64(str: string) {
  return window.btoa(str);
}

function base64ToText(str: string) {
  if (!isValidBase64(str)) {
    throw new Error('Incorrect base64 string');
  }

  const cleanStr = removePotentialDataAndMimePrefix(str);

  try {
    return window.atob(cleanStr);
  } catch (_) {
    throw new Error('Incorrect base64 string');
  }
}

function removePotentialDataAndMimePrefix(str: string) {
  return str.replace(/^data:.*?;base64,/, '');
}

function isValidBase64(str: string) {
  const cleanStr = removePotentialDataAndMimePrefix(str);

  try {
    return window.btoa(window.atob(cleanStr)) === cleanStr;
  } catch (err) {
    return false;
  }
}
