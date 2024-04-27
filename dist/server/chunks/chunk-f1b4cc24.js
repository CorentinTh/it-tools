function withDefaultOnError(cb, defaultValue) {
  try {
    return cb();
  } catch (_) {
    return defaultValue;
  }
}
async function withDefaultOnErrorAsync(cb, defaultValue) {
  try {
    return await cb();
  } catch (_) {
    return defaultValue;
  }
}

export { withDefaultOnErrorAsync as a, withDefaultOnError as w };
