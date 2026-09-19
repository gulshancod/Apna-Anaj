import React from 'react';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';
import {
  Truck,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Store,
  Clock,
  PackageCheck
} from 'lucide-react';
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
  const targetQuantity = 1000;
  const farmerQuantity = Math.max(Number(produce.qty) || 0, 0);

  const remainingQuantity = Math.max(
    targetQuantity - farmerQuantity,
    0
  );

  const farmerBQty = Math.round(remainingQuantity * 0.6);
  const farmerCQty = remainingQuantity - farmerBQty;

  const totalQuantity =
    farmerQuantity + farmerBQty + farmerCQty;

  const stops = [
    {
      name: `${produce.loc} — ${farmerName}`,
      quantity: farmerQuantity
    },
    {
      name: 'Nearby Farm — Farmer B',
      quantity: farmerBQty
    },
    {
      name: 'Nearby Farm — Farmer C',
      quantity: farmerCQty
    }
  ].filter((stop) => stop.quantity > 0);

  const numberOfStops = stops.length;

  // Prototype logistics estimates
  const estimatedDistance = numberOfStops * 30;
  const estimatedTime = numberOfStops * 45;

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] shadow-sm space-y-6">

        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#276b45] dark:text-[#4ade80] tracking-widest">
          <Truck className="w-4 h-4" />
          <span>Apna Anaj Pickup Planning</span>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-bold text-[#20352b] dark:text-[#f4f8f5]">
            🚚 Farm Pickup Route
          </h2>

          <p className="text-xs sm:text-sm text-[#6d7e73] dark:text-[#9ab0a2] mt-1">
            Pickup sequence for the pooled {produce.crop} batch.
          </p>
        </div>

        {/* Batch Summary */}
        <div className="grid grid-cols-2 gap-3">

          <div className="p-4 rounded-2xl bg-[#eaf5ce] dark:bg-[#163824] border border-[#276b45]/30">
            <p className="text-[10px] font-bold uppercase text-[#6d7e73]">
              Pooled Quantity
            </p>

            <p className="text-xl font-bold text-[#276b45] mt-1">
              {totalQuantity.toLocaleString()} KG
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf5e8] dark:bg-[#0e1a14] border">
            <p className="text-[10px] font-bold uppercase text-[#6d7e73]">
              Pickup Stops
            </p>

            <p className="text-xl font-bold mt-1">
              {numberOfStops}
            </p>
          </div>

        </div>

        {/* Route */}
        <div className="p-5 rounded-2xl bg-[#eaf5ce]/60 dark:bg-[#163824]/60 border border-[#dfe7df] dark:border-[#223f30] space-y-4">

          <span className="text-[10px] font-extrabold uppercase text-[#276b45] dark:text-[#4ade80] tracking-wider">
            Pickup Sequence
          </span>

          <div className="space-y-4">

            {stops.map((stop, index) => (
              <div
                key={`${stop.name}-${index}`}
                className="flex items-start gap-3"
              >

                <div className="w-7 h-7 rounded-full bg-[#276b45] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {index + 1}
                </div>

                <div>
                  <div className="font-bold text-xs">
                    <MapPin className="w-3.5 h-3.5 inline mr-1" />
                    {stop.name}
                  </div>

                  <div className="text-[10px] text-[#6d7e73] mt-1">
                    {stop.quantity.toLocaleString()} KG {produce.crop}
                  </div>
                </div>

              </div>
            ))}

            {/* Destination */}
            <div className="flex items-start gap-3">

              <div className="w-7 h-7 rounded-full bg-[#f28b47] text-white flex items-center justify-center text-xs font-bold shrink-0">
                <Store className="w-3.5 h-3.5" />
              </div>

              <div>
                <div className="font-bold text-xs text-[#f28b47]">
                  Buyer Fulfillment Hub
                </div>

                <div className="text-[10px] text-[#6d7e73] mt-1">
                  Final batch: {totalQuantity.toLocaleString()} KG
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Logistics Stats */}
        <div className="grid grid-cols-2 gap-3">

          <div className="p-4 rounded-xl bg-[#faf5e8] dark:bg-[#0e1a14] border">

            <div className="flex items-center gap-1 text-[10px] text-[#6d7e73] font-bold uppercase">
              <MapPin className="w-3 h-3" />
              Estimated Distance
            </div>

            <div className="text-xl font-bold mt-1">
              ~{estimatedDistance} KM
            </div>

          </div>

          <div className="p-4 rounded-xl bg-[#faf5e8] dark:bg-[#0e1a14] border">

            <div className="flex items-center gap-1 text-[10px] text-[#6d7e73] font-bold uppercase">
              <Clock className="w-3 h-3" />
              Estimated Time
            </div>

            <div className="text-xl font-bold mt-1">
              ~{estimatedTime} min
            </div>

          </div>

        </div>

        {/* Status */}
        <div className="p-4 rounded-xl bg-green-50 dark:bg-[#163824] border border-green-200">

          <div className="flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-[#276b45]" />

            <p className="text-xs font-bold text-[#276b45]">
              Pickup Plan Ready
            </p>
          </div>

          <p className="text-[11px] text-[#6d7e73] mt-1">
            {totalQuantity.toLocaleString()} KG of {produce.crop}
            {' '}is planned for collection across {numberOfStops} farm stop
            {numberOfStops !== 1 ? 's' : ''}.
          </p>

        </div>

        {/* Note */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#15271e] border">

          <p className="text-xs font-bold">
            🚚 Route Planning Note
          </p>

          <p className="text-[11px] text-[#6d7e73] mt-1">
            Distance and travel time are preliminary prototype estimates.
            Actual route optimization can be connected to a mapping service
            using verified farmer coordinates.
          </p>

        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2 gap-3">

          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#dfe7df] text-[#20352b] dark:text-[#f4f8f5] font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#276b45] hover:bg-[#1e5636] text-white font-bold text-xs shadow-md"
          >
            View Price Transparency
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};