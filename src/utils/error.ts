export { getErrorMessageIfThrows };

function getErrorMessageIfThrows(cb: () => unknown) {
  try {
    cb();
    return undefined;
  }
  catch (err) {
    if (typeof err === 'string') {
      return err;
    }

    if (err instanceof Error) {
      return err.message;
    }

    if (typeof err === 'object' && err !== null && 'message' in err && typeof err.message === 'string') {
      return err.message;
    }

    return 'An error as occurred.';
  }
}
