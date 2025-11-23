import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import OrderSummary from '../src/features/store/components/OrderSummary';

describe('OrderSummary', () => {
    const mockItems = [
        { id: 1, name: 'Producto 1', price: 100, quantity: 2, img: 'img1.jpg' },
        { id: 2, name: 'Producto 2', price: 50, quantity: 1, img: 'img2.jpg' }
    ];

    const mockTotal = '250.00';

    it('debería renderizar el título "Resumen de Compra"', () => {
        renderWithProviders(
            <OrderSummary items={mockItems} total={mockTotal} />,
            { withRouter: false }
        );

        expect(screen.getByText('Resumen de Compra')).toBeInTheDocument();
    });

    it('debería renderizar todos los productos con sus cantidades', () => {
        renderWithProviders(
            <OrderSummary items={mockItems} total={mockTotal} />,
            { withRouter: false }
        );

        expect(screen.getByText(/Producto 1 x 2/)).toBeInTheDocument();
        expect(screen.getByText(/Producto 2 x 1/)).toBeInTheDocument();
    });

    it('debería mostrar el precio total de cada producto', () => {
        renderWithProviders(
            <OrderSummary items={mockItems} total={mockTotal} />,
            { withRouter: false }
        );

        // Producto 1: 100 * 2 = 200 -> $200 (CLP)
        expect(screen.getByText('$200')).toBeInTheDocument();
        // Producto 2: 50 * 1 = 50 -> $50 (CLP)
        expect(screen.getByText('$50')).toBeInTheDocument();
    });

    it('debería mostrar el subtotal correcto', () => {
        renderWithProviders(
            <OrderSummary items={mockItems} total={mockTotal} />,
            { withRouter: false }
        );

        expect(screen.getByText('Subtotal:')).toBeInTheDocument();
        // Usar getAllByText porque el total aparece múltiples veces
        const totals = screen.getAllByText('$250');
        expect(totals.length).toBeGreaterThan(0);
    });

    it('debería mostrar que el envío es gratis', () => {
        renderWithProviders(
            <OrderSummary items={mockItems} total={mockTotal} />,
            { withRouter: false }
        );

        expect(screen.getByText('Envío:')).toBeInTheDocument();
        expect(screen.getByText('Gratis')).toBeInTheDocument();
    });

    it('debería mostrar el total final', () => {
        renderWithProviders(
            <OrderSummary items={mockItems} total={mockTotal} />,
            { withRouter: false }
        );

        const totalHeaders = screen.getAllByText('Total:');
        expect(totalHeaders.length).toBeGreaterThan(0);
    });

    it('debería mostrar el badge de "Compra Segura"', () => {
        renderWithProviders(
            <OrderSummary items={mockItems} total={mockTotal} />,
            { withRouter: false }
        );

        expect(screen.getByText('Compra Segura')).toBeInTheDocument();
        expect(screen.getByText(/Tus datos están protegidos con encriptación SSL/i)).toBeInTheDocument();
    });

    it('debería renderizar correctamente con un solo producto', () => {
        const singleItem = [{ id: 1, name: 'Único Producto', price: 99.99, quantity: 1, img: 'img.jpg' }];

        renderWithProviders(
            <OrderSummary items={singleItem} total="99.99" />,
            { withRouter: false }
        );

        expect(screen.getByText(/Único Producto x 1/)).toBeInTheDocument();
        // Usar getAllByText porque el precio aparece múltiples veces
        const prices = screen.getAllByText('$99,99');
        expect(prices.length).toBeGreaterThan(0);
    });

    it('debería manejar correctamente items sin imagen', () => {
        const itemsWithoutImg = [
            { id: 1, name: 'Producto sin img', price: 100, quantity: 1 }
        ];

        renderWithProviders(
            <OrderSummary items={itemsWithoutImg} total="100.00" />,
            { withRouter: false }
        );

        expect(screen.getByText(/Producto sin img x 1/)).toBeInTheDocument();
    });
});
