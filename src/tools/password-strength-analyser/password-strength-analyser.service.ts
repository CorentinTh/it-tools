import _ from 'lodash';

export { getPasswordCrackTimeEstimation, getCharsetLength };

function prettifyExponentialNotation(exponentialNotation: number) {
  const [base, exponent] = exponentialNotation.toString().split('e');
  const baseAsNumber = Number.parseFloat(base);
  const prettyBase = baseAsNumber % 1 === 0 ? baseAsNumber.toLocaleString() : baseAsNumber.toFixed(2);
  return exponent ? `${prettyBase}e${exponent}` : prettyBase;
}

function getHumanFriendlyDuration({ seconds }: { seconds: number }, t: (message: string, options?: any) => string) {
  if (seconds <= 0.001) {
    return t('passwordStrengthAnalyser.instantly');
  }

  if (seconds <= 1) {
    return t('passwordStrengthAnalyser.lessThanOneSecond');
  }

  const timeUnits = [
    {
      unit: t('passwordStrengthAnalyser.millenium'),
      secondsInUnit: 31536000000,
      format: prettifyExponentialNotation,
      plural: t('passwordStrengthAnalyser.millennia'),
    },
    { unit: t('passwordStrengthAnalyser.century'), secondsInUnit: 3153600000, plural: t('passwordStrengthAnalyser.centuries') },
    { unit: t('passwordStrengthAnalyser.decade'), secondsInUnit: 315360000, plural: t('passwordStrengthAnalyser.decades') },
    { unit: t('passwordStrengthAnalyser.year'), secondsInUnit: 31536000, plural: t('passwordStrengthAnalyser.years') },
    { unit: t('passwordStrengthAnalyser.month'), secondsInUnit: 2592000, plural: t('passwordStrengthAnalyser.months') },
    { unit: t('passwordStrengthAnalyser.week'), secondsInUnit: 604800, plural: t('passwordStrengthAnalyser.weeks') },
    { unit: t('passwordStrengthAnalyser.day'), secondsInUnit: 86400, plural: t('passwordStrengthAnalyser.days') },
    { unit: t('passwordStrengthAnalyser.hour'), secondsInUnit: 3600, plural: t('passwordStrengthAnalyser.hours') },
    { unit: t('passwordStrengthAnalyser.minute'), secondsInUnit: 60, plural: t('passwordStrengthAnalyser.minutes') },
    { unit: t('passwordStrengthAnalyser.second'), secondsInUnit: 1, plural: t('passwordStrengthAnalyser.seconds') },
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

function getPasswordCrackTimeEstimation(
  { password, guessesPerSecond = 1e9 }: { password: string; guessesPerSecond?: number },
  t: (message: string, options?: any) => string,
) {
  const charsetLength = getCharsetLength({ password });
  const passwordLength = password.length;

  const entropy = password === '' ? 0 : Math.log2(charsetLength) * passwordLength;

  const secondsToCrack = 2 ** entropy / guessesPerSecond;

  const crackDurationFormatted = getHumanFriendlyDuration({ seconds: secondsToCrack }, t);

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
