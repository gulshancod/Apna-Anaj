import React, { useState } from 'react';
import { Lock, ShoppingBag, Wheat, ArrowLeft, ArrowRight } from 'lucide-react';

interface AuthLoginProps {
  onLogin: (
    role: 'buyer' | 'farmer',
    identifier: string,
    password: string
  ) => Promise<void>;
  onBack: () => void;
}

export const AuthLogin: React.FC<AuthLoginProps> = ({ onLogin, onBack }) => {
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'farmer'>('buyer');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onLogin(selectedRole, identifier.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15271e] border border-[#e5dec9] dark:border-[#223f30] shadow-sm">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#1e5634] dark:text-[#4ade80] tracking-widest mb-1">
          <Lock className="w-4 h-4" />
          <span>Apna Anaj Security</span>
        </div>

        <h2 className="font-heading text-2xl font-bold text-[#1f3427] dark:text-[#f4f8f5] mb-2">
          Account Login
        </h2>

        <p className="text-xs text-[#5e7164] dark:text-[#9ab0a2] mb-6">
          Use the mobile number or email you registered with.
        </p>

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
            <span>Buyer Login</span>
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
            <span>Farmer Login</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1f3427] dark:text-[#f4f8f5] mb-1">
              Mobile Number / Email ID
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Registered mobile or email"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5dec9] dark:border-[#223f30] bg-[#fbf8ef] dark:bg-[#0d1a13] text-[#1f3427] dark:text-[#f4f8f5] text-sm focus:outline-none focus:border-[#1e5634]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1f3427] dark:text-[#f4f8f5] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
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
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1e5634] hover:bg-[#164327] disabled:opacity-60 text-white font-bold text-xs shadow-md shadow-[#1e5634]/20 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span>{isSubmitting ? 'Signing in…' : 'Login to Apna Anaj'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
