import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12; // Nombre de tours pour le sel bcrypt

/**
 * Valide la complexité d'un mot de passe.
 * @param {string} password - Le mot de passe à valider.
 * @throws {Error} Si le mot de passe ne respecte pas les règles de validation.
 */
export const validatePasswordStrength = (password: string) => {
  const minLength = 8;
  const maxLength = 128;
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (password.length < minLength || password.length > maxLength) {
    throw new Error(
      "Le mot de passe doit comporter entre 8 et 128 caractères."
    );
  }

  if (!regex.test(password)) {
    throw new Error(
      "Le mot de passe doit inclure une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial."
    );
  }

  return true;
};

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
