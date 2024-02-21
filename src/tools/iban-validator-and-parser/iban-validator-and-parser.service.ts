import { ValidationErrorsIBAN } from 'ibantools';
import { translate as t } from '@/plugins/i18n.plugin';

export { getFriendlyErrors };

const ibanErrorToMessage = {
  [ValidationErrorsIBAN.NoIBANProvided]: t('tools.iban-validator-and-parser.noIBANProvided'),
  [ValidationErrorsIBAN.NoIBANCountry]: t('tools.iban-validator-and-parser.noIBANCountry'),
  [ValidationErrorsIBAN.WrongBBANLength]: t('tools.iban-validator-and-parser.wrongBBANLength'),
  [ValidationErrorsIBAN.WrongBBANFormat]: t('tools.iban-validator-and-parser.wrongBBANFormat'),
  [ValidationErrorsIBAN.ChecksumNotNumber]: t('tools.iban-validator-and-parser.checksumNotNumber'),
  [ValidationErrorsIBAN.WrongIBANChecksum]: t('tools.iban-validator-and-parser.wrongIBANChecksum'),
  [ValidationErrorsIBAN.WrongAccountBankBranchChecksum]: t('tools.iban-validator-and-parser.wrongAccountBankBranchChecksum'),
  [ValidationErrorsIBAN.QRIBANNotAllowed]: t('tools.iban-validator-and-parser.QRIBANNotAllowed'),
};

function getFriendlyErrors(errorCodes: ValidationErrorsIBAN[]) {
  return errorCodes.map(errorCode => ibanErrorToMessage[errorCode]).filter(Boolean);
}
