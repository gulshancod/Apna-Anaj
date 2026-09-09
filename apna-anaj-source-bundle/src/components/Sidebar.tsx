import React from 'react';
import { 
  Compass, 
  Store, 
  KeyRound, 
  LayoutDashboard, 
  Sprout, 
  TrendingUp, 
  Lightbulb, 
  Handshake, 
  Boxes, 
  Truck, 
  Scale, 
  PackageOpen, 
  Zap, 
  Bike, 
  History 
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
  currentUser: {
    role: UserRole;
    name: string;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  currentUser
}) => {
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-[#fbf8ef] dark:bg-[#15271e] border-r border-[#e5dec9] dark:border-[#223f30] p-4 sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto z-30 transition-colors">
      
      {/* Guest Mode Navigation */}
      {currentUser.role === 'guest' && (
        <div className="space-y-1">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#7a887e] dark:text-[#9ab0a2] px-3 py-2">
            Start Journey
          </div>
          
          <button
            onClick={() => onTabChange('view-welcome')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              currentTab === 'view-welcome'
                ? 'bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] dark:text-[#4ade80] border border-[#bed99f] dark:border-[#223f30]'
                : 'text-[#5e7164] dark:text-[#9ab0a2] hover:bg-[#e4f1cd]/60 hover:text-[#1e5634]'
            }`}
          >
            <Compass className="w-4 h-4 text-[#1e5634]" />
            <span>1. Welcome & Role</span>
          </button>

          <button
            onClick={() => onTabChange('view-buyer-store')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              currentTab === 'view-buyer-store'
                ? 'bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] dark:text-[#4ade80] border border-[#bed99f] dark:border-[#223f30]'
                : 'text-[#5e7164] dark:text-[#9ab0a2] hover:bg-[#e4f1cd]/60 hover:text-[#1e5634]'
            }`}
          >
            <Store className="w-4 h-4 text-[#1e5634]" />
            <span>2. Fresh Anaj Store</span>
          </button>

          <button
            onClick={() => onTabChange('view-auth')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              currentTab === 'view-auth'
                ? 'bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] dark:text-[#4ade80] border border-[#bed99f] dark:border-[#223f30]'
                : 'text-[#5e7164] dark:text-[#9ab0a2] hover:bg-[#e4f1cd]/60 hover:text-[#1e5634]'
            }`}
          >
            <KeyRound className="w-4 h-4 text-[#1e5634]" />
            <span>3. Existing Login</span>
          </button>
        </div>
      )}

      {/* Farmer Portal Navigation */}
      {currentUser.role === 'farmer' && (
        <div className="space-y-1">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#1e5634] dark:text-[#4ade80] px-3 py-2 flex items-center gap-1.5">
            <span>🧑‍🌾 Farmer Portal</span>
          </div>

          <button
            onClick={() => onTabChange('view-farmer-dash')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              currentTab === 'view-farmer-dash'
                ? 'bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] dark:text-[#4ade80] border border-[#bed99f] dark:border-[#223f30]'
                : 'text-[#5e7164] dark:text-[#9ab0a2] hover:bg-[#e4f1cd]/60 hover:text-[#1e5634]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#1e5634]" />
            <span>1. Dashboard</span>
          </button>

          <button
            onClick={() => onTabChange('view-add-produce')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              currentTab === 'view-add-produce'
                ? 'bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] dark:text-[#4ade80] border border-[#bed99f] dark:border-[#223f30]'
                : 'text-[#5e7164] dark:text-[#9ab0a2] hover:bg-[#e4f1cd]/60 hover:text-[#1e5634]'
            }`}
          >
            <Sprout className="w-4 h-4 text-[#1e5634]" />
            <span>2. Add Harvest / Anaj</span>
          </button>

          <button
            onClick={() => onTabChange('view-demand-forecast')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              currentTab === 'view-demand-forecast'
                ? 'bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] dark:text-[#4ade80] border border-[#bed99f] dark:border-[#223f30]'
                : 'text-[#5e7164] dark:text-[#9ab0a2] hover:bg-[#e4f1cd]/60 hover:text-[#1e5634]'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#1e5634]" />
            <span>3. AI Demand Forecast</span>
          </button>

          <button
            onClick={() => onTabChange('view-selling-rec')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              currentTab === 'view-selling-rec'
                ? 'bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] dark:text-[#4ade80] border border-[#bed99f] dark:border-[#223f30]'
                : 'text-[#5e7164] dark:text-[#9ab0a2] hover:bg-[#e4f1cd]/60 hover:text-[#1e5634]'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-[#1e5634]" />
            <span>4. Selling Rec</span>
          </button>

          <button
            onClick={() => onTabChange('view-matching')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              currentTab === 'view-matching'
                ? 'bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] dark:text-[#4ade80] border border-[#bed99f] dark:border-[#223f30]'
                : 'text-[#5e7164] dark:text-[#9ab0a2] hover:bg-[#e4f1cd]/60 hover:text-[#1e5634]'
            }`}
          >
            <Handshake className="w-4 h-4 text-[#1e5634]" />
            <span>5. Buyer Matching</span>
          </button>

          <button
            onClick={() => onTabChange('view-pooling')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              currentTab === 'view-pooling'
                ? 'bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] dark:text-[#4ade80] border border-[#bed99f] dark:border-[#223f30]'
                : 'text-[#5e7164] dark:text-[#9ab0a2] hover:bg-[#e4f1cd]/60 hover:text-[#1e5634]'
            }`}
          >
            <Boxes className="w-4 h-4 text-[#1e5634]" />
            <span>6. Quantity Pooling</span>
          </button>

          <button
            onClick={() => onTabChange('view-route')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              currentTab === 'view-route'
                ? 'bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] dark:text-[#4ade80] border border-[#bed99f] dark:border-[#223f30]'
                : 'text-[#5e7164] dark:text-[#9ab0a2] hover:bg-[#e4f1cd]/60 hover:text-[#1e5634]'
            }`}
          >
            <Truck className="w-4 h-4 text-[#1e5634]" />
            <span>7. EV Pickup Route</span>
          </button>

          <button
            onClick={() => onTabChange('view-transparency')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              currentTab === 'view-transparency'
                ? 'bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] dark:text-[#4ade80] border border-[#bed99f] dark:border-[#223f30]'
                : 'text-[#5e7164] dark:text-[#9ab0a2] hover:bg-[#e4f1cd]/60 hover:text-[#1e5634]'
            }`}
          >
            <Scale className="w-4 h-4 text-[#1e5634]" />
            <span>8. Price Transparency</span>
          </button>

          <button
            onClick={() => onTabChange('view-orders')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              currentTab === 'view-orders'
                ? 'bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] dark:text-[#4ade80] border border-[#bed99f] dark:border-[#223f30]'
                : 'text-[#5e7164] dark:text-[#9ab0a2] hover:bg-[#e4f1cd]/60 hover:text-[#1e5634]'
            }`}
          >
            <PackageOpen className="w-4 h-4 text-[#1e5634]" />
            <span>9. Dispatched Batches</span>
          </button>
        </div>
      )}

      {/* Buyer Mode Navigation */}
      {currentUser.role === 'buyer' && (
        <div className="space-y-1">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#1e5634] dark:text-[#4ade80] px-3 py-2 flex items-center gap-1.5">
            <span>🛒 Fresh Store</span>
          </div>

          <button
            onClick={() => onTabChange('view-buyer-store')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              currentTab === 'view-buyer-store'
                ? 'bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] dark:text-[#4ade80] border border-[#bed99f] dark:border-[#223f30]'
                : 'text-[#5e7164] dark:text-[#9ab0a2] hover:bg-[#e4f1cd]/60 hover:text-[#1e5634]'
            }`}
          >
            <Zap className="w-4 h-4 text-[#f28b47]" />
            <span>1. Fresh Farm Store</span>
          </button>

          <button
            onClick={() => onTabChange('view-buyer-tracking')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              currentTab === 'view-buyer-tracking'
                ? 'bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] dark:text-[#4ade80] border border-[#bed99f] dark:border-[#223f30]'
                : 'text-[#5e7164] dark:text-[#9ab0a2] hover:bg-[#e4f1cd]/60 hover:text-[#1e5634]'
            }`}
          >
            <Bike className="w-4 h-4 text-[#1e5634]" />
            <span>2. Live 15-Min Tracking</span>
          </button>

          <button
            onClick={() => onTabChange('view-orders')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              currentTab === 'view-orders'
                ? 'bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] dark:text-[#4ade80] border border-[#bed99f] dark:border-[#223f30]'
                : 'text-[#5e7164] dark:text-[#9ab0a2] hover:bg-[#e4f1cd]/60 hover:text-[#1e5634]'
            }`}
          >
            <History className="w-4 h-4 text-[#1e5634]" />
            <span>3. Order History & Impact</span>
          </button>
        </div>
      )}

      {/* Footer Info in Sidebar */}
      <div className="mt-auto pt-4 border-t border-[#e5dec9] dark:border-[#223f30] text-[11px] text-[#5e7164] dark:text-[#9ab0a2]">
        <div className="flex items-center gap-1.5 font-bold text-[#1e5634] dark:text-[#4ade80]">
          <span>🌾 Apna Anaj</span>
        </div>
        <p className="text-[10px] mt-1 text-[#5e7164]/80">
          Zero middleman fees • 88% farmer payout guarantee
        </p>
      </div>

    </aside>
  );
};
