import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Obtener datos de la compra desde el state de navegación
    const { orderData } = location.state || {};

    useEffect(() => {
        // Si no hay datos de orden, redirigir al home
        if (!orderData) {
            navigate('/');
        }
    }, [orderData, navigate]);

    if (!orderData) {
        return null;
    }

    const { orderNumber, items, total, customerInfo } = orderData;

    return (
        <main className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    {/* Mensaje de éxito */}
                    <div className="text-center mb-4">
                        <div className="mb-4">
                            <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                                style={{ width: '80px', height: '80px' }}>
                                <i className="bi bi-check-lg" style={{ fontSize: '3rem' }}></i>
                            </div>
                        </div>
                        <h1 className="display-5 mb-3">¡Pago Exitoso!</h1>
                        <p className="lead text-muted">
                            Tu compra ha sido procesada correctamente
                        </p>
                    </div>

                    {/* Detalles de la orden */}
                    <div className="card mb-4">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">Detalles de la Orden</h5>
                        </div>
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <strong>Número de Orden:</strong>
                                    <p className="mb-0 text-primary">{orderNumber}</p>
                                </div>
                                <div className="col-md-6">
                                    <strong>Fecha:</strong>
                                    <p className="mb-0">{new Date().toLocaleDateString('es-CL', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</p>
                                </div>
                            </div>

                            <hr />

                            <div className="mb-3">
                                <strong>Enviado a:</strong>
                                <p className="mb-1">{customerInfo.firstName} {customerInfo.lastName}</p>
                                <p className="mb-1">{customerInfo.address}</p>
                                <p className="mb-1">{customerInfo.city}, {customerInfo.state} - {customerInfo.zipCode}</p>
                                <p className="mb-0">
                                    <i className="bi bi-envelope me-2"></i>{customerInfo.email}
                                </p>
                                <p className="mb-0">
                                    <i className="bi bi-telephone me-2"></i>{customerInfo.phone}
                                </p>
                            </div>

                            <hr />

                            <div>
                                <strong className="d-block mb-3">Productos:</strong>
                                <ul className="list-unstyled">
                                    {items.map(item => (
                                        <li key={item.id} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={item.img}
                                                    alt={item.name}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                    className="rounded me-3"
                                                />
                                                <div>
                                                    <div>{item.name}</div>
                                                    <small className="text-muted">Cantidad: {item.quantity}</small>
                                                </div>
                                            </div>
                                            <strong>$ {(item.price * item.quantity).toFixed(2)}</strong>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Total Pagado:</h5>
                                <h4 className="mb-0 text-success">$ {total}</h4>
                            </div>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="alert alert-info" role="alert">
                        <h6 className="alert-heading">
                            <i className="bi bi-info-circle me-2"></i>
                            ¿Qué sigue?
                        </h6>
                        <ul className="mb-0">
                            <li>Recibirás un correo de confirmación en {customerInfo.email}</li>
                            <li>Tu pedido será procesado en las próximas 24 horas</li>
                            <li>El tiempo de entrega estimado es de 3-5 días hábiles</li>
                            <li>Podrás rastrear tu pedido con el número de orden proporcionado</li>
                        </ul>
                    </div>

                    {/* Acciones */}
                    <div className="d-flex gap-2 justify-content-center">
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/')}
                        >
                            <i className="bi bi-house-door me-2"></i>
                            Volver al Inicio
                        </button>
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate('/products')}
                        >
                            <i className="bi bi-shop me-2"></i>
                            Seguir Comprando
                        </button>
                    </div>

                    {/* Soporte */}
                    <div className="text-center mt-4">
                        <p className="text-muted mb-0">
                            ¿Necesitas ayuda? Contáctanos en <a href="mailto:soporte@gamerstore.com">soporte@gamerstore.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PaymentSuccess;
