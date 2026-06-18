import bcrypt from "bcryptjs";

/**
 * Hashes a plaintext password using a generated salt.
 * @param password The plaintext password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compares a plaintext password against a hashed password.
 * @param password The plaintext password to check.
 * @param hash The hashed password stored in the database.
 * @returns A promise that resolves to true if passwords match, false otherwise.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
