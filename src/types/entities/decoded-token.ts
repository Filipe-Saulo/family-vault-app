export interface DecodedToken {
  exp: number;
  uid?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
  permission?: string | string[];
  [key: string]: unknown;
}
