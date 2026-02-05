
import React, { useState } from 'react';
import { NewsItem } from '../types';
import { summarizeNews } from '../services/geminiService';

interface NewsCardProps {
  item: NewsItem;
  variant?: 'vertical' | 'horizontal';
}

const NewsCard: React.FC<NewsCardProps> = ({ item, variant = 'vertical' }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAIAction = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Mos lejo hapjen e lajmit kur klikohet AI
    if (summary) {
      setSummary(null);
      return;
    }
    setLoading(true);
    const result = await summarizeNews(item.title, item.excerpt);
    setSummary(result);
    setLoading(false);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'showbiz': return 'bg-pink-600 text-white';
      case 'sport': return 'bg-green-600 text-white';
      case 'komuna': return 'bg-red-700 text-white';
      case 'politikë': return 'bg-blue-800 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (variant === 'horizontal') {
    return (
      <div className="group flex gap-4 bg-white p-4 rounded-3xl border border-gray-100 hover:border-red-100 transition-all duration-300 hover:shadow-lg">
        <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-2xl">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="flex-1">
          <span className={`${getCategoryColor(item.category)} text-[8px] uppercase font-black px-2 py-0.5 rounded-sm mb-2 inline-block tracking-tighter`}>
            {item.category}
          </span>
          <h3 className="text-xs font-black leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
            {item.title}
          </h3>
          <p className="text-[10px] text-gray-400 mt-2 font-bold">{item.date}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100">
      <div className="relative overflow-hidden aspect-[16/10]">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute top-4 left-4">
          <span className={`${getCategoryColor(item.category)} text-[10px] uppercase font-black px-4 py-1 rounded-full shadow-lg tracking-widest`}>
            {item.category}
          </span>
        </div>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl scale-90 group-hover:scale-100 transition-transform">Lexo artikullin</span>
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
            <i className="far fa-clock mr-1 text-red-600"></i> {item.date}
          </span>
          <button 
            onClick={handleAIAction}
            className="w-8 h-8 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-full transition-all flex items-center justify-center"
            title="Përmbledhje me Inteligjencë Artificiale"
          >
            <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-wand-sparkles'}`}></i>
          </button>
        </div>

        <h3 className="text-xl font-black mb-4 leading-snug group-hover:text-red-600 transition-colors">
          {item.title}
        </h3>

        {summary ? (
          <div className="bg-indigo-50 p-4 rounded-2xl mb-4 text-xs text-indigo-900 border-l-4 border-indigo-400 animate-fade-in font-medium leading-relaxed">
            <p className="font-black mb-2 uppercase tracking-widest text-[9px] opacity-60">Përmbledhja AI:</p>
            {summary}
          </div>
        ) : (
          <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
            {item.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
          <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">
            Nga: {item.author}
          </span>
          <div className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
            Lexo <i className="fas fa-chevron-right text-[8px]"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
