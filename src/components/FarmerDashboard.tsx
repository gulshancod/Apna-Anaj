import React from 'react';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';
import {
  Sprout,
  TrendingUp,
  Scale,
  Truck,
  Boxes,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  IndianRupee,
  MapPin,
  Sparkles,
  BarChart3,
  Clock3
} from 'lucide-react';
import { FarmerProduce } from '../types';

interface FarmerDashboardProps {
  farmerName: string;
  farmName: string;
  farmerLoc: string;
  produce: FarmerProduce;
  onNavigateTab: (tabId: string) => void;
}

const workflow = [
  {
    id: 'view-add-produce',
    number: '01',
    icon: Sprout,
    title: 'Add Harvest',
    sub: 'List fresh crop details'
  },
  {
    id: 'view-demand-forecast',
    number: '02',
    icon: TrendingUp,
    title: 'AI Forecast',
    sub: 'Read demand & price'
  },
  {
    id: 'view-selling-rec',
    number: '03',
    icon: Scale,
    title: 'Sell Decision',
    sub: 'Choose the best action'
  },
  {
    id: 'view-matching',
    number: '04',
    icon: Boxes,
    title: 'Buyer Match',
    sub: 'Find nearby demand'
  }
];

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  farmerName,
  farmName,
  farmerLoc,
  produce,
  onNavigateTab
}) => {
  const quantity = Number(produce.qty) || 0;
  const price = Number(produce.price) || 0;
  const estimatedValue = quantity * price;

  return (
    <div className="space-y-6 animate-fadeIn">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#1e5634] p-6 sm:p-8 text-white shadow-[0_20px_50px_rgba(30,86,52,0.18)]">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#f7c244]/10 blur-2xl" />
        <div className="absolute -bottom-24 -left-14 h-56 w-56 rounded-full bg-[#d9efb7]/10 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#f7c244]">
              <span className="h-2 w-2 rounded-full bg-[#f7c244] animate-pulse" />
              Verified Farmer Dashboard
            </div>

            <h1 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">
              Namaste, {farmerName.split(' ')[0] || 'Farmer'} 👋
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/75">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#f7c244]" />
                {farmName || 'Your Farm'}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#f7c244]" />
                {farmerLoc || 'Location not set'}
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('view-add-produce')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f7c244] px-5 py-3 text-xs font-black text-[#1f3427] shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:bg-[#e6b338]"
          >
            <Sprout className="h-4 w-4" />
            Add Harvested Crop
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="premium-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="premium-label">Active Crop</p>
              <p className="mt-2 font-heading text-2xl font-bold text-[#20352b] dark:text-white">{quantity.toLocaleString()} KG</p>
              <p className="mt-1 text-xs font-semibold text-[#6d7e73] dark:text-[#9ab0a2]">{produce.crop}</p>
            </div>
            <div className="premium-icon bg-[#eef6e8] text-[#276b45]"><Sprout className="h-4 w-4" /></div>
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#276b45] dark:text-[#4ade80]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Ready for pooled pickup
          </div>
        </div>

        <div className="premium-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="premium-label">Direct Fair Rate</p>
              <p className="mt-2 font-heading text-2xl font-bold text-[#276b45] dark:text-[#4ade80]">₹{price.toFixed(2)}<span className="text-sm font-normal">/kg</span></p>
              <p className="mt-1 text-xs font-semibold text-[#6d7e73] dark:text-[#9ab0a2]">Transparent farmer-facing rate</p>
            </div>
            <div className="premium-icon bg-[#e4f1cd] text-[#276b45]"><IndianRupee className="h-4 w-4" /></div>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#edf1ed] dark:bg-[#243b2f]">
            <div className="h-full w-[88%] rounded-full bg-[#276b45]" />
          </div>
          <p className="mt-2 text-[10px] font-bold text-[#6d7e73] dark:text-[#9ab0a2]">88% direct farmer share shown in the prototype</p>
        </div>

        <div className="premium-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="premium-label">Estimated Batch Value</p>
              <p className="mt-2 font-heading text-2xl font-bold text-[#20352b] dark:text-white">₹{estimatedValue.toLocaleString()}</p>
              <p className="mt-1 text-xs font-semibold text-[#6d7e73] dark:text-[#9ab0a2]">Quantity × listed rate</p>
            </div>
            <div className="premium-icon bg-[#fff5d9] text-[#c88900]"><BarChart3 className="h-4 w-4" /></div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-[#276b45] dark:text-[#4ade80]">
            <Sparkles className="h-3.5 w-3.5" />
            Ready for AI analysis
          </div>
        </div>

        <div className="premium-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="premium-label">Route Compatibility</p>
              <p className="mt-2 font-heading text-2xl font-bold text-[#f28b47]">95%</p>
              <p className="mt-1 text-xs font-semibold text-[#6d7e73] dark:text-[#9ab0a2]">2 neighboring farms grouped</p>
            </div>
            <div className="premium-icon bg-[#fff0e4] text-[#f28b47]"><Truck className="h-4 w-4" /></div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-[#276b45] dark:text-[#4ade80]">
            <Clock3 className="h-3.5 w-3.5" />
            EV pickup compatible
          </div>
        </div>
      </section>

      <section className="premium-card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-[#e7ece7] dark:border-[#2a4335] p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="premium-label">Next best action</p>
            <h2 className="mt-1 font-heading text-xl font-bold text-[#20352b] dark:text-white">Move your harvest through the AI workflow</h2>
            <p className="mt-1 text-xs text-[#6d7e73] dark:text-[#9ab0a2]">Complete the next step to unlock the recommendation and matching tools.</p>
          </div>
          <button
            onClick={() => onNavigateTab('view-add-produce')}
            className="inline-flex items-center gap-2 self-start rounded-xl bg-[#276b45] px-4 py-2.5 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#1e5636]"
          >
            Start workflow
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-0 md:grid-cols-2 xl:grid-cols-4">
          {workflow.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigateTab(item.id)}
                className="group relative border-b border-[#e7ece7] p-5 text-left transition-all hover:bg-[#f7faf5] dark:border-[#2a4335] dark:hover:bg-[#14271e] xl:border-b-0 xl:border-r last:xl:border-r-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest text-[#a0aca4]">{item.number}</span>
                  <span className="premium-icon bg-[#eef6e8] text-[#276b45] group-hover:bg-[#276b45] group-hover:text-white">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="mt-5 text-sm font-extrabold text-[#20352b] dark:text-white">{item.title}</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-[#6d7e73] dark:text-[#9ab0a2]">{item.sub}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-[10px] font-black text-[#276b45] dark:text-[#4ade80]">
                  Open
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="premium-card p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="premium-label">Farmer advantage</p>
              <h2 className="mt-1 font-heading text-xl font-bold text-[#20352b] dark:text-white">Everything important stays above the fold</h2>
            </div>
            <div className="premium-icon bg-[#e4f1cd] text-[#276b45]"><Sparkles className="h-4 w-4" /></div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button onClick={() => onNavigateTab('view-demand-forecast')} className="premium-soft-card text-left">
              <TrendingUp className="h-5 w-5 text-[#276b45]" />
              <p className="mt-3 text-sm font-bold text-[#20352b] dark:text-white">AI Demand Forecast</p>
              <p className="mt-1 text-[11px] text-[#6d7e73] dark:text-[#9ab0a2]">Live mandi average, range and 7-day projection.</p>
            </button>
            <button onClick={() => onNavigateTab('view-selling-rec')} className="premium-soft-card text-left">
              <Scale className="h-5 w-5 text-[#276b45]" />
              <p className="mt-3 text-sm font-bold text-[#20352b] dark:text-white">Selling Recommendation</p>
              <p className="mt-1 text-[11px] text-[#6d7e73] dark:text-[#9ab0a2]">Convert market numbers into an easy next action.</p>
            </button>
            <button onClick={() => onNavigateTab('view-route')} className="premium-soft-card text-left">
              <Truck className="h-5 w-5 text-[#f28b47]" />
              <p className="mt-3 text-sm font-bold text-[#20352b] dark:text-white">EV Pickup Route</p>
              <p className="mt-1 text-[11px] text-[#6d7e73] dark:text-[#9ab0a2]">Track grouped logistics and pickup readiness.</p>
            </button>
            <button onClick={() => onNavigateTab('view-transparency')} className="premium-soft-card text-left">
              <ShieldCheck className="h-5 w-5 text-[#276b45]" />
              <p className="mt-3 text-sm font-bold text-[#20352b] dark:text-white">Price Transparency</p>
              <p className="mt-1 text-[11px] text-[#6d7e73] dark:text-[#9ab0a2]">Show how the farmer-facing payout is built.</p>
            </button>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[#dbe6d9] dark:border-[#284433] bg-[#f7fbf4] dark:bg-[#13271d] p-6">
          <div className="flex items-center gap-2 text-[#276b45] dark:text-[#4ade80]">
            <ShieldCheck className="h-5 w-5" />
            <p className="text-xs font-black uppercase tracking-[0.15em]">Trust layer</p>
          </div>
          <h3 className="mt-3 font-heading text-xl font-bold text-[#20352b] dark:text-white">Clear numbers. Clear next step.</h3>
          <div className="mt-5 space-y-3">
            {[
              ['Verified farmer profile', 'Identity and farm context stays visible.'],
              ['Transparent pricing', 'Government mandi data is shown where available.'],
              ['Shared logistics', 'Pooling and EV pickup are part of the same flow.'],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-xl border border-[#dfe7df] dark:border-[#2a4335] bg-white dark:bg-[#15271e] p-3.5">
                <p className="text-xs font-bold text-[#20352b] dark:text-white">{title}</p>
                <p className="mt-1 text-[10px] leading-relaxed text-[#6d7e73] dark:text-[#9ab0a2]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
