import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import PaymentInfoForm from '../src/features/store/components/PaymentInfoForm';

describe('PaymentInfoForm', () => {
    const mockFormData = {
        cardNumber: '',
        cardName: '',
        cardExpiry: '',
        cardCVV: ''
    };

    const mockErrors = {};
    const mockOnChange = vi.fn();

    it('debería renderizar el título "Información de Pago"', () => {
        renderWithProviders(
            <PaymentInfoForm
                formData={mockFormData}
                errors={mockErrors}
                onChange={mockOnChange}
            />,
            { withRouter: false }
        );

        expect(screen.getByText('Información de Pago')).toBeInTheDocument();
    });

    it('debería renderizar todos los campos del formulario', () => {
        renderWithProviders(
            <PaymentInfoForm
                formData={mockFormData}
                errors={mockErrors}
                onChange={mockOnChange}
            />,
            { withRouter: false }
        );

        expect(screen.getByLabelText(/Número de Tarjeta \*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Nombre en la Tarjeta \*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Fecha de Vencimiento \*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/CVV \*/i)).toBeInTheDocument();
    });

    it('debería mostrar placeholders en los campos', () => {
        renderWithProviders(
            <PaymentInfoForm
                formData={mockFormData}
                errors={mockErrors}
                onChange={mockOnChange}
            />,
            { withRouter: false }
        );

        expect(screen.getByPlaceholderText('1234 5678 9012 3456')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Como aparece en la tarjeta')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('MM/AA')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('123')).toBeInTheDocument();
    });

    it('debería tener atributos maxLength correctos', () => {
        renderWithProviders(
            <PaymentInfoForm
                formData={mockFormData}
                errors={mockErrors}
                onChange={mockOnChange}
            />,
            { withRouter: false }
        );

        expect(screen.getByLabelText(/Número de Tarjeta \*/i)).toHaveAttribute('maxLength', '19');
        expect(screen.getByLabelText(/Fecha de Vencimiento \*/i)).toHaveAttribute('maxLength', '5');
        expect(screen.getByLabelText(/CVV \*/i)).toHaveAttribute('maxLength', '4');
    });

    it('debería llamar onChange cuando se escribe en los campos', () => {
        renderWithProviders(
            <PaymentInfoForm
                formData={mockFormData}
                errors={mockErrors}
                onChange={mockOnChange}
            />,
            { withRouter: false }
        );

        const cardNumberInput = screen.getByLabelText(/Número de Tarjeta \*/i);
        fireEvent.change(cardNumberInput, { target: { value: '1234567890123456' } });

        expect(mockOnChange).toHaveBeenCalled();
    });

    it('debería mostrar mensajes de error cuando los hay', () => {
        const errorsWithMessages = {
            cardNumber: 'El número de tarjeta debe tener 16 dígitos',
            cardExpiry: 'Formato inválido (MM/AA)'
        };

        renderWithProviders(
            <PaymentInfoForm
                formData={mockFormData}
                errors={errorsWithMessages}
                onChange={mockOnChange}
            />,
            { withRouter: false }
        );

        expect(screen.getByText('El número de tarjeta debe tener 16 dígitos')).toBeInTheDocument();
        expect(screen.getByText('Formato inválido (MM/AA)')).toBeInTheDocument();
    });

    it('debería mostrar los valores del formData en los inputs', () => {
        const filledFormData = {
            cardNumber: '1234567890123456',
            cardName: 'Juan Pérez',
            cardExpiry: '12/25',
            cardCVV: '123'
        };

        renderWithProviders(
            <PaymentInfoForm
                formData={filledFormData}
                errors={mockErrors}
                onChange={mockOnChange}
            />,
            { withRouter: false }
        );

        expect(screen.getByLabelText(/Número de Tarjeta \*/i)).toHaveValue('1234567890123456');
        expect(screen.getByLabelText(/Nombre en la Tarjeta \*/i)).toHaveValue('Juan Pérez');
        expect(screen.getByLabelText(/Fecha de Vencimiento \*/i)).toHaveValue('12/25');
        expect(screen.getByLabelText(/CVV \*/i)).toHaveValue('123');
    });
});
