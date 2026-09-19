import React, { useEffect, useState } from "react";
import { LanguageCode } from '../types';
import { translations } from '../data/translations';
import { apiFetch } from '../lib/api';

import {
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";

import { FarmerProduce } from "../types";

interface SellingRecommendationProps {
  produce: FarmerProduce;
  onNext: () => void;
  onBack: () => void;
}

export const SellingRecommendation: React.FC<
  SellingRecommendationProps
> = ({
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
      .trim() ||
    produce.crop.trim();


  // =====================================
  // LIVE GOVERNMENT MANDI DATA
  // =====================================

  useEffect(() => {

    const fetchMarketPrice = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await apiFetch(`/api/market-summary?crop=${encodeURIComponent(
            crop
          )}`
        );

        if (!response.ok) {
          throw new Error(
            "Government mandi API unavailable"
          );
        }

        const data = await response.json();

        if (
          !data.success ||
          !data.availableData
        ) {
          throw new Error(
            "No government mandi data available for this crop."
          );
        }

        setMarketPrice(
          Number(
            data.averageModalPricePerKg
          ) || 0
        );

      } catch (err) {

        console.error(
          "Selling recommendation error:",
          err
        );

        setError(
          "Live mandi price could not be loaded."
        );

        setMarketPrice(0);

      } finally {

        setLoading(false);

      }

    };

    fetchMarketPrice();

  }, [crop]);


  // =====================================
  // FARMER VALUES
  // =====================================

  const farmerPrice =
    Number(produce.price) || 0;

  const quantity =
    Number(produce.qty) || 0;


  // =====================================
  // COSTS
  // =====================================

  const logistics =
    2.5;

  const platformFee =
    1.0;


  // =====================================
  // NET PAYOUT
  // =====================================

  const netPayout =
    Math.max(
      marketPrice -
        logistics -
        platformFee,
      0
    );


  const totalPayout =
    Math.round(
      netPayout * quantity
    );


  // =====================================
  // PRICE DIFFERENCE
  // =====================================

  const priceDifference =
    farmerPrice - marketPrice;


  const priceDifferencePercent =
    marketPrice > 0
      ? (
          (priceDifference /
            marketPrice) *
          100
        )
      : 0;


  // =====================================
  // RECOMMENDATION ENGINE
  // =====================================

  let recommendation =
    "WAIT ⏳";

  let recommendationReason =
    "Checking current government mandi conditions.";


  if (marketPrice > 0) {

    if (
      farmerPrice <=
      marketPrice * 0.95
    ) {

      recommendation =
        "SELL NOW ✅";

      recommendationReason =
        "Your expected selling rate is below the current government mandi average, so the current market looks favorable.";

    } else if (
      farmerPrice <=
      marketPrice * 1.05
    ) {

      recommendation =
        "JOIN POOL 🤝";

      recommendationReason =
        "Your expected rate is close to the current mandi average. Pooling can help improve market access and reduce selling difficulty.";

    } else {

      recommendation =
        "WAIT ⏳";

      recommendationReason =
        "Your expected rate is higher than the current mandi average. Consider waiting for a better buyer or market opportunity.";

    }

  }


  // =====================================
  // LOADING SCREEN
  // =====================================

  if (loading) {

    return (

      <div className="max-w-xl mx-auto">

        <div className="p-8 rounded-3xl bg-white dark:bg-[#15271e] border shadow-sm text-center">

          <TrendingUp className="w-8 h-8 mx-auto mb-3 text-[#276b45] animate-pulse" />

          <h2 className="text-lg font-bold text-[#20352b] dark:text-white">
            Checking Live Mandi Prices...
          </h2>

          <p className="text-xs text-gray-500 mt-2">
            Government of India • AGMARKNET
          </p>

        </div>

      </div>

    );

  }


  // =====================================
  // ERROR SCREEN
  // =====================================

  if (error || marketPrice <= 0) {

    return (

      <div className="max-w-xl mx-auto">

        <div className="p-8 rounded-3xl bg-white dark:bg-[#15271e] border shadow-sm text-center">

          <AlertCircle className="w-8 h-8 mx-auto mb-3 text-orange-500" />

          <h2 className="text-lg font-bold text-[#20352b] dark:text-white">
            Mandi Data Unavailable
          </h2>

          <p className="text-xs text-gray-500 mt-2">
            {error ||
              "No valid government mandi price was found for this crop."}
          </p>

          <button
            onClick={onBack}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[#276b45] text-white font-bold text-xs"
          >
            Go Back
          </button>

        </div>

      </div>

    );

  }


  // =====================================
  // MAIN UI
  // =====================================

  return (

    <div className="max-w-xl mx-auto space-y-6">

      <div className="p-6 rounded-3xl bg-white dark:bg-[#15271e] border shadow-sm space-y-6">


        {/* HEADER */}

        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#276b45]">

          <Lightbulb className="w-4 h-4" />

          AI Selling Recommendation

        </div>


        <div>

          <h2 className="text-2xl font-bold text-[#20352b] dark:text-white">

            💡 Best Selling Channel

          </h2>

          <p className="text-xs text-gray-500 mt-1">

            Live market analysis for{" "}

            <strong>
              {quantity} KG {produce.crop}
            </strong>

          </p>

        </div>


        {/* LIVE SOURCE */}

        <div className="flex justify-between items-center p-3 rounded-xl bg-[#eaf5ce] border">

          <div>

            <p className="text-[10px] uppercase font-bold text-gray-500">
              Data Source
            </p>

            <p className="text-xs font-bold text-[#276b45]">
              Government of India • AGMARKNET
            </p>

          </div>

          <div className="text-right">

            <p className="text-[10px] uppercase font-bold text-gray-500">
              Current Avg
            </p>

            <p className="text-sm font-bold text-[#276b45]">
              ₹{marketPrice.toFixed(2)}/kg
            </p>

          </div>

        </div>


        {/* PRICE COMPARISON */}

        <div className="grid grid-cols-2 gap-3">

          <div className="p-3 rounded-xl bg-green-50 border">

            <p className="text-xs text-gray-500">
              Govt. Mandi Rate
            </p>

            <h3 className="text-xl font-bold text-green-700">
              ₹{marketPrice.toFixed(2)}/kg
            </h3>

          </div>


          <div className="p-3 rounded-xl bg-orange-50 border">

            <p className="text-xs text-gray-500">
              Your Expected Rate
            </p>

            <h3 className="text-xl font-bold text-orange-600">
              ₹{farmerPrice.toFixed(2)}/kg
            </h3>

          </div>

        </div>


        {/* PRICE DIFFERENCE */}

        <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1c3327] border">

          <div className="flex justify-between text-sm">

            <span className="text-gray-500">
              Difference from Mandi
            </span>

            <strong
              className={
                priceDifference <= 0
                  ? "text-green-700"
                  : "text-orange-600"
              }
            >
              {priceDifference >= 0
                ? "+"
                : ""}
              ₹{priceDifference.toFixed(2)}/kg
            </strong>

          </div>

          <p className="text-[11px] text-gray-500 mt-1">

            {Math.abs(
              priceDifferencePercent
            ).toFixed(1)}
            %{" "}
            {priceDifference >= 0
              ? "above"
              : "below"}{" "}
            current mandi average

          </p>

        </div>


        {/* PAYOUT BREAKDOWN */}

        <div className="p-4 rounded-xl bg-[#eaf5ce] border space-y-3">

          <div className="flex justify-between">

            <span>
              Government Avg Price
            </span>

            <strong>
              ₹{marketPrice.toFixed(2)}
            </strong>

          </div>


          <div className="flex justify-between">

            <span>
              Logistics Cost
            </span>

            <strong>
              - ₹{logistics.toFixed(2)}
            </strong>

          </div>


          <div className="flex justify-between">

            <span>
              Platform Fee
            </span>

            <strong>
              - ₹{platformFee.toFixed(2)}
            </strong>

          </div>


          <hr />


          <div className="flex justify-between text-lg font-bold text-[#276b45]">

            <span>
              Net Payout / KG
            </span>

            <span>
              ₹{netPayout.toFixed(2)}
            </span>

          </div>


          <div className="flex justify-between text-lg font-bold">

            <span>
              Estimated Total Earnings
            </span>

            <span>
              ₹{totalPayout.toLocaleString("en-IN")}
            </span>

          </div>

        </div>


        {/* RECOMMENDATION */}

        <div className="p-4 rounded-xl bg-green-700 text-white">

          <div className="flex items-center gap-2">

            <TrendingUp className="w-5 h-5" />

            <span className="font-bold">
              AI Recommendation
            </span>

          </div>


          <h3 className="text-2xl font-bold mt-2">

            {recommendation}

          </h3>


          <p className="text-sm mt-2 opacity-90">

            {recommendationReason}

          </p>


          <p className="text-[10px] mt-3 opacity-70">

            Based on current Government of India
            AGMARKNET mandi price data.

          </p>

        </div>


        {/* BUTTONS */}

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

            Buyer Matching

            <ArrowRight className="w-4 h-4 inline ml-2" />

          </button>

        </div>

      </div>

    </div>

  );

};