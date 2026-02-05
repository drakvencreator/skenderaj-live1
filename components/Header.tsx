
import React, { useState, useEffect } from 'react';

interface HeaderProps {
  onAdminClick: () => void;
  onCategorySelect: (category: string | null) => void;
  onSearch: (query: string) => void;
  activeCategory: string | null;
}

const Header: React.FC<HeaderProps> = ({ onAdminClick, onCategorySelect, onSearch, activeCategory }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const categories = ['Drenica', 'Politikë', 'Sport', 'Showbiz', 'Ekonomi', 'Botë', 'Tech'];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="w-full bg-white transition-all duration-300">
      {/* Top bar - E thjeshtuar për mobile */}
      <div className="flex justify-between items-center px-4 lg:px-8 py-2 bg-gray-950 text-white text-[9px] lg:text-[10px] font-black uppercase tracking-widest">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><i className="fas fa-bolt text-yellow-500"></i> LIVE</span>
          <span className="hidden sm:inline opacity-60">{new Date().toLocaleDateString('sq-AL', { day: 'numeric', month: 'short' })}</span>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={onAdminClick} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            <i className="fas fa-lock"></i> <span className="hidden xs:inline">Admin</span>
          </button>
          <div className="flex gap-3">
            <a href="#" className="hover:text-red-600"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="hover:text-red-600"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>

      {/* Main Brand Header - Responsive size */}
      <div className={`flex flex-col items-center border-b transition-all duration-500 ${scrolled ? 'py-3 shadow-md' : 'py-6 lg:py-10'}`}>
        <button onClick={() => { onCategorySelect(null); onSearch(''); setSearchValue(''); }} className="serif text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter flex items-center gap-1 group">
          SKENDERAJ<span className="text-red-600 italic">LIVE</span>
        </button>
        {!scrolled && (
          <div className="flex items-center gap-2 mt-2">
              <div className="h-[1px] w-4 bg-red-600"></div>
              <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Zëri i Drenicës</p>
              <div className="h-[1px] w-4 bg-red-600"></div>
          </div>
        )}
      </div>

      {/* Navigation - Mobile Scrollable Categories */}
      <nav className={`sticky top-0 z-50 bg-white border-b shadow-sm transition-all ${scrolled ? 'py-0' : 'py-0'}`}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between">
          
          {/* Scrollable Area */}
          <div className="flex overflow-x-auto no-scrollbar py-3 px-4 lg:px-0 lg:flex-1">
            <ul className="flex gap-6 lg:gap-10 text-[10px] lg:text-[11px] font-bold uppercase tracking-widest">
              <li className="flex-shrink-0">
                <button 
                  onClick={() => { onCategorySelect(null); onSearch(''); setSearchValue(''); }}
                  className={`pb-1 border-b-2 transition-all ${!activeCategory ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500'}`}
                >
                  Ballina
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat} className="flex-shrink-0">
                  <button 
                    onClick={() => { onCategorySelect(cat); onSearch(''); setSearchValue(''); }}
                    className={`pb-1 border-b-2 transition-all ${activeCategory === cat ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500'} ${cat === 'Showbiz' ? 'text-pink-600' : ''}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Search compact */}
          <div className="px-4 pb-3 lg:pb-0 lg:px-4 lg:border-l">
            <div className="relative">
              <input 
                type="text" 
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Kërko..." 
                className="bg-gray-100 rounded-full py-2 px-8 text-[11px] font-bold w-full lg:w-48 outline-none focus:bg-gray-200 transition-all"
              />
              <i className="fas fa-search absolute left-3 top-2.5 text-gray-400 text-[10px]"></i>
            </div>
          </div>
        </div>
      </nav>

      {/* Ticker - E fshehur në mobile për performancë */}
      <div className="hidden lg:flex bg-red-600 text-white py-1.5 overflow-hidden whitespace-nowrap">
        <div className="bg-black text-[8px] font-black uppercase px-4 py-0.5 mx-4 rounded-full flex-shrink-0 animate-pulse">Ekskluzive</div>
        <div className="flex items-center animate-marquee">
          <span className="text-[10px] font-bold mx-10">Moti në Skenderaj: Nesër pritet rritje temperaturash deri në 18 gradë.</span>
          <span className="text-[10px] font-bold mx-10">Iniciativa të reja për rininë në Drenicë - Programet e punësimit rriten.</span>
          <span className="text-[10px] font-bold mx-10">KF Drenica përgatitet për derbin e javës së ardhshme.</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
