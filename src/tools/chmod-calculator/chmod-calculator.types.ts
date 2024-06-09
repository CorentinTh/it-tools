export type Scope = 'read' | 'write' | 'execute';
export type Group = 'owner' | 'group' | 'public';
export type SpecialFlags = 'setuid' | 'setgid' | 'stickybit';

export type GroupPermissions = {
  [k in Scope]: boolean;
};

export type SpecialPermissions = {
  [k in SpecialFlags]: boolean;
};

export type Permissions = {
  [k in Group]: GroupPermissions;
} & {
  flags: SpecialPermissions
};
