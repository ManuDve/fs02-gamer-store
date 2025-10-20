import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from './test-utils';
import ContactForm from '../src/features/store/components/ContactForm';
import userEvent from '@testing-library/user-event';

describe('ContactForm Component', () => {
  it('renderiza el formulario de contacto', () => {
    renderWithProviders(<ContactForm />, { withCart: true });

    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
  });

  it('valida que el nombre no esté vacío', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />, { withCart: true });

    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/mensaje/i);
    const submitButton = screen.getByRole('button', { name: /enviar/i });

    await user.type(emailInput, 'usuario@duoc.cl');
    await user.type(messageInput, 'Mensaje de prueba');
    await user.click(submitButton);

    expect(screen.getByText(/el nombre no puede estar vacío/i)).toBeInTheDocument();
  });

  it('valida que el email sea válido', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />, { withCart: true });

    const nameInput = screen.getByLabelText(/nombre/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/mensaje/i);
    const submitButton = screen.getByRole('button', { name: /enviar/i });

    await user.type(nameInput, 'Juan Pérez');
    await user.type(emailInput, 'usuario@hotmail.com');
    await user.type(messageInput, 'Mensaje de prueba');
    await user.click(submitButton);

    expect(screen.getByText(/el email debe ser @duoc\.cl, @profesor\.duoc\.cl o @gmail\.com/i)).toBeInTheDocument();
  });

  it('valida que el mensaje no esté vacío', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />, { withCart: true });

    const nameInput = screen.getByLabelText(/nombre/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /enviar/i });

    await user.type(nameInput, 'Juan Pérez');
    await user.type(emailInput, 'usuario@duoc.cl');
    await user.click(submitButton);

    expect(screen.getByText(/el mensaje es requerido/i)).toBeInTheDocument();
  });

  it('permite enviar el formulario con datos válidos', async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, 'log');
    
    renderWithProviders(<ContactForm />, { withCart: true });

    const nameInput = screen.getByLabelText(/nombre/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/mensaje/i);
    const submitButton = screen.getByRole('button', { name: /enviar/i });

    await user.type(nameInput, 'Juan Pérez');
    await user.type(emailInput, 'usuario@duoc.cl');
    await user.type(messageInput, 'Este es un mensaje de prueba');
    await user.click(submitButton);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Formulario válido:',
      expect.objectContaining({
        name: 'Juan Pérez',
        email: 'usuario@duoc.cl',
        message: 'Este es un mensaje de prueba',
      })
    );

    consoleSpy.mockRestore();
  });

  it('limpia el formulario después de enviarlo', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />, { withCart: true });

    const nameInput = screen.getByLabelText(/nombre/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/mensaje/i);
    const submitButton = screen.getByRole('button', { name: /enviar/i });

    await user.type(nameInput, 'Juan Pérez');
    await user.type(emailInput, 'usuario@duoc.cl');
    await user.type(messageInput, 'Este es un mensaje de prueba');
    await user.click(submitButton);

    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(messageInput.value).toBe('');
  });

  it('muestra múltiples errores a la vez', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />, { withCart: true });

    const submitButton = screen.getByRole('button', { name: /enviar/i });
    await user.click(submitButton);

    expect(screen.getByText(/el nombre no puede estar vacío/i)).toBeInTheDocument();
    expect(screen.getByText(/el email debe ser @duoc\.cl, @profesor\.duoc\.cl o @gmail\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/el mensaje es requerido/i)).toBeInTheDocument();
  });

  it('valida que el mensaje no exceda 500 caracteres', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />, { withCart: true });

    const nameInput = screen.getByLabelText(/nombre/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/mensaje/i);
    const submitButton = screen.getByRole('button', { name: /enviar/i });

    const longMessage = 'a'.repeat(501);

    await user.type(nameInput, 'Juan Pérez');
    await user.type(emailInput, 'usuario@duoc.cl');
    await user.type(messageInput, longMessage);
    await user.click(submitButton);

    expect(screen.getByText(/el mensaje es requerido/i)).toBeInTheDocument();
  });

  it('renderiza los campos con las propiedades correctas', () => {
    renderWithProviders(<ContactForm />, { withCart: true });

    const nameInput = screen.getByLabelText(/nombre/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/mensaje/i);

    expect(nameInput).toHaveAttribute('type', 'text');
    expect(nameInput).toHaveAttribute('id', 'contact-name-input');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('id', 'contact-email-input');
    expect(messageInput).toHaveAttribute('id', 'contact-msg-input');
  });
});
