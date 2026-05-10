export function formatPrice(value) {
  const numericValue = Number(value || 0);
  return `${numericValue.toLocaleString('ru-RU')} ₽`;
}
