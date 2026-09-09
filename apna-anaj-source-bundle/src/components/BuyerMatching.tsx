import React from 'react';
import { Handshake, ArrowLeft, ArrowRight, MapPin, Users, CheckCircle2 } from 'lucide-react';
import { FarmerProduce } from '../types';

interface BuyerMatchingProps {
  farmerName: string;
  produce: FarmerProduce;
  onNext: () => void;
  onBack: () => void;
}

export const BuyerMatching: React.FC<BuyerMatchingProps> = ({
  farmerName,
  produce,
  onNext,
  onBack
}) => {
  const totalBatch = Math.max(1000, produce.qty + 500);
  const farmerBQty = Math.round((totalBatch - produce.qty) * 0.6);
  const farmerCQty = totalBatch - produce.qty - farmerBQty;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] shadow-sm space-y-6">
        
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#276b45] dark:text-[#4ade80] tracking-widest">
          <Handshake className="w-4 h-4" />
          <span>Apna Anaj Smart Matching</span>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-bold text-[#20352b] dark:text-[#f4f8f5]">
            🤝 Smart Buyer & Route Matching
          </h2>
          <p className="text-xs sm:text-sm text-[#6d7e73] dark:text-[#9ab0a2] mt-1">
            Aggregated harvest demand for your location, harvest timing, and organic quality tier:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Matched Batch Card */}
          <div className="p-5 rounded-2xl bg-[#faf5e8] dark:bg-[#0e1a14] border border-[#dfe7df] dark:border-[#223f30] flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#f28b47] tracking-wider">
                Full Target Batch
              </span>
              <h3 className="font-heading text-xl font-bold text-[#20352b] dark:text-[#f4f8f5] mt-1">
                🌾 {produce.crop} — {totalBatch.toLocaleString()} KG
              </h3>
              <div className="text-xs text-[#6d7e73] dark:text-[#9ab0a2] mt-1 space-y-0.5">
                <div>Destination: <strong>Metro Quick-Commerce Hub</strong></div>
                <div>Direct Price: <strong className="text-[#276b45] dark:text-[#4ade80]">₹{produce.price} / KG Direct</strong></div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#eaf5ce] dark:bg-[#163824] border border-[#276b45]/30">
              <div className="text-xs font-bold text-[#276b45] dark:text-[#4ade80] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>95% Route Compatibility</span>
              </div>
              <p className="text-[11px] text-[#20352b] dark:text-[#f4f8f5] mt-1">
                Batched alongside 2 neighbor farms to reduce your freight cost to just ₹2.50/kg.
              </p>
            </div>
          </div>

          {/* Farms In This Pooled Batch */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] space-y-3">
            <span className="text-[10px] font-extrabold uppercase text-[#6d7e73] dark:text-[#9ab0a2] tracking-wider flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>Neighbor Farms in this Pooled Route</span>
            </span>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-[#eaf5ce]/80 dark:bg-[#163824]/80 border border-[#276b45]/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#20352b] dark:text-[#f4f8f5]">
                    Farmer A ({farmerName} - You)
                  </div>
                  <div className="text-[10px] text-[#6d7e73] dark:text-[#9ab0a2]">{produce.loc}</div>
                </div>
                <div className="font-bold text-xs text-[#276b45] dark:text-[#4ade80]">
                  {produce.qty} KG
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#faf5e8] dark:bg-[#0e1a14] border border-[#dfe7df] dark:border-[#223f30] flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#20352b] dark:text-[#f4f8f5]">
                    Farmer B (Suresh Patil)
                  </div>
                  <div className="text-[10px] text-[#6d7e73] dark:text-[#9ab0a2]">Satara / Malwa Sector</div>
                </div>
                <div className="font-bold text-xs text-[#276b45] dark:text-[#4ade80]">
                  {farmerBQty} KG
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#faf5e8] dark:bg-[#0e1a14] border border-[#dfe7df] dark:border-[#223f30] flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#20352b] dark:text-[#f4f8f5]">
                    Farmer C (Anita More)
                  </div>
                  <div className="text-[10px] text-[#6d7e73] dark:text-[#9ab0a2]">Nashik / Bhopal Belt</div>
                </div>
                <div className="font-bold text-xs text-[#276b45] dark:text-[#4ade80]">
                  {farmerCQty} KG
                </div>
              </div>
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
            <span>View Quantity Pooling</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
