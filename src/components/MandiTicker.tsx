import React from 'react';
import { mandiRates } from '../data/mockData';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

export const MandiTicker: React.FC = () => {
  return (
    <div className="bg-[#1e5634] dark:bg-[#12281c] text-white text-xs font-semibold py-2 overflow-hidden border-b border-[#164327] dark:border-[#223f30] select-none z-30 relative transition-colors">
      <div className="animate-marquee flex items-center gap-8">
        {mandiRates.concat(mandiRates).map((rate, idx) => (
          <div key={`${rate.id}-${idx}`} className="inline-flex items-center gap-2 font-medium">
            <span className="text-[#f7c244] font-bold">🌾 {rate.mandi}:</span>
            <span>{rate.commodity}</span>
            <span className="text-white/80">Mandi ₹{rate.price}/{rate.unit.replace('₹/', '')}</span>
            <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${rate.isUp ? 'text-[#d9efb7]' : 'text-red-300'}`}>
              {rate.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {rate.isUp ? '+' : ''}{rate.change}%
            </span>
            <span className="bg-white/20 text-[#d9efb7] px-1.5 py-0.5 rounded text-[11px] font-bold">
              Apna Anaj: ₹{rate.apnaAnajPrice}
            </span>
            <span className="text-white/40">|</span>
          </div>
        ))}
        <div className="inline-flex items-center gap-1 text-[#f7c244] font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Apna Anaj: 88% Direct Payout to Farmers • 0% Middleman Fees!</span>
        </div>
      </div>
    </div>
  );
};

