import React, { useState } from 'react';
import { Lock, ShoppingBag, Wheat, ArrowLeft, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

interface AuthLoginProps {
  onLogin: (role: 'buyer' | 'farmer', name: string) => void;
  onBack: () => void;
}

export const AuthLogin: React.FC<AuthLoginProps> = ({ onLogin, onBack }) => {
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'farmer'>('buyer');
  const [identifier, setIdentifier] = useState('9625700458');
  const [password, setPassword] = useState('123456');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userName = selectedRole === 'farmer' ? 'Ramesh Kumar' : 'Krish Kumar';
    onLogin(selectedRole, userName);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15271e] border border-[#e5dec9] dark:border-[#223f30] shadow-sm">
        
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#1e5634] dark:text-[#4ade80] tracking-widest mb-1">
          <Lock className="w-4 h-4" />
          <span>Apna Anaj Security</span>
        </div>

        <h2 className="font-heading text-2xl font-bold text-[#1f3427] dark:text-[#f4f8f5] mb-2">
          Account Login (लॉगिन)
        </h2>

        <p className="text-xs text-[#5e7164] dark:text-[#9ab0a2] mb-6">
          Choose your account type to access your active portal:
        </p>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            onClick={() => setSelectedRole('buyer')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRole === 'buyer'
                ? 'bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] dark:text-[#4ade80] border-2 border-[#1e5634]'
                : 'bg-[#fbf8ef] dark:bg-[#0d1a13] text-[#5e7164] dark:text-[#9ab0a2] border border-[#e5dec9] dark:border-[#223f30]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>🛒 Buyer Login</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('farmer')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRole === 'farmer'
                ? 'bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] dark:text-[#4ade80] border-2 border-[#1e5634]'
                : 'bg-[#fbf8ef] dark:bg-[#0d1a13] text-[#5e7164] dark:text-[#9ab0a2] border border-[#e5dec9] dark:border-[#223f30]'
            }`}
          >
            <Wheat className="w-4 h-4" />
            <span>🧑‍🌾 Farmer Login</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1f3427] dark:text-[#f4f8f5] mb-1">
              Mobile Number / Email ID
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Registered mobile or email"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dec9] dark:border-[#223f30] bg-[#fbf8ef] dark:bg-[#0d1a13] text-[#1f3427] dark:text-[#f4f8f5] text-sm focus:outline-none focus:border-[#1e5634]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1f3427] dark:text-[#f4f8f5] mb-1">
              Password or OTP (One-Time Password)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password or OTP"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dec9] dark:border-[#223f30] bg-[#fbf8ef] dark:bg-[#0d1a13] text-[#1f3427] dark:text-[#f4f8f5] text-sm focus:outline-none focus:border-[#1e5634]"
            />
          </div>

          <div className="flex items-center justify-between pt-4 gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#e5dec9] dark:border-[#223f30] text-[#1f3427] dark:text-[#f4f8f5] font-bold text-xs hover:bg-[#e4f1cd]/50 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1e5634] hover:bg-[#164327] text-white font-bold text-xs shadow-md shadow-[#1e5634]/20 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span>Login to Apna Anaj</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

