import { useState, useEffect } from 'react';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'Consolas',
    description: '',
    img: ''
  });
  const [errors, setErrors] = useState({});

  // Cargar productos desde localStorage o usar datos por defecto
  useEffect(() => {
    const storedProducts = localStorage.getItem('adminProducts');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Productos iniciales
      const initialProducts = [
        { id: 1, name: 'PlayStation 5', category: 'Consolas', stock: 25, price: 599990, description: 'Consola de última generación', img: '/img/ps5.jpg' },
        { id: 2, name: 'Xbox Series X', category: 'Consolas', stock: 15, price: 549990, description: 'Potente consola de Microsoft', img: '/img/xbox.jpg' },
        { id: 3, name: 'Nintendo Switch', category: 'Consolas', stock: 8, price: 349990, description: 'Consola híbrida portátil', img: '/img/switch.jpg' },
        { id: 4, name: 'DualSense Controller', category: 'Accesorios', stock: 45, price: 69990, description: 'Control para PS5', img: '/img/dualsense.jpg' },
        { id: 5, name: 'Gaming Chair Pro', category: 'Muebles', stock: 3, price: 299990, description: 'Silla gamer ergonómica', img: '/img/chair.jpg' },
      ];
      setProducts(initialProducts);
      localStorage.setItem('adminProducts', JSON.stringify(initialProducts));
    }
  }, []);

  // Guardar productos en localStorage cuando cambien
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('adminProducts', JSON.stringify(products));
    }
  }, [products]);

  const categories = ['Consolas', 'Accesorios', 'Muebles', 'PC Gaming', 'Juegos', 'Audio'];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (editingProduct) {
      // Editar producto existente
      setProducts(prev =>
        prev.map(p =>
          p.id === editingProduct.id
            ? { ...formData, id: p.id, price: Number(formData.price), stock: Number(formData.stock) }
            : p
        )
      );
    } else {
      // Agregar nuevo producto
      const newProduct = {
        ...formData,
        id: Date.now(),
        price: Number(formData.price),
        stock: Number(formData.stock)
      };
      setProducts(prev => [...prev, newProduct]);
    }

    closeModal();
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        stock: '',
        category: 'Consolas',
        description: '',
        img: ''
      });
    }
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      stock: '',
      category: 'Consolas',
      description: '',
      img: ''
    });
    setErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 10).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

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

      {/* Estadísticas */}
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
        <div className="stat-card">
          <div className="stat-icon bg-warning">
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <div className="stat-info">
            <h3>Stock Bajo</h3>
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

      {/* Filtros */}
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

      {/* Tabla de productos */}
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
                        <small className="text-muted">{product.description}</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{product.category}</span>
                  </td>
                  <td>
                    <span className={`stock-badge ${product.stock < 10 ? 'low' : 'normal'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="price-cell">{formatPrice(product.price)}</td>
                  <td className="price-cell">{formatPrice(product.price * product.stock)}</td>
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
                        onClick={() => handleDelete(product.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
              <button className="modal-close" onClick={closeModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
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
                <label htmlFor="category">Categoría *</label>
                <select
                  id="category"
                  name="category"
                  className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <div className="invalid-feedback">{errors.category}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descripción del producto"
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="img">URL de Imagen</label>
                <input
                  type="text"
                  id="img"
                  name="img"
                  className="form-control"
                  value={formData.img}
                  onChange={handleChange}
                  placeholder="/img/producto.jpg"
                />
              </div>

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
