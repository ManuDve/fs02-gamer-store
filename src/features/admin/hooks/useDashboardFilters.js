export const useDashboardFilters = (dashboardData, dateFilter, searchTerm) => {
  const filterDataByDate = (data, dateField) => {
    if (dateFilter === 'all') return data;

    const today = new Date();
    const filterDate = new Date();

    switch (dateFilter) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        filterDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(today.getMonth() - 1);
        break;
      default:
        return data;
    }

    return data.filter(item => new Date(item[dateField]) >= filterDate);
  };

  const filteredOrders = filterDataByDate(dashboardData.recentOrders, 'date').filter(order =>
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = dashboardData.users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInventory = dashboardData.inventory.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    filteredOrders,
    filteredUsers,
    filteredInventory,
  };
};
