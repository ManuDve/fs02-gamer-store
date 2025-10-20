# 🧪 Recomendaciones de Testing para Gamer Store

## 📊 Estado Actual

✅ **194 tests pasando** en 37 archivos
📈 **Cobertura Global: 55.17%**

---

## 🎯 Áreas Críticas sin Cobertura (0%)

### 1. **Router y Navegación Principal** ⚠️ CRÍTICO

**Archivos:**

- `src/app/router.jsx` (0% cobertura)
- `src/app/main.jsx` (0% cobertura)
- `src/app/App.jsx` (0% cobertura)

**¿Por qué es importante?**

- Es el punto de entrada de la aplicación
- Gestiona todas las rutas y navegación
- Define las rutas protegidas (admin)

**Tests recomendados:**

```javascript
// tests/Router.test.jsx
describe('Application Router', () => {
  it('debería renderizar la ruta home por defecto', () => {
    // Test que / muestra el componente Home
  });

  it('debería proteger rutas de admin', () => {
    // Test que /admin/dashboard redirige si no es admin
  });

  it('debería permitir acceso a admin autenticado', () => {
    // Test que admin puede acceder a /admin/dashboard
  });

  it('debería mostrar 404 para rutas inexistentes', () => {
    // Test de página no encontrada
  });
});
```

---

### 2. **Layouts** 📐

**Archivos:**

- `src/app/layouts/AdminLayout.jsx` (0% cobertura)
- `src/app/layouts/AuthLayout.jsx` (0% cobertura)
- `src/app/layouts/BlogLayout.jsx` (0% cobertura)
- `src/app/layouts/MainLayout.jsx` (0% cobertura)

**Tests recomendados:**

```javascript
// tests/AdminLayout.test.jsx
describe('AdminLayout', () => {
  it('debería mostrar sidebar con navegación', () => {});
  it('debería resaltar enlace activo', () => {});
  it('debería mostrar info del usuario admin', () => {});
  it('debería tener botón de logout', () => {});
  it('debería renderizar children en el Outlet', () => {});
});
```

---

### 3. **Dashboard Admin Completo** 📊 CRÍTICO

**Archivos sin cobertura:**

- `DashboardFilters.jsx` (0%)
- `DashboardHeader.jsx` (0%)
- `DashboardTabs.jsx` (0%)
- `InventoryTab.jsx` (0%)
- `OrdersTab.jsx` (0%)
- `OverviewTab.jsx` (0%)
- `ReportsTab.jsx` (0%)
- `StatCard.jsx` (0%)
- `UsersTab.jsx` (0%)
- `useDashboardData.js` (0%)
- `useDashboardFilters.js` (0%)

**¿Por qué es crítico?**

- Funcionalidad core del panel admin
- Maneja datos sensibles (usuarios, órdenes)
- Filtros complejos

**Tests prioritarios:**

```javascript
// tests/admin/Dashboard.test.jsx
describe('Dashboard Admin', () => {
  describe('Filtros', () => {
    it('debería filtrar por fecha', () => {});
    it('debería buscar por término', () => {});
    it('debería combinar filtros', () => {});
  });

  describe('Tabs', () => {
    it('debería cambiar entre tabs', () => {});
    it('debería mantener estado de filtros al cambiar tabs', () => {});
  });

  describe('Datos', () => {
    it('debería cargar estadísticas correctamente', () => {});
    it('debería actualizar contadores en tiempo real', () => {});
  });
});
```

---

### 4. **Página de Productos Admin** 🛠️

**Archivo:**

- `src/features/admin/pages/Products.jsx` (0% cobertura)

**Tests recomendados:**

