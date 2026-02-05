
import React, { useState } from 'react';
import { ContactRequest } from '../types';

interface ContactModalProps {
  onClose: () => void;
  onSubmit: (request: Omit<ContactRequest, 'id' | 'date' | 'status'>) => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose, onSubmit }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    onSubmit(formData);
    setTimeout(() => {
      setStatus('success');
    }, 800);
  };

  if (status === 'success') {
    return (
      <div className="fixed inset-0 bg-black/80 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full text-center animate-scale-up">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            <i className="fas fa-check"></i>
          </div>
          <h2 className="text-2xl font-black uppercase mb-4">Kërkesa u dërgua!</h2>
          <p className="text-gray-500 mb-8 font-medium">
            Faleminderit që zgjodhët Skenderaj Live. Kërkesa juaj u dërgua me sukses dhe do të shqyrtohet nga <strong>Redaksia jonë</strong> së shpejti. Do t'ju kontaktojmë në detajet e lëna.
          </p>
          <button onClick={onClose} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-600 transition-all">Mbyll</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[3rem] p-8 lg:p-12 max-w-lg w-full shadow-2xl animate-scale-up relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-red-600 transition-colors">
          <i className="fas fa-times text-xl"></i>
        </button>
        
        <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Rezervo Reklamën</h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Plotësoni të dhënat dhe redaksia do t'ju kontaktojë</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Emri i Biznesit / Personit</label>
            <input 
              required 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-gray-50 border border-transparent focus:border-red-600 p-4 rounded-2xl outline-none font-bold text-sm transition-all" 
              placeholder="Emri juaj" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Email Adresa</label>
              <input 
                required 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-gray-50 border border-transparent focus:border-red-600 p-4 rounded-2xl outline-none font-bold text-sm transition-all" 
                placeholder="emri@gmail.com" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Telefoni</label>
              <input 
                required 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-gray-50 border border-transparent focus:border-red-600 p-4 rounded-2xl outline-none font-bold text-sm transition-all" 
                placeholder="+383..." 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Mesazhi / Detajet</label>
            <textarea 
              required 
              rows={4} 
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full bg-gray-50 border border-transparent focus:border-red-600 p-4 rounded-2xl outline-none text-sm transition-all" 
              placeholder="Përshkruani llojin e reklamës..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={status === 'sending'}
            className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl hover:bg-black transition-all disabled:opacity-50"
          >
            {status === 'sending' ? 'Duke u dërguar...' : 'Dërgo Kërkesën te Redaksia'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
