import { describe, it, expect } from 'vitest';
import { formatPrice } from '../src/features/admin/utils/formatPrice';

describe('formatPrice utility', () => {
    it('debería formatear precio simple correctamente', () => {
        expect(formatPrice(1000)).toBe('$1.000');
    });

    it('debería formatear precio con decimales', () => {
        // CLP redondea los centavos
        expect(formatPrice(1500.50)).toBe('$1.501');
    });

    it('debería formatear precio muy grande', () => {
        expect(formatPrice(1000000)).toBe('$1.000.000');
    });

    it('debería manejar cero', () => {
        expect(formatPrice(0)).toBe('$0');
    });

    it('debería manejar números negativos', () => {
        expect(formatPrice(-100)).toBe('$-100');
    });

    it('debería formatear decimales precisos', () => {
        // CLP redondea automáticamente
        expect(formatPrice(99.99)).toBe('$100');
    });

    it('debería manejar string numérico', () => {
        expect(formatPrice('500')).toBe('$500');
    });

    it('debería manejar números muy pequeños', () => {
        // CLP no muestra centavos, redondea a 0
        expect(formatPrice(0.01)).toBe('$0');
    });

    it('debería formatear precio de producto típico', () => {
        // CLP redondea a entero más cercano
        expect(formatPrice(35.99)).toBe('$36');
    });

    it('debería formatear precio con muchos dígitos', () => {
        // CLP usa punto como separador de miles y redondea decimales
        expect(formatPrice(123456.78)).toBe('$123.457');
    });
});
