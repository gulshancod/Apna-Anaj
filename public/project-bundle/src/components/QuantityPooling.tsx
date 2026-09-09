import React from 'react';
import { Boxes, ArrowLeft, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { FarmerProduce } from '../types';

interface QuantityPoolingProps {
  farmerName: string;
  produce: FarmerProduce;
  onNext: () => void;
  onBack: () => void;
}

export const QuantityPooling: React.FC<QuantityPoolingProps> = ({
  farmerName,
  produce,
  onNext,
  onBack
}) => {
  const totalBatch = Math.max(1000, produce.qty + 500);
  const shareA = Math.round((produce.qty / totalBatch) * 100);
  const farmerBQty = Math.round((totalBatch - produce.qty) * 0.6);
  const shareB = Math.round((farmerBQty / totalBatch) * 100);
  const farmerCQty = totalBatch - produce.qty - farmerBQty;
  const shareC = 100 - shareA - shareB;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] shadow-sm space-y-6">
        
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#276b45] dark:text-[#4ade80] tracking-widest">
          <Boxes className="w-4 h-4" />
          <span>Apna Anaj Cooperative Pooling</span>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-bold text-[#20352b] dark:text-[#f4f8f5]">
            📦 Shared Quantity Pooling
          </h2>
          <p className="text-xs sm:text-sm text-[#6d7e73] dark:text-[#9ab0a2] mt-1">
            Aggregated harvest volume from neighboring verified farms to fill cold EV transport:
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#eaf5ce] dark:bg-[#163824] border border-[#dfe7df] dark:border-[#223f30] space-y-5">
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#6d7e73] dark:text-[#9ab0a2] tracking-wider">
                Full Pooled Volume
              </span>
              <h3 className="font-heading text-2xl font-bold text-[#20352b] dark:text-[#f4f8f5]">
                🌾 {totalBatch.toLocaleString()} KG {produce.crop}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#276b45] text-white text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Target Met</span>
            </span>
          </div>

          {/* Progress Bar for Shares */}
          <div className="space-y-1.5">
            <div className="h-3 w-full bg-white dark:bg-[#15271e] rounded-full overflow-hidden flex">
              <div style={{ width: `${shareA}%` }} className="bg-[#276b45] h-full" title={`You: ${shareA}%`} />
              <div style={{ width: `${shareB}%` }} className="bg-[#f28b47] h-full" title={`Farmer B: ${shareB}%`} />
              <div style={{ width: `${shareC}%` }} className="bg-[#f8ce58] h-full" title={`Farmer C: ${shareC}%`} />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-[#6d7e73] dark:text-[#9ab0a2]">
              <span className="text-[#276b45] dark:text-[#4ade80]">■ You ({shareA}%)</span>
              <span className="text-[#f28b47]">■ Farmer B ({shareB}%)</span>
              <span className="text-[#f8ce58]">■ Farmer C ({shareC}%)</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#dfe7df]/60 dark:border-[#223f30]">
            <div className="p-3 rounded-xl bg-white dark:bg-[#15271e] flex items-center justify-between text-xs">
              <span className="font-bold text-[#20352b] dark:text-[#f4f8f5]">Farmer A (You - {farmerName})</span>
              <strong className="text-[#276b45] dark:text-[#4ade80]">{produce.qty} KG ({shareA}%)</strong>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#15271e] flex items-center justify-between text-xs">
              <span className="font-bold text-[#20352b] dark:text-[#f4f8f5]">Farmer B (Suresh Patil)</span>
              <strong className="text-[#20352b] dark:text-[#f4f8f5]">{farmerBQty} KG ({shareB}%)</strong>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#15271e] flex items-center justify-between text-xs">
              <span className="font-bold text-[#20352b] dark:text-[#f4f8f5]">Farmer C (Anita More)</span>
              <strong className="text-[#20352b] dark:text-[#f4f8f5]">{farmerCQty} KG ({shareC}%)</strong>
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
            <span>View Pickup Route</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
