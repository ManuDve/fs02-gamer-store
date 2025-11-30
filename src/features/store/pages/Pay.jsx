import { useNavigate } from 'react-router-dom';
import { useCartState } from '../../../app/context/CartContext';
import { usePaymentForm } from '../hooks/usePaymentForm';
import { usePaymentProcessing } from '../hooks/usePaymentProcessing';
import PersonalInfoForm from '../components/PersonalInfoForm';
import ShippingAddressForm from '../components/ShippingAddressForm';
import PaymentInfoForm from '../components/PaymentInfoForm';
import OrderSummary from '../components/OrderSummary';
import PaymentFormActions from '../components/PaymentFormActions';
import { useEffect } from 'react';

const Pay = () => {
    const navigate = useNavigate();
    const { items } = useCartState();

    const { formData, errors, handleChange, validateForm } = usePaymentForm();

    const total = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0).toFixed(2);

    const { isProcessing, processPayment } = usePaymentProcessing(items, total, formData);

    // Solo redirigir al carrito si está vacío Y NO estamos procesando el pago
    useEffect(() => {
        if ((!items || items.length === 0) && !isProcessing) {
            navigate('/cart');
        }
    }, [items, navigate, isProcessing]); // ⬅️ AGREGAMOS isProcessing como dependencia

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            processPayment();
        }
    };

    // Mostrar loading mientras se procesa
    if (isProcessing) {
        return (
            <main className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Procesando pago...</span>
                    </div>
                    <h3 className="mt-4">Procesando tu pago...</h3>
                    <p className="text-muted">Por favor espera un momento</p>
                </div>
            </main>
        );
    }

    return (
        <main className="container py-5">
            <h2 className="mb-4">Finalizar Compra</h2>

            <div className="row">
                {/* Formulario de pago */}
                <div className="col-lg-8">
                    <form onSubmit={handleSubmit}>
                        <PersonalInfoForm
                            formData={formData}
                            errors={errors}
                            onChange={handleChange}
                        />

                        <ShippingAddressForm
                            formData={formData}
                            errors={errors}
                            onChange={handleChange}
                        />

                        <PaymentInfoForm
                            formData={formData}
                            errors={errors}
                            onChange={handleChange}
                        />

                        <PaymentFormActions isProcessing={isProcessing} />
                    </form>
                </div>

                {/* Resumen de Compra */}
                <div className="col-lg-4">
                    <OrderSummary items={items} total={total} />
                </div>
            </div>
        </main>
    );
};

export default Pay;