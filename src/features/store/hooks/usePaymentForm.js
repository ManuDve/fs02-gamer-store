import { useState } from 'react';

export const usePaymentForm = () => {
    const [formData, setFormData] = useState({
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

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validación de campos personales
        if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es requerido';
        if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido';
        if (!formData.email.trim()) {
            newErrors.email = 'El correo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El correo no es válido';
        }
        if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';

        // Validación de dirección
        if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
        if (!formData.city.trim()) newErrors.city = 'La ciudad es requerida';
        if (!formData.state.trim()) newErrors.state = 'La región es requerida';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'El código postal es requerido';

        // Validación de tarjeta
        if (!formData.cardNumber.trim()) {
            newErrors.cardNumber = 'El número de tarjeta es requerido';
        } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
            newErrors.cardNumber = 'El número de tarjeta debe tener 16 dígitos';
        }
        if (!formData.cardName.trim()) newErrors.cardName = 'El nombre en la tarjeta es requerido';
        if (!formData.cardExpiry.trim()) {
            newErrors.cardExpiry = 'La fecha de vencimiento es requerida';
        } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
            newErrors.cardExpiry = 'Formato inválido (MM/AA)';
        }
        if (!formData.cardCVV.trim()) {
            newErrors.cardCVV = 'El CVV es requerido';
        } else if (!/^\d{3,4}$/.test(formData.cardCVV)) {
            newErrors.cardCVV = 'El CVV debe tener 3 o 4 dígitos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return {
        formData,
        errors,
        handleChange,
        validateForm
    };
};
