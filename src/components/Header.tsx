import React from 'react';
import { Wheat, Sprout, Heart, ShoppingBasket, Moon, Sun, LogOut, ArrowUpRight, Globe } from 'lucide-react';
import { UserRole, LanguageCode } from '../types';
import { translations } from '../data/translations';

interface HeaderProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  currentUser: {
    role: UserRole;
    name: string;
    farm?: string;
    location?: string;
    address?: string;
  };
  cartItemCount: number;
  cartTotal: number;
  favoriteCount: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenCart: () => void;
  onOpenJoinModal: (role?: 'buyer' | 'farmer') => void;
  onOpenFavorites: () => void;
  onLogout: () => void;
  onNavigateHome: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  currentUser,
  cartItemCount,
  cartTotal,
  favoriteCount,
  isDarkMode,
  onToggleTheme,
  onOpenCart,
  onOpenJoinModal,
  onOpenFavorites,
  onLogout,
  onNavigateHome,
  onNavigateTab
}) => {
  const currentLangObj = translations[currentLang] || translations.en;

  return (
    <header className="sticky top-0 z-40 bg-[#fbf8ef]/95 dark:bg-[#0e1a14]/95 backdrop-blur-md border-b border-[#e5dec9] dark:border-[#223f30] px-4 md:px-8 py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-6">
          <div 
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            role="button"
            tabIndex={0}
          >
            <div className="w-9 h-9 rounded-xl bg-[#1e5634] text-white flex items-center justify-center shadow-md shadow-[#1e5634]/20 group-hover:scale-105 transition-all">
              <Wheat className="w-5 h-5 text-[#f7c244]" />
            </div>
            <div className="flex items-center">
              <span className="font-heading font-bold text-xl md:text-2xl text-[#1f3427] dark:text-[#f4f8f5] leading-none tracking-tight">
                Apna<span className="text-[#1e5634] dark:text-[#4ade80]">Anaj</span>
              </span>
            </div>
          </div>

          {/* Quick Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 ml-2 text-sm font-semibold text-[#5e7164] dark:text-[#9ab0a2]">
            <button 
              onClick={() => onNavigateTab('view-buyer-store')}
              className="hover:text-[#1e5634] dark:hover:text-[#4ade80] transition-colors cursor-pointer"
            >
              Marketplace
            </button>
            <button 
              onClick={() => onNavigateTab('view-welcome')}
              className="hover:text-[#1e5634] dark:hover:text-[#4ade80] transition-colors cursor-pointer"
            >
              How it works
            </button>
            <button 
              onClick={() => onNavigateTab('view-welcome')}
              className="hover:text-[#1e5634] dark:hover:text-[#4ade80] transition-colors cursor-pointer"
            >
              Stories & Impact
            </button>
          </nav>
        </div>

        {/* Actions & Role State */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* User Role Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#e4f1cd] dark:bg-[#163824] border border-[#d2e5b3] dark:border-[#223f30] text-[#1e5634] dark:text-[#4ade80]">
            <span className="text-xs">🌐 {currentLangObj.name}</span>
            <span className="text-xs opacity-50">•</span>
            <span className="text-xs font-bold flex items-center gap-1">
              <span>{currentUser.role === 'farmer' ? '🧑‍🌾' : currentUser.role === 'buyer' ? '🛒' : '👤'}</span>
              <span className="truncate max-w-[110px]">
                {currentUser.role === 'guest' ? 'Guest' : currentUser.name}
              </span>
            </span>
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative inline-flex items-center">
            <Globe className="w-3.5 h-3.5 absolute left-2.5 text-[#5e7164] dark:text-[#9ab0a2] pointer-events-none" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="bg-white dark:bg-[#15271e] text-[#1f3427] dark:text-[#f4f8f5] border border-[#e5dec9] dark:border-[#223f30] text-xs font-semibold rounded-lg pl-7 pr-3 py-1.5 cursor-pointer hover:border-[#1e5634] focus:outline-none transition-colors"
            >
              {Object.keys(translations).map((key) => {
                const lang = translations[key as LanguageCode];
                return (
                  <option key={key} value={key}>
                    {lang.flag} {lang.nativeName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Favorites / Wishlist */}
          <button
            onClick={onOpenFavorites}
            className="relative p-2 rounded-lg border border-[#e5dec9] dark:border-[#223f30] bg-white dark:bg-[#15271e] text-[#1f3427] dark:text-[#f4f8f5] hover:text-[#f28b47] hover:border-[#f28b47] transition-all cursor-pointer"
            title="Saved Crops & Harvests"
            aria-label="Saved crops"
          >
            <Heart className={`w-4 h-4 ${favoriteCount > 0 ? 'fill-[#f28b47] text-[#f28b47]' : ''}`} />
            {favoriteCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#f28b47] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* Cart Basket — Buyer only */}
          {currentUser.role === 'buyer' && (
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#1e5634] hover:bg-[#164327] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#1e5634]/20 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              title="View Basket"
            >
              <ShoppingBasket className="w-4 h-4" />
              <span className="font-semibold">{cartItemCount} Items</span>
              <span className="text-white/60">•</span>
              <span>₹{cartTotal}</span>
            </button>
          )}

          {/* Join / Role Trigger */}
          {currentUser.role === 'guest' ? (
            <button
              onClick={() => onOpenJoinModal('buyer')}
              className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#1f3427] hover:bg-[#1f3427]/90 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Join <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg border border-[#e5dec9] dark:border-[#223f30] bg-white dark:bg-[#15271e] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold transition-all cursor-pointer"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg border border-[#e5dec9] dark:border-[#223f30] bg-white dark:bg-[#15271e] text-[#1f3427] dark:text-[#f4f8f5] hover:bg-[#e4f1cd] dark:hover:bg-[#163824] transition-all cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-[#f7c244]" /> : <Moon className="w-4 h-4" />}
          </button>

        </div>

      </div>
    </header>
  );
};
