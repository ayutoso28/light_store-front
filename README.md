# СветоМир — frontend интернет-магазина

Пользовательская часть магазина лампочек на React + Vite.

## Что реализовано

- загрузка категорий и товаров из `products-service` через `fetch`;
- карточка товара с актуальной ценой, остатком и добавлением в корзину;
- корзина с изменением количества, удалением позиций и сохранением в `localStorage`;
- оформление заказа через `orders-service`;
- глобальное состояние на Redux Toolkit: `products`, `cart`, `orders`;
- обработка loading/error-состояний для каталога, карточки товара и оформления заказа.

## Запуск

Сначала поднимите backend из соседней папки:

```bash
cd ../light_store
docker compose up -d --build
```

Затем запустите frontend:

```bash
npm install
npm run dev
```

По умолчанию frontend обращается к API:

```env
VITE_PRODUCTS_API_URL=http://localhost:3001/api/v1
VITE_ORDERS_API_URL=http://localhost:3002/api/v1
```

Если сервисы запущены на других адресах, создайте `.env` рядом с `package.json` и переопределите эти переменные.

## Проверки

```bash
npm run lint
npm run build
```
