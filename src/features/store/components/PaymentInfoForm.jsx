const PaymentInfoForm = ({ formData, errors, onChange }) => {
    return (
        <div className="card mb-4">
            <div className="card-header">
                <h5 className="mb-0">Información de Pago</h5>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label htmlFor="cardNumber" className="form-label">Número de Tarjeta *</label>
                    <input
                        type="text"
                        className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={onChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                    />
                    {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="cardName" className="form-label">Nombre en la Tarjeta *</label>
                    <input
                        type="text"
                        className={`form-control ${errors.cardName ? 'is-invalid' : ''}`}
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={onChange}
                        placeholder="Como aparece en la tarjeta"
                    />
                    {errors.cardName && <div className="invalid-feedback">{errors.cardName}</div>}
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="cardExpiry" className="form-label">Fecha de Vencimiento *</label>
                        <input
                            type="text"
                            className={`form-control ${errors.cardExpiry ? 'is-invalid' : ''}`}
                            id="cardExpiry"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={onChange}
                            placeholder="MM/AA"
                            maxLength="5"
                        />
                        {errors.cardExpiry && <div className="invalid-feedback">{errors.cardExpiry}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="cardCVV" className="form-label">CVV *</label>
                        <input
                            type="text"
                            className={`form-control ${errors.cardCVV ? 'is-invalid' : ''}`}
                            id="cardCVV"
                            name="cardCVV"
                            value={formData.cardCVV}
                            onChange={onChange}
                            placeholder="123"
                            maxLength="4"
                        />
                        {errors.cardCVV && <div className="invalid-feedback">{errors.cardCVV}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentInfoForm;
