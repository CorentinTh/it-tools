function convertHexToBin(hex) {
  return hex.trim().split("").map((byte) => Number.parseInt(byte, 16).toString(2).padStart(4, "0")).join("");
}

export { convertHexToBin as c };
