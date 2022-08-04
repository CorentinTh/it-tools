export { withDefaultOnError };

function withDefaultOnError<A, B>(cb: () => A, defaultValue: B): A | B {
  try {
    return cb();
  } catch (_) {
    return defaultValue;
  }
}
