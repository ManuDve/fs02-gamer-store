// Contacto

const contactNameInput = document.getElementById("contact-name-input");
const contactEmailInput = document.getElementById("contact-email-input");
const contactMsgInput = document.getElementById("contact-msg-input");
const contactBtnSendForm = document.getElementById("btn-contact-send");
const contactNameError = document.getElementById("name-contact-error");
const contactEmailError = document.getElementById("email-contact-error");
const contactMsgError = document.getElementById("msg-contact-error");

// Funciones Contacto

function isValidInput(string) {
  const trimmedText = string.trim();
  if (trimmedText.length > 0 && string.length <= 100) {
    return true;
  }
  return false;
}

function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
  if (email.trim().length > 100) {
    return false;
  }
  return regex.test(email);
}

function appendMsgError(errorMsg, errorContainer) {
  const msgError = document.createElement("p");
  msgError.textContent = errorMsg;
  msgError.classList.add("text-danger");
  errorContainer.append(msgError);
}

function isValidContactMessage(string) {
  const trimmedText = string.trim();
  if (trimmedText.length > 0 && string.length <= 500) {
    return true;
  }
  return false;
}

// Contact Event Listener

contactBtnSendForm.addEventListener("click", () => {
  formIsValid = true;
  // Remover mensajes anteriores
  contactNameError.replaceChildren();
  contactEmailError.replaceChildren();
  contactMsgError.replaceChildren();
  // Validacion de Nombre
  const inputText = contactNameInput.value;
  if (!isValidInput(inputText)) {
    appendMsgError("El nombre no puede estar vacío.", contactNameError);
    formIsValid = false;
  }
  // Validacion de Email
  const inputEmail = contactEmailInput.value;
  if (!isValidEmail(inputEmail)) {
    appendMsgError(
      "El email debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.",
      contactEmailError
    );
    formIsValid = false;
  }
  // Validacion de Mensaje
  const inputMessage = contactMsgInput.value;
  if (!isValidContactMessage(inputMessage)) {
    appendMsgError(
      "El mensaje es requerido y debe ser máximo de 500 caracteres.",
      contactMsgError
    );
    formIsValid = false;
  }

  console.log("Validez del form:", formIsValid);
});

// Mocks de datos

//const hundrerCharEmail =
//  "r8KzV1jPqM7yLd9nXc4wT2bGhJfQ5sZpRm6vNtBkY3uAoE8iHlCgD0xUvWaOeIrSyFXc4wT2bGhJfQ5sZpRm6vNtiHlC@duoc.cl";
//const fiveHundredCharMsg =
//  "r8KzV1jPqM7yLd9nXc4wT2bGhJfQ5sZpRm6vNtBkY3uAoE8iHlCgD0xUvWaOeIrSyFXc4wT2bGhJfQ5sZpRm6vNtiHlC@duoc.clr8KzV1jPqM7yLd9nXc4wT2bGhJfQ5sZpRm6vNtBkY3uAoE8iHlCgD0xUvWaOeIrSyFXc4wT2bGhJfQ5sZpRm6vNtiHlC@duoc.clr8KzV1jPqM7yLd9nXc4wT2bGhJfQ5sZpRm6vNtBkY3uAoE8iHlCgD0xUvWaOeIrSyFXc4wT2bGhJfQ5sZpRm6vNtiHlC@duoc.cl";
// console.log(fiveHundredCharMsg.length);