/**
 * Formatea un número a formato de precio en pesos chilenos
 * @param {number|string} price - El precio a formatear
 * @returns {string} - El precio formateado
 */
export function formatPrice(price) {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(numPrice);
}