```javascript
// tests/admin/Products.test.jsx
describe('Admin Products Page', () => {
  it('debería listar todos los productos', () => {});
  it('debería filtrar por categoría', () => {});
  it('debería buscar productos', () => {});
  
  describe('CRUD Operations', () => {
    it('debería abrir modal para agregar producto', () => {});
    it('debería validar formulario de producto', () => {});
    it('debería guardar nuevo producto', () => {});
    it('debería editar producto existente', () => {});
    it('debería eliminar producto con confirmación', () => {});
  });

  describe('Stock Management', () => {
    it('debería mostrar indicador de stock bajo', () => {});
    it('debería calcular valor total del inventario', () => {});
  });
});
```

---

### 5. **Utilidades Compartidas** 🔧

**Archivo:**

- `src/shared/utils/formatPrice.js` (0% cobertura)

**Tests recomendados:**

```javascript
// tests/utils/formatPrice.test.js
describe('formatPrice utility', () => {
  it('debería formatear precio en CLP', () => {
    expect(formatPrice(1000)).toBe('$1.000');
  });

  it('debería manejar decimales', () => {
    expect(formatPrice(1500.50)).toBe('$1.500,50');
  });

  it('debería manejar números negativos', () => {
    expect(formatPrice(-100)).toBe('-$100');
  });

  it('debería manejar cero', () => {
    expect(formatPrice(0)).toBe('$0');
  });
});
```

---

## 🟡 Áreas con Cobertura Parcial

### 1. **Página Pay (35.71%)** 💳

**Problemas actuales:**

- Solo se testea el redirect cuando no hay items
- No se testean los formularios
- No se testea el flujo completo de pago

**Tests faltantes:**

```javascript
describe('Pay Page - Complete Flow', () => {
  it('debería renderizar todos los formularios con items', () => {});
  it('debería validar información personal', () => {});
  it('debería validar dirección de envío', () => {});
  it('debería validar información de pago', () => {});
  it('debería mostrar resumen de orden', () => {});
  it('debería procesar pago exitosamente', () => {});
  it('debería manejar error de pago', () => {});
  it('debería limpiar carrito después de pago exitoso', () => {});
});
```

### 2. **Navbar (54.79%)** 🧭

**Tests faltantes:**

```javascript
describe('Navbar - Auth States', () => {
  it('debería mostrar Login/Register cuando no autenticado', () => {});
  it('debería mostrar dropdown de usuario cuando autenticado', () => {});
  it('debería mostrar link Dashboard solo para admins', () => {});
  it('debería ejecutar logout correctamente', () => {});
  it('debería cerrar dropdown al hacer logout', () => {});
});
```

---

## 🟢 Áreas con Buena Cobertura (mantener)

✅ **AuthContext** (86.74%) - Bien cubierto
✅ **Componentes de formularios de pago** (100%) - Excelente
✅ **Hooks personalizados** (100%) - Perfecto
✅ **Componentes de Blog** (87-100%) - Muy bien

---

## 📋 Plan de Acción Priorizado

### **Fase 1: Crítico (Semana 1)** 🔴

1. ✅ Tests para `Router.jsx` (rutas principales)
2. ✅ Tests para `AdminLayout.jsx` (navegación admin)
3. ✅ Tests para página `Products.jsx` (CRUD completo)
4. ✅ Tests para utilidad `formatPrice.js`

### **Fase 2: Alta Prioridad (Semana 2)** 🟠

1. ✅ Tests para Dashboard completo (todos los tabs)
2. ✅ Tests para hooks del Dashboard
3. ✅ Tests completos para página `Pay.jsx`
4. ✅ Tests de integración Router + Auth

### **Fase 3: Mejoras (Semana 3)** 🟡

1. ✅ Tests para todos los Layouts
2. ✅ Completar tests de Navbar (estados auth)
3. ✅ Tests E2E con Playwright/Cypress
4. ✅ Tests de accesibilidad

---

## 🎨 Mejores Prácticas Implementadas

### ✅ Lo que estás haciendo bien

1. **Tests organizados por feature** - Excelente estructura
2. **Uso de test-utils** - Buen patrón de reutilización
3. **Tests de integración** - CartIntegration es un gran ejemplo
4. **Limpieza de localStorage** - Previene interferencias

