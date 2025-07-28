import { isValidEmail } from '..'

describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('test.test2@example.com')).toBe(true);
        expect(isValidEmail('12345@domain.org')).toBe(true);
        expect(isValidEmail('very.long.email.address@sub.domain.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
        expect(isValidEmail('test@example')).toBe(false);
        expect(isValidEmail('test.y@example')).toBe(false);
        expect(isValidEmail('test@.com')).toBe(false);
        expect(isValidEmail('test.example.com')).toBe(false);
    });

    it('should handle empty strings and null/undefined inputs', () => {
        expect(isValidEmail('')).toBe(false);
        expect(isValidEmail(null)).toBe(false);
        expect(isValidEmail(undefined)).toBe(false);
    });
});
