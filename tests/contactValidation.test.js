import { describe, it, expect } from 'vitest';
import {
  isValidInput,
  isValidEmail,
  isValidContactMessage,
} from '../src/shared/utils/contactValidation';

describe('Contact Validation Functions', () => {
  describe('isValidInput', () => {
    it('debería retornar true para un input válido', () => {
      expect(isValidInput('Juan Pérez')).toBe(true);
    });

    it('debería retornar false para un input vacío', () => {
      expect(isValidInput('')).toBe(false);
    });

    it('debería retornar false para un input solo con espacios', () => {
      expect(isValidInput('   ')).toBe(false);
    });

    it('debería retornar false para un input mayor a 100 caracteres', () => {
      const longString = 'a'.repeat(101);
      expect(isValidInput(longString)).toBe(false);
    });

    it('debería retornar true para un input de exactamente 100 caracteres', () => {
      const exactString = 'a'.repeat(100);
      expect(isValidInput(exactString)).toBe(true);
    });

    it('debería trim el input antes de validar', () => {
      expect(isValidInput('  nombre  ')).toBe(true);
    });
  });

  describe('isValidEmail', () => {
    it('debería retornar true para un email válido @duoc.cl', () => {
      expect(isValidEmail('estudiante@duoc.cl')).toBe(true);
    });

    it('debería retornar true para un email válido @profesor.duoc.cl', () => {
      expect(isValidEmail('profesor@profesor.duoc.cl')).toBe(true);
    });

    it('debería retornar true para un email válido @gmail.com', () => {
      expect(isValidEmail('usuario@gmail.com')).toBe(true);
    });

    it('debería retornar false para un email con dominio no permitido', () => {
      expect(isValidEmail('usuario@hotmail.com')).toBe(false);
    });

    it('debería retornar false para un email sin dominio', () => {
      expect(isValidEmail('usuariosin@')).toBe(false);
    });

    it('debería retornar false para un email vacío', () => {
      expect(isValidEmail('')).toBe(false);
    });

    it('debería retornar false para un email mayor a 100 caracteres', () => {
      const longEmail = 'a'.repeat(95) + '@duoc.cl'; // 95 + 8 = 103 caracteres
      expect(isValidEmail(longEmail)).toBe(false);
    });

    it('debería trim el email antes de validar', () => {
      expect(isValidEmail('  usuario@duoc.cl  ')).toBe(true);
    });

    it('debería retornar false para un email con formato inválido', () => {
      expect(isValidEmail('usuario duoc.cl')).toBe(false);
    });
  });

  describe('isValidContactMessage', () => {
    it('debería retornar true para un mensaje válido', () => {
      expect(
        isValidContactMessage('Quisiera conocer más sobre sus productos')
      ).toBe(true);
    });

    it('debería retornar false para un mensaje vacío', () => {
      expect(isValidContactMessage('')).toBe(false);
    });

    it('debería retornar false para un mensaje solo con espacios', () => {
      expect(isValidContactMessage('   ')).toBe(false);
    });

    it('debería retornar false para un mensaje mayor a 500 caracteres', () => {
      const longMessage = 'a'.repeat(501);
      expect(isValidContactMessage(longMessage)).toBe(false);
    });

    it('debería retornar true para un mensaje de exactamente 500 caracteres', () => {
      const exactMessage = 'a'.repeat(500);
      expect(isValidContactMessage(exactMessage)).toBe(true);
    });

    it('debería trim el mensaje antes de validar', () => {
      expect(isValidContactMessage('  mensaje  ')).toBe(true);
    });
  });
});