### 🚀 Sugerencias de mejora

#### 1. **Agregar tests de snapshot para UI**

```javascript
// Útil para detectar cambios visuales no intencionales
it('debería coincidir con snapshot', () => {
  const { container } = renderWithProviders(<MyComponent />);
  expect(container).toMatchSnapshot();
});
```

#### 2. **Tests de accesibilidad**

```javascript
import { axe } from 'jest-axe';

it('debería no tener violaciones de accesibilidad', async () => {
  const { container } = renderWithProviders(<Login />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

#### 3. **Tests de performance**

```javascript
it('debería renderizar Dashboard en menos de 500ms', async () => {
  const start = performance.now();
  renderWithProviders(<Dashboard />);
  const end = performance.now();
  expect(end - start).toBeLessThan(500);
});
```

#### 4. **Tests de errores de consola**

```javascript
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  expect(console.error).not.toHaveBeenCalled();
  console.error.mockRestore();
});
```

#### 5. **Mocking más realista de APIs**

```javascript
// Simular latencia de red
vi.mock('./api', () => ({
  fetchProducts: vi.fn(() => 
    new Promise(resolve => 
      setTimeout(() => resolve(mockProducts), 100)
    )
  )
}));
```

#### 6. **Tests de casos extremos**

```javascript
describe('Edge Cases', () => {
  it('debería manejar array vacío', () => {});
  it('debería manejar string muy largo', () => {});
  it('debería manejar caracteres especiales', () => {});
  it('debería manejar valores null/undefined', () => {});
  it('debería manejar números muy grandes', () => {});
});
```

---

## 📊 Configuración de Cobertura Recomendada

Actualiza `vite.config.js`:

```javascript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.test.{js,jsx}',
        '**/*.config.js',
        '**/mocks/**',
      ],
      thresholds: {
        lines: 70,      // Objetivo: 70% líneas
        functions: 70,  // Objetivo: 70% funciones
        branches: 60,   // Objetivo: 60% branches
        statements: 70  // Objetivo: 70% statements
      }
    }
  }
});
```

---

## 🔄 Comandos Útiles

```bash
# Ejecutar tests con cobertura
npm test -- --coverage

# Tests en modo watch
npm test

# Tests solo de un archivo
npm test Products.test.jsx

# Tests con UI interactiva
npm test -- --ui

# Generar reporte HTML de cobertura
npm test -- --coverage --reporter=html
```

---

## 📚 Recursos Adicionales

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
- [React Testing Patterns](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Test Coverage Analysis](https://istanbul.js.org/)

---

## ✅ Checklist de Calidad

### Antes de hacer commit

- [ ] Todos los tests pasan
- [ ] Cobertura > 70% en archivos modificados
- [ ] No hay console.error/warning en tests
- [ ] Tests son legibles y bien nombrados
- [ ] Tests no dependen del orden de ejecución
- [ ] Mock data es realista
- [ ] Se testean casos felices y errores
- [ ] Tests son rápidos (< 5s total)

---

## 🎯 Meta de Cobertura

**Objetivo a 3 meses:**

- 🎯 **Lines**: 55% → **80%**
- 🎯 **Functions**: 63% → **85%**
- 🎯 **Branches**: 60% → **75%**
- 🎯 **Statements**: 55% → **80%**

**Prioridad en orden:**

1. Router y navegación (crítico para UX)
2. Dashboard admin (datos sensibles)
3. Productos admin (funcionalidad core)
4. Formularios de pago (transacciones)
5. Layouts (estructura)

---

## 💡 Próximos Pasos Inmediatos

1. **Crear archivo de tests para Router**
2. **Agregar tests para AdminLayout**
3. **Completar tests de Products.jsx**
4. **Configurar thresholds de cobertura en CI/CD**
5. **Documentar casos de test complejos**

¡Excelente trabajo hasta ahora! 🎉 El proyecto tiene una base sólida de tests, solo necesita expandir la cobertura en áreas críticas.
