import { describe, expect, it } from 'vitest';
import { isValidEmail } from './AuthContext';

describe('isValidEmail', () => {
  it('accepts e-mails from well-known, conventional providers', () => {
    expect(isValidEmail('usuario@gmail.com')).toBe(true);
    expect(isValidEmail('usuario@hotmail.com')).toBe(true);
    expect(isValidEmail('usuario@yahoo.com')).toBe(true);
    expect(isValidEmail('usuario@outlook.com')).toBe(true);
    expect(isValidEmail('usuario@icloud.com')).toBe(true);
    expect(isValidEmail('Usuario@Gmail.com')).toBe(true);
  });

  it('rejects made-up or unknown domains, even if well-formed', () => {
    expect(isValidEmail('123@kkk.com')).toBe(false);
    expect(isValidEmail('usuario@empresa-qualquer.com')).toBe(false);
    expect(isValidEmail('teste@naoexiste.xyz')).toBe(false);
  });

  it('rejects text with no @ at all', () => {
    expect(isValidEmail('usuario')).toBe(false);
  });
  it('rejects an @ with nothing after it', () => {
    expect(isValidEmail('usuario@')).toBe(false);
  });
  it('rejects missing text before the @', () => {
    expect(isValidEmail('@gmail.com')).toBe(false);
  });
  it('rejects a domain with no extension', () => {
    expect(isValidEmail('usuario@gmail')).toBe(false);
  });
  it('rejects addresses containing spaces', () => {
    expect(isValidEmail('usuario gmail.com')).toBe(false);
  });
  it('rejects a domain that starts with a dot', () => {
    expect(isValidEmail('usuario@.com')).toBe(false);
  });
});
