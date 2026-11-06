import { ValidationErrorsIBAN } from 'ibantools';

export { getFriendlyErrors };

const ibanErrorToMessage = {
  [ValidationErrorsIBAN.NoIBANProvided]: 'No IBAN provided',
  [ValidationErrorsIBAN.NoIBANCountry]: 'No IBAN country',
  [ValidationErrorsIBAN.WrongBBANLength]: 'Wrong BBAN length',
  [ValidationErrorsIBAN.WrongBBANFormat]: 'Wrong BBAN format',
  [ValidationErrorsIBAN.ChecksumNotNumber]: 'Checksum is not a number',
  [ValidationErrorsIBAN.WrongIBANChecksum]: 'Wrong IBAN checksum',
  [ValidationErrorsIBAN.WrongAccountBankBranchChecksum]: 'Wrong account bank branch checksum',
  [ValidationErrorsIBAN.QRIBANNotAllowed]: 'QR-IBAN not allowed',
};

function getFriendlyErrors(errorCodes: ValidationErrorsIBAN[]) {
  return errorCodes.map(errorCode => ibanErrorToMessage[errorCode]).filter(Boolean);
}
