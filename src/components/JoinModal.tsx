import React, { useState } from 'react';
import { X, ShoppingBag, Wheat, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

interface JoinModalProps {
  isOpen: boolean;
  initialRole: 'buyer' | 'farmer';
  onClose: () => void;
  onConfirmJoin: (role: 'buyer' | 'farmer', name: string, phone: string) => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({
  isOpen,
  initialRole,
  onClose,
  onConfirmJoin
}) => {
  const [role, setRole] = useState<'buyer' | 'farmer'>(initialRole || 'buyer');
  const [name, setName] = useState(initialRole === 'farmer' ? 'Ramesh Kumar' : 'Krish Kumar');
  const [phone, setPhone] = useState('9876543210');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmJoin(role, name || (role === 'farmer' ? 'Ramesh Kumar' : 'Krish Kumar'), phone);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fadeIn cursor-pointer"
      />

      <div className="relative w-full max-w-md bg-[#faf5e8] dark:bg-[#0e1a14] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#dfe7df] dark:border-[#223f30] z-10 space-y-5 animate-scaleUp">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-[#6d7e73] hover:text-[#20352b] dark:hover:text-white cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#276b45] dark:text-[#4ade80]">
            Join Apna Anaj
          </span>
          <h2 className="font-heading text-2xl font-bold text-[#20352b] dark:text-[#f4f8f5] mt-1">
            Let's get you connected.
          </h2>
          <p className="text-xs text-[#6d7e73] dark:text-[#9ab0a2] mt-0.5">
            Choose how you want to experience pure Indian harvest:
          </p>
        </div>

        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              role === 'buyer'
                ? 'bg-[#eaf5ce] dark:bg-[#163824] border-[#276b45] text-[#276b45] dark:text-[#4ade80]'
                : 'bg-white dark:bg-[#15271e] border-[#dfe7df] dark:border-[#223f30] text-[#6d7e73] dark:text-[#9ab0a2]'
            }`}
          >
            <ShoppingBag className="w-5 h-5 mb-1.5" />
            <div className="font-bold text-xs text-[#20352b] dark:text-[#f4f8f5]">I want to buy</div>
            <div className="text-[10px] text-[#6d7e73] dark:text-[#9ab0a2]">15-min delivery</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              role === 'farmer'
                ? 'bg-[#eaf5ce] dark:bg-[#163824] border-[#276b45] text-[#276b45] dark:text-[#4ade80]'
                : 'bg-white dark:bg-[#15271e] border-[#dfe7df] dark:border-[#223f30] text-[#6d7e73] dark:text-[#9ab0a2]'
            }`}
          >
            <Wheat className="w-5 h-5 mb-1.5" />
            <div className="font-bold text-xs text-[#20352b] dark:text-[#f4f8f5]">I want to sell</div>
            <div className="text-[10px] text-[#6d7e73] dark:text-[#9ab0a2]">Direct fair rates</div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#20352b] dark:text-[#f4f8f5] mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar or Krish Kumar"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] bg-white dark:bg-[#15271e] text-[#20352b] dark:text-[#f4f8f5] text-xs focus:outline-none focus:border-[#276b45]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20352b] dark:text-[#f4f8f5] mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] bg-white dark:bg-[#15271e] text-[#20352b] dark:text-[#f4f8f5] text-xs focus:outline-none focus:border-[#276b45]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#276b45] hover:bg-[#1e5636] text-white text-xs font-bold shadow-md shadow-[#276b45]/20 flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
          >
            <span>Create Apna Anaj Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
