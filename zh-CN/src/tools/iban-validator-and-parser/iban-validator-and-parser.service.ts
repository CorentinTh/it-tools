import { ValidationErrorsIBAN } from 'ibantools';

export { getFriendlyErrors };

const ibanErrorToMessage = {
  [ValidationErrorsIBAN.NoIBANProvided]: '未提供 IBAN',
  [ValidationErrorsIBAN.NoIBANCountry]: '无 IBAN 国家/地区',
  [ValidationErrorsIBAN.WrongBBANLength]: 'BBAN 长度错误',
  [ValidationErrorsIBAN.WrongBBANFormat]: 'BBAN 格式错误',
  [ValidationErrorsIBAN.ChecksumNotNumber]: '不是数字',
  [ValidationErrorsIBAN.WrongIBANChecksum]: 'IBAN 校验和错误',
  [ValidationErrorsIBAN.WrongAccountBankBranchChecksum]: '帐户银行分行校验错误',
  [ValidationErrorsIBAN.QRIBANNotAllowed]: '不允许 QR-IBAN',
};

function getFriendlyErrors(errorCodes: ValidationErrorsIBAN[]) {
  return errorCodes.map(errorCode => ibanErrorToMessage[errorCode]).filter(Boolean);
}
