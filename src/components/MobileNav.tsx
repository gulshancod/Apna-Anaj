import React from 'react';
import { LayoutDashboard, Store, Bike, History, Sprout, TrendingUp, PackageOpen } from 'lucide-react';
import { UserRole } from '../types';

interface MobileNavProps {
  role: UserRole;
  currentTab: string;
  onNavigate: (tabId: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ role, currentTab, onNavigate }) => {
  if (role !== 'buyer' && role !== 'farmer') return null;

  const items = role === 'farmer'
    ? [
        { id: 'view-farmer-dash', label: 'Home', icon: LayoutDashboard },
        { id: 'view-add-produce', label: 'Crop', icon: Sprout },
        { id: 'view-demand-forecast', label: 'AI', icon: TrendingUp },
        { id: 'view-orders', label: 'Orders', icon: PackageOpen },
      ]
    : [
        { id: 'view-buyer-store', label: 'Market', icon: Store },
        { id: 'view-buyer-tracking', label: 'Track', icon: Bike },
        { id: 'view-orders', label: 'Orders', icon: History },
      ];

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-[70] md:hidden rounded-2xl border border-white/60 dark:border-[#294536] bg-white/95 dark:bg-[#102219]/95 shadow-[0_18px_40px_rgba(15,35,24,0.18)] backdrop-blur-xl px-2 py-2">
      <div className={`grid gap-1 ${role === "farmer" ? "grid-cols-4" : "grid-cols-3"}`}>
        {items.map((item, index) => {
          const Icon = item.icon;
          const active = currentTab === item.id;
          return (
            <button
              key={`${item.id}-${index}`}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold transition-all ${
                active
                  ? 'bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] dark:text-[#4ade80]'
                  : 'text-[#6d7e73] dark:text-[#9ab0a2] hover:bg-[#f5f8f3] dark:hover:bg-[#15271e]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
