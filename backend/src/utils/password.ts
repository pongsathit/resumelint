import bcrypt from 'bcrypt';

// Use 12 salt rounds for strong security (recommended for production)
// This provides a good balance between security and performance
const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password using bcrypt
 * @param plainTextPassword - The plain-text password to hash
 * @returns Promise<string> - The hashed password
 */
export const hashPassword = async (plainTextPassword: string): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(plainTextPassword, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    throw new Error('Failed to hash password');
  }
};

/**
 * Verify a plain-text password against a hashed password
 * @param plainTextPassword - The plain-text password to verify
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise<boolean> - True if passwords match, false otherwise
 */
export const verifyPassword = async (
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    // If verification fails due to invalid hash format or other errors,
    // return false rather than throwing to prevent information leakage
    return false;
  }
};
