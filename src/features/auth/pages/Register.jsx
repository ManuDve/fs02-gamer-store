import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../app/context/AuthContext';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar teléfono (opcional pero si se ingresa debe ser válido)
    if (formData.phone && !/^\+?[\d\s-]{8,}$/.test(formData.phone)) {
      newErrors.phone = 'Teléfono inválido';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener mayúsculas y minúsculas';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar la contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar términos y condiciones
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simular delay de red
    setTimeout(() => {
      const { confirmPassword, acceptTerms, ...userData } = formData;
      const result = register(userData);

      if (result.success) {
        // Redirigir al home después del registro exitoso
        navigate('/');
      } else {
        setErrors({ general: result.error });
      }

      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <button 
          className="back-to-store-btn"
          onClick={() => navigate('/')}
          title="Volver a la tienda"
        >
          <i className="bi bi-arrow-left"></i> Volver a la tienda
        </button>

        <div className="register-header">
          <h1>Crear Cuenta</h1>
          <p>Únete a Level-Up Gamer y disfruta de beneficios exclusivos</p>
        </div>

        {errors.general && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-circle"></i> {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">
              <i className="bi bi-person"></i> Nombre Completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="Juan Pérez"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <i className="bi bi-envelope"></i> Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <i className="bi bi-telephone"></i> Teléfono (opcional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              placeholder="+56 9 1234 5678"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
            {errors.phone && (
              <div className="invalid-feedback">{errors.phone}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="bi bi-lock"></i> Contraseña *
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
            {errors.password && (
              <div className="invalid-feedback d-block">{errors.password}</div>
            )}
            <small className="form-text text-muted">
              Mínimo 6 caracteres, debe contener mayúsculas y minúsculas
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <i className="bi bi-lock-fill"></i> Confirmar Contraseña *
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
            )}
          </div>

          <div className="form-group">
            <div className="form-check">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                className={`form-check-input ${errors.acceptTerms ? 'is-invalid' : ''}`}
                checked={formData.acceptTerms}
                onChange={handleChange}
              />
              <label htmlFor="acceptTerms" className="form-check-label">
                Acepto los <a href="#" onClick={(e) => e.preventDefault()}>términos y condiciones</a> y la{' '}
                <a href="#" onClick={(e) => e.preventDefault()}>política de privacidad</a>
              </label>
              {errors.acceptTerms && (
                <div className="invalid-feedback d-block">{errors.acceptTerms}</div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-register"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creando cuenta...
              </>
            ) : (
              <>
                <i className="bi bi-person-plus"></i> Crear Cuenta
              </>
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="login-link">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <div className="benefits-section">
          <h6><i className="bi bi-star-fill"></i> Beneficios de Registrarte</h6>
          <ul>
            <li><i className="bi bi-check-circle"></i> Seguimiento de tus pedidos</li>
            <li><i className="bi bi-check-circle"></i> Ofertas exclusivas para miembros</li>
            <li><i className="bi bi-check-circle"></i> Proceso de compra más rápido</li>
            <li><i className="bi bi-check-circle"></i> Historial de compras</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;
