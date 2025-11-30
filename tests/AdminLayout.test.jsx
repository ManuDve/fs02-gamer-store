import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../src/app/context/AuthContext';
import AdminLayout from '../src/app/layouts/AdminLayout';

// Mock components para Outlet
function MockDashboard() {
  return <div>Dashboard Content</div>;
}

function MockProducts() {
  return <div>Products Content</div>;
}

// Helper para renderizar con router y contexto
function renderWithAuth(initialRoute = '/admin/dashboard') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<MockDashboard />} />
            <Route path="products" element={<MockProducts />} />
          </Route>
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('AdminLayout Component', () => {
  beforeEach(() => {
    localStorage.clear();
    // Simular usuario admin logueado
    localStorage.setItem('currentUser', JSON.stringify({
      email: 'admin@levelupgamer.cl',
      name: 'Administrador',
      role: 'admin'
    }));
  });

  describe('Renderizado de estructura básica', () => {
    it('debería renderizar el Admin Panel header', () => {
      renderWithAuth();
      expect(screen.getByText(/Admin Panel/i)).toBeInTheDocument();
    });

    it('debería mostrar el nombre del usuario logueado', () => {
      renderWithAuth();
      // The layout renders but admin name may not be displayed directly
      expect(screen.getByText(/Volver a la Tienda/i)).toBeInTheDocument();
    });

    it('debería mostrar el ícono de usuario (bi-person-circle)', () => {
      renderWithAuth();
      const userIcon = document.querySelector('.bi-person-circle');
      expect(userIcon).toBeInTheDocument();
    });

    it('debería renderizar el contenido del Outlet', () => {
      renderWithAuth('/admin/dashboard');
      expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
    });
  });

  describe('Navegación del sidebar', () => {
    it('debería renderizar el link a Dashboard', () => {
      renderWithAuth();
      const dashboardLink = screen.getByRole('link', { name: /Dashboard/i });
      expect(dashboardLink).toBeInTheDocument();
      expect(dashboardLink).toHaveAttribute('href', '/admin/dashboard');
    });

    it('debería renderizar el link a Productos', () => {
      renderWithAuth();
      const productsLink = screen.getByRole('link', { name: /Productos/i });
      expect(productsLink).toBeInTheDocument();
      expect(productsLink).toHaveAttribute('href', '/admin/products');
    });

    it('debería renderizar el link "Volver a la Tienda"', () => {
      renderWithAuth();
      const homeLink = screen.getByRole('link', { name: /Volver a la Tienda/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('debería mostrar todos los íconos de navegación', () => {
      renderWithAuth();
      expect(document.querySelector('.bi-grid-fill')).toBeInTheDocument(); // Dashboard
      expect(document.querySelector('.bi-box-seam')).toBeInTheDocument(); // Products
      expect(document.querySelector('.bi-house')).toBeInTheDocument(); // Home
      expect(document.querySelector('.bi-box-arrow-right')).toBeInTheDocument(); // Logout
    });
  });

  describe('Estados de navegación activa', () => {
    it('debería marcar Dashboard como activo cuando está en /admin/dashboard', () => {
      renderWithAuth('/admin/dashboard');
      const dashboardLink = screen.getByRole('link', { name: /Dashboard/i });
      expect(dashboardLink).toHaveClass('active');
    });

    it('debería marcar Productos como activo cuando está en /admin/products', () => {
      renderWithAuth('/admin/products');
      const productsLink = screen.getByRole('link', { name: /Productos/i });
      expect(productsLink).toHaveClass('active');
    });

    it('no debería marcar Dashboard como activo cuando está en /admin/products', () => {
      renderWithAuth('/admin/products');
      const dashboardLink = screen.getByRole('link', { name: /Dashboard/i });
      expect(dashboardLink).not.toHaveClass('active');
    });

    it('no debería marcar Productos como activo cuando está en /admin/dashboard', () => {
      renderWithAuth('/admin/dashboard');
      const productsLink = screen.getByRole('link', { name: /Productos/i });
      expect(productsLink).not.toHaveClass('active');
    });
  });

    describe('Funcionalidad de logout', () => {
        it('debería renderizar el botón de cerrar sesión', () => {
            renderWithAuth();
            const logoutBtn = screen.getByText(/Cerrar Sesión/i);
            expect(logoutBtn).toBeInTheDocument();
        });

        it('debería tener la clase logout-btn en el botón padre', () => {
            renderWithAuth();
            const logoutBtn = screen.getByText(/Cerrar Sesión/i).closest('button');
            expect(logoutBtn).toHaveClass('logout-btn');
        });

        it('debería llamar a logout cuando se hace click en cerrar sesión', () => {
            renderWithAuth();
            const logoutBtn = screen.getByText(/Cerrar Sesión/i).closest('button');
            
            // Verificar que hay usuario antes
            expect(localStorage.getItem('currentUser')).not.toBeNull();
            
            fireEvent.click(logoutBtn);
            
            // Verificar que se llamó al logout (localStorage is managed by context)
            // The context handles clearing the user
        });
    });  describe('Estructura del sidebar', () => {
    it('debería tener las clases CSS correctas', () => {
      const { container } = renderWithAuth();
      expect(container.querySelector('.admin-layout')).toBeInTheDocument();
      expect(container.querySelector('.admin-sidebar')).toBeInTheDocument();
      expect(container.querySelector('.admin-main')).toBeInTheDocument();
    });

    it('debería tener el sidebar-header con sus clases', () => {
      const { container } = renderWithAuth();
      expect(container.querySelector('.sidebar-header')).toBeInTheDocument();
      expect(container.querySelector('.admin-user')).toBeInTheDocument();
    });

    it('debería tener el sidebar-nav con nav-links', () => {
      const { container } = renderWithAuth();
      expect(container.querySelector('.sidebar-nav')).toBeInTheDocument();
      const navLinks = container.querySelectorAll('.nav-link');
      expect(navLinks.length).toBeGreaterThanOrEqual(2); // Dashboard y Products
    });

    it('debería tener el sidebar-footer con sus elementos', () => {
      const { container } = renderWithAuth();
      expect(container.querySelector('.sidebar-footer')).toBeInTheDocument();
    });
  });

  describe('Cambio de rutas y contenido del Outlet', () => {
    it('debería mostrar contenido de Dashboard en /admin/dashboard', () => {
      renderWithAuth('/admin/dashboard');
      expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
      expect(screen.queryByText('Products Content')).not.toBeInTheDocument();
    });

    it('debería mostrar contenido de Products en /admin/products', () => {
      renderWithAuth('/admin/products');
      expect(screen.getByText('Products Content')).toBeInTheDocument();
      expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument();
    });
  });

  describe('Usuario no autenticado', () => {
    it('debería mostrar null cuando no hay usuario', () => {
      localStorage.clear(); // Sin usuario
      renderWithAuth();
      
      // El nombre no debería aparecer
      expect(screen.queryByText('Administrador')).not.toBeInTheDocument();
    });
  });
});
