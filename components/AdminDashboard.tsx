
import React, { useState } from 'react';
import { NewsItem, Category } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
  onAddNews: (item: NewsItem) => void;
  onDelete: (id: string) => void;
  currentNews: NewsItem[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onAddNews, onDelete, currentNews }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState<Category>('Drenica');
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/seed/' + Math.random() + '/1200/800');
  const [author, setAuthor] = useState('Redaksia');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Fjalëkalimi i gabuar!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: NewsItem = {
      id: Date.now().toString(),
      title,
      excerpt,
      category,
      image: imageUrl,
      date: 'Sapo u publikua',
      author,
      isFeatured: true
    };
    onAddNews(newItem);
    setTitle('');
    setExcerpt('');
    alert('U publikua!');
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 lg:p-10 max-w-sm w-full shadow-2xl">
          <h2 className="text-xl font-black uppercase text-center mb-6 tracking-tighter">Login Redaksia</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border p-4 rounded-xl outline-none focus:border-red-600 font-bold text-center"
              placeholder="admin123"
            />
            <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest">Hyr</button>
            <button onClick={onClose} type="button" className="w-full text-gray-400 text-[10px] font-bold uppercase">Mbyll</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-[100] overflow-y-auto lg:p-10">
      <div className="bg-white min-h-screen lg:min-h-0 lg:rounded-[2rem] w-full max-w-6xl mx-auto shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Form - Shfaqet e para në mobile */}
        <div className="p-6 lg:p-10 lg:w-3/5 border-b lg:border-r border-gray-100">
          <div className="flex justify-between items-center mb-6 lg:mb-10">
            <h2 className="text-xl lg:text-2xl font-black uppercase italic">Shto Lajm</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 text-gray-400">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-gray-50 border p-3 lg:p-4 rounded-xl outline-none focus:border-red-600 font-bold text-sm" placeholder="Titulli..." />
            
            <div className="grid grid-cols-2 gap-4">
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="bg-gray-50 border p-3 rounded-xl font-bold text-xs">
                <option value="Drenica">Drenica</option>
                <option value="Showbiz">Showbiz</option>
                <option value="Politikë">Politikë</option>
                <option value="Sport">Sport</option>
              </select>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} className="bg-gray-50 border p-3 rounded-xl font-bold text-xs" />
            </div>

            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-gray-50 border p-3 rounded-xl font-mono text-[9px]" placeholder="URL e fotos..." />
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required rows={4} className="w-full bg-gray-50 border p-3 rounded-xl text-sm" placeholder="Teksti i lajmit..."></textarea>

            <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all">Publiko Lajmin</button>
          </form>
        </div>

        {/* List Section - Menaxhimi i lajmeve */}
        <div className="bg-gray-50 p-6 lg:p-10 lg:w-2/5 overflow-y-auto max-h-[400px] lg:max-h-screen">
          <h3 className="font-black uppercase text-[10px] tracking-widest text-gray-400 mb-6">Lajmet Ekzistuese</h3>
          <div className="space-y-3">
            {currentNews.slice(0, 15).map(n => (
              <div key={n.id} className="bg-white p-3 rounded-xl border flex justify-between items-center shadow-sm">
                <div className="flex gap-3 items-center min-w-0">
                  <img src={n.image} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <h4 className="text-[10px] font-black truncate">{n.title}</h4>
                </div>
                <button onClick={() => onDelete(n.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all">
                  <i className="fas fa-trash-alt text-[10px]"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
