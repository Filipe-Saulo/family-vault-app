export interface User {
  firstName: string;
  lastName: string;
  age: number;
}

export interface CurrentUser {
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string | null;
  email: string | null;
  age: number;
}
