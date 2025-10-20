import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Products from "../../src/features/admin/pages/Products";

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
    // Mock window.confirm
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Renderizado inicial', () => {
    it('debería renderizar el título "Gestión de Productos"', () => {
      renderProducts();
      expect(screen.getByText(/Gestión de Productos/i)).toBeInTheDocument();
    });

    it('debería renderizar el botón "Agregar Producto"', () => {
      renderProducts();
      expect(screen.getByRole('button', { name: /Agregar Producto/i })).toBeInTheDocument();
    });

    it('debería cargar productos iniciales cuando no hay datos en localStorage', () => {
      renderProducts();
      expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
      expect(screen.getByText('Xbox Series X')).toBeInTheDocument();
      expect(screen.getByText('Nintendo Switch')).toBeInTheDocument();
    });

    it('debería cargar productos desde localStorage si existen', () => {
      const customProducts = [
        { id: 99, name: 'Custom Product', category: 'Consolas', stock: 10, price: 100000, description: 'Test', img: '' }
      ];
      localStorage.setItem('adminProducts', JSON.stringify(customProducts));
      
      renderProducts();
      expect(screen.getByText('Custom Product')).toBeInTheDocument();
    });
  });

  describe('Estadísticas', () => {
    it('debería mostrar el total de productos', () => {
      renderProducts();
      expect(screen.getByText('Total Productos')).toBeInTheDocument();
      // 5 productos iniciales - buscar en la tarjeta de estadísticas
      const statCards = document.querySelectorAll('.stat-card');
      const totalProductosCard = Array.from(statCards).find(card => card.textContent.includes('Total Productos'));
      expect(totalProductosCard).toBeTruthy();
      expect(totalProductosCard.textContent).toContain('5');
    });

    it('debería mostrar productos con stock bajo (<10)', () => {
      renderProducts();
      expect(screen.getByText('Stock Bajo')).toBeInTheDocument();
      // 2 productos con stock < 10 (Switch=8, Chair=3)
      // Buscar en la tarjeta de estadísticas que contiene "Stock Bajo"
      const statCards = document.querySelectorAll('.stat-card');
      const stockBajoCard = Array.from(statCards).find(card => card.textContent.includes('Stock Bajo'));
      expect(stockBajoCard).toBeTruthy();
      expect(stockBajoCard.textContent).toContain('2');
    });

    it('debería mostrar el valor total del inventario', () => {
      renderProducts();
      // Buscar "Valor Total" en las estadísticas
      const allValorTotal = screen.getAllByText('Valor Total');
      expect(allValorTotal.length).toBeGreaterThan(0);
      // Debe haber un valor formateado en CLP
      const statValues = screen.getAllByText(/\$/);
      expect(statValues.length).toBeGreaterThan(0);
    });
  });

  describe('Filtros y búsqueda', () => {
    it('debería filtrar productos por nombre al buscar', async () => {
      renderProducts();
      const searchInput = screen.getByPlaceholderText('Buscar productos...');
      
      fireEvent.change(searchInput, { target: { value: 'PlayStation' } });
      
      await waitFor(() => {
        expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
        expect(screen.queryByText('Xbox Series X')).not.toBeInTheDocument();
      });
    });

    it('debería filtrar productos por categoría', async () => {
      renderProducts();
      const categorySelect = screen.getByLabelText(/Categoría/i);
      
      fireEvent.change(categorySelect, { target: { value: 'Accesorios' } });
      
      await waitFor(() => {
        expect(screen.getByText('DualSense Controller')).toBeInTheDocument();
        expect(screen.queryByText('PlayStation 5')).not.toBeInTheDocument();
      });
    });

    it('debería mostrar todos los productos cuando el filtro es "all"', () => {
      renderProducts();
      const categorySelect = screen.getByLabelText(/Categoría/i);
      
      fireEvent.change(categorySelect, { target: { value: 'all' } });
      
      expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
      expect(screen.getByText('DualSense Controller')).toBeInTheDocument();
    });

    it('debería mostrar mensaje cuando no hay resultados', async () => {
      renderProducts();
      const searchInput = screen.getByPlaceholderText('Buscar productos...');
      
      fireEvent.change(searchInput, { target: { value: 'ProductoQueNoExiste' } });
      
      await waitFor(() => {
        expect(screen.getByText('No se encontraron productos')).toBeInTheDocument();
      });
    });
  });

    describe('Modal de agregar/editar producto', () => {
        it('debería abrir modal al hacer click en "Agregar Producto"', () => {
            renderProducts();
            const addButton = screen.getByText(/Agregar Producto/i);
            
            fireEvent.click(addButton);
            
            expect(screen.getAllByText(/Agregar Producto/i).length).toBeGreaterThan(1);
            expect(screen.getByLabelText(/Nombre del Producto/i)).toBeInTheDocument();
        });

        it('debería cerrar modal al hacer click en "Cancelar"', async () => {
            renderProducts();
            fireEvent.click(screen.getByText(/Agregar Producto/i));
            
            const cancelButton = screen.getByText(/Cancelar/i);
            fireEvent.click(cancelButton);
            
            await waitFor(() => {
                expect(screen.queryByLabelText(/Nombre del Producto/i)).not.toBeInTheDocument();
            });
        });

        it('debería cerrar modal al hacer click en la X', async () => {
            renderProducts();
            fireEvent.click(screen.getByText(/Agregar Producto/i));
            
            const closeButton = document.querySelector('.modal-close');
            fireEvent.click(closeButton);
            
            await waitFor(() => {
                expect(screen.queryByLabelText(/Nombre del Producto/i)).not.toBeInTheDocument();
            });
        });

        it('debería abrir modal en modo edición al hacer click en editar producto', () => {
            renderProducts();
            
            // Buscar el primer botón de editar (con título "Editar")
            const editButtons = screen.getAllByTitle('Editar');
            fireEvent.click(editButtons[0]);
            
            expect(screen.getByText('Editar Producto')).toBeInTheDocument();
            // El formulario debe tener los datos del producto
            expect(screen.getByDisplayValue('PlayStation 5')).toBeInTheDocument();
        });
    });  describe('Validación del formulario', () => {
    it('debería mostrar error si el nombre está vacío', async () => {
      renderProducts();
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
            
            // Abrir modal
            fireEvent.click(screen.getByText(/Agregar Producto/i));
            
            // Llenar formulario
            fireEvent.change(screen.getByLabelText(/Nombre del Producto/i), {
                target: { value: 'Nuevo Producto Test' }
            });
            fireEvent.change(screen.getByLabelText(/Precio/i), {
                target: { value: '50000' }
            });
            fireEvent.change(screen.getByLabelText(/Stock/i), {
                target: { value: '20' }
            });
            
            // Submit - buscar el botón dentro del modal
            const submitButtons = screen.getAllByText(/Agregar Producto/i);
            const modalSubmitButton = submitButtons[submitButtons.length - 1];
            fireEvent.click(modalSubmitButton);
            
            await waitFor(() => {
                expect(screen.getByText('Nuevo Producto Test')).toBeInTheDocument();
            });
        });

        it('debería guardar el nuevo producto en localStorage', async () => {
            renderProducts();
            
            fireEvent.click(screen.getByText(/Agregar Producto/i));
            
            fireEvent.change(screen.getByLabelText(/Nombre del Producto/i), {
                target: { value: 'Test Storage' }
            });
            fireEvent.change(screen.getByLabelText(/Precio/i), {
                target: { value: '10000' }
            });
            fireEvent.change(screen.getByLabelText(/Stock/i), {
                target: { value: '5' }
            });
            
            const submitButtons = screen.getAllByText(/Agregar Producto/i);
            const modalSubmitButton = submitButtons[submitButtons.length - 1];
            fireEvent.click(modalSubmitButton);
            
            await waitFor(() => {
                const stored = JSON.parse(localStorage.getItem('adminProducts'));
                expect(stored.some(p => p.name === 'Test Storage')).toBe(true);
            });
        });
    });  describe('Editar producto existente', () => {
    it('debería actualizar un producto exitosamente', async () => {
      renderProducts();
      
      // Abrir modal de edición del primer producto
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
      
      const editButtons = screen.getAllByTitle('Editar');
      fireEvent.click(editButtons[0]);
      
      const nameInput = screen.getByDisplayValue('PlayStation 5');
      fireEvent.change(nameInput, { target: { value: 'PS5 Edited' } });
      
      const saveButton = screen.getByText(/Guardar Cambios/i);
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        const stored = JSON.parse(localStorage.getItem('adminProducts'));
        const editedProduct = stored.find(p => p.name === 'PS5 Edited');
        expect(editedProduct.id).toBe(1); // ID original
      });
    });
  });

  describe('Eliminar producto', () => {
    it('debería mostrar confirmación al eliminar', () => {
      const confirmSpy = vi.spyOn(window, 'confirm');
      renderProducts();
      
      const deleteButtons = screen.getAllByTitle('Eliminar');
      fireEvent.click(deleteButtons[0]);
      
      expect(confirmSpy).toHaveBeenCalledWith('¿Estás seguro de eliminar este producto?');
    });

    it('debería eliminar producto cuando se confirma', async () => {
      renderProducts();
      
      const deleteButtons = screen.getAllByTitle('Eliminar');
      fireEvent.click(deleteButtons[0]); // Eliminar PlayStation 5
      
      await waitFor(() => {
        expect(screen.queryByText('PlayStation 5')).not.toBeInTheDocument();
      });
    });

    it('no debería eliminar si se cancela la confirmación', async () => {
      vi.spyOn(window, 'confirm').mockImplementation(() => false);
      renderProducts();
      
      const deleteButtons = screen.getAllByTitle('Eliminar');
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
      });
    });

    it('debería actualizar localStorage después de eliminar', async () => {
      renderProducts();
      
      const deleteButtons = screen.getAllByTitle('Eliminar');
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        const stored = JSON.parse(localStorage.getItem('adminProducts'));
        expect(stored.find(p => p.id === 1)).toBeUndefined();
      });
    });
  });

  describe('Interfaz de usuario', () => {
    it('debería mostrar badge de stock bajo para productos con stock < 10', () => {
      renderProducts();
      // Nintendo Switch tiene stock = 8, debería tener clase 'low'
      const stockBadges = document.querySelectorAll('.stock-badge.low');
      expect(stockBadges.length).toBeGreaterThan(0);
    });

    it('debería renderizar categorías disponibles en el select del formulario', () => {
      renderProducts();
      fireEvent.click(screen.getByRole('button', { name: /Agregar Producto/i }));
      
      const categorySelect = screen.getByLabelText(/Categoría/i);
      expect(categorySelect.querySelector('option[value="Consolas"]')).toBeInTheDocument();
      expect(categorySelect.querySelector('option[value="Accesorios"]')).toBeInTheDocument();
      expect(categorySelect.querySelector('option[value="Muebles"]')).toBeInTheDocument();
    });

    it('debería mostrar precios formateados en la tabla', () => {
      renderProducts();
      // Buscar elementos con el símbolo $ (formato chileno)
      const prices = screen.getAllByText(/\$/);
      expect(prices.length).toBeGreaterThan(0);
    });

    it('debería renderizar descripciones de productos cuando existen', () => {
      renderProducts();
      expect(screen.getByText('Consola de última generación')).toBeInTheDocument();
      expect(screen.getByText('Potente consola de Microsoft')).toBeInTheDocument();
    });
  });
});
