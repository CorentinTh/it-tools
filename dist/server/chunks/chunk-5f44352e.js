function convertBase({ value, fromBase, toBase }) {
  const range = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split("");
  const fromRange = range.slice(0, fromBase);
  const toRange = range.slice(0, toBase);
  let decValue = value.split("").reverse().reduce((carry, digit, index) => {
    if (!fromRange.includes(digit)) {
      throw new Error(`Invalid digit "${digit}" for base ${fromBase}.`);
    }
    return carry += fromRange.indexOf(digit) * fromBase ** index;
  }, 0);
  let newValue = "";
  while (decValue > 0) {
    newValue = toRange[decValue % toBase] + newValue;
    decValue = (decValue - decValue % toBase) / toBase;
  }
  return newValue || "0";
}

export { convertBase as c };
