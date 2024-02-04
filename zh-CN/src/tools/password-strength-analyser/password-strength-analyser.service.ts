import _ from 'lodash';

export { getPasswordCrackTimeEstimation, getCharsetLength };

function prettifyExponentialNotation(exponentialNotation: number) {
  const [base, exponent] = exponentialNotation.toString().split('e');
  const baseAsNumber = Number.parseFloat(base);
  const prettyBase = baseAsNumber % 1 === 0 ? baseAsNumber.toLocaleString() : baseAsNumber.toFixed(2);
  return exponent ? `${prettyBase}e${exponent}` : prettyBase;
}

function getHumanFriendlyDuration({ seconds }: { seconds: number }) {
  if (seconds <= 0.001) {
    return '立即';
  }

  if (seconds <= 1) {
    return '不到一秒';
  }

  const timeUnits = [
    { unit: 'century', secondsInUnit: 3153600000, format: prettifyExponentialNotation, plural: '世纪' },
    { unit: 'year', secondsInUnit: 31536000, plural: '年' },
    { unit: 'month', secondsInUnit: 2592000, plural: '个月' },
    { unit: 'week', secondsInUnit: 604800, plural: '周' },
    { unit: 'day', secondsInUnit: 86400, plural: '天' },
    { unit: 'hour', secondsInUnit: 3600, plural: '小时' },
    { unit: 'minute', secondsInUnit: 60, plural: '分钟' },
    { unit: 'second', secondsInUnit: 1, plural: '秒' },
  ];

  return _.chain(timeUnits)
    .map(({ unit, secondsInUnit, plural, format = _.identity }) => {
      const quantity = Math.floor(seconds / secondsInUnit);
      seconds %= secondsInUnit;

      if (quantity <= 0) {
        return undefined;
      }

      const formattedQuantity = format(quantity);
      return `${formattedQuantity} ${quantity > 1 ? plural : unit}`;
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
