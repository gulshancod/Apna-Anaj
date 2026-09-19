import React from 'react';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';
import {
  PackageOpen,
  ArrowRight,
  CheckCircle2,
  Truck,
  MapPin,
  IndianRupee
} from 'lucide-react';
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
  const quantity = Number(farmerProduce.qty) || 0;
  const price = Number(farmerProduce.price) || 0;

  // Prototype estimate
  const logisticsCost = 2.5;
  const serviceFee = 1.0;

  const netRate = Math.max(
    price - logisticsCost - serviceFee,
    0
  );

  const estimatedPayout = Math.round(
    quantity * netRate
  );

  const batchId = `AA-${String(
    Math.max(quantity, 1)
  ).padStart(4, '0')}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] shadow-sm space-y-6">

        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#276b45] dark:text-[#4ade80] tracking-widest">
          <PackageOpen className="w-4 h-4" />
          <span>Transactions & Fulfillment</span>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-bold text-[#20352b] dark:text-[#f4f8f5]">
            {userRole === 'buyer'
              ? '🛍️ My Recent Orders'
              : '📦 Farm Batch Status'}
          </h2>

          <p className="text-xs sm:text-sm text-[#6d7e73] dark:text-[#9ab0a2] mt-1">
            {userRole === 'buyer'
              ? 'View your recent orders and farmer payout information.'
              : 'Track your current produce batch from pickup planning to fulfillment.'}
          </p>
        </div>

        {/* Buyer View */}
        {userRole === 'buyer' ? (
          <div className="space-y-4">

            {orders.length === 0 ? (
              <div className="text-center py-10 p-6 rounded-2xl bg-[#faf5e8] dark:bg-[#0e1a14] border border-[#dfe7df] dark:border-[#223f30] space-y-3">

                <p className="text-xs text-[#6d7e73] dark:text-[#9ab0a2]">
                  You haven't placed any farm orders yet.
                </p>

                <button
                  onClick={onNavigateStore}
                  className="px-5 py-2.5 rounded-xl bg-[#276b45] text-white text-xs font-bold shadow-md hover:bg-[#1e5636] transition-all"
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

                    <span className="text-[#6d7e73] dark:text-[#9ab0a2]">
                      Placed at {ord.time}
                    </span>

                    <span className="font-bold text-[#276b45] dark:text-[#4ade80]">
                      🌱 Farmer Payout: ₹{ord.farmerPayout}
                    </span>

                  </div>

                </div>
              ))
            )}

          </div>
        ) : (

          /* Farmer View */
          <div className="space-y-4">

            {/* Current Batch */}
            <div className="p-5 rounded-2xl bg-[#eaf5ce] dark:bg-[#163824] border border-[#276b45]/30 space-y-4">

              <div className="flex flex-wrap items-center justify-between gap-2">

                <div>
                  <div className="font-bold text-sm text-[#20352b] dark:text-[#f4f8f5]">
                    Batch #{batchId} • 🌾 {farmerProduce.crop}
                  </div>

                  <div className="text-xs text-[#6d7e73] dark:text-[#9ab0a2] mt-1">
                    Your contribution: {quantity.toLocaleString()} KG
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-[#276b45] text-white text-xs font-bold">
                  <Truck className="w-3.5 h-3.5 inline mr-1" />
                  Pickup Planned
                </span>

              </div>

              {/* Status Steps */}
              <div className="grid grid-cols-3 gap-2 pt-2">

                <div className="p-3 rounded-xl bg-white dark:bg-[#15271e] text-center">
                  <CheckCircle2 className="w-4 h-4 mx-auto text-[#276b45]" />
                  <p className="text-[10px] font-bold mt-1">
                    Matched
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#15271e] text-center">
                  <CheckCircle2 className="w-4 h-4 mx-auto text-[#276b45]" />
                  <p className="text-[10px] font-bold mt-1">
                    Pooled
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#15271e] text-center">
                  <Truck className="w-4 h-4 mx-auto text-[#f28b47]" />
                  <p className="text-[10px] font-bold mt-1">
                    Pickup
                  </p>
                </div>

              </div>

            </div>

            {/* Batch Details */}
            <div className="p-5 rounded-2xl bg-[#faf5e8] dark:bg-[#0e1a14] border border-[#dfe7df] dark:border-[#223f30] space-y-4">

              <p className="text-xs font-bold">
                📋 Batch Details
              </p>

              <div className="space-y-2 text-xs">

                <div className="flex justify-between">
                  <span className="text-[#6d7e73]">
                    Crop
                  </span>
                  <strong>{farmerProduce.crop}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#6d7e73]">
                    Quantity
                  </span>
                  <strong>{quantity.toLocaleString()} KG</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#6d7e73] flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Pickup Location
                  </span>
                  <strong>{farmerProduce.loc}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#6d7e73]">
                    Expected Buyer Rate
                  </span>
                  <strong>₹{price.toFixed(2)}/KG</strong>
                </div>

              </div>

            </div>

            {/* Payout */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30]">

              <div className="flex items-center gap-2 mb-3">
                <IndianRupee className="w-4 h-4 text-[#276b45]" />
                <p className="text-xs font-bold">
                  Estimated Farmer Payout
                </p>
              </div>

              <div className="flex justify-between text-xs">
                <span>Expected Rate</span>
                <strong>₹{price.toFixed(2)}/KG</strong>
              </div>

              <div className="flex justify-between text-xs mt-2">
                <span>Logistics</span>
                <strong>- ₹{logisticsCost.toFixed(2)}/KG</strong>
              </div>

              <div className="flex justify-between text-xs mt-2">
                <span>Service Fee</span>
                <strong>- ₹{serviceFee.toFixed(2)}/KG</strong>
              </div>

              <hr className="my-3" />

              <div className="flex justify-between text-lg font-bold text-[#276b45]">
                <span>Estimated Net</span>
                <span>₹{estimatedPayout.toLocaleString()}</span>
              </div>

            </div>

            {/* Prototype note */}
            <div className="p-4 rounded-xl border bg-white dark:bg-[#15271e]">

              <p className="text-[11px] text-[#6d7e73]">
                ℹ️ This is the prototype fulfillment status.
                Actual dispatch tracking, payment settlement and
                delivery status can be connected to backend services
                in the production version.
              </p>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};