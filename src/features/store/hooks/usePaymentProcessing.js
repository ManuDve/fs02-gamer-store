import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartDispatch, clearCart } from '../../../app/context/CartContext';
import orderService from '../../../shared/services/orderService';

export const usePaymentProcessing = (items, total, formData) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();
    const dispatch = useCartDispatch();

    const processPayment = async () => {
        setIsProcessing(true);

        // Simular procesamiento de pago
        setTimeout(async () => {
            const isSuccess = true;

            if (isSuccess) {
                try {
                    // Generar número de orden único
                    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                    const timestamp = new Date().toISOString();

                    // Estructura correcta que espera el backend
                    const orderPayload = {
                        order: {
                            shippingAddress: {
                                address: formData.address,
                                city: formData.city,
                                state: formData.state,
                                zipCode: formData.zipCode
                            },
                            items: items.map(item => ({
                                id: item.id,
                                quantity: item.quantity
                            })),
                            shipping: 0,
                            payment: {
                                cardNumber: formData.cardNumber,
                                cardName: formData.cardName,
                                cardExpiry: formData.cardExpiry,
                                cardCVV: formData.cardCVV
                            }
                        }
                    };

                    // Guardar orden en el backend
                    const response = await orderService.createOrder(orderPayload);

                    // Preparar datos para la vista
                    const orderData = {
                        orderNumber: response.orderNumber || orderNumber,
                        timestamp: response.timestamp || timestamp,
                        status: response.status || 'Confirmado',
                        items: items.map(item => ({
                            name: item.name,
                            quantity: item.quantity,
                            price: item.price,
                            subtotal: item.price * item.quantity
                        })),
                        summary: {
                            subtotal: parseFloat(total),
                            shipping: 0,
                            total: parseFloat(total)
                        },
                        customerInfo: {
                            firstName: formData.firstName,
                            lastName: formData.lastName,
                            email: formData.email,
                            phone: formData.phone
                        },
                        shippingAddress: {
                            address: formData.address,
                            city: formData.city,
                            state: formData.state,
                            zipCode: formData.zipCode
                        }
                    };

                    // ⬇️ PRIMERO: Navegar (esto desmonta el componente Pay.jsx)
                    navigate('/payment-success', {
                        state: { orderData },
                        replace: true
                    });

                    // ⬇️ DESPUÉS: Limpiar carrito (con un pequeño delay)
                    setTimeout(() => {
                        clearCart(dispatch);
                        setIsProcessing(false);
                    }, 100);

                } catch (error) {
                    console.error('Error al procesar el pago:', error);
                    setIsProcessing(false);
                    
                    // Mostrar error de backend
                    navigate('/payment-error', {
                        state: {
                            errorCode: 'SERVER_ERROR',
                            errorMessage: 'Error al procesar la orden en el servidor. Intenta nuevamente.'
                        },
                        replace: true
                    });
                }
            }
        }, 2000);
    };

    return {
        isProcessing,
        processPayment
    };
};