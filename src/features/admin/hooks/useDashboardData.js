import { useState } from 'react';

export const useDashboardData = () => {
  const [dashboardData] = useState({
    totalSales: 1250000,
    totalOrders: 342,
    registeredUsers: 1547,
    productsInStock: 156,
    lowStockProducts: 12,
    recentOrders: [
      { id: 'ORD-001', customer: 'Juan Pérez', total: 89990, date: '2025-10-20', status: 'Completado' },
      { id: 'ORD-002', customer: 'María González', total: 125000, date: '2025-10-20', status: 'En proceso' },
      { id: 'ORD-003', customer: 'Carlos Silva', total: 45000, date: '2025-10-19', status: 'Completado' },
      { id: 'ORD-004', customer: 'Ana Rodríguez', total: 210000, date: '2025-10-19', status: 'Completado' },
      { id: 'ORD-005', customer: 'Pedro Martínez', total: 67500, date: '2025-10-18', status: 'Cancelado' },
    ],
    users: [
      { id: 1, name: 'Juan Pérez', email: 'juan@email.com', orders: 5, totalSpent: 450000, registerDate: '2025-01-15' },
      { id: 2, name: 'María González', email: 'maria@email.com', orders: 8, totalSpent: 780000, registerDate: '2025-02-20' },
      { id: 3, name: 'Carlos Silva', email: 'carlos@email.com', orders: 3, totalSpent: 180000, registerDate: '2025-03-10' },
      { id: 4, name: 'Ana Rodríguez', email: 'ana@email.com', orders: 12, totalSpent: 1200000, registerDate: '2025-04-05' },
      { id: 5, name: 'Pedro Martínez', email: 'pedro@email.com', orders: 2, totalSpent: 95000, registerDate: '2025-09-01' },
    ],
    inventory: [
      { id: 1, name: 'PlayStation 5', category: 'Consolas', stock: 25, price: 599990, status: 'En stock' },
      { id: 2, name: 'Xbox Series X', category: 'Consolas', stock: 15, price: 549990, status: 'En stock' },
      { id: 3, name: 'Nintendo Switch', category: 'Consolas', stock: 8, price: 349990, status: 'Stock bajo' },
      { id: 4, name: 'DualSense Controller', category: 'Accesorios', stock: 45, price: 69990, status: 'En stock' },
      { id: 5, name: 'Gaming Chair Pro', category: 'Muebles', stock: 3, price: 299990, status: 'Stock bajo' },
      { id: 6, name: 'Gaming Mouse RGB', category: 'Accesorios', stock: 67, price: 45990, status: 'En stock' },
      { id: 7, name: 'Mechanical Keyboard', category: 'Accesorios', stock: 5, price: 89990, status: 'Stock bajo' },
      { id: 8, name: 'Gaming Headset', category: 'Accesorios', stock: 32, price: 79990, status: 'En stock' },
    ],
  });

  return dashboardData;
};
