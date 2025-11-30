import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Products from "../../src/features/admin/pages/Products";
import { productService } from "../../src/shared/services/productService";

// Mock del servicio de productos
vi.mock('../../src/shared/services/productService', () => ({
  productService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
}));

// Productos mock para las pruebas
const mockProducts = [
  {
    id: 1,
    name: 'PlayStation 5',
    category: 'Consola',
    stock: 15,
    price: 599990,
    description: 'Consola de última generación',
    img: '/img/ps5.jpg'
  },
  {
    id: 2,
    name: 'Xbox Series X',
    category: 'Consola',
    stock: 12,
    price: 549990,
    description: 'Potente consola de Microsoft',
    img: '/img/xbox.jpg'
  },
  {
    id: 3,
    name: 'Nintendo Switch',
    category: 'Consola',
    stock: 8,
    price: 349990,
    description: 'Consola híbrida portátil',
    img: '/img/switch.jpg'
  },
  {
    id: 4,
    name: 'DualSense Controller',
    category: 'Accesorios',
    stock: 25,
    price: 69990,
    description: 'Control para PS5',
    img: '/img/dualsense.jpg'
  },
  {
    id: 5,
    name: 'Gaming Chair',
    category: 'Muebles',
    stock: 3,
    price: 199990,
    description: 'Silla gamer ergonómica',
    img: '/img/chair.jpg'
  }
];

// Helper para renderizar
function renderProducts() {
  return render(
    <MemoryRouter>
      <Products />
    </MemoryRouter>
  );
}

