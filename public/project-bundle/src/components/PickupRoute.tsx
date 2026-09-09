import React from 'react';
import { Truck, ArrowLeft, ArrowRight, MapPin, Store, Leaf } from 'lucide-react';
import { FarmerProduce } from '../types';

interface PickupRouteProps {
  farmerName: string;
  produce: FarmerProduce;
  onNext: () => void;
  onBack: () => void;
}

export const PickupRoute: React.FC<PickupRouteProps> = ({
  farmerName,
  produce,
  onNext,
  onBack
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] shadow-sm space-y-6">
        
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#276b45] dark:text-[#4ade80] tracking-widest">
          <Truck className="w-4 h-4" />
          <span>Apna Anaj Eco-Logistics Fleet</span>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-bold text-[#20352b] dark:text-[#f4f8f5]">
            🚚 Scheduled EV Farm Pickup Route
          </h2>
          <p className="text-xs sm:text-sm text-[#6d7e73] dark:text-[#9ab0a2] mt-1">
            Optimized multi-stop cold electric vehicle routing from farm gate to consumer hub:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Route Stops Column */}
          <div className="p-5 rounded-2xl bg-[#eaf5ce]/60 dark:bg-[#163824]/60 border border-[#dfe7df] dark:border-[#223f30] space-y-4">
            <span className="text-[10px] font-extrabold uppercase text-[#276b45] dark:text-[#4ade80] tracking-wider block">
              Pickup Milestones
            </span>

            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#276b45]/30">
              
              <div className="flex items-start gap-3 relative z-10">
                <div className="w-6 h-6 rounded-full bg-[#276b45] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </div>
                <div>
                  <div className="font-bold text-xs text-[#20352b] dark:text-[#f4f8f5]">
                    📍 Stop 1: {produce.loc} ({farmerName})
                  </div>
                  <div className="text-[10px] text-[#6d7e73] dark:text-[#9ab0a2]">
                    {produce.qty} KG {produce.crop} • Pickup 5:30 AM
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 relative z-10">
                <div className="w-6 h-6 rounded-full bg-[#276b45] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </div>
                <div>
                  <div className="font-bold text-xs text-[#20352b] dark:text-[#f4f8f5]">
                    📍 Stop 2: Satara Belt (Suresh Patil)
                  </div>
                  <div className="text-[10px] text-[#6d7e73] dark:text-[#9ab0a2]">
                    300 KG • Pickup 6:45 AM
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 relative z-10">
                <div className="w-6 h-6 rounded-full bg-[#276b45] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </div>
                <div>
                  <div className="font-bold text-xs text-[#20352b] dark:text-[#f4f8f5]">
                    📍 Stop 3: Nashik Corridor (Anita More)
                  </div>
                  <div className="text-[10px] text-[#6d7e73] dark:text-[#9ab0a2]">
                    200 KG • Pickup 8:15 AM
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 relative z-10">
                <div className="w-6 h-6 rounded-full bg-[#f28b47] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  <Store className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[#f28b47]">
                    🏪 Drop: 15-Min Metro Fulfillment Hub
                  </div>
                  <div className="text-[10px] text-[#6d7e73] dark:text-[#9ab0a2]">
                    Immediate grading, sorting & fast delivery
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Efficiency & Eco Stats */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#6d7e73] dark:text-[#9ab0a2] tracking-wider block mb-3">
                Efficiency & Savings
              </span>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-[#faf5e8] dark:bg-[#0e1a14] flex justify-between">
                  <span className="text-[#6d7e73] dark:text-[#9ab0a2]">Total Route Distance:</span>
                  <strong className="text-[#20352b] dark:text-[#f4f8f5]">180 KM</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-[#faf5e8] dark:bg-[#0e1a14] flex justify-between">
                  <span className="text-[#6d7e73] dark:text-[#9ab0a2]">Truck Capacity Utilized:</span>
                  <strong className="text-[#276b45] dark:text-[#4ade80]">94% Capacity</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-[#faf5e8] dark:bg-[#0e1a14] flex justify-between">
                  <span className="text-[#6d7e73] dark:text-[#9ab0a2]">Shared Freight Cost:</span>
                  <strong className="text-[#20352b] dark:text-[#f4f8f5]">₹2.50 / KG</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-[#eaf5ce] dark:bg-[#163824] flex items-center justify-between text-[#276b45] dark:text-[#4ade80]">
                  <span className="flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5" /> Carbon Cut:
                  </span>
                  <strong>-45% Emissions</strong>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#6d7e73] dark:text-[#9ab0a2] pt-2 border-t border-[#dfe7df]/60 dark:border-[#223f30]">
              Cold EV chain ensures 0% moisture loss for grains and maximum crispness for vegetables.
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
            <span>View Price Transparency</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
