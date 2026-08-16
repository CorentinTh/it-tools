import type { Group, GroupPermissions, Permissions, SpecialPermissions } from './chmod-calculator.types';

export interface ChmodMode {
  permissions: Permissions
  special: SpecialPermissions
}

const groups: Group[] = ['owner', 'group', 'public'];
const scopes = ['read', 'write', 'execute'] as const;
const scopeValues = { read: 4, write: 2, execute: 1 } as const;

export function emptyChmodMode(): ChmodMode {
  return {
    permissions: Object.fromEntries(groups.map(group => [group, { read: false, write: false, execute: false }])) as Permissions,
    special: { setuid: false, setgid: false, sticky: false },
  };
}

function groupValue(permission: GroupPermissions) {
  return scopes.reduce((total, scope) => total + (permission[scope] ? scopeValues[scope] : 0), 0);
}

function specialValue(special: SpecialPermissions) {
  return (special.setuid ? 4 : 0) + (special.setgid ? 2 : 0) + (special.sticky ? 1 : 0);
}

export function computeChmodOctalRepresentation({ permissions, special = { setuid: false, setgid: false, sticky: false } }: { permissions: Permissions; special?: SpecialPermissions }): string {
  const ordinary = groups.map(group => groupValue(permissions[group])).join('');
  const leading = specialValue(special);
  return leading ? `${leading}${ordinary}` : ordinary;
}

export function computeChmodSymbolicRepresentation({ permissions, special = { setuid: false, setgid: false, sticky: false } }: { permissions: Permissions; special?: SpecialPermissions }): string {
  const output = groups.flatMap(group => scopes.map((scope) => {
    if (scope !== 'execute') {
      return permissions[group][scope] ? scope[0] : '-';
    }
    const enabled = permissions[group].execute;
    const specialEnabled = group === 'owner' ? special.setuid : group === 'group' ? special.setgid : special.sticky;
    if (!specialEnabled) {
      return enabled ? 'x' : '-';
    }
    return group === 'public' ? (enabled ? 't' : 'T') : (enabled ? 's' : 'S');
  }));
  return output.join('');
}

function fromOctal(input: string): ChmodMode {
  const normalized = input.startsWith('0') && input.length === 4 ? input.slice(1) : input;
  if (!/^[0-7]{3,4}$/u.test(normalized)) {
    throw new TypeError('Enter a three- or four-digit octal mode using only 0–7.');
  }
  const mode = emptyChmodMode();
  const digits = normalized.length === 4 ? normalized : `0${normalized}`;
  const special = Number(digits[0]);
  mode.special = { setuid: Boolean(special & 4), setgid: Boolean(special & 2), sticky: Boolean(special & 1) };
  groups.forEach((group, index) => {
    const value = Number(digits[index + 1]);
    mode.permissions[group] = { read: Boolean(value & 4), write: Boolean(value & 2), execute: Boolean(value & 1) };
  });
  return mode;
}

function parseExecute(character: string, lower: string, upper: string) {
  if (character === 'x' || character === '-') {
    return { execute: character === 'x', special: false };
  }
  if (character === lower || character === upper) {
    return { execute: character === lower, special: true };
  }
  throw new TypeError('Symbolic execute positions must use x, -, s/S, or t/T in their applicable position.');
}

function fromSymbolic(input: string): ChmodMode {
  if (input.length !== 9) {
    throw new TypeError('Enter exactly nine symbolic permission characters, such as rwxr-xr-x.');
  }
  const mode = emptyChmodMode();
  groups.forEach((group, index) => {
    const offset = index * 3;
    if (!['r', '-'].includes(input[offset]) || !['w', '-'].includes(input[offset + 1])) {
      throw new TypeError('Symbolic read/write positions must use r/w or -.');
    }
    const parsed = parseExecute(input[offset + 2], group === 'public' ? 't' : 's', group === 'public' ? 'T' : 'S');
    mode.permissions[group] = { read: input[offset] === 'r', write: input[offset + 1] === 'w', execute: parsed.execute };
    if (group === 'owner') {
      mode.special.setuid = parsed.special;
    }
    if (group === 'group') {
      mode.special.setgid = parsed.special;
    }
    if (group === 'public') {
      mode.special.sticky = parsed.special;
    }
  });
  return mode;
}

export function parseChmodMode(value: string): ChmodMode {
  const input = value.trim();
  return /^[0-9]+$/u.test(input) ? fromOctal(input) : fromSymbolic(input);
}

export function applyUmask(requestedMode: '0666' | '0777', umask: string) {
  if (!/^0?[0-7]{3}$/u.test(umask.trim())) {
    throw new TypeError('Umask must be a three-digit octal value, optionally prefixed with 0.');
  }
  const requested = Number.parseInt(requestedMode, 8);
  const mask = Number.parseInt(umask.trim(), 8);
  return (requested & ~mask & 0o777).toString(8).padStart(3, '0');
}
