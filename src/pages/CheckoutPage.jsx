import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';

const DELIVERY_PRICE = { courier: 500, pickup: 0 };

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clear } = useCart();

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    delivery: 'courier',
    payment: 'online',
  });
  const [errors, setErrors] = useState({});

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Укажите ФИО';
    if (!form.phone.trim()) errs.phone = 'Укажите телефон';
    if (!form.email.trim()) errs.email = 'Укажите email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Некорректный email';
    if (form.delivery === 'courier' && !form.address.trim()) errs.address = 'Укажите адрес доставки';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    const orderItems = items.map(({ product, quantity }) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
    }));
    const order = {
      number: orderNumber,
      createdAt: new Date().toISOString(),
      items: orderItems,
      itemsTotal: totalPrice,
      deliveryPrice: DELIVERY_PRICE[form.delivery],
      total: totalPrice + DELIVERY_PRICE[form.delivery],
      customer: form,
    };
    clear();
    navigate('/order-confirmation', { state: { order } });
  };

  const deliveryPrice = DELIVERY_PRICE[form.delivery];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16">
      <h1 className="text-[2rem] md:text-[2.75rem] font-black uppercase mb-12 border-b border-outline pb-4">
        ОФОРМЛЕНИЕ ЗАКАЗА
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Form */}
        <div className="lg:col-span-7 space-y-12">
          <section>
            <h2 className="text-[1.125rem] font-bold uppercase mb-6 tracking-tight">КОНТАКТНЫЕ ДАННЫЕ</h2>
            <div className="space-y-6">
              <Field label="ФИО" error={errors.fullName}>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={update('fullName')}
                  className="w-full bg-surface-container border border-outline px-4 py-3 focus:outline-none focus:border-primary text-[0.875rem]"
                  placeholder="Иванов Иван Иванович"
                />
              </Field>
              <Field label="ТЕЛЕФОН" error={errors.phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  className="w-full bg-surface-container border border-outline px-4 py-3 focus:outline-none focus:border-primary text-[0.875rem]"
                  placeholder="+7 (999) 000-00-00"
                />
              </Field>
              <Field label="EMAIL" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  className="w-full bg-surface-container border border-outline px-4 py-3 focus:outline-none focus:border-primary text-[0.875rem]"
                  placeholder="example@mail.ru"
                />
              </Field>
              {form.delivery === 'courier' && (
                <Field label="АДРЕС ДОСТАВКИ" error={errors.address}>
                  <textarea
                    rows={3}
                    value={form.address}
                    onChange={update('address')}
                    className="w-full bg-surface-container border border-outline px-4 py-3 focus:outline-none focus:border-primary text-[0.875rem]"
                    placeholder="Город, улица, дом, квартира"
                  />
                </Field>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-[1.125rem] font-bold uppercase mb-6 tracking-tight">СПОСОБ ДОСТАВКИ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RadioCard
                name="delivery"
                value="courier"
                checked={form.delivery === 'courier'}
                onChange={update('delivery')}
                title="КУРЬЕР"
                subtitle="ДОСТАВКА ДО ДВЕРИ — 500 ₽"
              />
              <RadioCard
                name="delivery"
                value="pickup"
                checked={form.delivery === 'pickup'}
                onChange={update('delivery')}
                title="САМОВЫВОЗ"
                subtitle="ИЗ ПУНКТА ВЫДАЧИ — БЕСПЛАТНО"
              />
            </div>
          </section>

          <section>
            <h2 className="text-[1.125rem] font-bold uppercase mb-6 tracking-tight">СПОСОБ ОПЛАТЫ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RadioCard
                name="payment"
                value="online"
                checked={form.payment === 'online'}
                onChange={update('payment')}
                title="КАРТОЙ ОНЛАЙН"
              />
              <RadioCard
                name="payment"
                value="on-delivery"
                checked={form.payment === 'on-delivery'}
                onChange={update('payment')}
                title="ПРИ ПОЛУЧЕНИИ"
              />
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-5">
          <div className="bg-surface-container-low border border-outline p-8 sticky top-24">
            <h2 className="text-[1.125rem] font-bold uppercase mb-8 border-b border-outline-variant pb-4">СВОДКА ЗАКАЗА</h2>
            <div className="space-y-6 mb-8">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4">
                  <div className="w-16 h-16 border border-outline-variant placeholder-x flex items-center justify-center flex-shrink-0 bg-surface-container">
                    <span className="text-[0.5rem] font-bold uppercase text-outline">Изобр.</span>
                  </div>
                  <div className="flex-grow">
                    <div className="text-[0.875rem] font-bold uppercase leading-tight">{product.name}</div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[0.6875rem] text-outline">{quantity} ШТ.</span>
                      <span className="text-[0.875rem] font-bold">{formatPrice(product.price * quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-outline-variant pt-6 mb-8">
              <div className="flex justify-between text-[0.875rem]">
                <span className="text-outline uppercase tracking-wider">ТОВАРЫ</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-[0.875rem]">
                <span className="text-outline uppercase tracking-wider">ДОСТАВКА</span>
                <span>{deliveryPrice === 0 ? 'Бесплатно' : formatPrice(deliveryPrice)}</span>
              </div>
              <div className="flex justify-between text-[1.125rem] font-black pt-4">
                <span className="uppercase tracking-tighter">ИТОГО</span>
                <span>{formatPrice(totalPrice + deliveryPrice)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-on-primary py-4 text-[0.875rem] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all active:scale-95 duration-100"
            >
              ПОДТВЕРДИТЬ ЗАКАЗ
            </button>
            <p className="mt-4 text-[0.6875rem] text-outline text-center uppercase leading-relaxed">
              НАЖИМАЯ КНОПКУ, ВЫ СОГЛАШАЕТЕСЬ С УСЛОВИЯМИ ОФЕРТЫ И ПОЛИТИКОЙ КОНФИДЕНЦИАЛЬНОСТИ
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-2">
      <label className="text-[0.6875rem] font-bold uppercase text-outline">{label}</label>
      {children}
      {error && <div className="text-[0.6875rem] text-error uppercase">{error}</div>}
    </div>
  );
}

function RadioCard({ name, value, checked, onChange, title, subtitle }) {
  return (
    <label className="relative flex items-center p-4 border border-outline bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
      <input
        className="hidden peer"
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <div className="w-4 h-4 border border-outline mr-4 peer-checked:bg-primary flex items-center justify-center flex-shrink-0">
        <div className="w-2 h-2 bg-white opacity-0 peer-checked:opacity-100"></div>
      </div>
      <div>
        <div className="text-[0.875rem] font-bold uppercase">{title}</div>
        {subtitle && <div className="text-[0.6875rem] text-outline">{subtitle}</div>}
      </div>
    </label>
  );
}
