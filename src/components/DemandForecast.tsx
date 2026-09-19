import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowLeft,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { FarmerProduce } from '../types';

interface DemandForecastProps {
  produce: FarmerProduce;
  onNext: () => void;
  onBack: () => void;
}

interface MarketResponse {
  success: boolean;
  availableData?: boolean;
  isDemoData?: boolean;
  source?: string;
  sourceType?: string;
  crop?: string;
  markets?: number;
  records?: number;
  averageModalPricePerKg?: number;
  lowestModalPricePerKg?: number;
  highestModalPricePerKg?: number;
}

export const DemandForecast: React.FC<DemandForecastProps> = ({
  produce,
  onNext,
  onBack
}) => {
  const [marketData, setMarketData] =
    useState<MarketResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    const loadMarketData = async () => {
      try {
        setLoading(true);
        setError('');

        const crop =
          produce.crop
            .split('/')
            .pop()
            ?.replace(/\(.*?\)/g, '')
            .trim() ||
          produce.crop.trim();

        const response = await apiFetch(`/api/market-summary?crop=${encodeURIComponent(
            crop
          )}`
        );

        if (!response.ok) {
          throw new Error(
            'Government market API unavailable'
          );
        }

        const data: MarketResponse =
          await response.json();

        if (
          !data.success ||
          !data.availableData
        ) {
          throw new Error(
            data.sourceType ||
              'No mandi data available for this crop'
          );
        }

        setMarketData(data);
      } catch (err) {
        console.error(
          'Demand forecast error:',
          err
        );

        setError(
          'Live mandi data could not be loaded.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadMarketData();
  }, [produce.crop]);


  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-5 animate-fadeIn">
        <div className="premium-card p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="h-3 w-36 rounded skeleton" />
              <div className="mt-3 h-7 w-72 rounded skeleton" />
              <div className="mt-2 h-4 w-96 max-w-full rounded skeleton" />
            </div>
            <div className="premium-icon skeleton" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-24 rounded-2xl skeleton" />
            ))}
          </div>

          <div className="mt-5 h-56 rounded-2xl skeleton" />
        </div>

        <div className="rounded-2xl border border-[#dfe7df] bg-[#f7fbf4] p-4 dark:border-[#223f30] dark:bg-[#13271d]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#276b45] dark:text-[#4ade80]">
            <Sparkles className="h-4 w-4" />
            Analysing live mandi data…
          </div>
          <p className="mt-1 text-[11px] text-[#6d7e73] dark:text-[#9ab0a2]">
            Government of India • AGMARKNET
          </p>
        </div>
      </div>
    );
  }


  // =====================================
  // ERROR
  // =====================================

  if (error || !marketData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="p-8 rounded-3xl bg-white dark:bg-[#15271e] border border-red-200 shadow-sm text-center">

          <TrendingDown className="w-8 h-8 mx-auto mb-3 text-red-500" />

          <h2 className="font-bold text-lg text-[#20352b] dark:text-white">
            Mandi Data Unavailable
          </h2>

          <p className="text-sm text-[#6d7e73] mt-2">
            {error}
          </p>

          <button
            type="button"
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
  // LIVE VALUES
  // =====================================

  const governmentAverage =
    Number(
      marketData.averageModalPricePerKg || 0
    );

  const lowestPrice =
    Number(
      marketData.lowestModalPricePerKg || 0
    );

  const highestPrice =
    Number(
      marketData.highestModalPricePerKg || 0
    );

  const farmerPrice =
    Number(produce.price || 0);


  // =====================================
  // MARKET SIGNAL
  // =====================================
  // Based on farmer's expected rate
  // versus current government mandi average.

  let demand:
    | 'HIGH'
    | 'MEDIUM'
    | 'LOW';

  let recommendation: string;

  let reason: string;

  if (farmerPrice <= governmentAverage) {
    demand = 'HIGH';

    recommendation = 'Sell Now';

    reason =
      'Your expected rate is at or below the current government mandi average, indicating a strong selling opportunity.';
  }

  else if (
    farmerPrice <=
    governmentAverage * 1.10
  ) {
    demand = 'MEDIUM';

    recommendation = 'Join Pool';

    reason =
      'Your expected rate is slightly above the current mandi average. Pooling can improve market access and selling efficiency.';
  }

  else {
    demand = 'LOW';

    recommendation = 'Review Price';

    reason =
      'Your expected rate is considerably above the current mandi average. Consider reviewing the price before selling.';
  }


  // =====================================
  // 7-DAY PROJECTION
  // =====================================
  // This is a projection based on the
  // current live mandi range.
  // It is NOT historical government data.

  const currentPrice =
    governmentAverage > 0
      ? governmentAverage
      : farmerPrice;

  const marketRange =
    Math.max(
      highestPrice - lowestPrice,
      1
    );

  const rangePercent =
    (marketRange / currentPrice) * 100;

  const trend =
    farmerPrice <= governmentAverage
      ? Math.min(
          Math.max(rangePercent * 0.25, 2),
          8
        )
      : Math.min(
          Math.max(rangePercent * 0.15, -5),
          5
        );


  const prices = [
    Math.max(
      1,
      Number(
        (
          currentPrice -
          marketRange * 0.18
        ).toFixed(2)
      )
    ),

    Math.max(
      1,
      Number(
        (
          currentPrice -
          marketRange * 0.10
        ).toFixed(2)
      )
    ),

    Math.max(
      1,
      Number(
        (
          currentPrice -
          marketRange * 0.04
        ).toFixed(2)
      )
    ),

    Number(
      currentPrice.toFixed(2)
    ),

    Number(
      (
        currentPrice *
        (1 + trend / 100 * 0.35)
      ).toFixed(2)
    ),

    Number(
      (
        currentPrice *
        (1 + trend / 100 * 0.65)
      ).toFixed(2)
    ),

    Number(
      (
        currentPrice *
        (1 + trend / 100)
      ).toFixed(2)
    )
  ];


  const labels = [
    'Recent',
    'Recent',
    'Recent',
    'Today',
    'Day +2',
    'Day +4',
    'Day +7'
  ];


  const minChartPrice =
    Math.min(...prices);

  const maxChartPrice =
    Math.max(...prices);


  const days =
    prices.map(
      (price, index) => {

        const height =
          maxChartPrice ===
          minChartPrice
            ? 70
            : 35 +
              (
                (price -
                  minChartPrice) /
                (maxChartPrice -
                  minChartPrice)
              ) *
                65;

        return {
          label:
            labels[index],

          price,

          type:
            index === 3
              ? 'current'
              : index > 3
              ? 'pred'
              : 'past',

          height:
            `${height}%`
        };
      }
    );


  const DemandIcon =
    demand === 'HIGH'
      ? TrendingUp
      : demand === 'LOW'
      ? TrendingDown
      : Minus;


  const demandColor =
    demand === 'HIGH'
      ? 'bg-green-100 text-green-700 border-green-200'
      : demand === 'LOW'
      ? 'bg-red-100 text-red-700 border-red-200'
      : 'bg-yellow-100 text-yellow-700 border-yellow-200';


  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div className="premium-card p-5 sm:p-7 space-y-6">

        {/* HEADER */}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#276b45] dark:text-[#4ade80] tracking-widest">
          <TrendingUp className="w-4 h-4" />

            <span>Apna Anaj AI Demand Forecast</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#eef6e8] px-3 py-1.5 text-[10px] font-black text-[#276b45] dark:bg-[#163824] dark:text-[#4ade80]">
            <Sparkles className="h-3.5 w-3.5" />
            Live market signal
          </span>
        </div>


        <div>

          <h2 className="font-heading text-2xl font-bold text-[#20352b] dark:text-[#f4f8f5]">
            📈 7-Day Demand & Price Forecast
          </h2>

          <p className="text-xs sm:text-sm text-[#6d7e73] dark:text-[#9ab0a2] mt-1">

            Live market analysis for{' '}

            <strong className="text-[#20352b] dark:text-[#f4f8f5]">
              {produce.qty} KG {produce.crop}
            </strong>

          </p>

        </div>


        {/* LIVE SOURCE */}

        <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#eaf5ce]/60 dark:bg-[#163824]/60 border border-[#dfe7df]">

          <div>

            <p className="text-[10px] uppercase font-bold text-[#6d7e73]">
              Data Source
            </p>

            <p className="text-xs font-bold text-[#276b45]">
              {marketData.isDemoData
                ? 'ApnaAnaj Demo Reference'
                : 'Government of India • AGMARKNET'}
            </p>

          </div>


          <div className="text-right">

            <p className="text-[10px] uppercase font-bold text-[#6d7e73]">
              Markets
            </p>

            <p className="text-sm font-bold text-[#20352b] dark:text-white">
              {marketData.markets || 0}
            </p>

          </div>

        </div>


        {/* DEMAND STATUS */}

        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#eaf5ce]/60 dark:bg-[#163824]/60 border border-[#dfe7df]">

          <div>

            <p className="text-xs text-[#6d7e73] mb-1">
              Current Market Signal
            </p>

            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-black text-base ${demandColor}`}
            >

              <DemandIcon className="w-4 h-4" />

              {demand}

            </div>

          </div>


          <div className="text-right">

            <p className="text-xs text-[#6d7e73]">
              Current Mandi Average
            </p>

            <p className="text-xl font-bold text-[#276b45]">
              ₹{governmentAverage.toFixed(2)}/kg
            </p>

          </div>

        </div>


        {/* LIVE PRICE RANGE */}

        <div className="grid grid-cols-3 gap-3">

          <div className="p-3 rounded-xl bg-[#f5f7f5] dark:bg-[#1c3327] text-center">

            <p className="text-[10px] text-[#6d7e73]">
              Lowest
            </p>

            <p className="font-bold text-sm text-[#20352b] dark:text-white">
              ₹{lowestPrice.toFixed(2)}
            </p>

          </div>


          <div className="p-3 rounded-xl bg-[#f5f7f5] dark:bg-[#1c3327] text-center">

            <p className="text-[10px] text-[#6d7e73]">
              Average
            </p>

            <p className="font-bold text-sm text-[#20352b] dark:text-white">
              ₹{governmentAverage.toFixed(2)}
            </p>

          </div>


          <div className="p-3 rounded-xl bg-[#f5f7f5] dark:bg-[#1c3327] text-center">

            <p className="text-[10px] text-[#6d7e73]">
              Highest
            </p>

            <p className="font-bold text-sm text-[#20352b] dark:text-white">
              ₹{highestPrice.toFixed(2)}
            </p>

          </div>

        </div>


        {/* CHART */}

        <div className="p-5 rounded-2xl bg-[#eaf5ce]/60 dark:bg-[#163824]/60 border border-[#dfe7df] dark:border-[#223f30] space-y-4">

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">

            <span className="text-[#20352b] dark:text-[#f4f8f5]">
              Live Mandi Price + 7-Day Projection
            </span>

            <span className="text-[#276b45]">
              Current ₹{governmentAverage.toFixed(2)}/kg
            </span>

          </div>


          <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 border-b border-[#dfe7df] dark:border-[#223f30]">

            {days.map(
              (d, idx) => (

                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                >

                  <span className="text-[10px] font-bold text-[#6d7e73]">
                    ₹{d.price}
                  </span>


                  <div
                    style={{
                      height:
                        d.height
                    }}
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      d.type === 'current'
                        ? 'bg-[#f28b47] ring-2 ring-[#f28b47]/40'
                        : d.type === 'pred'
                        ? 'bg-[#276b45] dark:bg-[#4ade80]'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  />


                  <span className="text-[10px] font-bold text-[#6d7e73] truncate max-w-[55px] text-center">
                    {d.label}
                  </span>

                </div>

              )
            )}

          </div>


          {/* INSIGHT */}

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] text-xs">

            <Sparkles className="w-4 h-4 text-[#f28b47] shrink-0 mt-0.5" />

            <div className="text-[#20352b] dark:text-[#f4f8f5]">

              <strong>Market Insight:</strong>{' '}

              {reason}{' '}

              Based on the current mandi range,
              the 7-day projected reference is
              approximately{' '}

              <strong>
                ₹{prices[6].toFixed(2)}/kg
              </strong>.

            </div>

          </div>


          {/* RECOMMENDATION */}

          <div className="relative overflow-hidden rounded-2xl bg-[#1e5634] p-5 text-white shadow-lg shadow-[#1e5634]/10">

            <p className="text-xs opacity-80">
              Farmer Recommendation
            </p>

            <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
              <p className="font-heading text-2xl font-bold">💡 {recommendation}</p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-white/85">Actionable next step</span>
            </div>

          </div>

        </div>


        {/* BUTTONS */}

        <div className="flex items-center justify-between pt-2 gap-3">

          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] text-[#20352b] dark:text-[#f4f8f5] font-bold text-xs hover:bg-[#eaf5ce]/50 transition-all cursor-pointer"
          >

            <ArrowLeft className="w-4 h-4" />

            Back

          </button>


          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#276b45] hover:bg-[#1e5636] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >

            View Selling Recommendation

            <ArrowRight className="w-4 h-4" />

          </button>

        </div>

      </div>

    </div>
  );
};