import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import ShippingAddressForm from '../src/features/store/components/ShippingAddressForm';

describe('ShippingAddressForm', () => {
    const mockFormData = {
        address: '',
        city: '',
        state: '',
        zipCode: ''
    };

    const mockErrors = {};
    const mockOnChange = vi.fn();

    it('debería renderizar el título "Dirección de Entrega"', () => {
        renderWithProviders(
            <ShippingAddressForm
                formData={mockFormData}
                errors={mockErrors}
                onChange={mockOnChange}
            />,
            { withRouter: false }
        );

        expect(screen.getByText('Dirección de Entrega')).toBeInTheDocument();
    });

    it('debería renderizar todos los campos del formulario', () => {
        renderWithProviders(
            <ShippingAddressForm
                formData={mockFormData}
                errors={mockErrors}
                onChange={mockOnChange}
            />,
            { withRouter: false }
        );

        expect(screen.getByLabelText(/Dirección \*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Ciudad \*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Región \*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Código Postal \*/i)).toBeInTheDocument();
    });

    it('debería mostrar placeholder en el campo dirección', () => {
        renderWithProviders(
            <ShippingAddressForm
                formData={mockFormData}
                errors={mockErrors}
                onChange={mockOnChange}
            />,
            { withRouter: false }
        );

        const addressInput = screen.getByLabelText(/Dirección \*/i);
        expect(addressInput).toHaveAttribute('placeholder', 'Calle, número, depto, etc.');
    });

    it('debería llamar onChange cuando se escribe en los campos', () => {
        renderWithProviders(
            <ShippingAddressForm
                formData={mockFormData}
                errors={mockErrors}
                onChange={mockOnChange}
            />,
            { withRouter: false }
        );

        const addressInput = screen.getByLabelText(/Dirección \*/i);
        fireEvent.change(addressInput, { target: { value: 'Calle Principal 123' } });

        expect(mockOnChange).toHaveBeenCalled();
    });

    it('debería mostrar mensajes de error cuando los hay', () => {
        const errorsWithMessages = {
            address: 'La dirección es requerida',
            city: 'La ciudad es requerida'
        };

        renderWithProviders(
            <ShippingAddressForm
                formData={mockFormData}
                errors={errorsWithMessages}
                onChange={mockOnChange}
            />,
            { withRouter: false }
        );

        expect(screen.getByText('La dirección es requerida')).toBeInTheDocument();
        expect(screen.getByText('La ciudad es requerida')).toBeInTheDocument();
    });

    it('debería mostrar los valores del formData en los inputs', () => {
        const filledFormData = {
            address: 'Calle Principal 123',
            city: 'Santiago',
            state: 'RM',
            zipCode: '12345'
        };

        renderWithProviders(
            <ShippingAddressForm
                formData={filledFormData}
                errors={mockErrors}
                onChange={mockOnChange}
            />,
            { withRouter: false }
        );

        expect(screen.getByLabelText(/Dirección \*/i)).toHaveValue('Calle Principal 123');
        expect(screen.getByLabelText(/Ciudad \*/i)).toHaveValue('Santiago');
        expect(screen.getByLabelText(/Región \*/i)).toHaveValue('RM');
        expect(screen.getByLabelText(/Código Postal \*/i)).toHaveValue('12345');
    });
});
