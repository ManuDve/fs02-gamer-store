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

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    } else if (!/(@duoc\.cl|@gmail\.com)$/.test(formData.email)) {
      newErrors.email = 'El email debe ser @duoc.cl o @gmail.com';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (formData.phone.trim().length < 9) {
      newErrors.phone = 'El teléfono debe tener al menos 9 caracteres';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({}); // Limpiar errores generales

    try {
      // Llamar a la función de registro del contexto AuthContext
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      });

      if (result.success) {
        // Registro e inicio de sesión exitosos
        const isAdmin = result.user.roles?.includes('ROLE_ADMIN');
        
        if (isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        // Mostrar error del backend
        setErrors({ general: result.error });
      }
    } catch (error) {
      // Manejar errores de red o del servidor
      setErrors({ 
        general: 'Error al conectar con el servidor. Por favor, intenta nuevamente.' 
      });
    } finally {
      setIsLoading(false);
    }
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
              <i className="bi bi-person"></i> Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="Tu nombre completo"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              disabled={isLoading}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <i className="bi bi-envelope"></i> Email
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
              disabled={isLoading}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <i className="bi bi-telephone"></i> Teléfono <span className="text-danger">*</span>
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
              disabled={isLoading}
            />
            {errors.phone && (
              <div className="invalid-feedback d-block">{errors.phone}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="bi bi-lock"></i> Contraseña
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                disabled={isLoading}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
            {errors.password && (
              <div className="invalid-feedback d-block">{errors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <i className="bi bi-lock-fill"></i> Confirmar Contraseña
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
                disabled={isLoading}
              >
                <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
            )}
          </div>

          <div className="form-group form-check">
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              className={`form-check-input ${errors.acceptTerms ? 'is-invalid' : ''}`}
              checked={formData.acceptTerms}
              onChange={handleChange}
              disabled={isLoading}
            />
            <label className="form-check-label" htmlFor="acceptTerms">
              Acepto los{' '}
              <Link to="/terms" target="_blank">
                términos y condiciones
              </Link>
            </label>
            {errors.acceptTerms && (
              <div className="invalid-feedback d-block">{errors.acceptTerms}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-register"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Registrando...
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
      </div>
    </div>
  );
};

export default Register;