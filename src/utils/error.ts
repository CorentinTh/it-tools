import _ from 'lodash';

export { getErrorMessageIfThrows };

function getErrorMessageIfThrows(cb: () => unknown) {
  try {
    cb();
    return undefined;
  }
  catch (err) {
    if (_.isString(err)) {
      return err;
    }

    if (_.isError(err)) {
      return err.message;
    }

    if (_.isObject(err) && _.has(err, 'message')) {
      return (err as { message: string }).message;
    }

    return 'An error as occurred.';
  }
}
