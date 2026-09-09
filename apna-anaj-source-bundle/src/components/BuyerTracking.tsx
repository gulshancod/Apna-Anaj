import React from 'react';
import { Bike, Phone, MapPin, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { OrderRecord } from '../types';

interface BuyerTrackingProps {
  latestOrder: OrderRecord | null;
  onNavigateStore: () => void;
}

export const BuyerTracking: React.FC<BuyerTrackingProps> = ({
  latestOrder,
  onNavigateStore
}) => {
  const order = latestOrder || {
    id: 'KD-4091',
    role: 'buyer',
    items: '1x MP Sharbati Gehu (1kg), 1x Desi Red Tomatoes (1kg)',
    total: 80,
    farmerPayout: 70,
    time: 'Just now',
    status: '🛵 Arriving in 11 mins',
    deliveryMinutes: 11,
    deliveryRider: {
      name: 'Vikas Shinde',
      vehicle: 'Electric EV Delivery Bike',
      rating: 4.9,
      phone: '+91 9876543210'
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] shadow-sm space-y-6">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#dfe7df] dark:border-[#223f30]">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f28b47]">
              LIVE EXPRESS SHIPMENT
            </span>
            <h1 className="font-heading text-2xl font-bold text-[#20352b] dark:text-[#f4f8f5]">
              Order #{order.id}
            </h1>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-[#eaf5ce] dark:bg-[#163824] border border-[#276b45]/30 text-[#276b45] dark:text-[#4ade80] text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#276b45] dark:bg-[#4ade80] animate-pulse" />
            <span>ETA: ~11 Minutes</span>
          </div>
        </div>

        {/* Visual Stepper */}
        <div className="p-4 rounded-2xl bg-[#faf5e8] dark:bg-[#0e1a14] border border-[#dfe7df] dark:border-[#223f30] space-y-3">
          <div className="flex justify-between text-[11px] font-bold text-[#6d7e73] dark:text-[#9ab0a2]">
            <span className="text-[#276b45] dark:text-[#4ade80] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Harvested
            </span>
            <span className="text-[#276b45] dark:text-[#4ade80] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Packed
            </span>
            <span className="text-[#f28b47] flex items-center gap-1 font-extrabold">
              <Bike className="w-3.5 h-3.5" /> On The Way
            </span>
            <span className="opacity-60">Doorstep</span>
          </div>

          <div className="h-2 w-full bg-[#dfe7df] dark:bg-[#223f30] rounded-full overflow-hidden">
            <div className="h-full bg-[#276b45] dark:bg-[#4ade80] w-[75%] rounded-full transition-all duration-500" />
          </div>
        </div>

        {/* Delivery Partner Card */}
        <div className="p-4 rounded-2xl bg-[#eaf5ce]/50 dark:bg-[#163824]/50 border border-[#dfe7df] dark:border-[#223f30] flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#276b45] text-white flex items-center justify-center text-xl font-bold">
              ⚡
            </div>
            <div>
              <div className="font-bold text-sm text-[#20352b] dark:text-[#f4f8f5]">
                {order.deliveryRider?.name || 'Vikas Shinde'} (EV Rider)
              </div>
              <div className="text-xs text-[#6d7e73] dark:text-[#9ab0a2]">
                ⭐ 4.9 Rating • Contactless Insulated Pack
              </div>
            </div>
          </div>

          <button
            onClick={() => alert(`Calling EV Rider at ${order.deliveryRider?.phone || '+91 9876543210'}...`)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#276b45] hover:bg-[#1e5636] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Rider</span>
          </button>
        </div>

        {/* Direct Farmer Contribution Impact */}
        <div className="p-4 rounded-2xl bg-[#fff3ec] dark:bg-[#3d2314]/60 border border-[#f28b47]/30 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#f28b47] shrink-0 mt-0.5" />
          <div className="text-xs text-[#20352b] dark:text-[#f4f8f5] space-y-1">
            <div className="font-bold text-[#f28b47]">
              88% Direct Farmer Payout (₹{order.farmerPayout})
            </div>
            <p className="text-[#6d7e73] dark:text-[#9ab0a2]">
              Your order funds clean agriculture and bypasses middlemen completely. Thank you for supporting Indian farming families!
            </p>
          </div>
        </div>

        {/* Order Items Summary */}
        <div className="text-xs text-[#6d7e73] dark:text-[#9ab0a2] space-y-1 pt-2 border-t border-[#dfe7df] dark:border-[#223f30]">
          <div><strong>Items:</strong> {order.items}</div>
          <div><strong>Total Paid:</strong> <span className="font-bold text-[#276b45] dark:text-[#4ade80]">₹{order.total}</span> (Inclusive of zero delivery fees)</div>
        </div>

        {/* Navigation */}
        <div className="pt-2">
          <button
            onClick={onNavigateStore}
            className="flex items-center gap-2 w-full justify-center py-3 rounded-xl bg-[#faf5e8] dark:bg-[#0e1a14] border border-[#dfe7df] dark:border-[#223f30] hover:border-[#276b45] text-[#20352b] dark:text-[#f4f8f5] font-bold text-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Fresh Anaj Marketplace</span>
          </button>
        </div>

      </div>
    </div>
  );
};
