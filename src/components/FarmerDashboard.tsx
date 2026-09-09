import React from 'react';
import { 
  Sprout, 
  TrendingUp, 
  Scale, 
  Truck, 
  Boxes, 
  ArrowRight, 
  CheckCircle2,
  Wheat,
  ShieldCheck
} from 'lucide-react';
import { FarmerProduce } from '../types';

interface FarmerDashboardProps {
  farmerName: string;
  farmName: string;
  farmerLoc: string;
  produce: FarmerProduce;
  onNavigateTab: (tabId: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  farmerName,
  farmName,
  farmerLoc,
  produce,
  onNavigateTab
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#276b45] text-white flex items-center justify-center text-xl font-bold">
            {farmerName.split(' ').map(n => n[0]).join('').slice(0, 2) || 'RK'}
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase text-[#276b45] dark:text-[#4ade80] tracking-widest">
              Apna Anaj Verified Producer
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#20352b] dark:text-[#f4f8f5]">
              {farmerName}
            </h1>
            <p className="text-xs text-[#6d7e73] dark:text-[#9ab0a2] mt-0.5">
              {farmName} • {farmerLoc}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('view-add-produce')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#276b45] hover:bg-[#1e5636] text-white font-bold text-xs shadow-md shadow-[#276b45]/20 hover:-translate-y-0.5 transition-all cursor-pointer shrink-0"
        >
          <Sprout className="w-4 h-4" />
          <span>+ Add Harvested Crop</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] shadow-sm">
          <span className="text-[10px] font-extrabold uppercase text-[#6d7e73] dark:text-[#9ab0a2] tracking-wider">
            Active Crop Batch
          </span>
          <div className="font-heading font-bold text-xl text-[#20352b] dark:text-[#f4f8f5] my-1">
            🌾 {produce.qty} KG {produce.crop}
          </div>
          <div className="text-xs font-bold text-[#276b45] dark:text-[#4ade80] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ready for Pooled EV Pickup</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] shadow-sm">
          <span className="text-[10px] font-extrabold uppercase text-[#6d7e73] dark:text-[#9ab0a2] tracking-wider">
            Current Direct Fair Rate
          </span>
          <div className="font-heading font-bold text-xl text-[#276b45] dark:text-[#4ade80] my-1">
            ₹{produce.price} / KG Direct
          </div>
          <div className="text-xs text-[#6d7e73] dark:text-[#9ab0a2]">
            +28% higher than local APMC Mandi
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] shadow-sm">
          <span className="text-[10px] font-extrabold uppercase text-[#6d7e73] dark:text-[#9ab0a2] tracking-wider">
            Logistics Compatibility
          </span>
          <div className="font-heading font-bold text-xl text-[#f28b47] my-1">
            95% Route Match
          </div>
          <div className="text-xs text-[#276b45] dark:text-[#4ade80] font-bold">
            Batched with 2 Neighboring Farms
          </div>
        </div>

      </div>

      {/* Workflow Navigation Quick Links */}
      <div className="p-6 rounded-3xl bg-[#eaf5ce]/50 dark:bg-[#163824]/50 border border-[#dfe7df] dark:border-[#223f30] space-y-4">
        <h3 className="font-heading text-lg font-bold text-[#20352b] dark:text-[#f4f8f5]">
          Farmer Operations Suite
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateTab('view-demand-forecast')}
            className="p-4 rounded-xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] hover:border-[#276b45] text-left transition-all cursor-pointer"
          >
            <TrendingUp className="w-5 h-5 text-[#276b45] mb-2" />
            <div className="text-xs font-bold text-[#20352b] dark:text-[#f4f8f5]">AI Demand Forecast</div>
            <div className="text-[10px] text-[#6d7e73] dark:text-[#9ab0a2]">7-Day Price Trajectory</div>
          </button>

          <button
            onClick={() => onNavigateTab('view-selling-rec')}
            className="p-4 rounded-xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] hover:border-[#276b45] text-left transition-all cursor-pointer"
          >
            <Scale className="w-5 h-5 text-[#276b45] mb-2" />
            <div className="text-xs font-bold text-[#20352b] dark:text-[#f4f8f5]">Selling Recommendation</div>
            <div className="text-[10px] text-[#6d7e73] dark:text-[#9ab0a2]">Net margin calculation</div>
          </button>

          <button
            onClick={() => onNavigateTab('view-route')}
            className="p-4 rounded-xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] hover:border-[#276b45] text-left transition-all cursor-pointer"
          >
            <Truck className="w-5 h-5 text-[#276b45] mb-2" />
            <div className="text-xs font-bold text-[#20352b] dark:text-[#f4f8f5]">EV Pickup Schedule</div>
            <div className="text-[10px] text-[#6d7e73] dark:text-[#9ab0a2]">Shared cold transport</div>
          </button>

          <button
            onClick={() => onNavigateTab('view-transparency')}
            className="p-4 rounded-xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] hover:border-[#276b45] text-left transition-all cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5 text-[#276b45] mb-2" />
            <div className="text-xs font-bold text-[#20352b] dark:text-[#f4f8f5]">Price Transparency</div>
            <div className="text-[10px] text-[#6d7e73] dark:text-[#9ab0a2]">88% direct bank payout</div>
          </button>
        </div>
      </div>

    </div>
  );
};
