import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  IndianRupee,
  Loader2
} from "lucide-react";
import { FarmerProduce } from "../types";

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
  const [marketPrice, setMarketPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const crop =
    produce.crop
      .split("/")
      .pop()
      ?.replace(/\(.*?\)/g, "")
      .trim() || produce.crop.trim();

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(
      `https://apna-anaj-backend.onrender.com/api/market-summary?crop=${encodeURIComponent(crop)}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Market API failed");
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setMarketPrice(Number(data.averageModalPricePerKg) || 0);
        } else {
          throw new Error("No market data");
        }
      })
      .catch(() => {
        setError("Unable to fetch live mandi price.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [crop]);

  const buyerPrice = Number(produce.price) || 0;
  const quantity = Number(produce.qty) || 0;

  // Prototype logistics/service deductions
  const logisticsCost = 2.5;
  const serviceFee = 1.0;

  const netFarmerRate = Math.max(
    buyerPrice - logisticsCost - serviceFee,
    0
  );

  const totalPayout = Math.round(netFarmerRate * quantity);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="p-6 rounded-3xl bg-white dark:bg-[#15271e] border shadow-sm space-y-6">

        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#276b45]">
          <IndianRupee className="w-4 h-4" />
          Price Transparency
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            💰 Transparent Price Breakdown
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Clear calculation of your expected farmer income.
          </p>
        </div>

        {/* Live Government Price */}
        <div className="p-4 rounded-2xl bg-green-50 border border-green-200">
          <p className="text-xs font-semibold text-gray-500 uppercase">
            Government Mandi Reference
          </p>

          {loading ? (
            <div className="flex items-center gap-2 mt-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Fetching live price...</span>
            </div>
          ) : error ? (
            <p className="text-red-600 text-sm mt-2">
              {error}
            </p>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-green-700 mt-1">
                ₹{marketPrice.toFixed(2)}/kg
              </h3>

              <p className="text-xs text-green-700 mt-1">
                Government of India • AGMARKNET
              </p>
            </>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="p-5 rounded-2xl bg-[#eaf5ce] border space-y-4">

          <div className="flex justify-between">
            <span>Buyer Price</span>
            <strong>₹{buyerPrice.toFixed(2)}/kg</strong>
          </div>

          <div className="flex justify-between">
            <span>Quantity</span>
            <strong>{quantity} KG</strong>
          </div>

          <hr />

          <div className="flex justify-between">
            <span>Logistics Cost</span>
            <strong>- ₹{logisticsCost.toFixed(2)}/kg</strong>
          </div>

          <div className="flex justify-between">
            <span>Platform / Service Fee</span>
            <strong>- ₹{serviceFee.toFixed(2)}/kg</strong>
          </div>

          <hr />

          <div className="flex justify-between text-lg font-bold text-[#276b45]">
            <span>Net Farmer Income / KG</span>
            <span>₹{netFarmerRate.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-xl font-bold">
            <span>Total Expected Income</span>
            <span>₹{totalPayout.toLocaleString()}</span>
          </div>
        </div>

        {/* Comparison */}
        {!loading && !error && marketPrice > 0 && (
          <div className="p-4 rounded-xl border bg-white dark:bg-[#1b3025]">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-bold">Market Comparison</span>
            </div>

            {buyerPrice >= marketPrice ? (
              <p className="text-sm text-green-700">
                Your buyer price is at or above the current
                government mandi average.
              </p>
            ) : (
              <p className="text-sm text-orange-700">
                Your buyer price is below the current government
                mandi average. Consider another buyer or pooling.
              </p>
            )}
          </div>
        )}

        {/* Note */}
        <p className="text-xs text-gray-500">
          * Government mandi price is a live reference. Logistics
          and service charges shown here are prototype estimates.
        </p>

        {/* Navigation */}
        <div className="flex justify-between pt-3">

          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl border"
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Back
          </button>

          <button
            onClick={onNext}
            className="px-5 py-2 rounded-xl bg-[#276b45] text-white"
          >
            Continue
            <ArrowRight className="w-4 h-4 inline ml-2" />
          </button>

        </div>
      </div>
    </div>
  );
};