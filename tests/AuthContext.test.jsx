import React, { useContext } from 'react';
import { renderWithProviders, screen, fireEvent, waitFor } from './test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider, AuthContext } from '../src/app/context/AuthContext.jsx';

// Componente helper para probar el contexto
function TestComponent() {
    const { user, login, logout, register } = useContext(AuthContext);

    return (
        <div>
            <div data-testid="user-status">{user ? user.name : 'Not logged in'}</div>
            <button onClick={() => login('admin@levelupgamer.cl', 'admin123')}>
                Login
            </button>
            <button onClick={() => register({ 
                name: 'Test User', 
                email: 'test@example.com',
                password: 'Test123',
                phone: '123456789'
            })}>
                Register
            </button>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

describe('AuthContext', () => {
    beforeEach(() => {
        // Limpiar localStorage antes de cada test
        localStorage.clear();
    });

    it('proporciona el estado inicial (usuario no autenticado)', () => {
        renderWithProviders(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>,
            { withCart: false, withRouter: false }
        );

        expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    });

    it('debería actualizar el estado de usuario al hacer login', async () => {
        renderWithProviders(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>,
            { withCart: false, withRouter: false }
        );

        const loginBtn = screen.getByRole('button', { name: /login/i });
        fireEvent.click(loginBtn);

        await waitFor(() => {
            expect(screen.getByTestId('user-status')).toHaveTextContent('Administrador');
        });
    });

    it('permite login y logout', async () => {
        renderWithProviders(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>,
            { withCart: false, withRouter: false }
        );

        // Primero hacer login
        const loginBtn = screen.getByRole('button', { name: /login/i });
        fireEvent.click(loginBtn);
        await waitFor(() => {
            expect(screen.getByTestId('user-status')).toHaveTextContent('Administrador');
        });

        // Luego hacer logout
        const logoutBtn = screen.getByRole('button', { name: /logout/i });
        fireEvent.click(logoutBtn);
        expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    });
});
