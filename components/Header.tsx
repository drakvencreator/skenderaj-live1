
import React, { useState, useEffect } from 'react';

interface HeaderProps {
  onAdminClick: () => void;
  onCategorySelect: (category: string | null) => void;
  onSearch: (query: string) => void;
  activeCategory: string | null;
  tickerText: string;
}

const Header: React.FC<HeaderProps> = ({ onAdminClick, onCategorySelect, onSearch, activeCategory, tickerText }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const categories = ['Komuna', 'Politikë', 'Sport', 'Showbiz', 'Ekonomi', 'Botë', 'Tech'];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  const getAlbanianDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    let formatted = date.toLocaleDateString('sq-AL', options);
    return formatted.charAt(0).toLowerCase() + formatted.slice(1);
  };

  const logoImgUrl = "https://i.ibb.co/gL1MbJ6B/1163-D542-54-F8-4973-97-F0-893-D88230-A37.jpg";

  return (
    <header className="w-full bg-white transition-all duration-500">
      {/* Top bar */}
      <div className="flex justify-between items-center px-4 lg:px-8 py-2.5 bg-gray-950 text-white text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em]">
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2 text-blue-400">
            <img src={logoImgUrl} className="w-4 h-4 rounded-full object-cover" alt="icon" />
            <span>Skenderaj 18°C</span>
          </div>
          <span className="hidden sm:inline opacity-40">|</span>
          <span className="hidden sm:inline opacity-60">
            {getAlbanianDate()}
          </span>
        </div>
        <div className="flex gap-4 lg:gap-8 items-center">
          <div className="hidden xs:flex items-center gap-4">
             <span className="text-[8px] opacity-40">Na kontaktoni:</span>
             <div className="flex gap-3">
               <a href="https://www.facebook.com/profile.php?id=100079638993669" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-transform hover:scale-125"><i className="fab fa-facebook-f"></i></a>
               <a href="https://www.instagram.com/skenderajlive" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-transform hover:scale-125"><i className="fab fa-instagram"></i></a>
               <a href="https://www.tiktok.com/@skenderajlive" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-transform hover:scale-125"><i className="fab fa-tiktok"></i></a>
             </div>
          </div>
          <span className="hidden xs:inline opacity-20">|</span>
          <button onClick={onAdminClick} className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5 group">
            <i className="fas fa-unlock-alt group-hover:scale-110 transition-transform"></i>
            <span className="hidden xs:inline">Hyrja</span>
          </button>
        </div>
      </div>

      {/* Main Brand Header - Text in Middle, Logos on Sides */}
      <div className={`flex flex-col items-center border-b transition-all duration-700 ${scrolled ? 'py-2 shadow-xl' : 'py-6 lg:py-10'}`}>
        <div className="flex items-center justify-center gap-4 sm:gap-10">
          <img 
            src={logoImgUrl} 
            alt="Side Logo" 
            className={`hidden md:block object-contain transition-all duration-700 ${scrolled ? 'h-10' : 'h-24'}`}
          />
          
          <button 
            onClick={() => { onCategorySelect(null); onSearch(''); setSearchValue(''); }} 
            className={`serif font-black tracking-tighter flex items-center gap-1 group transition-all duration-700 ${scrolled ? 'text-3xl' : 'text-5xl sm:text-7xl lg:text-8xl'}`}
          >
            SKENDERAJ<span className="text-red-600 italic group-hover:tracking-widest transition-all">LIVE</span>
          </button>

          <img 
            src={logoImgUrl} 
            alt="Side Logo" 
            className={`hidden md:block object-contain transition-all duration-700 ${scrolled ? 'h-10' : 'h-24'}`}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b shadow-sm transition-all ${scrolled ? 'translate-y-0' : ''}`}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between">
          
          <div className="flex overflow-x-auto no-scrollbar py-4 px-4 lg:px-0 lg:flex-1">
            <ul className="flex gap-8 lg:gap-12 text-[10px] lg:text-[12px] font-black uppercase tracking-[0.15em]">
              <li className="flex-shrink-0">
                <button 
                  onClick={() => { onCategorySelect(null); onSearch(''); setSearchValue(''); }}
                  className={`pb-1 border-b-2 transition-all ${!activeCategory ? 'border-red-600 text-red-600' : 'border-transparent text-gray-400 hover:text-black'}`}
                >
                  Ballina
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat} className="flex-shrink-0">
                  <button 
                    onClick={() => { onCategorySelect(cat); onSearch(''); setSearchValue(''); }}
                    className={`pb-1 border-b-2 transition-all ${activeCategory === cat ? 'border-red-600 text-red-600' : 'border-transparent text-gray-400 hover:text-black'} ${cat === 'Showbiz' ? 'text-pink-600' : ''}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-4 pb-4 lg:pb-0 lg:px-6 lg:border-l border-gray-100">
            <div className="relative group">
              <input 
                type="text" 
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Kërko lajmin..." 
                className="bg-gray-100 rounded-full py-2.5 px-10 text-[11px] font-bold w-full lg:w-56 outline-none focus:bg-white focus:ring-2 focus:ring-red-600/10 transition-all border border-transparent focus:border-red-600/20"
              />
              <i className="fas fa-search absolute left-4 top-3 text-gray-400 text-[11px] group-focus-within:text-red-600 transition-colors"></i>
            </div>
          </div>
        </div>
      </nav>

      {/* Dynamic News Ticker */}
      <div className="bg-red-600 text-white py-2.5 overflow-hidden whitespace-nowrap shadow-inner">
        <div className="flex items-center animate-marquee">
          <span className="text-[11px] font-black uppercase tracking-widest mx-10 flex items-center gap-2">
             <i className="fas fa-star"></i> {tickerText}
          </span>
          <span className="text-[11px] font-black uppercase tracking-widest mx-10 flex items-center gap-2">
             <i className="fas fa-star"></i> {tickerText}
          </span>
          <span className="text-[11px] font-black uppercase tracking-widest mx-10 flex items-center gap-2">
             <i className="fas fa-star"></i> {tickerText}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
