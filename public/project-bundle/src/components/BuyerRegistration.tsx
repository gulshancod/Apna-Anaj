import React, { useState } from 'react';
import { ShoppingBag, Zap, ArrowLeft, ArrowRight } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';

interface BuyerRegistrationProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onSubmitBuyer: (data: { name: string; address: string; phone: string }) => void;
  onBack: () => void;
}

export const BuyerRegistration: React.FC<BuyerRegistrationProps> = ({
  currentLang,
  onLanguageChange,
  onSubmitBuyer,
  onBack
}) => {
  const [name, setName] = useState('Krish Kumar');
  const [phone, setPhone] = useState('9625700458');
  const [address, setAddress] = useState('Ghaziabad, Uttar Pradesh');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitBuyer({ name, address, phone });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] shadow-sm">
        
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#f28b47] tracking-widest mb-1">
          <Zap className="w-4 h-4" />
          <span>Apna Anaj 15-Min Express Delivery</span>
        </div>

        <h2 className="font-heading text-2xl font-bold text-[#20352b] dark:text-[#f4f8f5] mb-2">
          🛒 Buyer Setup (खरीदार प्रोफाइल)
        </h2>

        <p className="text-xs sm:text-sm text-[#6d7e73] dark:text-[#9ab0a2] mb-6">
          Enter your delivery address for farm-fresh grains, vegetables and dairy in 15 minutes:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-[#20352b] dark:text-[#f4f8f5] mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Krish Kumar"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] bg-[#faf5e8] dark:bg-[#0e1a14] text-[#20352b] dark:text-[#f4f8f5] text-sm focus:outline-none focus:border-[#276b45]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20352b] dark:text-[#f4f8f5] mb-1">
              Mobile Number (फॉर लाइव ऑर्डर ट्रैकिंग)
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10 digit mobile number"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] bg-[#faf5e8] dark:bg-[#0e1a14] text-[#20352b] dark:text-[#f4f8f5] text-sm focus:outline-none focus:border-[#276b45]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20352b] dark:text-[#f4f8f5] mb-1">
              Delivery Address (घर का पता व शहर)
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House/Flat No, Area, City, Pincode"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] bg-[#faf5e8] dark:bg-[#0e1a14] text-[#20352b] dark:text-[#f4f8f5] text-sm focus:outline-none focus:border-[#276b45]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20352b] dark:text-[#f4f8f5] mb-1">
              Preferred Language
            </label>
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] bg-[#faf5e8] dark:bg-[#0e1a14] text-[#20352b] dark:text-[#f4f8f5] text-sm focus:outline-none focus:border-[#276b45]"
            >
              {Object.keys(translations).map((k) => (
                <option key={k} value={k}>
                  {translations[k as LanguageCode].flag} {translations[k as LanguageCode].nativeName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between pt-4 gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] text-[#20352b] dark:text-[#f4f8f5] font-bold text-xs hover:bg-[#eaf5ce]/50 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#276b45] hover:bg-[#1e5636] text-white font-bold text-xs shadow-md shadow-[#276b45]/20 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span>Open Fresh Store</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
