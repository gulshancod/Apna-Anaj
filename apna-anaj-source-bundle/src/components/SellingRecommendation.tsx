import React from 'react';
import { Lightbulb, ArrowLeft, ArrowRight, TrendingUp, CheckCircle2 } from 'lucide-react';
import { FarmerProduce } from '../types';

interface SellingRecommendationProps {
  produce: FarmerProduce;
  onNext: () => void;
  onBack: () => void;
}

export const SellingRecommendation: React.FC<SellingRecommendationProps> = ({
  produce,
  onNext,
  onBack
}) => {
  const basePrice = produce.price || 48;
  const netRate = (basePrice * 0.88).toFixed(2);
  const totalNet = Math.round(produce.qty * Number(netRate));

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] shadow-sm space-y-6">
        
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#276b45] dark:text-[#4ade80] tracking-widest">
          <Lightbulb className="w-4 h-4" />
          <span>Profit Maximization Analysis</span>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-bold text-[#20352b] dark:text-[#f4f8f5]">
            💡 Best Channel Recommendation
          </h2>
          <p className="text-xs sm:text-sm text-[#6d7e73] dark:text-[#9ab0a2] mt-1">
            Comparative analysis of Apna Anaj direct payout vs traditional local mandi:
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#eaf5ce] dark:bg-[#163824] border border-[#dfe7df] dark:border-[#223f30] space-y-4">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#276b45] text-white text-[11px] font-extrabold uppercase">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Highest Net Farmer Margin (98% Confidence)</span>
          </div>

          <div className="space-y-1">
            <h3 className="font-heading text-xl font-bold text-[#20352b] dark:text-[#f4f8f5]">
              Crop: 🌾 {produce.crop} ({produce.qty} KG Batch)
            </h3>
            <p className="text-xs text-[#6d7e73] dark:text-[#9ab0a2]">
              Fulfillment: <strong>Apna Anaj 15-Minute Local Urban Hub</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30]">
              <span className="text-[10px] text-[#6d7e73] dark:text-[#9ab0a2] font-bold uppercase">
                Shared Cold EV Freight
              </span>
              <div className="font-bold text-sm text-[#20352b] dark:text-[#f4f8f5]">
                ₹2.50 / KG
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30]">
              <span className="text-[10px] text-[#276b45] dark:text-[#4ade80] font-bold uppercase">
                Net Payout to Bank
              </span>
              <div className="font-bold text-base text-[#276b45] dark:text-[#4ade80]">
                ₹{netRate} / KG
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-[#15271e]/80 border border-[#dfe7df] dark:border-[#223f30] text-xs text-[#20352b] dark:text-[#f4f8f5]">
            💬 <strong>Financial Summary:</strong> Direct dispatch generates <strong className="text-[#276b45] dark:text-[#4ade80]">₹{totalNet.toLocaleString()} net profit</strong>—over <strong>+35% higher return</strong> than selling to middlemen at traditional APMC auctions.
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
            <span>View Buyer Matching</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
