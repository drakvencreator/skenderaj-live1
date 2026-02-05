
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import AdminDashboard from './components/AdminDashboard';
import ContactModal from './components/ContactModal';
import { db, COLLECTIONS } from './services/db';
import { NewsItem, AdConfig, ContactRequest, AppUser, RequestStatus } from './types';

const ITEMS_PER_PAGE = 6;

const App: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [readingNews, setReadingNews] = useState<NewsItem | null>(null);
  const [tickerText, setTickerText] = useState('Duke u sinkronizuar...');
  const [currentPage, setCurrentPage] = useState(1);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [adConfig, setAdConfig] = useState<AdConfig>({ imageUrl: '', linkUrl: '', title: 'Hapësirë Reklamuese' });
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    // Krijimi i dëgjuesve (Listeners) për sinkronizim real-time
    const unsubscribeNews = db.collection(COLLECTIONS.NEWS)
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot: any) => {
        const newsData = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as NewsItem));
        setNews(newsData);
        setDbError(null);
      }, (error: any) => {
        if (error.code === 'permission-denied') {
          setDbError("Sistemi: Ju lutem rregulloni 'Rules' në Firebase Console që lajmet të bëhen publike.");
        }
      });

    const unsubscribeTicker = db.collection(COLLECTIONS.TICKER).doc('main')
      .onSnapshot((doc: any) => {
        if (doc.exists) setTickerText(doc.data().text);
        else setTickerText("Mirësevini në portalin Skenderaj Live!");
      });

    const unsubscribeAds = db.collection(COLLECTIONS.ADS).doc('main')
      .onSnapshot((doc: any) => {
        if (doc.exists) setAdConfig(doc.data() as AdConfig);
      });

    const unsubscribeUsers = db.collection(COLLECTIONS.USERS)
      .onSnapshot((snapshot: any) => {
        const usersData = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as AppUser));
        setUsers(usersData);
      });

    const unsubscribeRequests = db.collection(COLLECTIONS.REQUESTS)
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot: any) => {
        const requestsData = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as ContactRequest));
        setContactRequests(requestsData);
      });

    return () => {
      unsubscribeNews();
      unsubscribeTicker();
      unsubscribeAds();
      unsubscribeUsers();
      unsubscribeRequests();
    };
  }, []);

  const handleAddNews = async (newItem: NewsItem) => {
    try {
      const { id, ...data } = newItem;
      await db.collection(COLLECTIONS.NEWS).doc(id).set({
        ...data,
        timestamp: (window as any).firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (err) { 
      alert("Gabim! Sigurohuni që keni vendosur 'allow read, write: if true;' te Firebase Rules."); 
    }
  };

  const handleDeleteNews = async (id: string) => {
    if(window.confirm("A jeni të sigurt për fshirjen?")) {
      try { await db.collection(COLLECTIONS.NEWS).doc(id).delete(); } catch (err) { console.error(err); }
    }
  };

  const handleUpdateTicker = async (text: string) => {
    try { await db.collection(COLLECTIONS.TICKER).doc('main').set({ text }); } catch (err) { console.error(err); }
  };

  const handleUpdateAd = async (config: AdConfig) => {
    try { await db.collection(COLLECTIONS.ADS).doc('main').set(config); } catch (err) { console.error(err); }
  };

  const handleAddContactRequest = async (data: Omit<ContactRequest, 'id' | 'date' | 'status'>) => {
    try {
      await db.collection(COLLECTIONS.REQUESTS).add({
        ...data,
        date: new Date().toLocaleString('sq-AL'),
        status: 'pending',
        timestamp: (window as any).firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (err) { console.error(err); }
  };

  const handleUpdateRequestStatus = async (id: string, status: RequestStatus) => {
    try { await db.collection(COLLECTIONS.REQUESTS).doc(id).update({ status }); } catch (err) { console.error(err); }
  };

  const handleDeleteRequest = async (id: string) => {
    try { await db.collection(COLLECTIONS.REQUESTS).doc(id).delete(); } catch (err) { console.error(err); }
  };

  const handleAddUser = async (user: AppUser) => {
    try {
      const { id, ...data } = user;
      await db.collection(COLLECTIONS.USERS).doc(id).set(data);
    } catch (err) { console.error(err); }
  };

  const handleDeleteUser = async (id: string) => {
    try { await db.collection(COLLECTIONS.USERS).doc(id).delete(); } catch (err) { console.error(err); }
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
      {dbError && (
        <div className="bg-black text-white text-[9px] font-black uppercase py-2 text-center sticky top-0 z-[100] tracking-widest px-4">
          <span className="text-red-500 mr-2">● GABIM KONFIGURIMI:</span> {dbError}
        </div>
      )}
      
      <Header 
        onAdminClick={() => setIsAdminOpen(true)} 
        onCategorySelect={(cat) => { setSelectedCategory(cat); setReadingNews(null); setCurrentPage(1); }}
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
        {!readingNews && (
          <div className="mb-10">
            <a href={adConfig.linkUrl || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-24 sm:h-32 bg-gray-100 rounded-2xl overflow-hidden relative group border-2 border-dashed border-gray-200">
              {adConfig.imageUrl ? (
                <img src={adConfig.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Marketing" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-300">
                   <p className="text-[10px] font-black uppercase tracking-widest">{adConfig.title}</p>
                   <p className="text-[8px] mt-1 italic">Kontaktoni redaksinë për marketing</p>
                </div>
              )}
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            {readingNews ? (
              <div className="bg-white p-6 lg:p-14 rounded-[2.5rem] shadow-xl animate-slide-up">
                <button onClick={() => setReadingNews(null)} className="mb-6 text-[10px] font-black uppercase flex items-center gap-2 text-gray-400 hover:text-red-600 transition-colors">
                  <i className="fas fa-arrow-left"></i> Kthehu te Ballina
                </button>
                <img src={readingNews.image} className="w-full h-64 lg:h-96 object-cover rounded-3xl mb-8 shadow-md" />
                <div className="flex items-center gap-3 mb-6">
                   <span className="bg-red-600 text-white text-[9px] font-black uppercase px-4 py-1 rounded-full">{readingNews.category}</span>
                   <span className="text-[9px] text-gray-400 font-black uppercase">{readingNews.date}</span>
                </div>
                <h1 className="serif text-3xl lg:text-5xl font-black mb-8 leading-tight text-gray-900">{readingNews.title}</h1>
                <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-line font-medium italic mb-8 border-l-4 border-red-600 pl-6 py-2">
                   Ky lajm u përgatit nga redaksia e Skenderaj Live.
                </div>
                <div className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                  {readingNews.excerpt}
                </div>
                <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase text-gray-400">Autori: <span className="text-black">{readingNews.author}</span></span>
                   <div className="flex gap-4">
                      <button className="text-blue-600"><i className="fab fa-facebook-f"></i></button>
                      <button className="text-pink-600"><i className="fab fa-instagram"></i></button>
                   </div>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                {news.length === 0 && !dbError && (
                   <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed">
                      <i className="fas fa-newspaper text-6xl mb-6 text-gray-200"></i>
                      <p className="font-black uppercase tracking-widest text-gray-400">Duke pritur lajmet e para nga admini...</p>
                   </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {paginatedNews.map(item => (
                    <div key={item.id} className="cursor-pointer" onClick={() => { setReadingNews(item); window.scrollTo(0,0); }}>
                      <NewsCard item={item} />
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center gap-3 pt-10">
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i} onClick={() => { setCurrentPage(i + 1); window.scrollTo(0,0); }} className={`w-12 h-12 rounded-2xl font-black text-[11px] transition-all ${currentPage === i+1 ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-white text-gray-400 hover:bg-gray-100'}`}>{i + 1}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-gray-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-red-600 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
               <h3 className="text-2xl font-black uppercase mb-4 relative z-10">Marketingu Juaj</h3>
               <p className="text-xs opacity-70 mb-8 leading-relaxed relative z-10">Bëhuni pjesë e portalit më të ndjekur në Drenicë. Reklamoni biznesin tuaj sot.</p>
               <button onClick={() => setIsContactOpen(true)} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all relative z-10 shadow-xl">Dërgo Kërkesë</button>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
               <h4 className="font-black uppercase text-[10px] mb-8 text-gray-400 tracking-[0.2em] flex items-center gap-2">
                  <span className="w-4 h-1 bg-red-600 rounded-full"></span> LAJMET E FUNDIT
               </h4>
               <div className="space-y-8">
                 {news.slice(0,6).map(n => (
                   <div key={n.id} onClick={() => { setReadingNews(n); window.scrollTo(0,0); }} className="flex gap-5 cursor-pointer group">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                        <img src={n.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-[11px] font-black line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">{n.title}</h5>
                        <div className="flex items-center gap-2 mt-2">
                           <span className="text-[8px] font-black text-red-600 uppercase">{n.category}</span>
                           <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                           <span className="text-[8px] font-bold text-gray-400 uppercase">{n.date}</span>
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default App;
