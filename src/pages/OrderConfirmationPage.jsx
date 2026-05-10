import { Link, Navigate, useLocation } from 'react-router-dom';
import { formatPrice } from '../data/products';
import { useAppSelector } from '../store/hooks';
import { selectCurrentOrder } from '../store/ordersSlice';

const DELIVERY_LABEL = { courier: 'Курьер', pickup: 'Самовывоз' };
const PAYMENT_LABEL = { online: 'Картой онлайн', cash: 'При получении' };

export default function OrderConfirmationPage() {
  const { state } = useLocation();
  const currentOrder = useAppSelector(selectCurrentOrder);
  const order = state?.order || currentOrder;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const { number, items, customer, itemsTotal, deliveryPrice, total } = order;

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-12 py-16">
      <div className="border border-outline p-8 md:p-12 bg-surface-container-lowest">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-8 border border-primary">
          <span className="material-symbols-outlined text-3xl">check</span>
        </div>
        <h1 className="text-[2rem] md:text-[2.5rem] font-black uppercase tracking-tight text-center mb-4">
          ЗАКАЗ УСПЕШНО СОЗДАН
        </h1>
        <div className="mb-8 border border-primary bg-surface-container-low px-6 py-4 text-center">
          <p className="text-[0.875rem] font-bold uppercase tracking-widest">
            Заказ успешно создан
          </p>
        </div>
        <p className="text-center text-on-surface-variant mb-8">
          Спасибо за покупку. Мы свяжемся с вами для подтверждения.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="border border-outline-variant p-6 bg-surface-container-low">
            <div className="text-[0.6875rem] uppercase text-outline mb-2">НОМЕР ЗАКАЗА</div>
            <div className="text-2xl font-black tracking-tight">№ {number}</div>
          </div>
          <div className="border border-outline-variant p-6 bg-surface-container-low">
            <div className="text-[0.6875rem] uppercase text-outline mb-2">СУММА К ОПЛАТЕ</div>
            <div className="text-2xl font-black tracking-tight">{formatPrice(total)}</div>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-[0.6875rem] font-bold uppercase tracking-widest mb-4 border-b border-outline pb-2">
            СОСТАВ ЗАКАЗА
          </h2>
          <div className="space-y-3">
            {items.map((it) => (
              <div key={it.id} className="flex justify-between text-[0.875rem]">
                <span>
                  {it.name} <span className="text-outline">× {it.quantity}</span>
                </span>
                <span className="font-bold">{formatPrice(it.price * it.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between text-[0.875rem] pt-3 border-t border-surface-variant">
              <span className="text-outline uppercase tracking-wider">Товары</span>
              <span>{formatPrice(itemsTotal)}</span>
            </div>
            <div className="flex justify-between text-[0.875rem]">
              <span className="text-outline uppercase tracking-wider">Доставка</span>
              <span>{deliveryPrice === 0 ? 'Бесплатно' : formatPrice(deliveryPrice)}</span>
            </div>
            <div className="flex justify-between text-[1.125rem] font-black pt-3 border-t border-outline-variant">
              <span className="uppercase tracking-tighter">ИТОГО</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-[0.6875rem] font-bold uppercase tracking-widest mb-4 border-b border-outline pb-2">
            КОНТАКТНАЯ ИНФОРМАЦИЯ
          </h2>
          <dl className="space-y-3 text-[0.875rem]">
            <Row label="ФИО" value={customer.fullName} />
            <Row label="Телефон" value={customer.phone} />
            <Row label="Email" value={customer.email} />
            <Row label="Способ доставки" value={DELIVERY_LABEL[customer.delivery]} />
            {customer.delivery === 'courier' && <Row label="Адрес" value={customer.address} />}
            <Row label="Способ оплаты" value={PAYMENT_LABEL[customer.payment]} />
          </dl>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="flex-1 text-center bg-primary text-on-primary py-4 text-[0.875rem] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all"
          >
            На главную
          </Link>
          <Link
            to="/catalog"
            className="flex-1 text-center border border-outline py-4 text-[0.875rem] font-bold uppercase tracking-widest hover:bg-surface-container transition-all"
          >
            Продолжить покупки
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-outline uppercase text-[0.6875rem] tracking-wider">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
