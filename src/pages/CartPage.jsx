import { Link } from 'react-router-dom';
import { formatPrice } from '../data/products';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  removeFromCart,
  selectCartItems,
  selectCartTotalPrice,
  updateQuantity,
} from '../store/cartSlice';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectCartTotalPrice);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 min-h-[calc(100vh-128px)]">
      <h1 className="text-[2rem] font-bold mb-12 uppercase tracking-tight">Корзина</h1>

      {items.length === 0 ? (
        <div className="border border-outline-variant py-24 text-center">
          <p className="text-outline uppercase tracking-widest text-sm mb-8">КОРЗИНА ПУСТА</p>
          <Link
            to="/catalog"
            className="inline-block bg-primary text-on-primary px-10 py-4 text-[0.875rem] font-bold uppercase tracking-widest"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <>
          <div className="w-full overflow-x-auto mb-16">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline">
                  <th className="py-4 font-bold text-[0.6875rem] uppercase tracking-widest text-outline">Изображение</th>
                  <th className="py-4 font-bold text-[0.6875rem] uppercase tracking-widest text-outline">Название</th>
                  <th className="py-4 font-bold text-[0.6875rem] uppercase tracking-widest text-outline">Цена за шт.</th>
                  <th className="py-4 font-bold text-[0.6875rem] uppercase tracking-widest text-outline text-center">Количество</th>
                  <th className="py-4 font-bold text-[0.6875rem] uppercase tracking-widest text-outline text-right">Сумма</th>
                  <th className="py-4 font-bold text-[0.6875rem] uppercase tracking-widest text-outline text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {items.map(({ product, quantity }) => (
                  <tr key={product.id}>
                    <td className="py-8 w-32">
                      <Link to={`/product/${product.id}`}>
                        <div className="relative aspect-square w-24 border border-outline-variant flex items-center justify-center bg-surface-container-low overflow-hidden placeholder-x">
                          {product.mainImage ? (
                            <img src={product.mainImage} alt={product.name} className="h-full w-full object-contain p-3" />
                          ) : (
                            <span className="relative z-10 text-[0.6875rem] uppercase font-bold text-outline">Изображение</span>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td className="py-8">
                      <Link to={`/product/${product.id}`} className="block">
                        <div className="text-lg font-bold">{product.name}</div>
                      </Link>
                      <div className="text-sm text-outline">Артикул: {String(product.id).padStart(6, '0')}</div>
                    </td>
                    <td className="py-8">
                      <div className="text-md">{formatPrice(product.price)}</div>
                    </td>
                    <td className="py-8">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={() => dispatch(updateQuantity({ productId: product.id, quantity: quantity - 1 }))}
                          className="w-8 h-8 border border-outline flex items-center justify-center hover:bg-surface-container-highest transition-colors"
                          aria-label="Уменьшить"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="font-bold text-lg min-w-[20px] text-center">{quantity}</span>
                        <button
                          onClick={() => dispatch(updateQuantity({ productId: product.id, quantity: quantity + 1 }))}
                          disabled={product.stockQuantity > 0 && quantity >= product.stockQuantity}
                          className="w-8 h-8 border border-outline flex items-center justify-center hover:bg-surface-container-highest transition-colors"
                          aria-label="Увеличить"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                    </td>
                    <td className="py-8 text-right font-bold">{formatPrice(product.price * quantity)}</td>
                    <td className="py-8 text-right">
                      <button
                        onClick={() => dispatch(removeFromCart(product.id))}
                        className="p-2 text-outline hover:text-error transition-colors"
                        aria-label="Удалить"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-end gap-6">
            <div className="flex items-baseline gap-8">
              <span className="text-[0.875rem] uppercase text-outline tracking-wider">Итого:</span>
              <span className="text-[2.75rem] font-black tracking-tight">{formatPrice(totalPrice)}</span>
            </div>
            <Link
              to="/checkout"
              className="bg-primary text-on-primary px-12 py-5 text-[0.875rem] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all active:scale-95 duration-100"
            >
              Оформить заказ
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
