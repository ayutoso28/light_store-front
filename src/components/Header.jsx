import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const navItem =
  'font-["Inter"] text-[0.875rem] uppercase tracking-wider px-2 py-1 transition-colors';

export default function Header() {
  const { totalCount } = useCart();

  return (
    <header className="flex justify-between items-center w-full px-6 md:px-12 h-16 bg-[#f9f9f9] border-b border-[#777777] sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-[#000000] uppercase tracking-tighter">
        СВЕТОМИР
      </Link>
      <nav className="hidden md:flex gap-8">
        <NavLink
          to="/catalog"
          className={({ isActive }) =>
            `${navItem} ${isActive ? 'text-[#000000] font-bold border-b-2 border-black' : 'text-[#777777] hover:bg-[#eeeeee]'}`
          }
        >
          КАТАЛОГ
        </NavLink>
        <a className={`${navItem} text-[#777777] hover:bg-[#eeeeee]`} href="#about">О НАС</a>
        <a className={`${navItem} text-[#777777] hover:bg-[#eeeeee]`} href="#contacts">КОНТАКТЫ</a>
      </nav>
      <Link
        to="/cart"
        className="relative flex items-center justify-center p-2 text-primary hover:bg-[#eeeeee] transition-colors"
        aria-label="Корзина"
      >
        <span className="material-symbols-outlined">shopping_cart</span>
        {totalCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[0.6875rem] font-bold min-w-[18px] h-[18px] px-1 flex items-center justify-center">
            {totalCount}
          </span>
        )}
      </Link>
    </header>
  );
}
