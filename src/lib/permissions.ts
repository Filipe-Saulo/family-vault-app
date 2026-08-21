export const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
export const PERMISSION_CLAIM = 'permission';

export function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
  if (typeof value === 'string') return [value];
  return [];
}

export function hasRole(roles: string[], role: string): boolean {
  return roles.includes(role);
}

export function hasPermission(permissions: string[], permission: string): boolean {
  return permissions.includes(permission);
}
