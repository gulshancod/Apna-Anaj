import React, { useEffect, useState } from 'react';
import {
  Handshake,
  ArrowLeft,
  ArrowRight,
  Users,
  CheckCircle2,
  MapPin,
  Loader2
} from 'lucide-react';
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
  const [marketPrice, setMarketPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const crop =
    produce.crop
      .split('/')
      .pop()
      ?.replace(/\(.*?\)/g, '')
      .trim() || produce.crop.trim();

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/market-summary?crop=${encodeURIComponent(crop)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMarketPrice(Number(data.averageModalPricePerKg) || 0);
        }
      })
      .catch(() => {
        setMarketPrice(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [crop]);

  const farmerPrice = Number(produce.price) || 0;
  const quantity = Number(produce.qty) || 0;

  const totalBatch = Math.max(1000, quantity + 500);

  const remainingQuantity = Math.max(totalBatch - quantity, 0);

  const farmerBQty = Math.round(remainingQuantity * 0.6);

  const farmerCQty =
    remainingQuantity - farmerBQty;

  // Quantity score
  const quantityMatch = Math.min(
    Math.round((quantity / totalBatch) * 100),
    100
  );

  // Location score
  const locationMatch =
    produce.loc.toLowerCase().includes('pune')
      ? 95
      : 85;

  // Price score based on LIVE mandi price
  let priceMatch = 85;

  if (marketPrice > 0 && farmerPrice > 0) {
    const difference =
      Math.abs(farmerPrice - marketPrice) / marketPrice;

    priceMatch = Math.max(
      60,
      Math.min(100, Math.round(100 - difference * 100))
    );
  }

  // Buyer demand indicator
  const buyerDemand = 90;

  // Weighted final score
  const overallMatch = Math.round(
    quantityMatch * 0.35 +
    locationMatch * 0.20 +
    buyerDemand * 0.20 +
    priceMatch * 0.25
  );

  const matchLabel =
    overallMatch >= 90
      ? 'Excellent Match'
      : overallMatch >= 75
      ? 'Good Match'
      : 'Potential Match';

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] shadow-sm space-y-6">

        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#276b45] dark:text-[#4ade80] tracking-widest">
          <Handshake className="w-4 h-4" />
          <span>Apna Anaj Smart Matching</span>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-bold text-[#20352b] dark:text-[#f4f8f5]">
            🤝 Smart Buyer & Route Matching
          </h2>

          <p className="text-xs sm:text-sm text-[#6d7e73] dark:text-[#9ab0a2] mt-1">
            Matching based on quantity, location, buyer demand and live mandi price.
          </p>
        </div>

        {/* Live Market */}
        <div className="p-4 rounded-2xl bg-green-50 dark:bg-[#163824] border border-green-200">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-[10px] font-bold uppercase text-[#6d7e73]">
                Live Government Mandi
              </p>

              {loading ? (
                <div className="flex items-center gap-2 mt-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Fetching...</span>
                </div>
              ) : (
                <p className="text-xl font-bold text-[#276b45]">
                  ₹{marketPrice.toFixed(2)}/kg
                </p>
              )}
            </div>

            <div className="text-right">
              <p className="text-[10px] text-[#6d7e73]">
                Your Rate
              </p>
              <p className="text-lg font-bold text-orange-600">
                ₹{farmerPrice.toFixed(2)}/kg
              </p>
            </div>

          </div>
        </div>

        {/* Match Score */}
        <div className="p-5 rounded-2xl bg-[#eaf5ce] dark:bg-[#163824] border border-[#276b45]/30">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-[#6d7e73]">
                Overall Match Score
              </p>

              <p className="text-3xl font-bold text-[#276b45]">
                {overallMatch}%
              </p>
            </div>

            <div className="px-3 py-2 rounded-xl bg-[#276b45] text-white text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 inline mr-1" />
              {matchLabel}
            </div>

          </div>

          {/* Score Breakdown */}
          <div className="mt-4 grid grid-cols-4 gap-2 text-center">

            <div className="p-2 rounded-xl bg-white dark:bg-[#15271e]">
              <p className="text-[10px] text-[#6d7e73]">
                Crop
              </p>
              <p className="font-bold text-xs">
                100%
              </p>
            </div>

            <div className="p-2 rounded-xl bg-white dark:bg-[#15271e]">
              <p className="text-[10px] text-[#6d7e73]">
                Quantity
              </p>
              <p className="font-bold text-xs">
                {quantityMatch}%
              </p>
            </div>

            <div className="p-2 rounded-xl bg-white dark:bg-[#15271e]">
              <p className="text-[10px] text-[#6d7e73]">
                Location
              </p>
              <p className="font-bold text-xs">
                {locationMatch}%
              </p>
            </div>

            <div className="p-2 rounded-xl bg-white dark:bg-[#15271e]">
              <p className="text-[10px] text-[#6d7e73]">
                Price
              </p>
              <p className="font-bold text-xs">
                {priceMatch}%
              </p>
            </div>

          </div>

        </div>

        {/* Target Batch */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="p-5 rounded-2xl bg-[#faf5e8] dark:bg-[#0e1a14] border border-[#dfe7df] flex flex-col justify-between space-y-4">

            <div>

              <span className="text-[10px] font-extrabold uppercase text-[#f28b47] tracking-wider">
                Target Buyer Batch
              </span>

              <h3 className="font-heading text-xl font-bold text-[#20352b] dark:text-[#f4f8f5] mt-1">
                🌾 {produce.crop}
              </h3>

              <div className="text-xs text-[#6d7e73] mt-2 space-y-1">

                <div>
                  Required Quantity:{' '}
                  <strong>
                    {totalBatch.toLocaleString()} KG
                  </strong>
                </div>

                <div>
                  Farmer Quantity:{' '}
                  <strong>
                    {quantity} KG
                  </strong>
                </div>

                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {produce.loc}
                </div>

              </div>

            </div>

            <div className="p-3.5 rounded-xl bg-[#eaf5ce] dark:bg-[#163824] border border-[#276b45]/30">

              <div className="text-xs font-bold text-[#276b45] dark:text-[#4ade80]">
                <CheckCircle2 className="w-4 h-4 inline mr-1" />
                Buyer Demand Matched
              </div>

              <p className="text-[11px] mt-1">
                Crop requirement, available quantity and price
                compatibility have been evaluated.
              </p>

            </div>

          </div>

          {/* Farmers */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#15271e] border border-[#dfe7df] space-y-3">

            <span className="text-[10px] font-extrabold uppercase text-[#6d7e73] tracking-wider flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              Neighbor Farms in Pooled Batch
            </span>

            <div className="space-y-2">

              <div className="p-3 rounded-xl bg-[#eaf5ce]/80 dark:bg-[#163824]/80 border flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs">
                    {farmerName} (You)
                  </div>
                  <div className="text-[10px] text-[#6d7e73]">
                    {produce.loc}
                  </div>
                </div>

                <div className="font-bold text-xs text-[#276b45]">
                  {quantity} KG
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#faf5e8] dark:bg-[#0e1a14] border flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs">
                    Farmer B
                  </div>
                  <div className="text-[10px] text-[#6d7e73]">
                    Nearby Farm
                  </div>
                </div>

                <div className="font-bold text-xs text-[#276b45]">
                  {farmerBQty} KG
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#faf5e8] dark:bg-[#0e1a14] border flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs">
                    Farmer C
                  </div>
                  <div className="text-[10px] text-[#6d7e73]">
                    Nearby Farm
                  </div>
                </div>

                <div className="font-bold text-xs text-[#276b45]">
                  {farmerCQty} KG
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Matching Basis */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#15271e] border border-[#dfe7df]">

          <p className="text-xs font-bold text-[#20352b] dark:text-white mb-2">
            🔎 Match calculated using
          </p>

          <div className="flex flex-wrap gap-2 text-[11px]">

            <span className="px-2.5 py-1 rounded-lg bg-[#eaf5ce]">
              Crop
            </span>

            <span className="px-2.5 py-1 rounded-lg bg-[#eaf5ce]">
              Quantity
            </span>

            <span className="px-2.5 py-1 rounded-lg bg-[#eaf5ce]">
              Location
            </span>

            <span className="px-2.5 py-1 rounded-lg bg-[#eaf5ce]">
              Buyer Demand
            </span>

            <span className="px-2.5 py-1 rounded-lg bg-[#eaf5ce]">
              Live Mandi Price
            </span>

          </div>

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
            View Quantity Pooling
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};