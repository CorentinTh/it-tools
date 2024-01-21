declare module 'jpeg-quality-estimator' {
  const getJpegQuality: (file: Uint8Array) => number;
  export default getJpegQuality;
}
