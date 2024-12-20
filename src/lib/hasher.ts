const bcrypt = require("bcrypt");

/**
 * Salts and hashes a password securely.
 * @param password - The plaintext password to be hashed.
 * @returns A promise that resolves to the hashed password.
 */
export async function saltAndHashPassword(password: string): Promise<string> {
  if (!password) {
    throw new Error("Password cannot be empty");
  }

  const saltRounds = 10; // Recommended number of salt rounds
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error : any) {
    throw new Error(`Error salting and hashing password: ${error.message}`);
  }
}

/**
 * Compares a plaintext password with a hashed password.
 * @param password - The plaintext password to verify.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise that resolves to true if the passwords match, otherwise false.
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error: any) {
    throw new Error(`Error verifying password: ${error.message}`);
  }
}
