export type Scope = 'read' | 'write' | 'execute';
export type Group = 'owner' | 'group' | 'public';

export type GroupPermissions = {
  [k in Scope]: boolean;
};

export type Permissions = {
  [k in Group]: GroupPermissions;
};

export interface SpecialPermissions {
  setuid: boolean
  setgid: boolean
  sticky: boolean
}
