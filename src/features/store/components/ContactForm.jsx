import { useState, useRef } from 'react';
import {
  isValidInput,
  isValidEmail,
  isValidContactMessage,
} from '../../../shared/utils/contactValidation';

export default function ContactForm() {
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });

  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const messageInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {
      name: '',
      email: '',
      message: '',
    };

    let formIsValid = true;

    // Validación de nombre
    const nameValue = nameInputRef.current.value;
    if (!isValidInput(nameValue)) {
      newErrors.name = 'El nombre no puede estar vacío.';
      formIsValid = false;
    }

    // Validación de email
    const emailValue = emailInputRef.current.value;
    if (!isValidEmail(emailValue)) {
      newErrors.email = 'El email debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.';
      formIsValid = false;
    }

    // Validación de mensaje
    const messageValue = messageInputRef.current.value;
    if (!isValidContactMessage(messageValue)) {
      newErrors.message = 'El mensaje es requerido y debe ser máximo de 500 caracteres.';
      formIsValid = false;
    }

    setErrors(newErrors);

    if (formIsValid) {
      // TODO: Aquí enviar el formulario a un servidor
      console.log('Formulario válido:', {
        name: nameValue,
        email: emailValue,
        message: messageValue,
      });
      
      // Limpiar formulario
      nameInputRef.current.value = '';
      emailInputRef.current.value = '';
      messageInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="contact-name-input" className="form-label">
          Nombre
        </label>
        <input
          type="text"
          className="form-control"
          id="contact-name-input"
          placeholder=""
          ref={nameInputRef}
        />
        {errors.name && <div className="text-danger mt-2">{errors.name}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="contact-email-input" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control"
          id="contact-email-input"
          placeholder="ejemplo@gmail.com"
          ref={emailInputRef}
        />
        {errors.email && <div className="text-danger mt-2">{errors.email}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="contact-msg-input" className="form-label">
          Mensaje
        </label>
        <textarea
          className="form-control"
          id="contact-msg-input"
          rows="3"
          ref={messageInputRef}
        ></textarea>
        {errors.message && <div className="text-danger mt-2">{errors.message}</div>}
      </div>

      <div className="mb-3">
        <button type="submit" className="btn btn-primary mb-3">
          Enviar
        </button>
      </div>
    </form>
  );
}
