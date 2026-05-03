import { Link } from 'react-router-dom';
import { CATEGORIES, getPopularProducts } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const popular = getPopularProducts(6);

  return (
    <>
      {/* Hero */}
      <section className="w-full px-6 md:px-12 py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto flex flex-col items-start gap-8">
          <div className="w-full aspect-[21/9] bg-surface-dim border border-outline-variant wireframe-x flex items-center justify-center">
            <span className="bg-surface-container px-6 py-2 border border-outline text-[0.6875rem] uppercase tracking-widest font-bold">
              ИЗОБРАЖЕНИЕ — БАННЕР АКЦИЙ
            </span>
          </div>
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-[2.5rem] md:text-[3.5rem] leading-none font-black uppercase tracking-tighter">
              ОСВЕЩАЕМ ВАШУ ЖИЗНЬ
            </h1>
            <p className="text-base text-on-surface-variant">
              Завод лампочек СВЕТОМИР — 20 моделей LED, накаливания, галогенных и энергосберегающих ламп. Качество и надёжность от производителя.
            </p>
            <Link
              to="/catalog"
              className="inline-block bg-primary text-on-primary px-10 py-4 font-bold uppercase tracking-widest text-[0.875rem] hover:opacity-90 transition-opacity"
            >
              В КАТАЛОГ
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="w-full px-6 md:px-12 py-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[2rem] font-black uppercase mb-12 border-l-4 border-primary pl-6">КАТЕГОРИИ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to={`/catalog?category=${c.id}`}
                className="group cursor-pointer"
              >
                <div className="aspect-square bg-surface-container border border-outline-variant wireframe-x mb-4 flex items-center justify-center">
                  <span className="text-[0.6875rem] uppercase tracking-widest text-outline">ИЗОБРАЖЕНИЕ</span>
                </div>
                <h3 className="text-[1.125rem] font-bold uppercase">{c.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="w-full px-6 md:px-12 py-24 bg-surface-container">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-[2rem] font-black uppercase">ПОПУЛЯРНЫЕ ТОВАРЫ</h2>
            <Link to="/catalog" className="text-[0.875rem] font-bold uppercase border-b border-primary pb-1">
              СМОТРЕТЬ ВСЕ
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {popular.map((p) => (
              <ProductCard key={p.id} product={p} variant="home" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
