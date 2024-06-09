import _ from 'lodash';
import type { GroupPermissions, Permissions, SpecialPermissions } from './chmod-calculator.types';

export { computeChmodOctalRepresentation, computeChmodSymbolicRepresentation, computePermissionsFromChmodOctalRepresentation, computePermissionsFromChmodSymbolicRepresentation };

function computeChmodOctalRepresentation({ permissions }: { permissions: Permissions }): string {
  const permissionValue = { read: 4, write: 2, execute: 1 };
  const specialPermissionValue = { setuid: 4, setgid: 2, stickybit: 1 };

  const getGroupPermissionValue = (permission: GroupPermissions) =>
    _.reduce(permission, (acc, isPermSet, key) => acc + (isPermSet ? _.get(permissionValue, key, 0) : 0), 0);
  const getSpecialPermissionValue = (permission: SpecialPermissions) => {
    const octalValue = _.reduce(permission, (acc, isPermSet, key) => acc + (isPermSet ? _.get(specialPermissionValue, key, 0) : 0), 0);
    return octalValue > 0 ? octalValue.toString() : '';
  };

  return [
    getSpecialPermissionValue(permissions.flags || { setuid: false, setgid: false, stickybit: false }),
    getGroupPermissionValue(permissions.owner),
    getGroupPermissionValue(permissions.group),
    getGroupPermissionValue(permissions.public),
  ].join('');
}

function computeChmodSymbolicRepresentation({ permissions }: { permissions: Permissions }): string {
  const permissionValue = { read: 'r', write: 'w', execute: 'x' };
  const specialFlagPermission = 'execute';

  const getGroupPermissionValue = (permission: GroupPermissions, specialFlag: null | 's' | 't') =>
    _.reduce(permission, (acc, isPermSet, key) => acc + ((key === specialFlagPermission ? specialFlag : undefined)
    || (isPermSet ? _.get(permissionValue, key, '') : '-')), '');

  return [
    getGroupPermissionValue(permissions.owner, permissions.flags?.setuid ? 's' : null),
    getGroupPermissionValue(permissions.group, permissions.flags?.setgid ? 's' : null),
    getGroupPermissionValue(permissions.public, permissions.flags?.stickybit ? 't' : null),
  ].join('');
}

function computePermissionsFromChmodOctalRepresentation(octalPermissions: string): Permissions {
  const permissionValue = { read: 4, write: 2, execute: 1 };
  const specialPermissionValue = { setuid: 4, setgid: 2, stickybit: 1 };

  if (!octalPermissions || !octalPermissions.match(/^[0-7]{3,4}$/)) {
    throw new Error(`Invalid octal permissions (must be 3 or 4 octal digits): ${octalPermissions}`);
  }
  const fullOctalPermissions = octalPermissions.length === 3 ? `0${octalPermissions}` : octalPermissions;

  const hasSet = (position: number, flagValue: number) => (Number(fullOctalPermissions[position]) & flagValue) === flagValue;
  function computePermissionObject<T>(permissionSet: object, position: number): T {
    return _.reduce(permissionSet, (acc, flag, key) => ({ ...acc, [key]: hasSet(position, flag) }), {}) as T;
  }
  const flagsPosition = 0;
  const ownerPosition = 1;
  const groupPosition = 2;
  const publicPosition = 3;
  return {
    owner: computePermissionObject(permissionValue, ownerPosition),
    group: computePermissionObject(permissionValue, groupPosition),
    public: computePermissionObject(permissionValue, publicPosition),
    flags: computePermissionObject(specialPermissionValue, flagsPosition),
  };
}

function computePermissionsFromChmodSymbolicRepresentation(symbolicPermissions: string): Permissions {
  const formatRegex = /^[-dlbcsp]?([r-])([w-])([xs-])([r-])([w-])([xs-])([r-])([w-])([xt-])$/;
  if (!symbolicPermissions || !symbolicPermissions.match(formatRegex)) {
    throw new Error(`Invalid string permissions (must be in form 'rwxrwxrwx'): ${symbolicPermissions}`);
  }

  const [_, rOwner, wOwner, xOwner, rGroup, wGroup, xGroup, rAll, wAll, xAll] = formatRegex.exec(symbolicPermissions) || [];
  const getOctal = (flag: string, flagLetter: string, flagValue: number) => flag === flagLetter ? flagValue : 0;
  const owner = getOctal(rOwner, 'r', 4)
  + getOctal(wOwner, 'w', 2)
  + getOctal(xOwner, 'x', 1) + getOctal(xOwner, 's', 1);
  const groups = getOctal(rGroup, 'r', 4)
  + getOctal(wGroup, 'w', 2)
  + getOctal(xGroup, 'x', 1) + getOctal(xGroup, 's', 1);
  const all = getOctal(rAll, 'r', 4)
  + getOctal(wAll, 'w', 2)
  + getOctal(xAll, 'x', 1) + getOctal(xAll, 't', 1);
  const flags = getOctal(xOwner, 's', 4)
    + getOctal(xGroup, 's', 2)
    + getOctal(xAll, 't', 1);
  const octalString = `${(flags > 0 ? flags : '')}${owner}${groups}${all}`;

  return computePermissionsFromChmodOctalRepresentation(octalString);
}
