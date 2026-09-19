import React from 'react';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';
import {
  Boxes,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Users
} from 'lucide-react';
import { FarmerProduce } from '../types';

interface QuantityPoolingProps {
  farmerName: string;
  produce: FarmerProduce;
  onNext: () => void;
  onBack: () => void;
}

export const QuantityPooling: React.FC<QuantityPoolingProps> = ({
  farmerName,
  produce,
  onNext,
  onBack
}) => {
  // Buyer requirement
  const targetQuantity = 1000;

  const farmerQuantity = Math.max(Number(produce.qty) || 0, 0);

  // Quantity still needed
  const remainingQuantity = Math.max(
    targetQuantity - farmerQuantity,
    0
  );

  // Temporary pool allocation for prototype
  const farmerBQty = Math.round(remainingQuantity * 0.6);
  const farmerCQty = remainingQuantity - farmerBQty;

  const totalPooled =
    farmerQuantity + farmerBQty + farmerCQty;

  const progress = Math.min(
    Math.round((totalPooled / targetQuantity) * 100),
    100
  );

  const shareA =
    totalPooled > 0
      ? Math.round((farmerQuantity / totalPooled) * 100)
      : 0;

  const shareB =
    totalPooled > 0
      ? Math.round((farmerBQty / totalPooled) * 100)
      : 0;

  const shareC =
    Math.max(100 - shareA - shareB, 0);

  const targetMet = totalPooled >= targetQuantity;

  return (
    <div className="max-w-xl mx-auto space-y-6">

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] shadow-sm space-y-6">

        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#276b45] dark:text-[#4ade80] tracking-widest">
          <Boxes className="w-4 h-4" />
          <span>Apna Anaj Cooperative Pooling</span>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-bold text-[#20352b] dark:text-[#f4f8f5]">
            📦 Shared Quantity Pooling
          </h2>

          <p className="text-xs sm:text-sm text-[#6d7e73] dark:text-[#9ab0a2] mt-1">
            Combine produce from nearby farmers to fulfil bulk buyer demand.
          </p>
        </div>

        {/* Pool Summary */}
        <div className="p-6 rounded-2xl bg-[#eaf5ce] dark:bg-[#163824] border border-[#276b45]/30 space-y-5">

          <div className="flex items-center justify-between gap-3">

            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#6d7e73] tracking-wider">
                Pooled Quantity
              </span>

              <h3 className="font-heading text-2xl font-bold text-[#20352b] dark:text-[#f4f8f5]">
                {totalPooled.toLocaleString()} KG
              </h3>

              <p className="text-xs text-[#6d7e73] mt-1">
                {produce.crop} • Target: {targetQuantity.toLocaleString()} KG
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#276b45] text-white text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {progress}%
            </span>

          </div>

          {/* Progress */}
          <div className="space-y-1.5">

            <div className="h-3 w-full bg-white dark:bg-[#15271e] rounded-full overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="bg-[#276b45] h-full transition-all"
              />
            </div>

            <div className="flex justify-between text-[10px] font-bold text-[#6d7e73]">
              <span>{totalPooled.toLocaleString()} KG pooled</span>
              <span>{targetQuantity.toLocaleString()} KG target</span>
            </div>

          </div>

          {/* Remaining */}
          {!targetMet && (
            <div className="p-3 rounded-xl bg-orange-50 dark:bg-[#2b2116] border border-orange-200">
              <p className="text-xs font-bold text-orange-700">
                {remainingQuantity.toLocaleString()} KG required from other farmers
              </p>
            </div>
          )}

          {/* Contributions */}
          <div className="space-y-2 pt-2 border-t border-[#dfe7df]/60">

            <div className="p-3 rounded-xl bg-white dark:bg-[#15271e] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#276b45]" />
                <span className="font-bold">
                  {farmerName} (You)
                </span>
              </div>

              <strong className="text-[#276b45]">
                {farmerQuantity} KG ({shareA}%)
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#15271e] flex items-center justify-between text-xs">
              <span className="font-bold">
                Farmer B
              </span>

              <strong>
                {farmerBQty} KG ({shareB}%)
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#15271e] flex items-center justify-between text-xs">
              <span className="font-bold">
                Farmer C
              </span>

              <strong>
                {farmerCQty} KG ({shareC}%)
              </strong>
            </div>

          </div>

        </div>

        {/* Status */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#15271e] border border-[#dfe7df]">

          <p className="text-xs font-bold">
            📊 Pool Status
          </p>

          <p className="text-xs text-[#6d7e73] mt-1">
            {targetMet
              ? 'Target quantity reached. The pooled batch is ready for pickup planning.'
              : `${remainingQuantity.toLocaleString()} KG more produce is required to complete the buyer target.`}
          </p>

        </div>

        {/* Prototype Note */}
        <div className="text-[10px] text-[#6d7e73]">
          Pool contribution values are calculated dynamically for the prototype.
          Production version can connect verified nearby farmer listings through
          the backend database.
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
            View Pickup Route
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};