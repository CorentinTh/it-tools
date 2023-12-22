import _ from 'lodash';
import { translate } from '@/plugins/i18n.plugin';

export { getPasswordCrackTimeEstimation, getCharsetLength };

function prettifyExponentialNotation(exponentialNotation: number) {
  const [base, exponent] = exponentialNotation.toString().split('e');
  const baseAsNumber = Number.parseFloat(base);
  const prettyBase = baseAsNumber % 1 === 0 ? baseAsNumber.toLocaleString() : baseAsNumber.toFixed(2);
  return exponent ? `${prettyBase}e${exponent}` : prettyBase;
}

function getHumanFriendlyDuration({ seconds }: { seconds: number }) {
  if (seconds <= 0.001) {
    return translate('tools.password-strength-analyser.instantly');
  }

  if (seconds <= 1) {
    return translate('tools.password-strength-analyser.lessThanASecond');
  }

  const timeUnits = [
    { unit: translate('tools.password-strength-analyser.millenium'), secondsInUnit: 31536000000, format: prettifyExponentialNotation, plural: translate('tools.password-strength-analyser.millennia') },
    { unit: translate('tools.password-strength-analyser.century'), secondsInUnit: 3153600000, plural: translate('tools.password-strength-analyser.centuries') },
    { unit: translate('tools.password-strength-analyser.decade'), secondsInUnit: 315360000, plural: translate('tools.password-strength-analyser.decades') },
    { unit: translate('tools.password-strength-analyser.year'), secondsInUnit: 31536000, plural: translate('tools.password-strength-analyser.years') },
    { unit: translate('tools.password-strength-analyser.month'), secondsInUnit: 2592000, plural: translate('tools.password-strength-analyser.months') },
    { unit: translate('tools.password-strength-analyser.week'), secondsInUnit: 604800, plural: translate('tools.password-strength-analyser.weeks') },
    { unit: translate('tools.password-strength-analyser.day'), secondsInUnit: 86400, plural: translate('tools.password-strength-analyser.days') },
    { unit: translate('tools.password-strength-analyser.hour'), secondsInUnit: 3600, plural: translate('tools.password-strength-analyser.hours') },
    { unit: translate('tools.password-strength-analyser.minute'), secondsInUnit: 60, plural: translate('tools.password-strength-analyser.minutes') },
    { unit: translate('tools.password-strength-analyser.second'), secondsInUnit: 1, plural: translate('tools.password-strength-analyser.seconds') },
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
