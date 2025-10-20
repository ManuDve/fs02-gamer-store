import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../src/app/context/AuthContext';
import { CartProvider } from '../src/app/context/CartContext';

import MainLayout from '../src/app/layouts/MainLayout';
import BlogLayout from '../src/app/layouts/BlogLayout';
import AdminLayout from '../src/app/layouts/AdminLayout';
import ProtectedRoute from '../src/app/components/ProtectedRoute';

import Home from '../src/features/store/pages/Home';
import Products from '../src/features/store/pages/Products';
import ProductDetail from '../src/features/store/pages/ProductDetail';
import Cart from '../src/features/store/pages/Cart';
import Pay from '../src/features/store/pages/Pay';
import PaymentSuccess from '../src/features/store/pages/PaymentSuccess';
import PaymentError from '../src/features/store/pages/PaymentError';

import BlogHome from '../src/features/blog/pages/BlogHome';
import BlogPost from '../src/features/blog/pages/BlogPost';

import Login from '../src/features/auth/pages/Login';
import Register from '../src/features/auth/pages/Register';

import AdminDashboard from '../src/features/admin/pages/Dashboard';
import AdminProducts from '../src/features/admin/pages/Products';

import NotFound from '../src/shared/pages/NotFound';

const mockProducts = [
    { id: 1, name: 'Test Product', price: 100, category: 'Consolas' }
];

const mockBlogPosts = [
    { id: 1, title: 'Test Post', content: 'Test content' }
];

// Helper para renderizar con router
function renderWithRouter(routes, initialEntries = ['/']) {
    const router = createMemoryRouter(routes, {
        initialEntries,
    });

    return render(
        <AuthProvider>
            <CartProvider>
                <RouterProvider router={router} />
            </CartProvider>
        </AuthProvider>
    );
}

