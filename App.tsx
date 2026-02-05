
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import AdminDashboard from './components/AdminDashboard';
import { MOCK_NEWS } from './constants';
import { NewsItem } from './types';

const App: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [readingNews, setReadingNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const savedNews = localStorage.getItem('skenderaj_live_news');
    if (savedNews) {
      setNews(JSON.parse(savedNews));
    } else {
      setNews(MOCK_NEWS);
      localStorage.setItem('skenderaj_live_news', JSON.stringify(MOCK_NEWS));
    }
  }, []);

  const handleAddNews = (newItem: NewsItem) => {
    const updatedNews = [newItem, ...news];
    setNews(updatedNews);
    localStorage.setItem('skenderaj_live_news', JSON.stringify(updatedNews));
    setSelectedCategory(null);
    setSearchQuery('');
  };

  const handleDeleteNews = (id: string) => {
    const updatedNews = news.filter(n => n.id !== id);
    setNews(updatedNews);
    localStorage.setItem('skenderaj_live_news', JSON.stringify(updatedNews));
  };

  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchesCategory = selectedCategory 
        ? item.category.toLowerCase() === selectedCategory.toLowerCase()
        : true;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [news, selectedCategory, searchQuery]);

  const featured = filteredNews[0];
  const latestSidebar = news.slice(0, 10);

  const handleReadNews = (item: NewsItem) => {
    setReadingNews(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-10 bg-gray-50 animate-fade-in">
      <Header 
        onAdminClick={() => setIsAdminOpen(true)} 
        onCategorySelect={(cat) => { setSelectedCategory(cat); setSearchQuery(''); setReadingNews(null); }}
        onSearch={(q) => { setSearchQuery(q); setReadingNews(null); }}
        activeCategory={selectedCategory}
      />
      
      {isAdminOpen && (
        <AdminDashboard 
          onClose={() => setIsAdminOpen(false)} 
          onAddNews={handleAddNews} 
          currentNews={news}
          onDelete={handleDeleteNews}
        />
      )}

      {/* Hero Section Responsive */}
      {!selectedCategory && !searchQuery && !readingNews && featured && (
        <section className="relative h-[55vh] sm:h-[70vh] min-h-[400px] overflow-hidden">
          <img 
            src={featured.image} 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end">
            <div className="max-w-7xl mx-auto px-4 w-full pb-10 lg:pb-20">
              <div className="max-w-3xl space-y-4 animate-slide-up">
                <span className="bg-red-600 text-white px-3 py-1 text-[9px] font-black uppercase rounded-full tracking-widest shadow-lg">Lajmi Kryesor</span>
                <h2 className="serif text-3xl sm:text-5xl lg:text-7xl font-black text-white leading-tight tracking-tighter">
                  {featured.title}
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                   <button onClick={() => handleReadNews(featured)} className="bg-white text-black px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all text-center">
                      Lexo Artikullin
                   </button>
                   <p className="text-white/60 text-[10px] font-bold uppercase self-center tracking-widest hidden sm:block">Publikuar: {featured.date}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="max-w-7xl mx-auto px-4 mt-8 lg:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            
            {readingNews ? (
              <article className="bg-white rounded-3xl overflow-hidden shadow-xl animate-slide-up">
                <div className="relative h-[300px] sm:h-[500px]">
                  <img src={readingNews.image} className="w-full h-full object-cover" />
                  <button onClick={() => setReadingNews(null)} className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-600 transition-all">
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  <div className="absolute bottom-0 left-0 w-full p-6 lg:p-10 bg-gradient-to-t from-black to-transparent">
                    <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase mb-2 inline-block">{readingNews.category}</span>
                    <h1 className="serif text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">{readingNews.title}</h1>
                  </div>
                </div>
                <div className="p-6 lg:p-10">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-black text-sm">{readingNews.author.charAt(0)}</div>
                      <div>
                        <p className="text-xs font-black uppercase">{readingNews.author}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{readingNews.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="prose prose-sm sm:prose-lg max-w-none">
                    <p className="text-gray-600 leading-relaxed text-base sm:text-xl">
                      {readingNews.excerpt}
                    </p>
                    <p className="text-gray-500 mt-6 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </div>
                </div>
              </article>
            ) : (
              <div className="space-y-8 lg:space-y-12">
                {(selectedCategory || searchQuery) && (
                  <h2 className="text-2xl lg:text-3xl font-black uppercase border-l-4 border-red-600 pl-4 py-1">
                    {searchQuery ? `Kërkimi: "${searchQuery}"` : selectedCategory}
                  </h2>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                  {/* Skip current featured if it's already shown in hero, unless filtered */}
                  {(selectedCategory || searchQuery ? filteredNews : filteredNews.slice(1)).map(item => (
                    <div key={item.id} onClick={() => handleReadNews(item)} className="cursor-pointer">
                      <NewsCard item={item} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area - Lajmet e Fundit shfaqen lart në mobile */}
          <aside className="lg:col-span-4 order-1 lg:order-2">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="bg-white rounded-3xl p-5 lg:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6 pb-3 border-b">
                  <h4 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                    <i className="fas fa-clock text-red-600"></i> Lajmet e Fundit
                  </h4>
                  <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
                </div>
                <div className="space-y-6 lg:space-y-8 max-h-[400px] lg:max-h-none overflow-y-auto no-scrollbar">
                  {latestSidebar.map((n, i) => (
                    <div 
                      key={n.id} 
                      onClick={() => handleReadNews(n)}
                      className="flex gap-4 group cursor-pointer"
                    >
                      <div className="relative flex-shrink-0">
                        <img src={n.image} className="w-16 h-16 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                        <span className="absolute -top-1 -left-1 w-5 h-5 bg-black text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">{i+1}</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="text-[10px] lg:text-[11px] font-black leading-tight line-clamp-2 group-hover:text-red-600 transition-colors mb-1">{n.title}</h5>
                        <span className="text-[8px] font-black uppercase text-red-600 tracking-tighter">{n.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SMS Alert compact for mobile */}
              <div className="bg-red-600 rounded-3xl p-6 text-white text-center shadow-lg">
                <h5 className="text-xs font-black uppercase mb-3">Lajme me SMS</h5>
                <div className="flex gap-2">
                  <input type="text" placeholder="04x..." className="bg-white/10 border border-white/20 rounded-xl p-2 text-[10px] flex-1 outline-none" />
                  <button className="bg-white text-red-600 px-4 py-2 rounded-xl font-black text-[9px] uppercase">OK</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-gray-950 text-white pt-10 pb-10 mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="serif text-2xl font-black tracking-tighter mb-4">SKENDERAJ<span className="text-red-600 italic">LIVE</span></h1>
            <p className="text-gray-500 text-[8px] uppercase font-bold tracking-[0.2em] mb-4">Portali nr. 1 në Drenicë</p>
            <div className="flex justify-center gap-4 mb-6 text-gray-400">
               <i className="fab fa-facebook"></i>
               <i className="fab fa-instagram"></i>
               <i className="fab fa-viber"></i>
            </div>
            <p className="text-gray-700 text-[8px] uppercase tracking-widest border-t border-white/5 pt-6">
                &copy; {new Date().getFullYear()} Skenderaj Live.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
