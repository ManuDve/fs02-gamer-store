import { useState, useEffect } from 'react';
import { userService } from '../../../shared/services/userService';
import { authorityService } from '../../../shared/services/authorityService';
import { productService } from '../../../shared/services/productService';
import orderService from '../../../shared/services/orderService';

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalOrders: 0,
    registeredUsers: 0,
    productsInStock: 0,
    lowStockProducts: 0,
    recentOrders: [],
    users: [],
    inventory: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Cargar usuarios
      const usersData = await userService.getAllUsers();
      const usersWithRoles = await Promise.all(
        usersData.map(async (user) => {
          try {
            const authorities = await authorityService.getByUserId(user.id);
            const isAdmin = authorities.some(auth => auth.authority === 'ROLE_ADMIN');
            
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone || null, // ✅ Agregado el campo phone
              role: isAdmin ? 'admin' : 'user'
            };
          } catch (error) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone || null, // ✅ Agregado el campo phone
              role: 'user'
            };
          }
        })
      );

      // Cargar productos
      const productsData = await productService.getAll();
      const inventoryData = productsData.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        stock: product.stock || 0,
        price: product.price,
        status: (product.stock || 0) < 10 ? 'Stock bajo' : 'En stock'
      }));

      // Cargar órdenes
      const ordersData = await orderService.getAllOrders();
      const recentOrdersData = ordersData.slice(0, 5).map(order => ({
        id: order.orderNumber,
        customer: `${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
        total: order.summary.total,
        date: order.timestamp,
        status: order.status
      }));

      // Calcular estadísticas
      const totalSales = ordersData.reduce((sum, order) => sum + order.summary.total, 0);
      const totalOrders = ordersData.length;
      const registeredUsers = usersWithRoles.length;
      const productsInStock = inventoryData.length;
      const lowStockProducts = inventoryData.filter(p => p.stock < 10).length;

      setDashboardData({
        totalSales,
        totalOrders,
        registeredUsers,
        productsInStock,
        lowStockProducts,
        recentOrders: recentOrdersData,
        users: usersWithRoles,
        inventory: inventoryData
      });
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return { dashboardData, loading, refreshData: loadDashboardData };
};