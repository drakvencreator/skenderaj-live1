
import React, { useState, useMemo, useEffect } from 'react';
import { NewsItem, Category, AdConfig, ContactRequest, AppUser, UserRole, RequestStatus } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
  onAddNews: (item: NewsItem) => void;
  onDelete: (id: string) => void;
  currentNews: NewsItem[];
  tickerText: string;
  onUpdateTicker: (text: string) => void;
  adConfig: AdConfig;
  onUpdateAd: (config: AdConfig) => void;
  contactRequests: ContactRequest[];
  onDeleteRequest: (id: string) => void;
  onUpdateRequestStatus: (id: string, status: RequestStatus) => void;
  users: AppUser[];
  onAddUser: (user: AppUser) => void;
  onDeleteUser: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onClose, 
  onAddNews, 
  onDelete, 
  currentNews = [], 
  tickerText = '', 
  onUpdateTicker,
  adConfig,
  onUpdateAd,
  contactRequests = [],
  onDeleteRequest,
  onUpdateRequestStatus,
  users = [],
  onAddUser,
  onDeleteUser
}) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'news' | 'ads' | 'requests' | 'users'>('news');
  
  // News Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState<Category>('Komuna');
  const [imageUrl, setImageUrl] = useState('');
  const [author, setAuthor] = useState('Redaksia');
  
  const [newsListFilter, setNewsListFilter] = useState<string>('Të gjitha');
  
  // User Form
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('Moderator');

  const [tempTicker, setTempTicker] = useState(tickerText);
  const [tempAd, setTempAd] = useState<AdConfig>(adConfig || { imageUrl: '', linkUrl: '', title: '' });

  useEffect(() => {
    setTempTicker(tickerText || '');
  }, [tickerText]);

  useEffect(() => {
    if (adConfig) setTempAd(adConfig);
  }, [adConfig]);

  // Safety logic for moderators
  useEffect(() => {
    if (currentUser && currentUser.role === 'Moderator' && activeTab !== 'news') {
      setActiveTab('news');
    }
  }, [activeTab, currentUser]);

  const categories: Category[] = ['Komuna', 'Politikë', 'Sport', 'Showbiz', 'Ekonomi', 'Botë', 'Tech', 'Kronikë'];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!users) return;
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    if (user) {
      setCurrentUser(user);
      setAuthor(user.name);
      setActiveTab('news');
    } else {
      alert('Të dhënat e qasjes janë të gabuara!');
    }
  };

  const resetNewsForm = () => {
    setEditingId(null);
    setTitle('');
    setExcerpt('');
    setImageUrl('');
    setCategory('Komuna');
    setAuthor(currentUser?.name || 'Redaksia');
  };

  const handleEditNews = (item: NewsItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setExcerpt(item.excerpt);
    setCategory(item.category as Category);
    setImageUrl(item.image);
    setAuthor(item.author);
    setActiveTab('news');
  };

  const handleSubmitNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const newItem: NewsItem = {
      id: editingId || Date.now().toString(),
      title,
      excerpt,
      category,
      image: imageUrl || `https://picsum.photos/seed/${Math.random()}/1200/800`,
      date: editingId ? 'E përditësuar' : 'Sapo u publikua',
      author: author || currentUser.name,
    };
    onAddNews(newItem);
    resetNewsForm();
    alert(editingId ? 'Lajmi u përditësua!' : 'Lajmi u publikua!');
  };

  const filteredNewsInList = useMemo(() => {
    const list = currentNews || [];
    if (newsListFilter === 'Të gjitha') return list;
    return list.filter(n => n.category === newsListFilter);
  }, [currentNews, newsListFilter]);

  if (!currentUser) {
    return (
      <div className="fixed inset-0 bg-gray-950/95 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
        <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 max-w-sm w-full shadow-2xl animate-scale-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter">SKENDERAJ LIVE</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Hyrja për Staf</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-gray-400 ml-2">Emri i përdoruesit</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-red-600 font-bold transition-all"
                placeholder="Username" 
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-gray-400 ml-2">Fjalëkalimi</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-red-600 font-bold transition-all"
                placeholder="Fjalëkalimi"
                required
              />
            </div>
            <button type="submit" className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-black transition-all shadow-lg mt-2">Kyçu</button>
            <button onClick={onClose} type="button" className="w-full text-gray-400 text-[10px] font-black uppercase tracking-widest pt-2">Kthehu te faqja</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] overflow-y-auto p-0 lg:p-10 backdrop-blur-lg">
      <div className="bg-white min-h-screen lg:min-h-0 lg:h-full lg:rounded-[3rem] w-full max-w-7xl mx-auto shadow-2xl overflow-hidden flex flex-col relative">
        
        <div className="bg-gray-100 p-4 lg:px-14 flex items-center gap-2 lg:gap-10 border-b overflow-x-auto no-scrollbar flex-shrink-0">
           <button onClick={() => setActiveTab('news')} className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'news' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}>
             <i className="fas fa-newspaper mr-2"></i>Lajmet
           </button>
           
           {currentUser.role === 'Admin' && (
             <>
               <button onClick={() => setActiveTab('ads')} className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ads' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}>
                 <i className="fas fa-ad mr-2"></i>Marketingu
               </button>
               <button onClick={() => setActiveTab('requests')} className={`relative whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'requests' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}>
                 <i className="fas fa-envelope mr-2"></i>Kërkesat 
                 {contactRequests?.filter(r => r.status === 'pending').length > 0 && (
                   <span className="absolute -top-1 -right-1 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px]">
                     {contactRequests.filter(r => r.status === 'pending').length}
                   </span>
                 )}
               </button>
               <button onClick={() => setActiveTab('users')} className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}>
                 <i className="fas fa-users mr-2"></i>Përdoruesit
               </button>
             </>
           )}

           <div className="ml-auto flex items-center gap-4">
             <div className="hidden md:block text-right">
                <p className="text-[10px] font-black uppercase">{currentUser.name}</p>
                <p className="text-[8px] font-bold text-red-600 uppercase tracking-widest">{currentUser.role}</p>
             </div>
             <button onClick={() => setCurrentUser(null)} className="w-9 h-9 rounded-full bg-white text-gray-400 hover:text-red-600 transition-all shadow-sm flex items-center justify-center">
               <i className="fas fa-sign-out-alt"></i>
             </button>
             <button onClick={onClose} className="w-9 h-9 rounded-full bg-white text-gray-500 hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center justify-center">
               <i className="fas fa-times"></i>
             </button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50">
          {activeTab === 'news' && (
            <div className="flex flex-col lg:flex-row min-h-full">
              <div className="p-8 lg:p-14 lg:w-1/2 bg-white border-b lg:border-r border-gray-100">
                <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
                  <span className="w-2 h-8 bg-red-600 rounded-full"></span>
                  {editingId ? 'Edito Lajmin' : 'Publiko Lajm'}
                </h2>
                <form onSubmit={handleSubmitNews} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Titulli i Lajmit</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-gray-50 p-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-red-600 transition-all" placeholder="Shkruaj titullin..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Kategoria</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="w-full bg-gray-50 p-4 rounded-2xl font-black text-[10px] uppercase outline-none border-2 border-transparent focus:border-red-600">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Autori</label>
                      <input value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full bg-gray-50 p-4 rounded-2xl font-bold text-xs outline-none border-2 border-transparent focus:border-red-600" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Foto URL</label>
                    <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-gray-50 p-4 rounded-2xl font-mono text-[10px] outline-none border-2 border-transparent focus:border-red-600" placeholder="https://..." />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Përmbajtja</label>
                    <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required rows={8} className="w-full bg-gray-50 p-4 rounded-2xl text-sm outline-none border-2 border-transparent focus:border-red-600 leading-relaxed" placeholder="Shkruaj lajmin këtu..."></textarea>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 bg-gray-950 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-600 transition-all">
                      {editingId ? 'Ruaj Ndryshimet' : 'Publiko Lajmin'}
                    </button>
                    {editingId && (
                      <button type="button" onClick={resetNewsForm} className="px-8 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase text-[10px]">Anulo</button>
                    )}
                  </div>
                </form>
              </div>

              <div className="p-8 lg:p-14 lg:w-1/2 bg-gray-50 overflow-y-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <h3 className="font-black uppercase text-[11px] text-gray-400 tracking-widest">Menaxho Lajmet</h3>
                  <select value={newsListFilter} onChange={(e) => setNewsListFilter(e.target.value)} className="bg-white border p-2.5 rounded-xl text-[9px] font-black uppercase outline-none shadow-sm">
                    <option value="Të gjitha">Të gjitha Kategoritë</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-4">
                  {filteredNewsInList.map(n => (
                    <div key={n.id} className="bg-white p-5 rounded-[2rem] flex justify-between items-center shadow-sm hover:border-red-600 border-2 border-transparent transition-all">
                      <div className="flex items-center gap-4 min-w-0">
                        <img src={n.image} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt="news" />
                        <div className="min-w-0">
                          <h4 className="text-[12px] font-black truncate max-w-[200px]">{n.title}</h4>
                          <span className="text-[8px] font-black uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded mt-1 inline-block">{n.category}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditNews(n)} className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center"><i className="fas fa-edit text-xs"></i></button>
                        {currentUser.role === 'Admin' && <button onClick={() => onDelete(n.id)} className="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"><i className="fas fa-trash-alt text-xs"></i></button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requests' && currentUser.role === 'Admin' && (
            <div className="p-8 lg:p-14 bg-gray-50 min-h-full">
              <h2 className="text-2xl font-black uppercase mb-10">Kërkesat e Klientëve</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactRequests?.map(req => (
                  <div key={req.id} className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-50 shadow-sm">
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-sm font-black">{req.name?.charAt(0)}</div>
                           <div>
                              <h4 className="font-black text-sm">{req.name}</h4>
                              <p className="text-[9px] font-bold text-gray-400 uppercase">{req.date}</p>
                           </div>
                        </div>
                        <span className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full ${req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-50 text-yellow-600'}`}>{req.status}</span>
                     </div>
                     
                     {/* SHFAQJA E EMAIL-IT DHE TELEFONIT */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 overflow-hidden">
                           <span className="text-[8px] font-black uppercase text-gray-400 block mb-1">Email Adresa:</span>
                           <span className="text-[11px] font-bold text-gray-800 break-all select-all cursor-pointer" title="Kliko për ta selektuar">{req.email || 'Nuk ka email'}</span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                           <span className="text-[8px] font-black uppercase text-gray-400 block mb-1">Telefoni:</span>
                           <span className="text-[11px] font-bold text-gray-800">{req.phone}</span>
                        </div>
                     </div>

                     <div className="bg-white p-5 rounded-2xl text-[12px] text-gray-600 italic border border-gray-100 leading-relaxed mb-6">
                        "{req.message}"
                     </div>

                     <div className="flex gap-2">
                        {req.status === 'pending' && <button onClick={() => onUpdateRequestStatus(req.id, 'approved')} className="flex-1 bg-green-600 text-white py-3 rounded-xl text-[9px] font-black uppercase">Aprovo</button>}
                        <button onClick={() => onDeleteRequest(req.id)} className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl text-[9px] font-black uppercase">Fshij</button>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && currentUser.role === 'Admin' && (
            <div className="p-8 lg:p-14 flex flex-col lg:flex-row gap-10 bg-white min-h-full">
               <div className="lg:w-1/3 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                  <h3 className="font-black uppercase text-sm mb-6">Shto Staf</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    onAddUser({ id: Date.now().toString(), name: newUserName, username: newUserUsername, password: newUserPassword, role: newUserRole });
                    setNewUserName(''); setNewUserUsername(''); setNewUserPassword('');
                  }} className="space-y-4">
                     <input value={newUserName} onChange={e => setNewUserName(e.target.value)} required className="w-full bg-white p-4 rounded-2xl outline-none text-xs font-bold" placeholder="Emri i plotë" />
                     <input value={newUserUsername} onChange={e => setNewUserUsername(e.target.value)} required className="w-full bg-white p-4 rounded-2xl outline-none text-xs font-bold" placeholder="Username" />
                     <input value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} required type="password" className="w-full bg-white p-4 rounded-2xl outline-none text-xs font-bold" placeholder="Password" />
                     <select value={newUserRole} onChange={e => setNewUserRole(e.target.value as UserRole)} className="w-full bg-white p-4 rounded-2xl outline-none text-[10px] font-black uppercase">
                        <option value="Moderator">Moderator</option>
                        <option value="Admin">Admin</option>
                     </select>
                     <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-2xl font-black uppercase text-[10px]">Krijo</button>
                  </form>
               </div>
               <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {users?.map(u => (
                    <div key={u.id} className="bg-white p-6 rounded-[2.5rem] flex justify-between items-center shadow-sm border border-gray-100">
                       <div>
                          <h4 className="font-black text-sm">{u.name}</h4>
                          <p className="text-[9px] font-bold text-red-600 uppercase">{u.role}</p>
                       </div>
                       {u.username !== currentUser.username && <button onClick={() => onDeleteUser(u.id)} className="text-gray-300 hover:text-red-600"><i className="fas fa-trash"></i></button>}
                    </div>
                  ))}
               </div>
            </div>
          )}
          
          {activeTab === 'ads' && currentUser.role === 'Admin' && (
             <div className="p-8 lg:p-14 max-w-2xl mx-auto space-y-10 bg-white min-h-full">
                <div className="bg-red-50 p-8 rounded-[3rem] border-2 border-red-100">
                   <h4 className="text-[10px] font-black uppercase text-red-600 mb-6">Shiriti i Lajmeve</h4>
                   <div className="flex gap-4">
                      <input value={tempTicker} onChange={e => setTempTicker(e.target.value)} className="flex-1 bg-white p-4 rounded-2xl text-xs font-bold outline-none" />
                      <button onClick={() => onUpdateTicker(tempTicker)} className="bg-red-600 text-white px-8 rounded-2xl font-black uppercase text-[10px]">Ruaj</button>
                   </div>
                </div>
                <div className="bg-blue-50 p-8 rounded-[3rem] border-2 border-blue-100 space-y-4">
                   <h4 className="text-[10px] font-black uppercase text-blue-600 mb-2">Marketingu Kryesor</h4>
                   <input value={tempAd.title} onChange={e => setTempAd({...tempAd, title: e.target.value})} className="w-full bg-white p-4 rounded-2xl text-xs font-bold outline-none" placeholder="Titulli" />
                   <input value={tempAd.imageUrl} onChange={e => setTempAd({...tempAd, imageUrl: e.target.value})} className="w-full bg-white p-4 rounded-2xl text-[10px] outline-none" placeholder="Foto URL" />
                   <input value={tempAd.linkUrl} onChange={e => setTempAd({...tempAd, linkUrl: e.target.value})} className="w-full bg-white p-4 rounded-2xl text-[10px] outline-none" placeholder="Link URL" />
                   <button onClick={() => onUpdateAd(tempAd)} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[10px]">Përditëso</button>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
