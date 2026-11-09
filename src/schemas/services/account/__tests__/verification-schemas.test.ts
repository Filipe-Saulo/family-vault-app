import { forgotPasswordRequestSchema } from '@/schemas/services/account/forgot-password-request-schema';
import { registerCodeSchema, registerRequestSchema } from '@/schemas/services/account/register-request-schema';
import { resetPasswordRequestSchema } from '@/schemas/services/account/reset-password-request-schema';

const personal = {
  firstName: 'Maria',
  lastName: 'Silva',
  age: 30,
  password: 'Abcde1',
  passwordConfirm: 'Abcde1',
};

describe('registerRequestSchema', () => {
  it('accepts SMS with a phone', () => {
    expect(registerRequestSchema.safeParse({ ...personal, method: 'sms', phoneNumber: '11987654321' }).success).toBe(true);
  });

  it('accepts e-mail without a phone', () => {
    expect(registerRequestSchema.safeParse({ ...personal, method: 'email', email: 'a@b.com' }).success).toBe(true);
  });

  it('rejects SMS without a phone and e-mail without an address', () => {
    expect(registerRequestSchema.safeParse({ ...personal, method: 'sms', email: 'a@b.com' }).success).toBe(false);
    expect(registerRequestSchema.safeParse({ ...personal, method: 'email', phoneNumber: '11987654321' }).success).toBe(false);
  });

  it('rejects an invalid e-mail and mismatched passwords', () => {
    expect(registerRequestSchema.safeParse({ ...personal, method: 'email', email: 'x' }).success).toBe(false);
    expect(
      registerRequestSchema.safeParse({ ...personal, passwordConfirm: 'Zzzzz9', method: 'email', email: 'a@b.com' }).success
    ).toBe(false);
  });
});

describe('forgotPasswordRequestSchema', () => {
  it('validates only the chosen channel', () => {
    expect(forgotPasswordRequestSchema.safeParse({ method: 'sms', phone: '11987654321' }).success).toBe(true);
    expect(forgotPasswordRequestSchema.safeParse({ method: 'email', email: 'a@b.com' }).success).toBe(true);
    expect(forgotPasswordRequestSchema.safeParse({ method: 'sms', phone: '' }).success).toBe(false);
    expect(forgotPasswordRequestSchema.safeParse({ method: 'email', email: '' }).success).toBe(false);
  });
});

describe('code validation', () => {
  it('requires exactly 6 digits', () => {
    expect(registerCodeSchema.safeParse({ code: '123456' }).success).toBe(true);
    expect(registerCodeSchema.safeParse({ code: '12345' }).success).toBe(false);
    expect(registerCodeSchema.safeParse({ code: '12345a' }).success).toBe(false);
    expect(
      resetPasswordRequestSchema.safeParse({ code: '12345', password: 'Abcde1', passwordConfirm: 'Abcde1' }).success
    ).toBe(false);
  });
});
