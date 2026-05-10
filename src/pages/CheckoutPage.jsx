import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { formatPrice } from '../data/products';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  clearCart,
  selectCartItems,
  selectCartTotalPrice,
} from '../store/cartSlice';
import {
  createOrder,
  selectOrderCreateStatus,
  selectOrderError,
} from '../store/ordersSlice';

const DELIVERY_PRICE = { courier: 500, pickup: 0 };

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectCartTotalPrice);
  const createStatus = useAppSelector(selectOrderCreateStatus);
  const orderError = useAppSelector(selectOrderError);

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

  const normalizePhone = (phone) => {
    const cleaned = phone.trim().replace(/[^\d+]/g, '');
    return cleaned.startsWith('+')
      ? `+${cleaned.slice(1).replace(/\D/g, '')}`
      : cleaned.replace(/\D/g, '');
  };

  const validate = () => {
    const errs = {};
    const phone = normalizePhone(form.phone);
    if (!form.fullName.trim()) errs.fullName = 'Укажите ФИО';
    if (!phone) errs.phone = 'Укажите телефон';
    else if (!/^\+?\d{10,15}$/.test(phone)) errs.phone = 'Некорректный формат телефона';
    if (!form.email.trim()) errs.email = 'Укажите email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Некорректный email';
    if (form.delivery === 'courier' && !form.address.trim()) errs.address = 'Укажите адрес доставки';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const customer = {
      fullName: form.fullName.trim(),
      phone: normalizePhone(form.phone),
      email: form.email.trim(),
      address: form.delivery === 'courier' ? form.address.trim() : '',
      delivery: form.delivery,
      payment: form.payment,
    };
    const body = {
      customer_name: customer.fullName,
      customer_email: customer.email,
      customer_phone: customer.phone,
      delivery_method: customer.delivery,
      delivery_address: customer.address,
      payment_method: customer.payment,
      items: items.map(({ product, quantity }) => ({
        product_id: product.id,
        quantity,
      })),
    };

    try {
      const order = await dispatch(createOrder({
        body,
        meta: {
          customer,
          deliveryPrice: DELIVERY_PRICE[form.delivery],
        },
      })).unwrap();
      dispatch(clearCart());
      navigate('/order-confirmation', { state: { order } });
    } catch {
      // Detailed API error is rendered from Redux state in the summary block.
    }
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
                value="cash"
                checked={form.payment === 'cash'}
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
                    {product.mainImage ? (
                      <img src={product.mainImage} alt={product.name} className="h-full w-full object-contain p-2" />
                    ) : (
                      <span className="text-[0.5rem] font-bold uppercase text-outline">Изобр.</span>
                    )}
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
              disabled={createStatus === 'loading'}
              className="w-full bg-primary text-on-primary py-4 text-[0.875rem] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all active:scale-95 duration-100"
            >
              {createStatus === 'loading' ? 'ОТПРАВЛЯЕМ ЗАКАЗ' : 'ПОДТВЕРДИТЬ ЗАКАЗ'}
            </button>
            {orderError && (
              <p className="mt-4 text-[0.75rem] text-error text-center leading-relaxed">
                {orderError.message}
              </p>
            )}
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
