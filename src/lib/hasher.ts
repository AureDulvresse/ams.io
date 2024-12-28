import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12; // Nombre de tours pour le sel bcrypt

/**
 * Hache un mot de passe en utilisant bcrypt.
 * @param {string} password - Le mot de passe en clair.
 * @returns {Promise<string>} Le mot de passe haché.
 */
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Vérifie si un mot de passe correspond à son hachage.
 * @param {string} plaintextPassword - Le mot de passe en clair.
 * @param {string} hashedPassword - Le mot de passe haché.
 * @returns {Promise<boolean>} Résultat de la comparaison.
 */
export const validatePassword = async (
  plaintextPassword: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(plaintextPassword, hashedPassword);
};
