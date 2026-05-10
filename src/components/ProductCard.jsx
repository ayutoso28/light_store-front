import { Link } from 'react-router-dom';
import { formatPrice } from '../data/products';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/cartSlice';

export default function ProductCard({ product, variant = 'catalog' }) {
  const dispatch = useAppDispatch();

  const handleBuy = (e) => {
    e.preventDefault();
    dispatch(addToCart(product, 1));
  };

  const image = product.mainImage ? (
    <img
      src={product.mainImage}
      alt={product.name}
      className="h-full w-full object-contain p-6"
      loading="lazy"
    />
  ) : (
    <span className="text-[0.6875rem] uppercase tracking-widest text-outline">ИЗОБРАЖЕНИЕ</span>
  );

  if (variant === 'home') {
    return (
      <div className="flex flex-col gap-4">
        <Link to={`/product/${product.id}`} className="block aspect-[4/5] bg-surface border border-outline-variant wireframe-x flex items-center justify-center">
          {image}
        </Link>
        <div className="space-y-1">
          <Link to={`/product/${product.id}`}>
            <h3 className="text-[1.125rem] font-bold uppercase">{product.name}</h3>
          </Link>
          <p className="text-[0.875rem] text-on-surface-variant uppercase">ЦЕНА: {formatPrice(product.price)}</p>
        </div>
        <button
          onClick={handleBuy}
          disabled={product.stockQuantity === 0}
          className="w-full border border-outline py-3 text-[0.6875rem] font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors"
        >
          {product.stockQuantity === 0 ? 'НЕТ В НАЛИЧИИ' : 'КУПИТЬ'}
        </button>
      </div>
    );
  }

  return (
    <div className="group">
      <Link to={`/product/${product.id}`} className="block image-placeholder mb-6 aspect-square bg-surface-container-low border border-outline-variant wireframe-x flex items-center justify-center">
        {product.mainImage ? image : (
          <span className="relative z-10 text-[0.6875rem] font-bold uppercase bg-surface px-4 py-2 border border-outline-variant">
            ИЗОБРАЖЕНИЕ
          </span>
        )}
      </Link>
      <div className="space-y-2">
        <div className="text-[0.6875rem] text-outline uppercase tracking-wider">
          {product.categoryName || product.category}
        </div>
        <Link to={`/product/${product.id}`}>
          <h4 className="font-bold text-base uppercase tracking-tight">{product.name}</h4>
        </Link>
        <div className="text-lg font-black mb-4">{formatPrice(product.price)}</div>
        <button
          onClick={handleBuy}
          disabled={product.stockQuantity === 0}
          className="w-full py-3 border border-primary text-xs font-bold uppercase group-hover:bg-primary group-hover:text-on-primary transition-all duration-300"
        >
          {product.stockQuantity === 0 ? 'НЕТ В НАЛИЧИИ' : 'КУПИТЬ'}
        </button>
      </div>
    </div>
  );
}
