export { withDefaultOnError, withDefaultOnErrorAsync };

function withDefaultOnError<A, B>(cb: () => A, defaultValue: B): A | B {
  try {
    return cb();
  }
  catch (_) {
    return defaultValue;
  }
}

async function withDefaultOnErrorAsync<A, B>(cb: () => A, defaultValue: B): Promise<Awaited<A> | B> {
  try {
    return await cb();
  }
  catch (_) {
    return defaultValue;
  }
}