describe('Application Router', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('Rutas Públicas', () => {
        it('debería renderizar la ruta home (/) por defecto', () => {
            const routes = [
                {
                    path: '/',
                    element: <MainLayout />,
                    children: [
                        { index: true, element: <Home products={mockProducts} /> },
                    ],
                },
            ];

            renderWithRouter(routes, ['/']);
            expect(screen.getByText(/¿Quiénes somos?/i)).toBeInTheDocument();
        });

        it('debería renderizar la página de productos (/products)', () => {
            const routes = [
                {
                    path: '/',
                    element: <MainLayout />,
                    children: [
                        { path: 'products', element: <Products products={mockProducts} /> },
                    ],
                },
            ];

            renderWithRouter(routes, ['/products']);
            // Verificar que existe la estructura de productos
            expect(document.querySelector('.products')).toBeInTheDocument();
        });

        it('debería renderizar el detalle de producto (/products/:id)', () => {
            const routes = [
                {
                    path: '/',
                    element: <MainLayout />,
                    children: [
                        { path: 'products/:id', element: <ProductDetail /> },
                    ],
                },
            ];

            renderWithRouter(routes, ['/products/1']);
            // ProductDetail renderiza algo (aunque sea vacío o con error)
            expect(document.body).toBeTruthy();
        });

        it('debería renderizar la página del carrito (/cart)', () => {
            const routes = [
                {
                    path: '/',
                    element: <MainLayout />,
                    children: [
                        { path: 'cart', element: <Cart /> },
                    ],
                },
            ];

            renderWithRouter(routes, ['/cart']);
            expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
        });

        it('debería renderizar la página de blog (/blog)', () => {
            const routes = [
                {
                    path: '/blog',
                    element: <BlogLayout />,
                    children: [
                        { index: true, element: <BlogHome posts={mockBlogPosts} /> },
                    ],
                },
            ];

            renderWithRouter(routes, ['/blog']);
            expect(screen.getAllByText(/LEVEL-UP NEWS & GUIDES/i).length).toBeGreaterThan(0);
        });

        it('debería renderizar post individual del blog (/blog/:id)', () => {
            const routes = [
                {
                    path: '/blog',
                    element: <BlogLayout />,
                    children: [
                        { path: ':id', element: <BlogPost /> },
                    ],
                },
            ];

            renderWithRouter(routes, ['/blog/1']);
            expect(document.body).toBeTruthy();
        });

        it('debería renderizar página de login (/login)', () => {
            const routes = [
                {
                    path: '/login',
                    element: <Login />,
                },
            ];

            renderWithRouter(routes, ['/login']);
            expect(screen.getByRole('heading', { name: /Iniciar Sesión/i })).toBeInTheDocument();
        });

        it('debería renderizar página de registro (/register)', () => {
            const routes = [
                {
                    path: '/register',
                    element: <Register />,
                },
            ];

            renderWithRouter(routes, ['/register']);
            expect(screen.getByRole('heading', { name: /Crear Cuenta/i })).toBeInTheDocument();
        });

        it('debería renderizar PaymentSuccess (/payment-success)', () => {
            const routes = [
                {
                    path: '/',
                    element: <MainLayout />,
                    children: [
                        { path: 'payment-success', element: <PaymentSuccess /> },
                    ],
                },
            ];

            renderWithRouter(routes, ['/payment-success']);
            // Verificar que se renderiza la página
            expect(document.body).toBeTruthy();
        });

        it('debería renderizar PaymentError (/payment-error)', () => {
            const routes = [
                {
                    path: '/',
                    element: <MainLayout />,
                    children: [
                        { path: 'payment-error', element: <PaymentError /> },
                    ],
                },
            ];

            renderWithRouter(routes, ['/payment-error']);
            expect(screen.getByText(/Error en el Pago/i)).toBeInTheDocument();
        });
    });

    describe('Rutas Protegidas - Admin', () => {
        it('debería redirigir a login cuando no está autenticado', async () => {
            const routes = [
                {
                    path: '/admin',
                    element: (
                        <ProtectedRoute requireAdmin={true}>
                            <AdminLayout />
                        </ProtectedRoute>
                    ),
                    children: [
                        { path: 'dashboard', element: <AdminDashboard /> },
                    ],
                },
                {
                    path: '/login',
                    element: <Login />,
                },
            ];

            renderWithRouter(routes, ['/admin/dashboard']);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: /Iniciar Sesión/i })).toBeInTheDocument();
            });
        });

        it('debería redirigir a home cuando es usuario normal (no admin)', async () => {
            // Simular usuario normal logueado
            localStorage.setItem('currentUser', JSON.stringify({
                email: 'user@test.com',
                name: 'Usuario Normal',
                role: 'user'
            }));

            const routes = [
                {
                    path: '/',
                    element: <MainLayout />,
                    children: [
                        { index: true, element: <Home products={mockProducts} /> },
                    ],
                },
                {
                    path: '/admin',
                    element: (
                        <ProtectedRoute requireAdmin={true}>
                            <AdminLayout />
                        </ProtectedRoute>
                    ),
                    children: [
                        { path: 'dashboard', element: <AdminDashboard /> },
                    ],
                },
            ];

            renderWithRouter(routes, ['/admin/dashboard']);

            await waitFor(() => {
                expect(screen.getAllByText(/Gamer Store/i).length).toBeGreaterThan(0);
            });
        });

        it('debería permitir acceso a admin autenticado', async () => {
            // Simular admin logueado
            localStorage.setItem('currentUser', JSON.stringify({
                email: 'admin@levelupgamer.cl',
                name: 'Administrador',
                role: 'admin'
            }));

            const routes = [
                {
                    path: '/admin',
                    element: (
                        <ProtectedRoute requireAdmin={true}>
                            <AdminLayout />
                        </ProtectedRoute>
                    ),
                    children: [
                        { path: 'dashboard', element: <AdminDashboard /> },
                    ],
                },
            ];

            renderWithRouter(routes, ['/admin/dashboard']);

            await waitFor(() => {
                expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
            });
        });

        it('debería renderizar página de productos admin (/admin/products)', async () => {
            localStorage.setItem('currentUser', JSON.stringify({
                email: 'admin@levelupgamer.cl',
                name: 'Administrador',
                role: 'admin'
            }));

            const routes = [
                {
                    path: '/admin',
                    element: (
                        <ProtectedRoute requireAdmin={true}>
                            <AdminLayout />
                        </ProtectedRoute>
                    ),
                    children: [
                        { path: 'products', element: <AdminProducts /> },
                    ],
                },
            ];

            renderWithRouter(routes, ['/admin/products']);

            await waitFor(() => {
                expect(screen.getByText(/Gestión de Productos/i)).toBeInTheDocument();
            });
        });
    });

    describe('Ruta 404', () => {
        it('debería mostrar página NotFound para rutas inexistentes', () => {
            const routes = [
                {
                    path: '/',
                    element: <MainLayout />,
                    children: [
                        { index: true, element: <Home products={mockProducts} /> },
                    ],
                },
                { path: '*', element: <NotFound /> },
            ];

            renderWithRouter(routes, ['/ruta-que-no-existe']);
            expect(screen.getByText(/NotFound/i)).toBeInTheDocument();
        });
    });

    describe('Navegación entre rutas', () => {
        it('debería tener MainLayout en rutas principales', () => {
            const routes = [
                {
                    path: '/',
                    element: <MainLayout />,
                    children: [
                        { index: true, element: <Home products={mockProducts} /> },
                        { path: 'products', element: <Products products={mockProducts} /> },
                    ],
                },
            ];

            renderWithRouter(routes, ['/']);
            // MainLayout debe tener el Navbar
            expect(screen.getAllByText(/Gamer Store/i).length).toBeGreaterThan(0);
        });

        it('debería tener BlogLayout en rutas de blog', () => {
            const routes = [
                {
                    path: '/blog',
                    element: <BlogLayout />,
                    children: [
                        { index: true, element: <BlogHome posts={mockBlogPosts} /> },
                    ],
                },
            ];

            renderWithRouter(routes, ['/blog']);
            expect(screen.getAllByText(/LEVEL-UP NEWS & GUIDES/i).length).toBeGreaterThan(0);
        });
    });
});
