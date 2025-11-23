const ShippingAddressForm = ({ formData, errors, onChange }) => {
    return (
        <div className="card mb-4">
            <div className="card-header">
                <h5 className="mb-0">Dirección de Entrega</h5>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">Dirección *</label>
                    <input
                        type="text"
                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={onChange}
                        placeholder="Calle, número, depto, etc."
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="city" className="form-label">Ciudad *</label>
                        <input
                            type="text"
                            className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={onChange}
                        />
                        {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                    </div>
                    <div className="col-md-3 mb-3">
                        <label htmlFor="state" className="form-label">Región *</label>
                        <input
                            type="text"
                            className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={onChange}
                        />
                        {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                    </div>
                    <div className="col-md-3 mb-3">
                        <label htmlFor="zipCode" className="form-label">Código Postal *</label>
                        <input
                            type="text"
                            className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`}
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={onChange}
                        />
                        {errors.zipCode && <div className="invalid-feedback">{errors.zipCode}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingAddressForm;