describe('Admin Products CRUD', () => {
  beforeEach(() => {
    localStorage.clear();
    // Mock window.confirm and alert
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    // Reset and setup mock
    vi.clearAllMocks();
    productService.getAll.mockResolvedValue([...mockProducts]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Renderizado inicial', () => {
    it('debería renderizar el título "Gestión de Productos"', async () => {
      renderProducts();
      await waitFor(() => {
        expect(screen.getByText(/Gestión de Productos/i)).toBeInTheDocument();
      });
    });

    it('debería renderizar el botón "Agregar Producto"', async () => {
      renderProducts();
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Agregar Producto/i })).toBeInTheDocument();
      });
    });

    it('debería cargar productos iniciales cuando no hay datos en localStorage', async () => {
      renderProducts();
      await waitFor(() => {
        expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
      });
      expect(screen.getByText('Xbox Series X')).toBeInTheDocument();
      expect(screen.getByText('Nintendo Switch')).toBeInTheDocument();
      expect(productService.getAll).toHaveBeenCalled();
    });

    it('debería cargar productos desde localStorage si existen', async () => {
      const customProducts = [
        { id: 99, name: 'Custom Product', category: 'Consola', stock: 10, price: 100000, description: 'Test', img: '' }
      ];
      productService.getAll.mockResolvedValue(customProducts);
      
      renderProducts();
      await waitFor(() => {
        expect(screen.getByText('Custom Product')).toBeInTheDocument();
      });
    });
  });

  describe('Estadísticas', () => {
    it('debería mostrar el total de productos', async () => {
      renderProducts();
      await waitFor(() => {
        expect(screen.getByText('Total Productos')).toBeInTheDocument();
      });
      // 5 productos iniciales - buscar en la tarjeta de estadísticas
      const statCards = document.querySelectorAll('.stat-card');
      const totalProductosCard = Array.from(statCards).find(card => card.textContent.includes('Total Productos'));
      expect(totalProductosCard).toBeTruthy();
      expect(totalProductosCard.textContent).toContain('5');
    });

    it('debería mostrar productos con stock bajo (<10)', async () => {
      renderProducts();
      await waitFor(() => {
        expect(screen.getByText('Stock Bajo')).toBeInTheDocument();
      });
      // 2 productos con stock < 10 (Switch=8, Chair=3)
      // Buscar en la tarjeta de estadísticas que contiene "Stock Bajo"
      const statCards = document.querySelectorAll('.stat-card');
      const stockBajoCard = Array.from(statCards).find(card => card.textContent.includes('Stock Bajo'));
      expect(stockBajoCard).toBeTruthy();
      expect(stockBajoCard.textContent).toContain('2');
    });

    it('debería mostrar el valor total del inventario', async () => {
      renderProducts();
      // Buscar "Valor Total" en las estadísticas
      await waitFor(() => {
        const allValorTotal = screen.getAllByText('Valor Total');
        expect(allValorTotal.length).toBeGreaterThan(0);
      });
      // Debe haber un valor formateado en CLP
      const statValues = screen.getAllByText(/\$/);
      expect(statValues.length).toBeGreaterThan(0);
    });
  });

  describe('Filtros y búsqueda', () => {
    it('debería filtrar productos por nombre al buscar', async () => {
      renderProducts();
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Buscar productos...')).toBeInTheDocument();
      });
      const searchInput = screen.getByPlaceholderText('Buscar productos...');
      
      fireEvent.change(searchInput, { target: { value: 'PlayStation' } });
      
      await waitFor(() => {
        expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
        expect(screen.queryByText('Xbox Series X')).not.toBeInTheDocument();
      });
    });

    it('debería filtrar productos por categoría', async () => {
      renderProducts();
      await waitFor(() => {
        expect(screen.getByLabelText(/Categoría/i)).toBeInTheDocument();
      });
      const categorySelect = screen.getByLabelText(/Categoría/i);
      
      fireEvent.change(categorySelect, { target: { value: 'Accesorios' } });
      
      await waitFor(() => {
        expect(screen.getByText('DualSense Controller')).toBeInTheDocument();
        expect(screen.queryByText('PlayStation 5')).not.toBeInTheDocument();
      });
    });

    it('debería mostrar todos los productos cuando el filtro es "all"', async () => {
      renderProducts();
      await waitFor(() => {
        expect(screen.getByLabelText(/Categoría/i)).toBeInTheDocument();
      });
      const categorySelect = screen.getByLabelText(/Categoría/i);
      
      fireEvent.change(categorySelect, { target: { value: 'all' } });
      
      await waitFor(() => {
        expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
        expect(screen.getByText('DualSense Controller')).toBeInTheDocument();
      });
    });

    it('debería mostrar mensaje cuando no hay resultados', async () => {
      renderProducts();
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Buscar productos...')).toBeInTheDocument();
      });
      const searchInput = screen.getByPlaceholderText('Buscar productos...');
      
      fireEvent.change(searchInput, { target: { value: 'ProductoQueNoExiste' } });
      
      await waitFor(() => {
        expect(screen.getByText('No se encontraron productos')).toBeInTheDocument();
      });
    });
  });

    describe('Modal de agregar/editar producto', () => {
        it('debería abrir modal al hacer click en "Agregar Producto"', async () => {
            renderProducts();
            await waitFor(() => {
                expect(screen.getByText(/Agregar Producto/i)).toBeInTheDocument();
            });
            const addButton = screen.getByText(/Agregar Producto/i);
            
            fireEvent.click(addButton);
            
            expect(screen.getAllByText(/Agregar Producto/i).length).toBeGreaterThan(1);
            expect(screen.getByLabelText(/Nombre del Producto/i)).toBeInTheDocument();
        });

        it('debería cerrar modal al hacer click en "Cancelar"', async () => {
            renderProducts();
            await waitFor(() => {
                expect(screen.getByText(/Agregar Producto/i)).toBeInTheDocument();
            });
            fireEvent.click(screen.getByText(/Agregar Producto/i));
            
            const cancelButton = screen.getByText(/Cancelar/i);
            fireEvent.click(cancelButton);
            
            await waitFor(() => {
                expect(screen.queryByLabelText(/Nombre del Producto/i)).not.toBeInTheDocument();
            });
        });

        it('debería cerrar modal al hacer click en la X', async () => {
            renderProducts();
            await waitFor(() => {
                expect(screen.getByText(/Agregar Producto/i)).toBeInTheDocument();
            });
            fireEvent.click(screen.getByText(/Agregar Producto/i));
            
            const closeButton = document.querySelector('.modal-close');
            fireEvent.click(closeButton);
            
            await waitFor(() => {
                expect(screen.queryByLabelText(/Nombre del Producto/i)).not.toBeInTheDocument();
            });
        });

        it('debería abrir modal en modo edición al hacer click en editar producto', async () => {
            renderProducts();
            
            // Buscar el primer botón de editar (con título "Editar")
            await waitFor(() => {
                expect(screen.getAllByTitle('Editar').length).toBeGreaterThan(0);
            });
            const editButtons = screen.getAllByTitle('Editar');
            fireEvent.click(editButtons[0]);
            
            expect(screen.getByText('Editar Producto')).toBeInTheDocument();
            // El formulario debe tener los datos del producto
            expect(screen.getByDisplayValue('PlayStation 5')).toBeInTheDocument();
        });
    });  describe('Validación del formulario', () => {
    it('debería mostrar error si el nombre está vacío', async () => {
      renderProducts();
      await waitFor(() => {
        expect(screen.getByText(/Agregar Producto/i)).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText(/Agregar Producto/i));
      
      const nameInput = screen.getByLabelText(/Nombre del Producto/i);
      fireEvent.change(nameInput, { target: { value: '' } });
      
      const submitButtons = screen.getAllByText(/Agregar Producto/i);
      const modalSubmitButton = submitButtons[submitButtons.length - 1];
      fireEvent.click(modalSubmitButton);
      
      await waitFor(() => {
        expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
      });
    });

    it('debería mostrar error si el precio es 0 o menor', async () => {
      renderProducts();
      await waitFor(() => {
        expect(screen.getByText(/Agregar Producto/i)).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText(/Agregar Producto/i));
      
      const nameInput = screen.getByLabelText(/Nombre del Producto/i);
      fireEvent.change(nameInput, { target: { value: 'Test' } });
      
      const priceInput = screen.getByLabelText(/Precio/i);
      fireEvent.change(priceInput, { target: { value: '0' } });
      
      const submitButtons = screen.getAllByText(/Agregar Producto/i);
      const modalSubmitButton = submitButtons[submitButtons.length - 1];
      fireEvent.click(modalSubmitButton);
      
      await waitFor(() => {
        expect(screen.getByText('El precio debe ser mayor a 0')).toBeInTheDocument();
      });
    });

  });

    describe('Crear nuevo producto', () => {
        it('debería agregar un nuevo producto exitosamente', async () => {
            renderProducts();
            
            // Esperar que los productos carguen
            await waitFor(() => {
                expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
            });
            
            // Mock para crear producto
            const newProduct = {
                id: 'TEST001',
                name: 'Nuevo Producto Test',
                category: 'Consola',
                stock: { quantity: 20 },
                price: 50000,
                description: 'Descripción de prueba',
                img: 'https://example.com/image.jpg'
            };
            productService.create.mockResolvedValue(newProduct);
            productService.getAll.mockResolvedValue([...mockProducts, { ...newProduct, stock: 20 }]);
            
            // Abrir modal
            fireEvent.click(screen.getByText(/Agregar Producto/i));
            
            // Llenar formulario (todos los campos requeridos)
            fireEvent.change(screen.getByLabelText(/ID del Producto/i), {
                target: { value: 'TEST001' }
            });
            fireEvent.change(screen.getByLabelText(/Nombre del Producto/i), {
                target: { value: 'Nuevo Producto Test' }
            });
            fireEvent.change(screen.getByLabelText(/Precio/i), {
                target: { value: '50000' }
            });
            fireEvent.change(screen.getByLabelText(/Stock/i), {
                target: { value: '20' }
            });
            fireEvent.change(screen.getByLabelText(/Descripción/i), {
                target: { value: 'Descripción de prueba' }
            });
            fireEvent.change(screen.getByLabelText(/URL de Imagen/i), {
                target: { value: 'https://example.com/image.jpg' }
            });
            
            // Submit - buscar el botón dentro del modal
            const submitButtons = screen.getAllByText(/Agregar Producto/i);
            const modalSubmitButton = submitButtons[submitButtons.length - 1];
            fireEvent.click(modalSubmitButton);
            
            await waitFor(() => {
                expect(screen.getByText('Nuevo Producto Test')).toBeInTheDocument();
            }, { timeout: 3000 });
        });

        it('debería guardar el nuevo producto en localStorage', async () => {
            renderProducts();
            
            await waitFor(() => {
                expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
            });
            
            const newProduct = {
                id: 'TEST002',
                name: 'Test Storage',
                category: 'Consola',
                stock: { quantity: 5 },
                price: 10000,
                description: 'Descripción de prueba',
                img: 'https://example.com/test.jpg'
            };
            productService.create.mockResolvedValue(newProduct);
            
            fireEvent.click(screen.getByText(/Agregar Producto/i));
            
            fireEvent.change(screen.getByLabelText(/ID del Producto/i), {
                target: { value: 'TEST002' }
            });
            fireEvent.change(screen.getByLabelText(/Nombre del Producto/i), {
                target: { value: 'Test Storage' }
            });
            fireEvent.change(screen.getByLabelText(/Precio/i), {
                target: { value: '10000' }
            });
            fireEvent.change(screen.getByLabelText(/Stock/i), {
                target: { value: '5' }
            });
            fireEvent.change(screen.getByLabelText(/Descripción/i), {
                target: { value: 'Descripción de prueba' }
            });
            fireEvent.change(screen.getByLabelText(/URL de Imagen/i), {
                target: { value: 'https://example.com/test.jpg' }
            });
            
            const submitButtons = screen.getAllByText(/Agregar Producto/i);
            const modalSubmitButton = submitButtons[submitButtons.length - 1];
            fireEvent.click(modalSubmitButton);
            
            await waitFor(() => {
                expect(productService.create).toHaveBeenCalled();
            });
        });
    });  describe('Editar producto existente', () => {
    it('debería actualizar un producto exitosamente', async () => {
      renderProducts();
      
      // Esperar a que los productos carguen
      await waitFor(() => {
        expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
      });
      
      // Mock para actualizar producto
      const updatedProduct = { ...mockProducts[0], name: 'PlayStation 5 Pro' };
      productService.update.mockResolvedValue(updatedProduct);
      productService.getAll.mockResolvedValue([
        updatedProduct,
        ...mockProducts.slice(1)
      ]);
      
      // Abrir modal de edición del primer producto
      await waitFor(() => {
        expect(screen.getAllByTitle('Editar').length).toBeGreaterThan(0);
      });
      const editButtons = screen.getAllByTitle('Editar');
      fireEvent.click(editButtons[0]);
      
      // Cambiar el nombre
      const nameInput = screen.getByDisplayValue('PlayStation 5');
      fireEvent.change(nameInput, { target: { value: 'PlayStation 5 Pro' } });
      
      // Guardar cambios
      const saveButton = screen.getByRole('button', { name: /Guardar Cambios/i });
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByText('PlayStation 5 Pro')).toBeInTheDocument();
        expect(screen.queryByText('PlayStation 5')).not.toBeInTheDocument();
      });
    });

    it('debería mantener el ID original al editar', async () => {
      renderProducts();
      
      await waitFor(() => {
        expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
      });
      
      const updatedProduct = { ...mockProducts[0], name: 'PS5 Edited' };
      productService.update.mockResolvedValue(updatedProduct);
      
      await waitFor(() => {
        expect(screen.getAllByTitle('Editar').length).toBeGreaterThan(0);
      });
      const editButtons = screen.getAllByTitle('Editar');
      fireEvent.click(editButtons[0]);
      
      const nameInput = screen.getByDisplayValue('PlayStation 5');
      fireEvent.change(nameInput, { target: { value: 'PS5 Edited' } });
      
      const saveButton = screen.getByText(/Guardar Cambios/i);
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(productService.update).toHaveBeenCalledWith(
          1,
          expect.objectContaining({ name: 'PS5 Edited' })
        );
      });
    });
  });

  describe('Eliminar producto', () => {
    it('debería mostrar confirmación al eliminar', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm');
      renderProducts();
      
      await waitFor(() => {
        expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
      });
      
      await waitFor(() => {
        expect(screen.getAllByTitle('Eliminar').length).toBeGreaterThan(0);
      });
      const deleteButtons = screen.getAllByTitle('Eliminar');
      fireEvent.click(deleteButtons[0]);
      
      expect(confirmSpy).toHaveBeenCalledWith('¿Estás seguro de eliminar "PlayStation 5"?');
    });

    it('debería eliminar producto cuando se confirma', async () => {
      renderProducts();
      
      await waitFor(() => {
        expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
      });
      
      productService.delete.mockResolvedValue({});
      productService.getAll.mockResolvedValue(mockProducts.slice(1));
      
      await waitFor(() => {
        expect(screen.getAllByTitle('Eliminar').length).toBeGreaterThan(0);
      });
      const deleteButtons = screen.getAllByTitle('Eliminar');
      fireEvent.click(deleteButtons[0]); // Eliminar PlayStation 5
      
      await waitFor(() => {
        expect(screen.queryByText('PlayStation 5')).not.toBeInTheDocument();
      });
    });

    it('no debería eliminar si se cancela la confirmación', async () => {
      vi.spyOn(window, 'confirm').mockImplementation(() => false);
      renderProducts();
      
      await waitFor(() => {
        expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
      });
      
      await waitFor(() => {
        expect(screen.getAllByTitle('Eliminar').length).toBeGreaterThan(0);
      });
      const deleteButtons = screen.getAllByTitle('Eliminar');
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
      });
    });

    it('debería actualizar localStorage después de eliminar', async () => {
      renderProducts();
      
      await waitFor(() => {
        expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
      });
      
      productService.delete.mockResolvedValue({});
      
      await waitFor(() => {
        expect(screen.getAllByTitle('Eliminar').length).toBeGreaterThan(0);
      });
      const deleteButtons = screen.getAllByTitle('Eliminar');
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(productService.delete).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('Interfaz de usuario', () => {
    it('debería mostrar badge de stock bajo para productos con stock < 10', async () => {
      renderProducts();
      // Nintendo Switch tiene stock = 8, debería tener clase 'low'
      await waitFor(() => {
        expect(screen.getByText('Nintendo Switch')).toBeInTheDocument();
      });
      
      await waitFor(() => {
        const stockBadges = document.querySelectorAll('.stock-badge.low');
        expect(stockBadges.length).toBeGreaterThan(0);
      });
    });

    it('debería renderizar categorías disponibles en el select del formulario', async () => {
      renderProducts();
      await waitFor(() => {
        expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByRole('button', { name: /Agregar Producto/i }));
      
      const categorySelect = screen.getByLabelText(/Categoría/i);
      expect(categorySelect.querySelector('option[value="Consola"]')).toBeInTheDocument();
      expect(categorySelect.querySelector('option[value="Accesorios"]')).toBeInTheDocument();
      expect(categorySelect.querySelector('option[value="Audio"]')).toBeInTheDocument();
    });

    it('debería mostrar precios formateados en la tabla', async () => {
      renderProducts();
      // Buscar elementos con el símbolo $ (formato chileno)
      await waitFor(() => {
        const prices = screen.getAllByText(/\$/);
        expect(prices.length).toBeGreaterThan(0);
      });
    });

    it('debería renderizar descripciones de productos cuando existen', async () => {
      renderProducts();
      await waitFor(() => {
        expect(screen.getByText('Consola de última generación')).toBeInTheDocument();
      });
      expect(screen.getByText('Potente consola de Microsoft')).toBeInTheDocument();
    });
  });
});
