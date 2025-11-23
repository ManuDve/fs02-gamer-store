import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartDispatch, clearCart } from '../../../app/context/CartContext';

export const usePaymentProcessing = (items, total, formData) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();
    const dispatch = useCartDispatch();

    const processPayment = () => {
        setIsProcessing(true);

        // Simular procesamiento de pago
        setTimeout(() => {
            // Simular resultado aleatorio (90% éxito, 10% error para demostración)
            const isSuccess = Math.random() > 0.1;

            if (isSuccess) {
                // Generar número de orden único
                const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

                // Preparar datos de la orden
                const orderData = {
                    orderNumber,
                    items: [...items],
                    total,
                    customerInfo: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        phone: formData.phone,
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        zipCode: formData.zipCode
                    }
                };

                // Limpiar el carrito después del pago exitoso
                clearCart(dispatch);

                // Navegar a página de confirmación con datos
                navigate('/payment-success', { state: { orderData } });
            } else {
                // Simular diferentes tipos de errores
                const errors = [
                    { code: 'CARD_DECLINED', message: 'Tu tarjeta ha sido rechazada' },
                    { code: 'INSUFFICIENT_FUNDS', message: 'Fondos insuficientes' },
                    { code: 'INVALID_CARD', message: 'Datos de tarjeta inválidos' },
                    { code: 'EXPIRED_CARD', message: 'Tarjeta vencida' },
                    { code: 'NETWORK_ERROR', message: 'Error de conexión' }
                ];

                const randomError = errors[Math.floor(Math.random() * errors.length)];

                // Navegar a página de error con información del error
                navigate('/payment-error', {
                    state: {
                        errorCode: randomError.code,
                        errorMessage: randomError.message
                    }
                });
            }

            setIsProcessing(false);
        }, 2000);
    };

    return {
        isProcessing,
        processPayment
    };
};
