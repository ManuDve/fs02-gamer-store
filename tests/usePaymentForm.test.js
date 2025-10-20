import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePaymentForm } from '../src/features/store/hooks/usePaymentForm';

describe('usePaymentForm', () => {
    it('debería inicializar con valores vacíos', () => {
        const { result } = renderHook(() => usePaymentForm());

        expect(result.current.formData).toEqual({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            cardNumber: '',
            cardName: '',
            cardExpiry: '',
            cardCVV: ''
        });
        expect(result.current.errors).toEqual({});
    });

    it('debería actualizar el formData cuando se llama handleChange', () => {
        const { result } = renderHook(() => usePaymentForm());

        act(() => {
            result.current.handleChange({
                target: { name: 'firstName', value: 'Juan' }
            });
        });

        expect(result.current.formData.firstName).toBe('Juan');
    });

    it('debería limpiar errores cuando se escribe en un campo con error', () => {
        const { result } = renderHook(() => usePaymentForm());

        // Primero validar para generar errores
        act(() => {
            result.current.validateForm();
        });

        expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);

        // Luego escribir en un campo con error
        act(() => {
            result.current.handleChange({
                target: { name: 'firstName', value: 'Juan' }
            });
        });

        expect(result.current.errors.firstName).toBe('');
    });

    it('debería validar campos requeridos', () => {
        const { result } = renderHook(() => usePaymentForm());

        let isValid;
        act(() => {
            isValid = result.current.validateForm();
        });

        expect(isValid).toBe(false);
        expect(result.current.errors.firstName).toBe('El nombre es requerido');
        expect(result.current.errors.lastName).toBe('El apellido es requerido');
        expect(result.current.errors.email).toBe('El correo es requerido');
        expect(result.current.errors.phone).toBe('El teléfono es requerido');
    });

    it('debería validar formato de email', () => {
        const { result } = renderHook(() => usePaymentForm());

        act(() => {
            result.current.handleChange({
                target: { name: 'email', value: 'email-invalido' }
            });
        });

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.errors.email).toBe('El correo no es válido');
    });

    it('debería aceptar email válido', () => {
        const { result } = renderHook(() => usePaymentForm());

        act(() => {
            result.current.handleChange({
                target: { name: 'email', value: 'usuario@example.com' }
            });
        });

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.errors.email).toBeUndefined();
    });

    it('debería validar número de tarjeta de 16 dígitos', () => {
        const { result } = renderHook(() => usePaymentForm());

        act(() => {
            result.current.handleChange({
                target: { name: 'cardNumber', value: '123' }
            });
        });

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.errors.cardNumber).toBe('El número de tarjeta debe tener 16 dígitos');
    });

    it('debería aceptar número de tarjeta válido', () => {
        const { result } = renderHook(() => usePaymentForm());

        act(() => {
            result.current.handleChange({
                target: { name: 'cardNumber', value: '1234567890123456' }
            });
        });

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.errors.cardNumber).toBeUndefined();
    });

    it('debería validar formato de fecha de vencimiento', () => {
        const { result } = renderHook(() => usePaymentForm());

        act(() => {
            result.current.handleChange({
                target: { name: 'cardExpiry', value: 'invalido' }
            });
        });

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.errors.cardExpiry).toBe('Formato inválido (MM/AA)');
    });

    it('debería aceptar fecha de vencimiento válida', () => {
        const { result } = renderHook(() => usePaymentForm());

        act(() => {
            result.current.handleChange({
                target: { name: 'cardExpiry', value: '12/25' }
            });
        });

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.errors.cardExpiry).toBeUndefined();
    });

    it('debería validar CVV de 3 o 4 dígitos', () => {
        const { result } = renderHook(() => usePaymentForm());

        act(() => {
            result.current.handleChange({
                target: { name: 'cardCVV', value: '12' }
            });
        });

        act(() => {
            result.current.validateForm();
        });

        expect(result.current.errors.cardCVV).toBe('El CVV debe tener 3 o 4 dígitos');
    });

    it('debería retornar true cuando el formulario es válido', () => {
        const { result } = renderHook(() => usePaymentForm());

        // Llenar todos los campos correctamente
        act(() => {
            result.current.handleChange({ target: { name: 'firstName', value: 'Juan' } });
            result.current.handleChange({ target: { name: 'lastName', value: 'Pérez' } });
            result.current.handleChange({ target: { name: 'email', value: 'juan@example.com' } });
            result.current.handleChange({ target: { name: 'phone', value: '123456789' } });
            result.current.handleChange({ target: { name: 'address', value: 'Calle 123' } });
            result.current.handleChange({ target: { name: 'city', value: 'Santiago' } });
            result.current.handleChange({ target: { name: 'state', value: 'RM' } });
            result.current.handleChange({ target: { name: 'zipCode', value: '12345' } });
            result.current.handleChange({ target: { name: 'cardNumber', value: '1234567890123456' } });
            result.current.handleChange({ target: { name: 'cardName', value: 'Juan Pérez' } });
            result.current.handleChange({ target: { name: 'cardExpiry', value: '12/25' } });
            result.current.handleChange({ target: { name: 'cardCVV', value: '123' } });
        });

        let isValid;
        act(() => {
            isValid = result.current.validateForm();
        });

        expect(isValid).toBe(true);
        expect(Object.keys(result.current.errors).length).toBe(0);
    });
});
