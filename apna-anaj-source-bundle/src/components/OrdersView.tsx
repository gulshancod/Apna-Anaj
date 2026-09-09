import React from 'react';
import { PackageOpen, Clock, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { OrderRecord, UserRole, FarmerProduce } from '../types';

interface OrdersViewProps {
  userRole: UserRole;
  orders: OrderRecord[];
  farmerProduce: FarmerProduce;
  onNavigateStore: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  userRole,
  orders,
  farmerProduce,
  onNavigateStore
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] shadow-sm space-y-6">
        
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#276b45] dark:text-[#4ade80] tracking-widest">
          <PackageOpen className="w-4 h-4" />
          <span>Transactions & Fulfillment</span>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-bold text-[#20352b] dark:text-[#f4f8f5]">
            {userRole === 'buyer' ? '🛍️ My Recent Orders' : '📦 Dispatched Farm Batches'}
          </h2>
          <p className="text-xs sm:text-sm text-[#6d7e73] dark:text-[#9ab0a2] mt-1">
            {userRole === 'buyer'
              ? 'Real-time order statuses and direct farmer livelihood contribution tally:'
              : 'Active pooled shipments and direct bank remittance records:'}
          </p>
        </div>

        {/* Buyer View */}
        {userRole === 'buyer' ? (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-10 p-6 rounded-2xl bg-[#faf5e8] dark:bg-[#0e1a14] border border-[#dfe7df] dark:border-[#223f30] space-y-3">
                <p className="text-xs text-[#6d7e73] dark:text-[#9ab0a2]">You haven't placed any farm orders yet.</p>
                <button
                  onClick={onNavigateStore}
                  className="px-5 py-2.5 rounded-xl bg-[#276b45] text-white text-xs font-bold shadow-md cursor-pointer hover:bg-[#1e5636] transition-all"
                >
                  Shop Fresh Farm Harvests ⚡
                </button>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#faf5e8] dark:bg-[#0e1a14] border border-[#dfe7df] dark:border-[#223f30] space-y-2 hover:border-[#276b45] transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm text-[#20352b] dark:text-[#f4f8f5]">
                        Order #{ord.id} • ₹{ord.total}
                      </div>
                      <div className="text-xs text-[#6d7e73] dark:text-[#9ab0a2] mt-0.5">
                        {ord.items}
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#eaf5ce] dark:bg-[#163824] text-[#276b45] dark:text-[#4ade80] text-xs font-bold">
                      {ord.status}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#dfe7df]/60 dark:border-[#223f30] flex items-center justify-between text-[11px]">
                    <span className="text-[#6d7e73] dark:text-[#9ab0a2]">Placed at {ord.time}</span>
                    <span className="font-bold text-[#276b45] dark:text-[#4ade80]">
                      🌱 Farmer Got: ₹{ord.farmerPayout}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Farmer View */
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#faf5e8] dark:bg-[#0e1a14] border border-[#dfe7df] dark:border-[#223f30] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-sm text-[#20352b] dark:text-[#f4f8f5]">
                    Batch #KD-9021 • 🌾 {farmerProduce.crop} (1,000 KG Pooled)
                  </div>
                  <div className="text-xs text-[#6d7e73] dark:text-[#9ab0a2] mt-0.5">
                    Your contribution: {farmerProduce.qty} KG • Destination: Metro Hub
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#eaf5ce] dark:bg-[#163824] text-[#276b45] dark:text-[#4ade80] text-xs font-bold">
                  🚚 Dispatched in Cold EV
                </span>
              </div>

              <div className="pt-2 border-t border-[#dfe7df]/60 dark:border-[#223f30] flex items-center justify-between text-xs">
                <span className="text-[#6d7e73] dark:text-[#9ab0a2]">Pickup Time: 5:30 AM</span>
                <strong className="text-[#276b45] dark:text-[#4ade80]">
                  Payout: ₹{Math.round(farmerProduce.qty * (farmerProduce.price * 0.88)).toLocaleString()} (Bank Settled)
                </strong>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf5e8] dark:bg-[#0e1a14] border border-[#dfe7df] dark:border-[#223f30] space-y-3 opacity-80">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-sm text-[#20352b] dark:text-[#f4f8f5]">
                    Batch #KD-8814 • 🍅 Desi Tomatoes (800 KG Pooled)
                  </div>
                  <div className="text-xs text-[#6d7e73] dark:text-[#9ab0a2] mt-0.5">
                    Delivered & 100% Fulfilled
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#276b45] text-white text-xs font-bold">
                  ✅ Completed
                </span>
              </div>

              <div className="pt-2 border-t border-[#dfe7df]/60 dark:border-[#223f30] flex items-center justify-between text-xs">
                <span className="text-[#6d7e73] dark:text-[#9ab0a2]">Delivered Yesterday</span>
                <strong className="text-[#276b45] dark:text-[#4ade80]">
                  ₹11,264 Deposited
                </strong>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
