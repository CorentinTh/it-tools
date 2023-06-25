import _ from 'lodash';

export { getPasswordCrackTimeEstimation, getCharsetLength };

function prettifyExponentialNotation(exponentialNotation: number) {
  const [base, exponent] = exponentialNotation.toString().split('e');
  const baseAsNumber = parseFloat(base);
  const prettyBase = baseAsNumber % 1 === 0 ? baseAsNumber.toLocaleString() : baseAsNumber.toFixed(2);
  return exponent ? `${prettyBase}e${exponent}` : prettyBase;
}

function getHumanFriendlyDuration({ seconds }: { seconds: number }) {
  if (seconds <= 0.001) {
    return 'Instantly';
  }

  if (seconds <= 1) {
    return 'Less than a second';
  }

  const timeUnits = [
    { unit: 'millenium', secondsInUnit: 31536000000, format: prettifyExponentialNotation },
    { unit: 'century', secondsInUnit: 3153600000 },
    { unit: 'decade', secondsInUnit: 315360000 },
    { unit: 'year', secondsInUnit: 31536000 },
    { unit: 'month', secondsInUnit: 2592000 },
    { unit: 'week', secondsInUnit: 604800 },
    { unit: 'day', secondsInUnit: 86400 },
    { unit: 'hour', secondsInUnit: 3600 },
    { unit: 'minute', secondsInUnit: 60 },
    { unit: 'second', secondsInUnit: 1 },
  ];

  return _.chain(timeUnits)
    .map(({ unit, secondsInUnit, format = _.identity }) => {
      const quantity = Math.floor(seconds / secondsInUnit);
      seconds %= secondsInUnit;

      if (quantity <= 0) {
        return undefined;
      }

      const formattedQuantity = format(quantity);
      return `${formattedQuantity} ${unit}${quantity > 1 ? 's' : ''}`;
    })
    .compact()
    .take(2)
    .join(', ')
    .value();
}

function getPasswordCrackTimeEstimation({ password, guessesPerSecond = 1e9 }: { password: string; guessesPerSecond?: number }) {
  const charsetLength = getCharsetLength({ password });
  const passwordLength = password.length;

  const entropy = password === '' ? 0 : Math.log2(charsetLength) * passwordLength;

  const secondsToCrack = 2 ** entropy / guessesPerSecond;

  const crackDurationFormatted = getHumanFriendlyDuration({ seconds: secondsToCrack });

  const score = Math.min(entropy / 128, 1);

  return {
    entropy,
    charsetLength,
    passwordLength,
    crackDurationFormatted,
    secondsToCrack,
    score,
  };
}

function getCharsetLength({ password }: { password: string }) {
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigits = /\d/.test(password);
  const hasSpecialChars = /\W|_/.test(password);

  let charsetLength = 0;

  if (hasLowercase) {
    charsetLength += 26;
  }
  if (hasUppercase) {
    charsetLength += 26;
  }
  if (hasDigits) {
    charsetLength += 10;
  }
  if (hasSpecialChars) {
    charsetLength += 32;
  }

  return charsetLength;
}
