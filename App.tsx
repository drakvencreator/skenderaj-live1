
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import AdminDashboard from './components/AdminDashboard';
import ContactModal from './components/ContactModal';
import { MOCK_NEWS } from './constants';
import { NewsItem, AdConfig, ContactRequest, AppUser, RequestStatus } from './types';

const ITEMS_PER_PAGE = 6;

const App: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [readingNews, setReadingNews] = useState<NewsItem | null>(null);
  const [tickerText, setTickerText] = useState('Mirësevini në Skenderaj Live - Zëri juaj i besueshëm në Drenicë!');
  const [currentPage, setCurrentPage] = useState(1);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  
  const [adConfig, setAdConfig] = useState<AdConfig>({
    imageUrl: '',
    linkUrl: '',
    title: 'Hapësirë për Reklamë'
  });

  useEffect(() => {
    const savedNews = localStorage.getItem('sk_live_news');
    const savedTicker = localStorage.getItem('sk_live_ticker');
    const savedAd = localStorage.getItem('sk_live_ad');
    const savedRequests = localStorage.getItem('sk_live_requests');
    const savedUsers = localStorage.getItem('sk_live_users');
    
    if (savedNews) setNews(JSON.parse(savedNews));
    else {
      setNews(MOCK_NEWS);
      localStorage.setItem('sk_live_news', JSON.stringify(MOCK_NEWS));
    }
    
    if (savedTicker) setTickerText(savedTicker);
    if (savedAd) setAdConfig(JSON.parse(savedAd));
    if (savedRequests) setContactRequests(JSON.parse(savedRequests));
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Krijimi i administratorit fillestar sipas kërkesës
      const initialAdmin: AppUser = {
        id: '1',
        name: 'Administratori',
        username: 'Admin',
        password: 'Dd1.1',
        role: 'Admin'
      };
      setUsers([initialAdmin]);
      localStorage.setItem('sk_live_users', JSON.stringify([initialAdmin]));
    }
  }, []);

  const handleAddNews = (newItem: NewsItem) => {
    setNews(prev => {
      const exists = prev.find(n => n.id === newItem.id);
      let updated = exists ? prev.map(n => n.id === newItem.id ? newItem : n) : [newItem, ...prev];
      localStorage.setItem('sk_live_news', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteNews = (id: string) => {
    setNews(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('sk_live_news', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateTicker = (text: string) => {
    setTickerText(text);
    localStorage.setItem('sk_live_ticker', text);
  };

  const handleUpdateAd = (config: AdConfig) => {
    setAdConfig(config);
    localStorage.setItem('sk_live_ad', JSON.stringify(config));
  };

  const handleAddContactRequest = (data: Omit<ContactRequest, 'id' | 'date' | 'status'>) => {
    const newRequest: ContactRequest = {
      ...data,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('sq-AL', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };
    setContactRequests(prev => {
      const updated = [newRequest, ...prev];
      localStorage.setItem('sk_live_requests', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateRequestStatus = (id: string, status: RequestStatus) => {
    setContactRequests(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, status } : r);
      localStorage.setItem('sk_live_requests', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteRequest = (id: string) => {
    setContactRequests(prev => {
      const updated = prev.filter(r => r.id !== id);
      localStorage.setItem('sk_live_requests', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddUser = (user: AppUser) => {
    setUsers(prev => {
      const updated = [...prev, user];
      localStorage.setItem('sk_live_users', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => {
      const updated = prev.filter(u => u.id !== id);
      localStorage.setItem('sk_live_users', JSON.stringify(updated));
      return updated;
    });
  };

  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [news, selectedCategory, searchQuery]);

  const paginatedNews = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNews.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredNews, currentPage]);

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen pb-10 bg-gray-50 animate-fade-in">
      <Header 
        onAdminClick={() => setIsAdminOpen(true)} 
        onCategorySelect={(cat) => { setSelectedCategory(cat); setReadingNews(null); }}
        onSearch={setSearchQuery}
        activeCategory={selectedCategory}
        tickerText={tickerText}
      />
      
      {isAdminOpen && (
        <AdminDashboard 
          onClose={() => setIsAdminOpen(false)} 
          onAddNews={handleAddNews} 
          currentNews={news}
          onDelete={handleDeleteNews}
          tickerText={tickerText}
          onUpdateTicker={handleUpdateTicker}
          adConfig={adConfig}
          onUpdateAd={handleUpdateAd}
          contactRequests={contactRequests}
          onDeleteRequest={handleDeleteRequest}
          onUpdateRequestStatus={handleUpdateRequestStatus}
          users={users}
          onAddUser={handleAddUser}
          onDeleteUser={handleDeleteUser}
        />
      )}

      {isContactOpen && <ContactModal onClose={() => setIsContactOpen(false)} onSubmit={handleAddContactRequest} />}

      <main className="max-w-7xl mx-auto px-4 mt-6">
        {/* Ad Section */}
        {!readingNews && (
          <div className="mb-10">
            <a href={adConfig.linkUrl || '#'} className="block w-full h-24 sm:h-32 bg-gray-100 rounded-2xl overflow-hidden relative group">
              {adConfig.imageUrl ? (
                <img src={adConfig.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Ad" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                   <p className="text-[10px] font-black uppercase tracking-widest">{adConfig.title}</p>
                   <p className="text-[8px] font-bold">Marketing & Showbiz</p>
                </div>
              )}
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            {readingNews ? (
              <div className="bg-white p-8 lg:p-14 rounded-[3rem] shadow-xl animate-slide-up">
                <button onClick={() => setReadingNews(null)} className="mb-8 text-xs font-black uppercase flex items-center gap-2 text-gray-400 hover:text-red-600 transition-colors">
                  <i className="fas fa-arrow-left"></i> Kthehu
                </button>
                <img src={readingNews.image} className="w-full h-96 object-cover rounded-[2rem] mb-10 shadow-lg" />
                <h1 className="serif text-4xl lg:text-6xl font-black mb-8 leading-tight">{readingNews.title}</h1>
                <div className="prose prose-lg text-gray-600 leading-relaxed font-medium">
                  {readingNews.excerpt}
                  <p className="mt-6">Lajmi i plotë vjen së shpejti me të gjitha detajet nga terreni. Qëndroni me Skenderaj Live.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {paginatedNews.map(item => (
                    <div key={item.id} onClick={() => { setReadingNews(item); window.scrollTo(0,0); }}>
                      <NewsCard item={item} />
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-full font-black text-[10px] ${currentPage === i+1 ? 'bg-red-600 text-white' : 'bg-white border'}`}>{i + 1}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-red-600 p-8 rounded-[2.5rem] text-white shadow-xl group">
               <h3 className="text-xl font-black uppercase mb-4 leading-tight">Promovo biznesin tënd në Skenderaj Live</h3>
               <p className="text-xs opacity-80 mb-6 font-medium">Arritni audiencën më të madhe në rajonin e Drenicës me marketing profesional.</p>
               <button onClick={() => setIsContactOpen(true)} className="w-full bg-white text-red-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform shadow-lg">Rezervo Tani</button>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border">
               <h4 className="font-black uppercase text-[10px] mb-6 tracking-widest text-gray-400">Të fundit</h4>
               <div className="space-y-6">
                 {news.slice(0,5).map(n => (
                   <div key={n.id} onClick={() => setReadingNews(n)} className="flex gap-4 cursor-pointer group">
                      <img src={n.image} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      <div>
                        <h5 className="text-[11px] font-black line-clamp-2 group-hover:text-red-600 transition-colors">{n.title}</h5>
                        <p className="text-[8px] font-black text-gray-400 uppercase mt-1">{n.category}</p>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 mt-20 pt-20 border-t text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6">Na kontaktoni në:</p>
         <div className="flex justify-center gap-6 mb-12">
           <a href="https://www.facebook.com/profile.php?id=100079638993669" target="_blank" className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><i className="fab fa-facebook-f"></i></a>
           <a href="https://www.instagram.com/skenderajlive" target="_blank" className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all"><i className="fab fa-instagram"></i></a>
           <a href="https://www.tiktok.com/@skenderajlive" target="_blank" className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all"><i className="fab fa-tiktok"></i></a>
         </div>
         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">&copy; {new Date().getFullYear()} Skenderaj Live. Të gjitha të drejtat e rezervuara.</p>
      </footer>
    </div>
  );
};

export default App;
