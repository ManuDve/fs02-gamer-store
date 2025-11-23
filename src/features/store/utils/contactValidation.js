/**
 * Valida que un texto no esté vacío y no exceda 100 caracteres
 * @param {string} string - Texto a validar
 * @returns {boolean} - True si es válido, false si no
 */
export function isValidInput(string) {
  const trimmedText = string.trim();
  if (trimmedText.length > 0 && string.length <= 100) {
    return true;
  }
  return false;
}

/**
 * Valida que el email sea válido y esté en los dominios permitidos
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido, false si no
 */
export function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
  if (email.trim().length > 100) {
    return false;
  }
  return regex.test(email);
}

/**
 * Valida que el mensaje no esté vacío y no exceda 500 caracteres
 * @param {string} string - Mensaje a validar
 * @returns {boolean} - True si es válido, false si no
 */
export function isValidContactMessage(string) {
  const trimmedText = string.trim();
  if (trimmedText.length > 0 && string.length <= 500) {
    return true;
  }
  return false;
}

/**
 * Valida todo el formulario de contacto
 * @param {string} name - Nombre del usuario
 * @param {string} email - Email del usuario
 * @param {string} message - Mensaje del usuario
 * @returns {Object} - Objeto con los errores encontrados
 */
export function validateContactForm(name, email, message) {
  const errors = {
    name: null,
    email: null,
    message: null,
  };

  if (!isValidInput(name)) {
    errors.name = "El nombre no puede estar vacío.";
  }

  if (!isValidEmail(email)) {
    errors.email = "El email debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.";
  }

  if (!isValidContactMessage(message)) {
    errors.message = "El mensaje es requerido y debe ser máximo de 500 caracteres.";
  }

  return errors;
}

/**
 * Verifica si hay errores en el objeto de errores
 * @param {Object} errors - Objeto con los errores
 * @returns {boolean} - True si hay errores, false si no
 */
export function hasErrors(errors) {
  return Object.values(errors).some((error) => error !== null);
}
