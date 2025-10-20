const OrderSummary = ({ items, total }) => {
    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">Resumen de Compra</h5>
                </div>
                <div className="card-body">
                    <ul className="list-unstyled">
                        {items.map(item => (
                            <li key={item.id} className="d-flex justify-content-between mb-2">
                                <span>{item.name} x {item.quantity}</span>
                                <span>$ {(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <hr />
                    <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <strong>$ {total}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span>Envío:</span>
                        <strong>Gratis</strong>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                        <h5>Total:</h5>
                        <h5 className="text-primary">$ {total}</h5>
                    </div>
                </div>
            </div>

            {/* Información adicional */}
            <div className="card mt-3">
                <div className="card-body">
                    <h6 className="card-title">
                        <i className="bi bi-shield-check me-2"></i>
                        Compra Segura
                    </h6>
                    <p className="card-text small text-muted mb-0">
                        Tus datos están protegidos con encriptación SSL
                    </p>
                </div>
            </div>
        </>
    );
};

export default OrderSummary;
