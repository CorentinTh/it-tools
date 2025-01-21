import _ from 'lodash';

export function isValidObjectId(objectId?: string): boolean {
  return !_.isNil(objectId) && /^[0-9a-fA-F]{24}$/.test(objectId);
}

export function objectIdToDate(objectId: string): Date {
  return new Date(Number.parseInt(objectId.substring(0, 8), 16) * 1000);
}

export function objectIdFromDate(milliseconds: number, onlyDate: boolean = false): string {
  const suffixReplacer = () => {
    if (onlyDate) {
      return '0';
    }

    return (_.random(0, 1, true) * 16 | 0).toString(16);
  };

  const timestamp = (milliseconds / 1000 | 0).toString(16);
  const suffix = 'xxxxxxxxxxxxxxxx'.replace(/x/g, suffixReplacer).toLowerCase();

  return `${timestamp}${suffix}`;
}
