/**
 * Formatea un número a formato de precio en pesos chilenos
 * Formato: $34.990 (con punto como miles separador, sin decimales)
 * @param {number|string} price - El precio a formatear
 * @returns {string} - El precio formateado
 */
export function formatPrice(price) {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  const rounded = Math.round(numPrice);
  // Formatear con punto como separador de miles
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$${formatted}`;
}
