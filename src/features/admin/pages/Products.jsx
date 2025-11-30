import { useState, useEffect } from 'react';
import { productService } from '../../../shared/services/productService';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    stock: '',
    category: 'Consola',
    description: '',
    img: ''
  });
  const [errors, setErrors] = useState({});
  const [characteristicsData, setCharacteristicsData] = useState({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      alert('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Consola', 'Juego de Mesa', 'Periférico Gamer', 'PC Gaming', 'Audio', 'Accesorios'];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  const getIdSuggestion = (category) => {
    const categoryMap = {
      'Consola': 'CN001',
      'Juego de Mesa': 'GM001', 
      'Periférico Gamer': 'PG001',
      'PC Gaming': 'PC001',
      'Audio': 'AU001',
      'Accesorios': 'AC001'
    };
    return categoryMap[category] || 'PROD001';
  };

  const getCharacteristicFields = (category) => {
    switch (category) {
      case 'Juego de Mesa':
        return [
          { key: 'jugadores', label: 'Número de Jugadores', type: 'text', placeholder: '2-4', required: true },
          { key: 'edadMinima', label: 'Edad Mínima', type: 'text', placeholder: '+12 años', required: true },
          { key: 'tiempoJuego', label: 'Tiempo de Juego', type: 'text', placeholder: '30-60 min', required: true }
        ];
      
      case 'Periférico Gamer':
        return [
          { key: 'tipoSwitch', label: 'Tipo de Switch', type: 'select', options: ['Mecánico', 'Membrana', 'Híbrido'], required: false },
          { key: 'iluminacion', label: 'Iluminación', type: 'select', options: ['RGB', 'LED', 'Sin iluminación'], required: false },
          { key: 'conexion', label: 'Conexión', type: 'select', options: ['USB', 'Inalámbrico', 'Bluetooth'], required: true },
          { key: 'sensor', label: 'Tipo de Sensor', type: 'text', placeholder: 'Óptico', required: false },
          { key: 'peso', label: 'Peso', type: 'text', placeholder: '150g', required: false },
          { key: 'sonido', label: 'Sonido', type: 'text', placeholder: '7.1', required: false },
          { key: 'compatibilidad', label: 'Compatibilidad', type: 'text', placeholder: 'PC/Mac', required: false },
          { key: 'dimensiones', label: 'Dimensiones', type: 'text', placeholder: 'Standard', required: false },
          { key: 'material', label: 'Material', type: 'text', placeholder: 'ABS', required: false }
        ];
      
      case 'Consola':
        return [
          { key: 'resolucionMaxima', label: 'Resolución Máxima', type: 'text', placeholder: '4K', required: false },
          { key: 'almacenamiento', label: 'Almacenamiento', type: 'text', placeholder: '1TB SSD', required: false },
          { key: 'lectorDiscos', label: 'Lector de Discos', type: 'select', options: ['Sí', 'No'], required: false },
          { key: 'pantalla', label: 'Compatibilidad Pantalla', type: 'text', placeholder: 'Compatible TV/Monitor', required: false },
          { key: 'modoJuego', label: 'Modo de Juego', type: 'text', placeholder: 'Individual/Multijugador', required: false },
          { key: 'memoria', label: 'Memoria RAM', type: 'text', placeholder: '16GB', required: false },
          { key: 'caracteristicaClave', label: 'Característica Clave', type: 'text', placeholder: 'Ray Tracing', required: false },
          { key: 'color', label: 'Color', type: 'text', placeholder: 'Negro', required: false },
          { key: 'genero', label: 'Género', type: 'text', placeholder: 'Consola', required: false },
          { key: 'clasificacion', label: 'Clasificación', type: 'select', options: ['E+', 'T+', 'M+'], required: false },
          { key: 'jugadores2', label: 'Jugadores', type: 'text', placeholder: '1-4', required: false }
        ];
      
      case 'PC Gaming':
      case 'Audio':
      case 'Accesorios':
      default:
        return [];
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCharacteristicChange = (e) => {
    const { name, value } = e.target;
    setCharacteristicsData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      category: value,
      id: editingProduct ? prev.id : ''
    }));
    setCharacteristicsData({});
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editingProduct && !formData.id.trim()) {
      newErrors.id = 'El ID es requerido para crear productos';
    }

    if (formData.id && formData.id.length > 10) {
      newErrors.id = 'El ID no puede tener más de 10 caracteres';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    if (!formData.category) {
      newErrors.category = 'Selecciona una categoría';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.img.trim()) {
      newErrors.img = 'La URL de imagen es requerida';
    }

    const fields = getCharacteristicFields(formData.category);
    fields.forEach(field => {
      if (field.required && (!characteristicsData[field.key] || characteristicsData[field.key].trim() === '')) {
        newErrors[`char_${field.key}`] = `${field.label} es requerido`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderCharacteristicFields = () => {
    const fields = getCharacteristicFields(formData.category);
    
    if (fields.length === 0) return null;

    return (
      <div className="characteristics-section">
        <h4 className="section-title">
          <i className="bi bi-gear"></i> Características Específicas
        </h4>
        <div className="characteristics-grid">
          {fields.map(field => (
            <div key={field.key} className="form-group">
              <label htmlFor={field.key}>
                {field.label} {field.required && <span className="text-danger">*</span>}
              </label>
              
              {field.type === 'select' ? (
                <select
                  id={field.key}
                  name={field.key}
                  className={`form-select ${errors[`char_${field.key}`] ? 'is-invalid' : ''}`}
                  value={characteristicsData[field.key] || ''}
                  onChange={handleCharacteristicChange}
                >
                  <option value="">Seleccionar...</option>
                  {field.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  id={field.key}
                  name={field.key}
                  className={`form-control ${errors[`char_${field.key}`] ? 'is-invalid' : ''}`}
                  placeholder={field.placeholder}
                  value={characteristicsData[field.key] || ''}
                  onChange={handleCharacteristicChange}
                />
              )}
              
              {errors[`char_${field.key}`] && (
                <div className="invalid-feedback">{errors[`char_${field.key}`]}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const createCharacteristicsObject = () => {
    const fields = getCharacteristicFields(formData.category);
    
    if (fields.length === 0) return null;

    const hasValidCharacteristics = fields.some(field => 
      characteristicsData[field.key] && characteristicsData[field.key].trim() !== ''
    );

    if (!hasValidCharacteristics) return null;

    const characteristics = {};
    
    Object.keys(characteristicsData).forEach(key => {
      if (characteristicsData[key] && characteristicsData[key].trim() !== '') {
        characteristics[key] = characteristicsData[key].trim();
      }
    });

    return Object.keys(characteristics).length > 0 ? characteristics : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    let productData = null;

    try {
      if (editingProduct) {
        productData = {
          category: formData.category,
          name: formData.name,
          price: Number(formData.price),
          img: formData.img,
          description: formData.description,
          review: formData.description || "Producto de calidad premium para gamers exigentes.",
          stock: {
            quantity: Number(formData.stock)
          }
        };

        const characteristicsObject = createCharacteristicsObject();
        if (characteristicsObject) {
          productData.characteristics = characteristicsObject;
        }
        
        await productService.update(editingProduct.id, productData);
        alert('✅ Producto actualizado exitosamente');
      } else {
        productData = {
          id: formData.id.trim(),
          category: formData.category,
          name: formData.name,
          price: Number(formData.price),
          img: formData.img,
          description: formData.description,
          review: formData.description || "Producto de calidad premium para gamers exigentes.",
          stock: {
            quantity: Number(formData.stock)
          }
        };

        const characteristicsObject = createCharacteristicsObject();
        if (characteristicsObject) {
          productData.characteristics = characteristicsObject;
        }
        
        await productService.create(productData);
        alert('✅ Producto creado exitosamente');
      }

      closeModal();
      loadProducts();
    } catch (error) {
      let errorMessage = 'Error desconocido';
      
      if (error.response?.status === 500) {
        errorMessage = `❌ Error interno del servidor: ${error.response?.data?.message || 'Error en el servidor'}`;
      } else if (error.response?.status === 409) {
        errorMessage = `❌ Conflicto de datos: ${error.response?.data?.message || 'Recurso duplicado'}`;
      } else if (error.response?.status === 400) {
        errorMessage = `❌ Datos inválidos: ${error.response?.data?.message || 'Verificar los datos ingresados'}`;
      } else {
        errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
      }
      
      alert(errorMessage);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock || 0,
        category: product.category,
        description: product.description,
        img: product.img
      });
      setCharacteristicsData(product.characteristics || {});
    } else {
      setEditingProduct(null);
      setFormData({
        id: '',
        name: '',
        price: '',
        stock: '',
        category: 'Consola',
        description: '',
        img: ''
      });
      setCharacteristicsData({});
    }
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      id: '',
      name: '',
      price: '',
      stock: '',
      category: 'Consola',
      description: '',
      img: ''
    });
    setCharacteristicsData({});
    setErrors({});
  };

  const handleDelete = async (id, productName) => {
    if (window.confirm(`¿Estás seguro de eliminar "${productName}"?`)) {
      try {
        await productService.delete(id);
        alert('✅ Producto eliminado exitosamente');
        loadProducts();
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
        alert(`❌ Error al eliminar: ${errorMessage}`);
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesLowStock = !filterLowStock || (product.stock || 0) < 10;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => (p.stock || 0) < 10).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);

  if (loading) {
    return (
      <div className="admin-products-container">
        <div className="loading-state">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-products-container">
      <div className="products-header">
        <div>
          <h1>Gestión de Productos</h1>
          <p className="text-muted">Administra el inventario de la tienda</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <i className="bi bi-plus-circle"></i> Agregar Producto
        </button>
      </div>

      <div className="products-stats">
        <div className="stat-card">
          <div className="stat-icon bg-primary">
            <i className="bi bi-box-seam"></i>
          </div>
          <div className="stat-info">
            <h3>Total Productos</h3>
            <p className="stat-value">{totalProducts}</p>
          </div>
        </div>
        <div 
          className="stat-card clickable" 
          onClick={() => setFilterLowStock(!filterLowStock)}
        >
          <div className="stat-icon bg-warning">
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <div className="stat-info">
            <h3>
              Stock Bajo 
              {filterLowStock && <span className="filter-active">●</span>}
            </h3>
            <p className="stat-value">{lowStockProducts}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-success">
            <i className="bi bi-cash-stack"></i>
          </div>
          <div className="stat-info">
            <h3>Valor Total</h3>
            <p className="stat-value">{formatPrice(totalValue)}</p>
          </div>
        </div>
      </div>

      <div className="products-filters">
        <div className="filter-group">
          <label htmlFor="search">
            <i className="bi bi-search"></i> Buscar
          </label>
          <input
            type="text"
            id="search"
            className="form-control"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="category">
            <i className="bi bi-funnel"></i> Categoría
          </label>
          <select
            id="category"
            className="form-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Valor Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <div className="product-name">
                      <strong>{product.name}</strong>
                      {product.description && (
                        <small className="text-muted d-block">{product.description}</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{product.category}</span>
                  </td>
                  <td>
                    <span className={`stock-badge ${(product.stock || 0) < 10 ? 'low' : 'normal'}`}>
                      {product.stock || 0}
                    </span>
                  </td>
                  <td className="price-cell">{formatPrice(product.price)}</td>
                  <td className="price-cell">{formatPrice(product.price * (product.stock || 0))}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => openModal(product)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(product.id, product.name)}
                        title="Eliminar"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  <div className="empty-state">
                    <i className="bi bi-inbox"></i>
                    <p>No se encontraron productos</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content-wrapper" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className={`bi ${editingProduct ? 'bi-pencil-square' : 'bi-plus-circle'}`}></i>
                {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
              </h2>
              <button className="modal-close" onClick={closeModal} type="button">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="category">Categoría *</label>
                <select
                  id="category"
                  name="category"
                  className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                  value={formData.category}
                  onChange={handleCategoryChange}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <div className="invalid-feedback">{errors.category}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="id">
                  ID del Producto * 
                  {editingProduct && <span className="text-muted"> (Solo lectura)</span>}
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  className={`form-control ${errors.id ? 'is-invalid' : ''}`}
                  value={formData.id}
                  onChange={handleChange}
                  placeholder={`Ej: ${getIdSuggestion(formData.category)}`}
                  maxLength="10"
                  disabled={editingProduct}
                />
                {errors.id && <div className="invalid-feedback">{errors.id}</div>}
                <small className="form-text text-muted">
                  Máximo 10 caracteres. Sugerido para {formData.category}: {getIdSuggestion(formData.category)}
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="name">Nombre del Producto *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: PlayStation 5"
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Precio *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="599990"
                    min="0"
                  />
                  {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="stock">Stock *</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    className={`form-control ${errors.stock ? 'is-invalid' : ''}`}
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="25"
                    min="0"
                  />
                  {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción *</label>
                <textarea
                  id="description"
                  name="description"
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descripción del producto"
                  rows="3"
                ></textarea>
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="img">URL de Imagen *</label>
                <input
                  type="text"
                  id="img"
                  name="img"
                  className={`form-control ${errors.img ? 'is-invalid' : ''}`}
                  value={formData.img}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {errors.img && <div className="invalid-feedback">{errors.img}</div>}
              </div>

              {renderCharacteristicFields()}

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-check-circle"></i>
                  {editingProduct ? 'Guardar Cambios' : 'Agregar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;