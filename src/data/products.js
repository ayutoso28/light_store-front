export const CATEGORIES = [
  { id: 'led', name: 'LED' },
  { id: 'incandescent', name: 'Накаливания' },
  { id: 'halogen', name: 'Галогенные' },
  { id: 'energy-saving', name: 'Энергосберегающие' },
];

export const PRODUCTS = [
  { id: 1,  name: 'LED A60 10W',            category: 'led',            base: 'E27',   power: '10W', temp: '3000K', price: 150, popular: true,  description: 'LED-лампа стандартной формы A60 для общего освещения. Тёплый белый свет, экономичное потребление.' },
  { id: 2,  name: 'LED A60 15W',            category: 'led',            base: 'E27',   power: '15W', temp: '4000K', price: 190, popular: true,  description: 'LED-лампа A60 повышенной мощности с нейтральным светом. Подходит для рабочих зон.' },
  { id: 3,  name: 'LED A60 20W',            category: 'led',            base: 'E27',   power: '20W', temp: '6500K', price: 230, popular: false, description: 'Мощная LED-лампа с холодным белым светом. Яркое освещение для больших помещений.' },
  { id: 4,  name: 'LED Свеча 7W',           category: 'led',            base: 'E14',   power: '7W',  temp: '3000K', price: 130, popular: true,  description: 'LED-лампа в форме свечи для люстр и бра. Тёплый свет, цоколь E14.' },
  { id: 5,  name: 'LED Свеча 9W',           category: 'led',            base: 'E14',   power: '9W',  temp: '4000K', price: 160, popular: false, description: 'LED-лампа свеча с нейтральным светом. Подходит для декоративных светильников.' },
  { id: 6,  name: 'LED Шар 9W',             category: 'led',            base: 'E27',   power: '9W',  temp: '3000K', price: 140, popular: true,  description: 'LED-лампа шарообразной формы с тёплым светом. Декоративное и общее освещение.' },
  { id: 7,  name: 'LED Шар 12W',            category: 'led',            base: 'E27',   power: '12W', temp: '4000K', price: 170, popular: false, description: 'LED-шар с нейтральным белым светом. Универсальное решение для гостиной и кухни.' },
  { id: 8,  name: 'LED GU10 5W',            category: 'led',            base: 'GU10',  power: '5W',  temp: '3000K', price: 180, popular: false, description: 'Точечная LED-лампа с цоколем GU10. Тёплый свет для встраиваемых светильников.' },
  { id: 9,  name: 'LED GU10 7W',            category: 'led',            base: 'GU10',  power: '7W',  temp: '4000K', price: 210, popular: true,  description: 'Точечная LED-лампа с увеличенной мощностью. Нейтральный свет для рабочих зон.' },
  { id: 10, name: 'LED Трубка T8 18W',      category: 'led',            base: 'G13',   power: '18W', temp: '4000K', price: 320, popular: false, description: 'LED-трубка T8 длиной 1200 мм для офисов и торговых помещений.' },
  { id: 11, name: 'Накал. А55 60W',         category: 'incandescent',   base: 'E27',   power: '60W', temp: '2700K', price: 35,  popular: false, description: 'Классическая лампа накаливания. Тёплое жёлтое свечение, привычный спектр.' },
  { id: 12, name: 'Накал. А55 75W',         category: 'incandescent',   base: 'E27',   power: '75W', temp: '2700K', price: 40,  popular: false, description: 'Лампа накаливания повышенной мощности для общего освещения.' },
  { id: 13, name: 'Накал. А55 95W',         category: 'incandescent',   base: 'E27',   power: '95W', temp: '2700K', price: 45,  popular: false, description: 'Мощная лампа накаливания. Подходит для просторных помещений.' },
  { id: 14, name: 'Накал. Свеча 40W',       category: 'incandescent',   base: 'E14',   power: '40W', temp: '2700K', price: 30,  popular: false, description: 'Лампа накаливания в форме свечи. Цоколь E14, классический тёплый свет.' },
  { id: 15, name: 'Накал. Свеча 60W',       category: 'incandescent',   base: 'E14',   power: '60W', temp: '2700K', price: 35,  popular: false, description: 'Лампа накаливания свеча 60Вт. Подходит для люстр и бра с цоколем E14.' },
  { id: 16, name: 'Галоген. JC 20W',        category: 'halogen',        base: 'G4',    power: '20W', temp: '3000K', price: 90,  popular: false, description: 'Капсульная галогенная лампа 12В. Применяется в декоративных и встраиваемых светильниках.' },
  { id: 17, name: 'Галоген. JC 35W',        category: 'halogen',        base: 'G4',    power: '35W', temp: '3000K', price: 110, popular: false, description: 'Галогенная капсульная лампа повышенной мощности. Чистый белый свет.' },
  { id: 18, name: 'Галоген. MR16 35W',      category: 'halogen',        base: 'GU5.3', power: '35W', temp: '3000K', price: 120, popular: false, description: 'Галогенная лампа с отражателем MR16. Точечный направленный свет.' },
  { id: 19, name: 'Энергосб. Спираль 15W',  category: 'energy-saving',  base: 'E27',   power: '15W', temp: '4000K', price: 95,  popular: false, description: 'Энергосберегающая компактная люминесцентная лампа в форме спирали.' },
  { id: 20, name: 'Энергосб. Спираль 20W',  category: 'energy-saving',  base: 'E27',   power: '20W', temp: '4000K', price: 110, popular: false, description: 'Энергосберегающая лампа повышенной мощности. Длительный срок службы.' },
];

export function getCategoryName(categoryId) {
  const c = CATEGORIES.find((c) => c.id === categoryId);
  return c ? c.name : categoryId;
}

export function getProductById(id) {
  const numericId = Number(id);
  return PRODUCTS.find((p) => p.id === numericId);
}

export function getPopularProducts(limit = 6) {
  return PRODUCTS.filter((p) => p.popular).slice(0, limit);
}

export function formatPrice(value) {
  return `${value.toLocaleString('ru-RU')} ₽`;
}
