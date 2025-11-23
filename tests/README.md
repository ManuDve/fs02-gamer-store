# Tests - Guía de Uso

Este directorio contiene todas las pruebas del proyecto usando **Vitest** y **React Testing Library**.

## Archivos Principales

### `setup.js`

Configuración global de tests que se ejecuta antes de todas las pruebas:

- ✅ Importa `@testing-library/jest-dom` para matchers extendidos (toBeInTheDocument, etc.)
- ✅ Limpia el DOM después de cada test (`cleanup()`)
- ✅ **Limpia localStorage antes de cada test** para aislar el estado entre pruebas

### `test-utils.jsx`

Utilidades compartidas para facilitar la escritura de tests:

#### `renderWithProviders(ui, options)`

Helper que renderiza componentes con los wrappers habituales configurados automáticamente.

**Parámetros:**

- `ui`: Componente de React a renderizar
- `options` (opcional):
  - `initialEntries`: Array de rutas iniciales para `MemoryRouter` (default: `['/']`)
  - `withCart`: Incluir `CartProvider` (default: `true`)
  - `withRouter`: Incluir `MemoryRouter` (default: `true`)
  - Cualquier otra opción de `render` de Testing Library

**Ejemplo básico:**

```jsx
import { renderWithProviders, screen } from './test-utils';

test('renders component', () => {
  renderWithProviders(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

**Ejemplo con rutas:**

```jsx
import { renderWithProviders, screen } from './test-utils';
import { Route, Routes } from 'react-router-dom';

test('renders product detail page', () => {
  renderWithProviders(
    <Routes>
      <Route path="/products/:id" element={<ProductDetail />} />
    </Routes>,
    { initialEntries: ['/products/123'] }
  );
  
  expect(screen.getByRole('heading')).toBeInTheDocument();
});
```

**Ejemplo sin providers específicos:**

```jsx
// Sin CartProvider (componente que no usa el carrito)
renderWithProviders(<BlogHome />, { withCart: false });

// Sin ningún provider (componente simple)
renderWithProviders(<Button />, { withCart: false, withRouter: false });
```

## Estructura de Tests

Cada archivo de test sigue esta estructura:

```jsx
import { renderWithProviders, screen, fireEvent } from './test-utils';
import { describe, it, expect } from 'vitest';
import MyComponent from '../src/path/to/MyComponent';

describe('MyComponent', () => {
  it('does something', () => {
    renderWithProviders(<MyComponent />);
    
    // Assertions...
    expect(screen.getByText('Something')).toBeInTheDocument();
  });
});
```

## Ejecutar Tests

```bash
# Ejecutar todos los tests en modo watch
npm test

# Ejecutar tests una vez
npm run test:run

# Ver cobertura
npm run test:coverage
```

## Buenas Prácticas

1. **Usa queries por rol cuando sea posible:**

   ```jsx
   screen.getByRole('button', { name: /submit/i })
   screen.getByRole('heading', { level: 1 })
   ```

2. **Usa `renderWithProviders` en lugar de `render`** para evitar repetir código de wrappers.

3. **Limpia mocks después de cada test:**

   ```jsx
   import { vi } from 'vitest';
   
   afterEach(() => {
     vi.clearAllMocks();
   });
   ```

4. **El localStorage se limpia automáticamente** entre tests gracias a `setup.js`.

5. **Prefiere queries que los usuarios usarían:**
   - ✅ `getByRole`, `getByLabelText`, `getByPlaceholderText`
   - ⚠️ `getByTestId` (solo cuando no hay alternativa)
   - ❌ `container.querySelector` (evitar)

## Coverage

El proyecto está configurado para generar reportes de cobertura. Los archivos de cobertura se encuentran en la carpeta `coverage/`.

Para ver el reporte HTML:

1. Ejecuta `npm run test:coverage`
2. Abre `coverage/index.html` en tu navegador
