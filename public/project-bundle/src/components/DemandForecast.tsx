import React from 'react';
import { TrendingUp, ArrowLeft, ArrowRight, Lightbulb, Sparkles } from 'lucide-react';
import { FarmerProduce } from '../types';

interface DemandForecastProps {
  produce: FarmerProduce;
  onNext: () => void;
  onBack: () => void;
}

export const DemandForecast: React.FC<DemandForecastProps> = ({
  produce,
  onNext,
  onBack
}) => {
  const basePrice = produce.price || 48;
  const days = [
    { label: '3 Days Ago', price: Math.round(basePrice * 0.88), type: 'past', height: '45%' },
    { label: '2 Days Ago', price: Math.round(basePrice * 0.92), type: 'past', height: '55%' },
    { label: 'Yesterday', price: Math.round(basePrice * 0.96), type: 'past', height: '68%' },
    { label: 'Today (Live)', price: basePrice, type: 'current', height: '80%' },
    { label: 'Day +2', price: Math.round(basePrice * 1.08), type: 'pred', height: '90%' },
    { label: 'Day +4', price: Math.round(basePrice * 1.15), type: 'pred', height: '95%' },
    { label: 'Day +7', price: Math.round(basePrice * 1.22), type: 'pred', height: '100%' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] shadow-sm space-y-6">
        
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#276b45] dark:text-[#4ade80] tracking-widest">
          <TrendingUp className="w-4 h-4" />
          <span>Apna Anaj AI Price Prediction Engine</span>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-bold text-[#20352b] dark:text-[#f4f8f5]">
            📈 7-Day Demand & Fair Rate Trajectory
          </h2>
          <p className="text-xs sm:text-sm text-[#6d7e73] dark:text-[#9ab0a2] mt-1">
            Real-time consumer demand curve for <strong className="text-[#20352b] dark:text-[#f4f8f5]">{produce.qty} KG {produce.crop}</strong> in 15-minute quick delivery fulfillment hubs.
          </p>
        </div>

        {/* Chart Visualization */}
        <div className="p-5 rounded-2xl bg-[#eaf5ce]/60 dark:bg-[#163824]/60 border border-[#dfe7df] dark:border-[#223f30] space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
            <span className="text-[#20352b] dark:text-[#f4f8f5]">Price Progression (₹/KG)</span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-[#6d7e73] dark:text-[#9ab0a2]">
                <span className="w-2.5 h-2.5 rounded bg-slate-300 dark:bg-slate-700" /> Historical
              </span>
              <span className="flex items-center gap-1.5 text-[#f28b47]">
                <span className="w-2.5 h-2.5 rounded bg-[#f28b47]" /> Today (₹{basePrice})
              </span>
              <span className="flex items-center gap-1.5 text-[#276b45] dark:text-[#4ade80]">
                <span className="w-2.5 h-2.5 rounded bg-[#276b45] dark:bg-[#4ade80]" /> Forecast (+22%)
              </span>
            </div>
          </div>

          {/* Bar Columns */}
          <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 border-b border-[#dfe7df] dark:border-[#223f30]">
            {days.map((d, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-[#6d7e73] dark:text-[#9ab0a2] opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{d.price}
                </span>
                <div
                  style={{ height: d.height }}
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    d.type === 'past'
                      ? 'bg-slate-300 dark:bg-slate-700'
                      : d.type === 'current'
                      ? 'bg-[#f28b47] ring-2 ring-[#f28b47]/40'
                      : 'bg-[#276b45] dark:bg-[#4ade80]'
                  }`}
                />
                <span className="text-[10px] font-bold text-[#6d7e73] dark:text-[#9ab0a2] truncate max-w-[50px] text-center">
                  {d.label}
                </span>
              </div>
            ))}
          </div>

          {/* AI Insights Card */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] text-xs">
            <Sparkles className="w-4 h-4 text-[#f28b47] shrink-0 mt-0.5" />
            <div className="text-[#20352b] dark:text-[#f4f8f5]">
              <strong>AI Market Signal:</strong> Urban household demand for pure <strong>{produce.crop}</strong> is at peak. Pooling your harvest today locks in an <strong>88% net direct payout (₹{Math.round(basePrice * 0.88)}/kg)</strong>.
            </div>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2 gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] text-[#20352b] dark:text-[#f4f8f5] font-bold text-xs hover:bg-[#eaf5ce]/50 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#276b45] hover:bg-[#1e5636] text-white font-bold text-xs shadow-md shadow-[#276b45]/20 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <span>View Selling Recommendation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
