import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#eeeeee] border-t border-[#777777] mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-12 py-16 max-w-7xl mx-auto">
        <div className="space-y-6">
          <div className="text-md font-bold text-black uppercase">СВЕТОМИР</div>
          <p className="font-['Inter'] text-[0.6875rem] uppercase leading-relaxed text-[#777777]">
            Ваш надежный партнёр в мире освещения. Завод лампочек с 2024 года.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-[0.6875rem] uppercase tracking-widest">НАВИГАЦИЯ</h4>
          <ul className="space-y-2">
            <li><Link className="font-['Inter'] text-[0.6875rem] uppercase text-[#777777] hover:text-black transition-all" to="/catalog">КАТАЛОГ</Link></li>
            <li><a className="font-['Inter'] text-[0.6875rem] uppercase text-[#777777] hover:text-black transition-all" href="#about">О НАС</a></li>
            <li><a className="font-['Inter'] text-[0.6875rem] uppercase text-[#777777] hover:text-black transition-all" href="#contacts">КОНТАКТЫ</a></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-[0.6875rem] uppercase tracking-widest">ПОМОЩЬ</h4>
          <ul className="space-y-2">
            <li><a className="font-['Inter'] text-[0.6875rem] uppercase text-[#777777] hover:text-black transition-all" href="#delivery">ДОСТАВКА</a></li>
            <li><a className="font-['Inter'] text-[0.6875rem] uppercase text-[#777777] hover:text-black transition-all" href="#returns">ВОЗВРАТ</a></li>
            <li><a className="font-['Inter'] text-[0.6875rem] uppercase text-[#777777] hover:text-black transition-all" href="#support">ПОДДЕРЖКА</a></li>
          </ul>
        </div>
      </div>
      <div className="px-12 py-8 border-t border-[#777777] text-center">
        <span className="font-['Inter'] text-[0.6875rem] uppercase text-[#777777]">© 2024 СВЕТОМИР. ВСЕ ПРАВА ЗАЩИЩЕНЫ.</span>
      </div>
    </footer>
  );
}
