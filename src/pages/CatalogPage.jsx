import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchCategories,
  fetchProducts,
  selectCategories,
  selectCategoriesError,
  selectCategoriesStatus,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from '../store/productsSlice';

const PAGE_SIZE = 12;
const PRICE_MAX_DEFAULT = 500;

const SORT_OPTIONS = [
  { id: 'default', label: 'ПО УМОЛЧАНИЮ' },
  { id: 'price-asc', label: 'СНАЧАЛА ДЕШЕВЫЕ' },
  { id: 'price-desc', label: 'СНАЧАЛА ДОРОГИЕ' },
  { id: 'name', label: 'ПО НАЗВАНИЮ' },
  { id: 'popular', label: 'ПО ПОПУЛЯРНОСТИ' },
];

const API_SORT = {
  'price-asc': 'price_asc',
  'price-desc': 'price_desc',
  name: 'name_asc',
  popular: 'popular',
};

export default function CatalogPage() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const products = useAppSelector(selectProducts);
  const productsStatus = useAppSelector(selectProductsStatus);
  const categoriesStatus = useAppSelector(selectCategoriesStatus);
  const productsError = useAppSelector(selectProductsError);
  const categoriesError = useAppSelector(selectCategoriesError);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory ? [initialCategory] : []
  );
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX_DEFAULT);
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (categoriesStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [categoriesStatus, dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({
      limit: 50,
      max_price: maxPrice,
      sort: API_SORT[sort],
      category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
    }));
  }, [dispatch, maxPrice, selectedCategories, sort]);

  const toggleCategory = (id) => {
    setSelectedCategories((prev) => {
      const next = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id];
      setSearchParams(next.length === 1 ? { category: next[0] } : {});
      return next;
    });
    setPage(1);
  };

  const reset = () => {
    setSelectedCategories([]);
    setMaxPrice(PRICE_MAX_DEFAULT);
    setSort('default');
    setPage(1);
    setSearchParams({});
  };

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice);
    if (selectedCategories.length > 0) {
      list = list.filter((p) => selectedCategories.includes(p.category));
    }
    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'name':
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popular':
        list = [...list].sort((a, b) => a.stockQuantity - b.stockQuantity || a.id - b.id);
        break;
      default:
        break;
    }
    return list;
  }, [products, selectedCategories, maxPrice, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row min-h-screen">
      {/* Sidebar Filters */}
      <aside className="md:w-64 flex-shrink-0 bg-surface-container-low border-b md:border-b-0 md:border-r border-outline py-12 px-6 md:px-8">
        <h2 className="font-headline font-bold text-lg mb-8 uppercase tracking-widest">ФИЛЬТРЫ</h2>
        <div className="space-y-8">
          <section>
            <h3 className="text-xs font-bold uppercase text-on-surface-variant mb-4">КАТЕГОРИИ</h3>
            <div className="flex flex-col gap-3">
              {categoriesStatus === 'loading' && (
                <div className="text-sm uppercase text-outline">Загрузка...</div>
              )}
              {categoriesStatus === 'failed' && (
                <div className="text-sm text-error">{categoriesError?.message}</div>
              )}
              {categories.map((c) => (
                <label key={c.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-none border-outline text-primary focus:ring-0"
                    checked={selectedCategories.includes(c.slug)}
                    onChange={() => toggleCategory(c.slug)}
                  />
                  <span className="text-sm uppercase">{c.name}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase text-on-surface-variant mb-4">ЦЕНА</h3>
            <div className="px-2">
              <input
                type="range"
                min="0"
                max={PRICE_MAX_DEFAULT}
                value={maxPrice}
                onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1); }}
                className="w-full h-1 bg-outline-variant appearance-none cursor-pointer accent-black"
              />
              <div className="flex justify-between mt-4 text-[0.6875rem] font-medium text-outline">
                <span>0 ₽</span>
                <span>{maxPrice} ₽</span>
              </div>
            </div>
          </section>

          <button
            onClick={reset}
            className="w-full py-3 border border-outline text-xs font-bold uppercase hover:bg-surface-container-highest transition-colors"
          >
            СБРОСИТЬ
          </button>
        </div>
      </aside>

      {/* Product grid */}
      <section className="flex-grow p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-12">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase text-outline">СОРТИРОВКА:</span>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="border-b border-outline bg-transparent text-sm uppercase py-1 pr-8 focus:outline-none focus:border-primary"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>

          <Pagination current={currentPage} total={totalPages} onChange={setPage} />
        </div>

        {productsStatus === 'loading' ? (
          <div className="py-24 text-center text-outline uppercase tracking-widest text-sm">
            ЗАГРУЖАЕМ ТОВАРЫ
          </div>
        ) : productsStatus === 'failed' ? (
          <div className="py-24 text-center">
            <p className="text-error uppercase tracking-widest text-sm mb-6">
              {productsError?.message || 'НЕ УДАЛОСЬ ЗАГРУЗИТЬ ТОВАРЫ'}
            </p>
            <button
              onClick={() => dispatch(fetchProducts({ limit: 50 }))}
              className="border border-outline px-8 py-3 text-xs font-bold uppercase hover:bg-surface-container-highest transition-colors"
            >
              Повторить
            </button>
          </div>
        ) : pageItems.length === 0 ? (
          <div className="py-24 text-center text-outline uppercase tracking-widest text-sm">
            ТОВАРОВ НЕ НАЙДЕНО
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {pageItems.map((p) => (
              <ProductCard key={p.id} product={p} variant="catalog" />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-24 flex justify-center">
            <PaginationLarge current={currentPage} total={totalPages} onChange={setPage} />
          </div>
        )}
      </section>
    </div>
  );
}

function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <nav className="flex items-center gap-2">
      <button
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
        className="w-8 h-8 flex items-center justify-center border border-outline hover:bg-surface-container transition-colors disabled:opacity-40"
      >
        <span className="material-symbols-outlined text-sm">chevron_left</span>
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-8 h-8 flex items-center justify-center text-xs font-bold ${
            p === current
              ? 'border border-primary bg-primary text-on-primary'
              : 'border border-outline hover:bg-surface-container transition-colors'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        disabled={current === total}
        onClick={() => onChange(current + 1)}
        className="w-8 h-8 flex items-center justify-center border border-outline hover:bg-surface-container transition-colors disabled:opacity-40"
      >
        <span className="material-symbols-outlined text-sm">chevron_right</span>
      </button>
    </nav>
  );
}

function PaginationLarge({ current, total, onChange }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <nav className="flex items-center gap-4">
      <button
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
        className="flex items-center gap-2 text-xs font-bold uppercase text-outline hover:text-primary transition-colors disabled:opacity-40"
      >
        <span className="material-symbols-outlined">arrow_back</span> ПРЕДЫДУЩАЯ
      </button>
      <div className="h-8 w-[1px] bg-outline mx-4"></div>
      <div className="flex gap-4">
        {pages.map((p) => (
          <span
            key={p}
            onClick={() => onChange(p)}
            className={`text-xs font-bold cursor-pointer ${
              p === current ? 'border-b-2 border-primary' : 'text-outline hover:text-primary'
            }`}
          >
            {String(p).padStart(2, '0')}
          </span>
        ))}
      </div>
      <div className="h-8 w-[1px] bg-outline mx-4"></div>
      <button
        disabled={current === total}
        onClick={() => onChange(current + 1)}
        className="flex items-center gap-2 text-xs font-bold uppercase text-outline hover:text-primary transition-colors disabled:opacity-40"
      >
        СЛЕДУЮЩАЯ <span className="material-symbols-outlined">arrow_forward</span>
      </button>
    </nav>
  );
}
