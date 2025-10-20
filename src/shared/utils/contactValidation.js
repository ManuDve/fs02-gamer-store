/**
 * Valida que una entrada de texto no esté vacía y tenga máximo 100 caracteres
 * @param {string} string - La cadena a validar
 * @returns {boolean} - true si es válida, false en caso contrario
 */
export function isValidInput(string) {
  const trimmedText = string.trim();
  if (trimmedText.length > 0 && string.length <= 100) {
    return true;
  }
  return false;
}

/**
 * Valida que un email sea válido y pertenezca a dominios autorizados
 * @param {string} email - El email a validar
 * @returns {boolean} - true si es válido, false en caso contrario
 */
export function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
  const trimmedEmail = email.trim();
  if (trimmedEmail.length > 100) {
    return false;
  }
  return regex.test(trimmedEmail);
}

/**
 * Valida que un mensaje de contacto sea válido (no vacío y máximo 500 caracteres)
 * @param {string} string - El mensaje a validar
 * @returns {boolean} - true si es válido, false en caso contrario
 */
export function isValidContactMessage(string) {
  const trimmedText = string.trim();
  if (trimmedText.length > 0 && string.length <= 500) {
    return true;
  }
  return false;
}

/**
 * Crea un elemento de error y lo añade al contenedor
 * @param {string} errorMsg - El mensaje de error a mostrar
 * @param {HTMLElement} errorContainer - El contenedor donde añadir el error
 */
export function appendMsgError(errorMsg, errorContainer) {
  const msgError = document.createElement("p");
  msgError.textContent = errorMsg;
  msgError.classList.add("text-danger");
  errorContainer.append(msgError);
}
