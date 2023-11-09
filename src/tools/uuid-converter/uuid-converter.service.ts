import { validate as uuidValidate, version as uuidVersion } from 'uuid';

export { normalizeUUID, UUID2HEX, getVersion };

function normalizeUUID(value: string) {
  let uuid = ''; // Default return value
  const probablyUuid = value.toLowerCase();

  const uuidHexRegEx = /^([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})$/;
  const isCondensedUuid = uuidHexRegEx.test(probablyUuid);

  if (isCondensedUuid) {
    uuid = probablyUuid.replace(uuidHexRegEx, '$1-$2-$3-$4-$5');
  }
  else {
    uuid = value;
  };

  return uuidValidate(uuid) ? uuid : '';
}

function UUID2HEX(value: string, upper = true) {
  let result = ''; // Default return value
  const uuid = normalizeUUID(value);

  if (uuid) {
    const hex = value.replace(/-/g, '');
    result = upper ? hex.toUpperCase() : hex.toLowerCase();
  }

  return result;
}

function getVersion(value: string) {
  const uuid = normalizeUUID(value);

  return uuid ? uuidVersion(uuid).toString() : '';
}
