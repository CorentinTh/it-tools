import _ from 'lodash';
import type { GroupPermissions, Permissions } from './chmod-calculator.types';

export {
  computeChmodOctalRepresentation,
  computeChmodSymbolicRepresentation,
  symbolicToOctal,
  checkSymbolicString,
  validateCharPositions,
};

function computeChmodOctalRepresentation({ permissions }: { permissions: Permissions }): string {
  const permissionValue = { read: 4, write: 2, execute: 1 };

  const getGroupPermissionValue = (permission: GroupPermissions) =>
    _.reduce(permission, (acc, isPermSet, key) => acc + (isPermSet ? _.get(permissionValue, key, 0) : 0), 0);

  return [
    getGroupPermissionValue(permissions.owner),
    getGroupPermissionValue(permissions.group),
    getGroupPermissionValue(permissions.public),
  ].join('');
}

function computeChmodSymbolicRepresentation({ permissions }: { permissions: Permissions }): string {
  const permissionValue = { read: 'r', write: 'w', execute: 'x' };

  const getGroupPermissionValue = (permission: GroupPermissions) =>
    _.reduce(permission, (acc, isPermSet, key) => acc + (isPermSet ? _.get(permissionValue, key, '') : '-'), '');

  return [
    getGroupPermissionValue(permissions.owner),
    getGroupPermissionValue(permissions.group),
    getGroupPermissionValue(permissions.public),
  ].join('');
}

function validateCharPositions(permissionSet: string): boolean {
  const validChars = ['r', 'w', 'x'];
  for (let i = 0; i < 3; i++) {
    const permSetCharCurrent = permissionSet.charAt(i);
    const validCharCurent = validChars[i];
    if (permissionSet.charAt(i) !== '-' && permSetCharCurrent !== validCharCurent) {
      return false;
    }
  }
  return true;
}

function checkDuplicateInGroup(group: string): boolean {
  const validPermissions = ['r', 'w', 'x'];
  const permissions = group.split('').filter(p => validPermissions.includes(p));
  const uniquePermissions = new Set(permissions);
  return permissions.length !== uniquePermissions.size;
}

function symbolicToOctal(symbolic: string): number {
  const symbolicMap: Record<string, number> = {
    'r': 4,
    'w': 2,
    'x': 1,
    '-': 0,
  };

  const userPart = symbolic.length === 10 ? symbolic.slice(1, 4) : symbolic.slice(0, 3);
  const groupPart = symbolic.length === 10 ? symbolic.slice(4, 7) : symbolic.slice(3, 6);
  const publicPart = symbolic.length === 10 ? symbolic.slice(7, 10) : symbolic.slice(6, 9);

  const userNumeric = userPart.split('').reduce((sum, value) => sum + (symbolicMap[value] || 0), 0);
  const groupNumeric = groupPart.split('').reduce((sum, value) => sum + (symbolicMap[value] || 0), 0);
  const publicNumeric = publicPart.split('').reduce((sum, value) => sum + (symbolicMap[value] || 0), 0);

  return userNumeric * 100 + groupNumeric * 10 + publicNumeric;
}

function checkSymbolicString(symbolicInput: string): string {
  const permissionsRegex = /^([-dlbcsp])?[rwx-]{9}$/;

  if (symbolicInput.length === 0) {
    return '';
  }
  if (symbolicInput.length > 10) {
    return 'Invalid length.';
  }
  if (!permissionsRegex.test(symbolicInput)) {
    return 'Invalid permission pattern.';
  }

  const userPermissions = symbolicInput.slice(-9, -6);
  const groupPermissions = symbolicInput.slice(-6, -3);
  const publicPermissions = symbolicInput.slice(-3);

  if (checkDuplicateInGroup(userPermissions)) {
    return 'Duplicate rights are not allowed in the user section.';
  }
  if (checkDuplicateInGroup(groupPermissions)) {
    return 'Duplicate rights are not allowed in the group section.';
  }
  if (checkDuplicateInGroup(publicPermissions)) {
    return 'Duplicate rights are not allowed in the public section.';
  }
  if (!validateCharPositions(userPermissions)) {
    return 'User permissions should be in the order of \'r\', \'w\', \'x\'.';
  }
  if (!validateCharPositions(groupPermissions)) {
    return 'Group permissions should be in the order of \'r\', \'w\', \'x\'.';
  }
  if (!validateCharPositions(publicPermissions)) {
    return 'Public permissions should be in the order of \'r\', \'w\', \'x\'.';
  }
  return '';
}
