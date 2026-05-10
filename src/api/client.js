const DEFAULT_PRODUCTS_API_URL = 'http://localhost:3001/api/v1';
const DEFAULT_ORDERS_API_URL = 'http://localhost:3002/api/v1';

export const PRODUCTS_API_URL =
  import.meta.env.VITE_PRODUCTS_API_URL || DEFAULT_PRODUCTS_API_URL;
export const ORDERS_API_URL =
  import.meta.env.VITE_ORDERS_API_URL || DEFAULT_ORDERS_API_URL;

class ApiError extends Error {
  constructor(message, { status, code, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function buildUrl(baseUrl, path, params) {
  const cleanBase = baseUrl.replace(/\/$/, '');
  const url = new URL(`${cleanBase}${path}`, window.location.origin);

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
}

async function request(baseUrl, path, { params, body, ...options } = {}) {
  const headers = new Headers(options.headers);
  const init = { ...options, headers };

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
    init.body = JSON.stringify(body);
  }

  const response = await fetch(buildUrl(baseUrl, path, params), init);
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = payload?.error;
    throw new ApiError(
      error?.message || `HTTP ${response.status}`,
      {
        status: response.status,
        code: error?.code,
        details: error?.details,
      },
    );
  }

  return payload;
}

export function apiErrorToObject(error) {
  return {
    message: error.message || 'Не удалось выполнить запрос',
    status: error.status,
    code: error.code,
    details: error.details,
  };
}

function firstImage(product) {
  if (product.main_image) return product.main_image;
  if (!Array.isArray(product.images)) return null;
  return product.images.find((image) => image.is_main)?.url || product.images[0]?.url || null;
}

function resolveImageUrl(url) {
  if (!url) return null;
  if (/^(https?:|data:|blob:)/.test(url)) return url;
  return null;
}

export function normalizeProduct(product) {
  const images = Array.isArray(product.images)
    ? product.images.map((image) => ({ ...image, url: resolveImageUrl(image.url) }))
    : [];

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    price: Number(product.price || 0),
    stockQuantity: Number(product.stock_quantity ?? product.stockQuantity ?? 0),
    category: product.category?.slug || product.category || '',
    categoryName: product.category?.name || product.categoryName || '',
    mainImage: resolveImageUrl(firstImage(product)),
    images,
    power: product.power_watts ? `${product.power_watts}W` : product.power || '',
    base: product.base_type || product.base || '',
    temp: product.color_temperature_k ? `${product.color_temperature_k}K` : product.temp || '',
    isActive: product.is_active ?? true,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  };
}

export function normalizeCategory(category) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    iconUrl: category.icon_url,
    productCount: Number(category.product_count || 0),
  };
}

export function normalizeOrder(order, requestMeta = {}) {
  const items = (order.items || []).map((item) => ({
    id: item.product_id,
    name: item.product_name,
    price: Number(item.product_price || 0),
    quantity: Number(item.quantity || 0),
    subtotal: Number(item.subtotal || 0),
  }));
  const itemsTotal = Number(order.total_amount || 0);
  const deliveryPrice = Number(requestMeta.deliveryPrice || 0);

  return {
    id: order.id,
    number: order.order_number,
    status: order.status,
    createdAt: order.created_at,
    items,
    itemsTotal,
    deliveryPrice,
    total: itemsTotal + deliveryPrice,
    customer: requestMeta.customer || {
      fullName: order.customer_name,
      email: order.customer_email,
      phone: order.customer_phone,
      delivery: order.delivery_method,
      address: order.delivery_address,
      payment: order.payment_method,
    },
  };
}

export async function fetchProductsRequest(params) {
  const payload = await request(PRODUCTS_API_URL, '/products', { params });
  return {
    data: payload.data.map(normalizeProduct),
    pagination: payload.pagination,
  };
}

export async function fetchCategoriesRequest() {
  const payload = await request(PRODUCTS_API_URL, '/categories');
  return payload.data.map(normalizeCategory);
}

export async function fetchProductRequest(id) {
  const payload = await request(PRODUCTS_API_URL, `/products/${id}`);
  return normalizeProduct(payload.data);
}

export async function createOrderRequest(body, requestMeta) {
  const payload = await request(ORDERS_API_URL, '/orders', {
    method: 'POST',
    body,
  });
  return normalizeOrder(payload.data, requestMeta);
}

export async function fetchOrderRequest(orderNumber) {
  const payload = await request(ORDERS_API_URL, `/orders/${orderNumber}`);
  return normalizeOrder(payload.data);
}
