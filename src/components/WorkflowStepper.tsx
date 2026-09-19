import React from 'react';
import { Check, Sprout, TrendingUp, Lightbulb, Handshake, Boxes, Truck, IndianRupee } from 'lucide-react';

export interface WorkflowStepperProps {
  currentStep: number;
}

const steps = [
  { label: 'Add Crop', icon: Sprout },
  { label: 'AI Forecast', icon: TrendingUp },
  { label: 'Sell Decision', icon: Lightbulb },
  { label: 'Buyer Match', icon: Handshake },
  { label: 'Pool', icon: Boxes },
  { label: 'Pickup', icon: Truck },
  { label: 'Payout', icon: IndianRupee },
];

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({ currentStep }) => (
  <div className="mb-6 rounded-3xl border border-[#dfe7df] dark:border-[#223f30] bg-white/90 dark:bg-[#15271e]/90 p-4 sm:p-5 shadow-[0_12px_35px_rgba(31,52,39,0.06)] backdrop-blur">
    <div className="flex items-center justify-between gap-3 mb-4">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#276b45] dark:text-[#4ade80]">
          Farmer workflow
        </p>
        <p className="text-xs text-[#6d7e73] dark:text-[#9ab0a2] mt-1">
          From fresh harvest to transparent payout
        </p>
      </div>
      <div className="hidden sm:block px-3 py-1.5 rounded-full bg-[#eef6e8] dark:bg-[#163824] text-[10px] font-black text-[#276b45] dark:text-[#4ade80]">
        {currentStep === 0 ? 'Overview' : `Step ${currentStep} of 7`}
      </div>
    </div>

    <div className="overflow-x-auto pb-1 scrollbar-none">
      <div className="flex min-w-[760px] items-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const complete = currentStep > index;
          const active = currentStep === index + 1;
          return (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center min-w-[94px]">
                <div
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    complete
                      ? 'bg-[#276b45] border-[#276b45] text-white'
                      : active
                      ? 'bg-[#e4f1cd] border-[#276b45] text-[#276b45] shadow-[0_0_0_5px_rgba(39,107,69,0.08)]'
                      : 'bg-white dark:bg-[#15271e] border-[#dfe7df] dark:border-[#2b4737] text-[#8b9b91]'
                  }`}
                >
                  {complete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`mt-2 text-[10px] font-bold text-center ${
                  active || complete ? 'text-[#20352b] dark:text-white' : 'text-[#7b8a80] dark:text-[#8ea298]'
                }`}>
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 min-w-5 mx-1 transition-colors ${
                  complete ? 'bg-[#276b45]' : 'bg-[#e7ece7] dark:bg-[#294536]'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  </div>
);
