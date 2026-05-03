import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatPrice, getCategoryName, getProductById } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { id } = useParams();
  const product = getProductById(id);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-12 py-24 text-center">
        <h1 className="text-2xl font-bold uppercase mb-6">Товар не найден</h1>
        <Link
          to="/catalog"
          className="inline-block bg-primary text-on-primary px-8 py-3 text-sm font-bold uppercase tracking-widest"
        >
          В каталог
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addItem(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="px-6 md:px-12 py-16">
      <div className="max-w-7xl mx-auto">
        <nav className="mb-8 text-[0.6875rem] uppercase tracking-widest text-outline">
          <Link to="/" className="hover:text-primary">Главная</Link>
          <span className="mx-2">/</span>
          <Link to="/catalog" className="hover:text-primary">Каталог</Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Gallery */}
          <section className="flex flex-col gap-4">
            <div className="aspect-square w-full border border-outline-variant bg-surface-container-low flex items-center justify-center relative placeholder-x">
              <span className="text-on-surface-variant tracking-widest text-[0.6875rem] bg-surface-container px-4 py-1 z-10 font-bold">
                ИЗОБРАЖЕНИЕ
              </span>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`aspect-square border ${i === 0 ? 'border-outline' : 'border-outline-variant'} bg-surface-container-low placeholder-x`}
                />
              ))}
            </div>
          </section>

          {/* Info */}
          <section className="flex flex-col">
            <div className="text-[0.6875rem] uppercase tracking-widest text-outline mb-2">
              {getCategoryName(product.category)}
            </div>
            <h1 className="text-[2rem] font-bold leading-tight mb-2">{product.name}</h1>
            <div className="text-[1.125rem] font-bold text-primary mb-8">Цена: {formatPrice(product.price)}</div>

            <p className="text-[0.875rem] text-on-surface-variant leading-relaxed mb-10">
              {product.description}
            </p>

            <div className="mb-10">
              <h2 className="text-[0.6875rem] font-bold uppercase tracking-widest mb-4 border-b border-outline pb-2">
                Характеристики
              </h2>
              <table className="w-full text-[0.875rem]">
                <tbody>
                  <tr className="border-b border-surface-variant">
                    <td className="py-3 text-on-surface-variant uppercase text-[0.6875rem]">Категория</td>
                    <td className="py-3 text-right">{getCategoryName(product.category)}</td>
                  </tr>
                  <tr className="border-b border-surface-variant">
                    <td className="py-3 text-on-surface-variant uppercase text-[0.6875rem]">Цоколь</td>
                    <td className="py-3 text-right">{product.base}</td>
                  </tr>
                  <tr className="border-b border-surface-variant">
                    <td className="py-3 text-on-surface-variant uppercase text-[0.6875rem]">Мощность</td>
                    <td className="py-3 text-right">{product.power}</td>
                  </tr>
                  <tr className="border-b border-surface-variant">
                    <td className="py-3 text-on-surface-variant uppercase text-[0.6875rem]">Цветовая температура</td>
                    <td className="py-3 text-right">{product.temp}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-6 mt-auto">
              <div className="flex items-center border border-outline h-12">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 h-full hover:bg-surface-container transition-colors border-r border-outline flex items-center justify-center"
                  aria-label="Уменьшить"
                >
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
                <div className="px-6 h-full flex items-center justify-center font-bold text-sm">{quantity}</div>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 h-full hover:bg-surface-container transition-colors border-l border-outline flex items-center justify-center"
                  aria-label="Увеличить"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 h-12 bg-primary text-on-primary font-bold uppercase tracking-widest text-[0.875rem] transition-all active:scale-95 duration-100"
              >
                В корзину
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
