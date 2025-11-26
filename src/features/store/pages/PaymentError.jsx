import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

const PaymentError = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const hasNavigated = useRef(false);
    const [isValidating, setIsValidating] = useState(true);

    // Obtener información del error desde el state de navegación
    const { errorMessage, errorCode } = location.state || {};

    // Proteger contra acceso directo sin datos de error
    useEffect(() => {
        // Validar si hay state válido
        if (!location.state || !errorCode) {
            // Prevenir navegación múltiple
            if (!hasNavigated.current) {
                hasNavigated.current = true;
                navigate('/cart', { replace: true });
            }
        } else {
            setIsValidating(false);
        }
    }, [location.state, errorCode, navigate]);

    // Mostrar loading mientras valida
    if (isValidating || !errorCode) {
        return null;
    }

    const getErrorDetails = (code) => {
        switch (code) {
            case 'CARD_DECLINED':
                return {
                    title: 'Tarjeta Rechazada',
                    description: 'Tu tarjeta ha sido rechazada. Por favor, verifica los datos o intenta con otro método de pago.',
                    icon: 'bi-credit-card-2-back'
                };
            case 'INSUFFICIENT_FUNDS':
                return {
                    title: 'Fondos Insuficientes',
                    description: 'No hay fondos suficientes en tu cuenta. Por favor, verifica tu saldo o utiliza otra tarjeta.',
                    icon: 'bi-wallet2'
                };
            case 'INVALID_CARD':
                return {
                    title: 'Tarjeta Inválida',
                    description: 'Los datos de la tarjeta son incorrectos. Verifica el número, fecha de vencimiento y CVV.',
                    icon: 'bi-exclamation-triangle'
                };
            case 'EXPIRED_CARD':
                return {
                    title: 'Tarjeta Vencida',
                    description: 'La tarjeta ha expirado. Por favor, utiliza una tarjeta válida.',
                    icon: 'bi-calendar-x'
                };
            case 'NETWORK_ERROR':
                return {
                    title: 'Error de Conexión',
                    description: 'No pudimos conectar con el servidor. Verifica tu conexión a internet e intenta nuevamente.',
                    icon: 'bi-wifi-off'
                };
            case 'TIMEOUT':
                return {
                    title: 'Tiempo de Espera Agotado',
                    description: 'La transacción tardó demasiado tiempo. Por favor, intenta nuevamente.',
                    icon: 'bi-clock-history'
                };
            default:
                return {
                    title: 'Error en el Pago',
                    description: errorMessage || 'Ocurrió un error inesperado al procesar tu pago. Por favor, intenta nuevamente.',
                    icon: 'bi-x-circle'
                };
        }
    };

    const errorDetails = getErrorDetails(errorCode);

    const commonIssues = [
        {
            icon: 'bi-credit-card',
            title: 'Verifica los datos de tu tarjeta',
            description: 'Asegúrate de que el número, fecha y CVV sean correctos'
        },
        {
            icon: 'bi-shield-check',
            title: 'Revisa los límites de tu tarjeta',
            description: 'Contacta a tu banco para verificar límites diarios o mensuales'
        },
        {
            icon: 'bi-currency-dollar',
            title: 'Confirma el saldo disponible',
            description: 'Verifica que tengas fondos suficientes para completar la compra'
        },
        {
            icon: 'bi-telephone',
            title: 'Contacta a tu banco',
            description: 'Tu banco puede estar bloqueando la transacción por seguridad'
        }
    ];

    return (
        <main className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    {/* Mensaje de error */}
                    <div className="text-center mb-4">
                        <div className="mb-4">
                            <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                                style={{ width: '80px', height: '80px' }}>
                                <i className={`${errorDetails.icon}`} style={{ fontSize: '3rem' }}></i>
                            </div>
                        </div>
                        <h1 className="display-5 mb-3 text-danger">{errorDetails.title}</h1>
                        <p className="lead text-muted">
                            {errorDetails.description}
                        </p>
                    </div>

                    {/* Detalles del error */}
                    <div className="card border-danger mb-4">
                        <div className="card-header bg-danger text-white">
                            <h5 className="mb-0">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                Detalles del Error
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <strong>Código de Error:</strong>
                                    <p className="mb-0 font-monospace text-danger">{errorCode}</p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <strong>Fecha y Hora:</strong>
                                    <p className="mb-0">{new Date().toLocaleString('es-CL', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}</p>
                                </div>
                            </div>

                            <div className="alert alert-warning mb-0 mt-3" role="alert">
                                <i className="bi bi-info-circle me-2"></i>
                                <strong>Importante:</strong> No se ha realizado ningún cargo a tu tarjeta. Tu carrito sigue activo con los productos seleccionados.
                            </div>
                        </div>
                    </div>

                    {/* Problemas comunes y soluciones */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">
                                <i className="bi bi-lightbulb me-2"></i>
                                Problemas Comunes y Soluciones
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {commonIssues.map((issue, index) => (
                                    <div key={index} className="col-md-6 mb-3">
                                        <div className="d-flex">
                                            <div className="text-primary me-3">
                                                <i className={issue.icon} style={{ fontSize: '1.5rem' }}></i>
                                            </div>
                                            <div>
                                                <h6 className="mb-1">{issue.title}</h6>
                                                <p className="text-muted small mb-0">{issue.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Métodos de pago alternativos */}
                    <div className="alert alert-info" role="alert">
                        <h6 className="alert-heading">
                            <i className="bi bi-credit-card me-2"></i>
                            ¿Sigues teniendo problemas?
                        </h6>
                        <p className="mb-2">Intenta con uno de estos métodos alternativos:</p>
                        <ul className="mb-0">
                            <li>Utiliza una tarjeta de crédito o débito diferente</li>
                            <li>Verifica que tu tarjeta esté habilitada para compras en línea</li>
                            <li>Contacta a tu banco para autorizar la transacción</li>
                            <li>Intenta nuevamente en unos minutos</li>
                        </ul>
                    </div>

                    {/* Acciones */}
                    <div className="d-flex gap-2 justify-content-center flex-wrap">
                        <button
                            className="btn btn-danger"
                            onClick={() => navigate('/pay')}
                        >
                            <i className="bi bi-arrow-repeat me-2"></i>
                            Reintentar Pago
                        </button>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => navigate('/cart')}
                        >
                            <i className="bi bi-cart me-2"></i>
                            Volver al Carrito
                        </button>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => navigate('/products')}
                        >
                            <i className="bi bi-shop me-2"></i>
                            Seguir Comprando
                        </button>
                    </div>

                    {/* Soporte */}
                    <div className="card mt-4 bg-light">
                        <div className="card-body text-center">
                            <h6 className="card-title">
                                <i className="bi bi-headset me-2"></i>
                                ¿Necesitas Ayuda?
                            </h6>
                            <p className="card-text text-muted mb-3">
                                Nuestro equipo de soporte está disponible para ayudarte
                            </p>
                            <div className="d-flex gap-3 justify-content-center flex-wrap">
                                <a href="mailto:soporte@gamerstore.com" className="btn btn-sm btn-outline-primary">
                                    <i className="bi bi-envelope me-2"></i>
                                    soporte@gamerstore.com
                                </a>
                                <a href="tel:+56912345678" className="btn btn-sm btn-outline-primary">
                                    <i className="bi bi-telephone me-2"></i>
                                    +56 9 1234 5678
                                </a>
                            </div>
                            <p className="text-muted small mt-3 mb-0">
                                Horario de atención: Lunes a Viernes, 9:00 - 18:00 hrs
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PaymentError;
