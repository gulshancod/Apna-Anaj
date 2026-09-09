import React from 'react';
import { Scale, ArrowLeft, ArrowRight, ShieldCheck, ArrowDown } from 'lucide-react';
import { FarmerProduce } from '../types';

interface PriceTransparencyProps {
  produce: FarmerProduce;
  onNext: () => void;
  onBack: () => void;
}

export const PriceTransparency: React.FC<PriceTransparencyProps> = ({
  produce,
  onNext,
  onBack
}) => {
  const consumerPrice = produce.price || 48;
  const farmerRate = (consumerPrice * 0.88).toFixed(2);
  const logisticsRate = '2.50';
  const packRate = (consumerPrice - Number(farmerRate) - Number(logisticsRate)).toFixed(2);
  const totalPayout = Math.round(produce.qty * Number(farmerRate));

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] shadow-sm space-y-6">
        
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#276b45] dark:text-[#4ade80] tracking-widest">
          <Scale className="w-4 h-4" />
          <span>Zero Commission Guarantee</span>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-bold text-[#20352b] dark:text-[#f4f8f5]">
            💰 100% Transparent Price Breakdown
          </h2>
          <p className="text-xs sm:text-sm text-[#6d7e73] dark:text-[#9ab0a2] mt-1">
            Every rupee from consumer checkout is accounted for. Farmer receives 88% net directly:
          </p>
        </div>

        {/* Waterfall Breakdown */}
        <div className="space-y-2">
          
          <div className="p-4 rounded-2xl bg-[#eaf5ce] dark:bg-[#163824] border border-[#276b45]/30 flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-[#20352b] dark:text-[#f4f8f5]">
                1. Farmer Direct Bank Deposit
              </div>
              <div className="text-[10px] text-[#6d7e73] dark:text-[#9ab0a2]">
                88% of Consumer Price (Guaranteed)
              </div>
            </div>
            <div className="font-heading font-bold text-lg text-[#276b45] dark:text-[#4ade80]">
              ₹{farmerRate} / KG
            </div>
          </div>

          <div className="flex justify-center text-[#276b45] dark:text-[#4ade80]">
            <ArrowDown className="w-4 h-4" />
          </div>

          <div className="p-4 rounded-2xl bg-[#faf5e8] dark:bg-[#0e1a14] border border-[#dfe7df] dark:border-[#223f30] flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-[#20352b] dark:text-[#f4f8f5]">
                2. Shared Cold EV Logistics
              </div>
              <div className="text-[10px] text-[#6d7e73] dark:text-[#9ab0a2]">
                Farm-to-hub aggregated route
              </div>
            </div>
            <div className="font-bold text-sm text-[#20352b] dark:text-[#f4f8f5]">
              + ₹{logisticsRate} / KG
            </div>
          </div>

          <div className="flex justify-center text-[#276b45] dark:text-[#4ade80]">
            <ArrowDown className="w-4 h-4" />
          </div>

          <div className="p-4 rounded-2xl bg-[#faf5e8] dark:bg-[#0e1a14] border border-[#dfe7df] dark:border-[#223f30] flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-[#20352b] dark:text-[#f4f8f5]">
                3. Quality Grading & Eco-Pack
              </div>
              <div className="text-[10px] text-[#6d7e73] dark:text-[#9ab0a2]">
                Zero-plastic breathable bags
              </div>
            </div>
            <div className="font-bold text-sm text-[#20352b] dark:text-[#f4f8f5]">
              + ₹{packRate} / KG
            </div>
          </div>

          <div className="flex justify-center text-[#f28b47]">
            <ArrowDown className="w-4 h-4" />
          </div>

          <div className="p-4 rounded-2xl bg-[#fff3ec] dark:bg-[#3d2314] border border-[#f28b47]/30 flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-[#f28b47]">
                Total Consumer Doorstep Price
              </div>
              <div className="text-[10px] text-[#6d7e73] dark:text-[#9ab0a2]">
                15-minute quick delivery
              </div>
            </div>
            <div className="font-heading font-bold text-xl text-[#f28b47]">
              ₹{consumerPrice}.00 / KG
            </div>
          </div>

        </div>

        {/* Total Batch Payout Callout */}
        <div className="p-5 rounded-2xl bg-[#276b45] text-white text-center shadow-md space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-[#f8ce58] tracking-wider">
            Total Net Payout ({produce.qty} KG {produce.crop.toUpperCase()})
          </span>
          <div className="font-heading font-bold text-3xl text-white">
            ₹{totalPayout.toLocaleString()}
          </div>
          <p className="text-[11px] text-white/80">
            Transferred automatically to your bank account upon EV pickup verification.
          </p>
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
            <span>View Active Batches</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
