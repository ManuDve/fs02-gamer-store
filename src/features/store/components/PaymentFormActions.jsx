import { useNavigate } from 'react-router-dom';

const PaymentFormActions = ({ isProcessing }) => {
    const navigate = useNavigate();

    return (
        <div className="d-flex gap-2">
            <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/cart')}
                disabled={isProcessing}
            >
                Volver al Carrito
            </button>
            <button
                type="submit"
                className="btn btn-primary"
                disabled={isProcessing}
            >
                {isProcessing ? 'Procesando...' : 'Confirmar Pago'}
            </button>
        </div>
    );
};

export default PaymentFormActions;
