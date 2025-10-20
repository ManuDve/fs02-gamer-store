import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import PersonalInfoForm from '../src/features/store/components/PersonalInfoForm';

describe('PersonalInfoForm', () => {
    const mockFormData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    };

    const mockErrors = {};
    const mockOnChange = vi.fn();

    it('debería renderizar el título "Información Personal"', () => {
        renderWithProviders(
            <PersonalInfoForm
                formData={mockFormData}
                errors={mockErrors}
                onChange={mockOnChange}
            />,
            { withRouter: false }
        );

        expect(screen.getByText('Información Personal')).toBeInTheDocument();
    });

    it('debería renderizar todos los campos del formulario', () => {
        renderWithProviders(
            <PersonalInfoForm
                formData={mockFormData}
                errors={mockErrors}
                onChange={mockOnChange}
            />,
            { withRouter: false }
        );

        expect(screen.getByLabelText(/Nombre \*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Apellido \*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Correo Electrónico \*/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Teléfono \*/i)).toBeInTheDocument();
    });

    it('debería llamar onChange cuando se escribe en los campos', () => {
        renderWithProviders(
            <PersonalInfoForm
                formData={mockFormData}
                errors={mockErrors}
                onChange={mockOnChange}
            />,
            { withRouter: false }
        );

        const firstNameInput = screen.getByLabelText(/Nombre \*/i);
        fireEvent.change(firstNameInput, { target: { value: 'Juan' } });

        expect(mockOnChange).toHaveBeenCalled();
    });

    it('debería mostrar mensajes de error cuando los hay', () => {
        const errorsWithMessages = {
            firstName: 'El nombre es requerido',
            email: 'El correo no es válido'
        };

        renderWithProviders(
            <PersonalInfoForm
                formData={mockFormData}
                errors={errorsWithMessages}
                onChange={mockOnChange}
            />,
            { withRouter: false }
        );

        expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
        expect(screen.getByText('El correo no es válido')).toBeInTheDocument();
    });

    it('debería aplicar clase "is-invalid" a campos con errores', () => {
        const errorsWithMessages = {
            firstName: 'El nombre es requerido'
        };

        renderWithProviders(
            <PersonalInfoForm
                formData={mockFormData}
                errors={errorsWithMessages}
                onChange={mockOnChange}
            />,
            { withRouter: false }
        );

        const firstNameInput = screen.getByLabelText(/Nombre \*/i);
        expect(firstNameInput).toHaveClass('is-invalid');
    });

    it('debería mostrar los valores del formData en los inputs', () => {
        const filledFormData = {
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan@example.com',
            phone: '123456789'
        };

        renderWithProviders(
            <PersonalInfoForm
                formData={filledFormData}
                errors={mockErrors}
                onChange={mockOnChange}
            />,
            { withRouter: false }
        );

        expect(screen.getByLabelText(/Nombre \*/i)).toHaveValue('Juan');
        expect(screen.getByLabelText(/Apellido \*/i)).toHaveValue('Pérez');
        expect(screen.getByLabelText(/Correo Electrónico \*/i)).toHaveValue('juan@example.com');
        expect(screen.getByLabelText(/Teléfono \*/i)).toHaveValue('123456789');
    });
});
