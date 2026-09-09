import React from 'react';
import { 
  ArrowRight, 
  Wheat, 
  ShoppingBag, 
  MapPin, 
  Handshake, 
  Sprout, 
  ShieldCheck, 
  Gift, 
  Copy, 
  Check, 
  Star, 
  HeartHandshake,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';
import { testimonials } from '../data/mockData';

interface WelcomeViewProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onSelectRole: (role: 'buyer' | 'farmer') => void;
  onNavigateTab: (tabId: string) => void;
  onCopyCoupon: (code: string) => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  currentLang,
  onLanguageChange,
  onSelectRole,
  onNavigateTab,
  onCopyCoupon
}) => {
  const t = translations[currentLang] || translations.en;
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    onCopyCoupon(t.couponCodeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Hero Banner with KrishiDirect theme */}
      <div className="relative overflow-hidden rounded-3xl bg-[#1e5634] text-white p-6 sm:p-10 lg:p-12 shadow-xl shadow-[#1e5634]/15">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#d9efb7]/15 pointer-events-none blur-2xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#f7c244]/10 pointer-events-none blur-xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#f7c244] text-xs font-extrabold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#f28b47] animate-pulse" />
              <span>{t.heroEyebrow}</span>
            </div>

            <h1 
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1]"
              dangerouslySetInnerHTML={{ __html: t.welcomeTitle }}
            />

            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl">
              {t.welcomeSub}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectRole('buyer')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f7c244] hover:bg-[#e6b338] text-[#1f3427] font-bold text-sm shadow-lg shadow-black/10 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <span>{t.btnHeroBuyer}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectRole('farmer')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-black/20 hover:bg-black/30 border border-white/25 text-white font-bold text-sm backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <span>{t.btnHeroFarmer}</span>
              </button>
            </div>

            {/* Trust Avatar Stack */}
            <div className="flex items-center gap-3 pt-2 text-xs text-white/80">
              <div className="flex -space-x-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#d4936f] text-white font-bold text-[10px] border-2 border-[#1e5634]">BP</span>
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#507d60] text-white font-bold text-[10px] border-2 border-[#1e5634]">RK</span>
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#c1a273] text-white font-bold text-[10px] border-2 border-[#1e5634]">AK</span>
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1f3427] text-[#f7c244] font-bold text-[10px] border-2 border-[#1e5634]">+8k</span>
              </div>
              <p>
                <strong className="text-white">8,400+</strong> families getting fresh pure harvest daily
              </p>
            </div>
          </div>

          {/* Right Visual Photo Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] aspect-square rounded-[2rem] overflow-hidden border-4 border-white/20 shadow-2xl bg-gradient-to-tr from-[#163824] to-[#1e5634]">
              <img 
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=700&q=80" 
                alt="Indian Farmer in lush wheat and grain fields"
                className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-500 scale-105 hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#163824] via-transparent to-transparent opacity-80" />
              
              {/* Badge top */}
              <div className="absolute top-4 right-4 px-3.5 py-2 rounded-xl bg-white/95 text-[#1f3427] text-xs font-bold shadow-lg flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#e4f1cd] text-[#1e5634] flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#1f3427]">88% सीधा किसान को</div>
                  <div className="text-[10px] text-[#5e7164] font-medium">शून्य बिचौलिया शुल्क</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Impact Statistics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 sm:p-6 rounded-2xl bg-[#e4f1cd] dark:bg-[#163824] border border-[#bed99f] dark:border-[#223f30]">
        <div className="p-2 sm:p-3">
          <div className="font-heading font-bold text-2xl sm:text-3xl text-[#1e5634] dark:text-[#4ade80]">15,000+</div>
          <div className="text-xs font-bold text-[#5e7164] dark:text-[#9ab0a2] mt-0.5">जुड़े किसान</div>
        </div>

        <div className="p-2 sm:p-3">
          <div className="font-heading font-bold text-2xl sm:text-3xl text-[#1e5634] dark:text-[#4ade80]">15 Mins</div>
          <div className="text-xs font-bold text-[#5e7164] dark:text-[#9ab0a2] mt-0.5">एक्सप्रेस डिलीवरी</div>
        </div>

        <div className="p-2 sm:p-3">
          <div className="font-heading font-bold text-2xl sm:text-3xl text-[#1e5634] dark:text-[#4ade80]">₹0</div>
          <div className="text-xs font-bold text-[#5e7164] dark:text-[#9ab0a2] mt-0.5">कमीशन व शुल्क</div>
        </div>

        <div className="col-span-2 md:col-span-1 lg:col-span-2 p-2 sm:p-3 flex items-center gap-3">
          <span className="text-2xl">🧡</span>
          <div className="text-xs font-bold text-[#1f3427] dark:text-[#f4f8f5] leading-snug">
            प्योर देसी गारंटी: आज सुबह की खेत से ताज़ा तुड़ाई सीधे आपके किचन तक ।
          </div>
        </div>
      </div>

      {/* Role Selection & Language Panel */}
      <div className="bg-white dark:bg-[#15271e] border border-[#e5dec9] dark:border-[#223f30] rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* Language Selection Chips */}
        <div className="bg-[#e4f1cd] dark:bg-[#163824]/60 border border-[#bed99f] dark:border-[#223f30] rounded-2xl p-4 sm:p-5 mb-8 text-center">
          <span className="text-[11px] font-extrabold uppercase text-[#1e5634] dark:text-[#4ade80] tracking-wider block mb-3">
            SELECT LANGUAGE (अपनी भाषा चुनें)
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Object.keys(translations).map((langKey) => {
              const item = translations[langKey as LanguageCode];
              const isSelected = currentLang === langKey;
              return (
                <button
                  key={langKey}
                  onClick={() => onLanguageChange(langKey as LanguageCode)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1e5634] text-white shadow-sm scale-105'
                      : 'bg-white dark:bg-[#15271e] text-[#1f3427] dark:text-[#f4f8f5] border border-[#bed99f] dark:border-[#223f30] hover:border-[#1e5634] hover:text-[#1e5634]'
                  }`}
                >
                  {item.flag} {item.nativeName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Role Options Heading */}
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-center text-[#1f3427] dark:text-[#f4f8f5] mb-6">
          What is your role on Apna Anaj?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Buyer Choice Card */}
          <div 
            onClick={() => onSelectRole('buyer')}
            className="p-6 sm:p-8 rounded-2xl border-2 border-[#bed99f] dark:border-[#223f30] bg-[#e4f1cd] dark:bg-[#163824]/40 hover:scale-[1.01] transition-all duration-200 cursor-pointer flex flex-col justify-between text-center group"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 text-4xl group-hover:scale-110 transition-transform">
                🛒
              </div>
              <h3 className="font-heading text-xl font-bold text-[#1f3427] dark:text-[#f4f8f5]">
                {t.buyerTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#5e7164] dark:text-[#9ab0a2] mt-2 leading-relaxed max-w-xs">
                {t.buyerSub}
              </p>
            </div>

            <button className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#1e5634] hover:bg-[#164327] text-white text-sm font-bold shadow-md shadow-[#1e5634]/20 group-hover:translate-x-0.5 transition-all cursor-pointer">
              <span>{t.btnBuyer}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Farmer Choice Card */}
          <div 
            onClick={() => onSelectRole('farmer')}
            className="p-6 sm:p-8 rounded-2xl border-2 border-[#e5dec9] dark:border-[#223f30] bg-white dark:bg-[#0e1a14] hover:border-[#1e5634] transition-all duration-200 cursor-pointer flex flex-col justify-between text-center group"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 text-3xl group-hover:scale-110 transition-transform">
                <span>🧑‍🌾</span><span className="text-2xl ml-1">🌾</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-[#1f3427] dark:text-[#f4f8f5]">
                {t.farmerTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#5e7164] dark:text-[#9ab0a2] mt-2 leading-relaxed max-w-xs">
                {t.farmerSub}
              </p>
            </div>

            <button className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white dark:bg-[#15271e] hover:bg-[#1e5634] hover:text-white border-2 border-[#1e5634] text-[#1e5634] dark:text-[#4ade80] text-sm font-bold shadow-sm transition-all cursor-pointer">
              <span>{t.btnFarmer}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        <div className="mt-6 text-center text-xs text-[#5e7164] dark:text-[#9ab0a2]">
          <span>{t.haveAccount}</span>{' '}
          <button 
            onClick={() => onNavigateTab('view-auth')}
            className="text-[#1e5634] dark:text-[#4ade80] font-bold hover:underline cursor-pointer"
          >
            {t.loginLink}
          </button>
        </div>

      </div>

      {/* How It Works Process */}
      <div className="bg-white dark:bg-[#15271e] border border-[#e5dec9] dark:border-[#223f30] rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-[11px] font-extrabold uppercase text-[#1e5634] dark:text-[#4ade80] tracking-widest mb-1">
            {t.howItWorksEyebrow}
          </p>
          <h2 
            className="font-heading text-2xl sm:text-3xl font-bold text-[#1f3427] dark:text-[#f4f8f5]"
            dangerouslySetInnerHTML={{ __html: t.howItWorksHeading }}
          />
          <p className="text-xs sm:text-sm text-[#5e7164] dark:text-[#9ab0a2] mt-2">
            {t.howItWorksSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="relative p-6 rounded-2xl bg-[#fbf8ef] dark:bg-[#0e1a14] border border-[#e5dec9] dark:border-[#223f30]">
            <span className="font-heading font-bold text-2xl text-[#1e5634] dark:text-[#4ade80] block mb-3">01</span>
            <div className="w-10 h-10 rounded-xl bg-[#e4f1cd] dark:bg-[#163824] text-[#f28b47] flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#1f3427] dark:text-[#f4f8f5] mb-2">{t.step1Title}</h3>
            <p className="text-xs sm:text-sm text-[#5e7164] dark:text-[#9ab0a2] leading-relaxed">{t.step1Desc}</p>
          </div>

          <div className="relative p-6 rounded-2xl bg-[#fbf8ef] dark:bg-[#0e1a14] border border-[#e5dec9] dark:border-[#223f30]">
            <span className="font-heading font-bold text-2xl text-[#1e5634] dark:text-[#4ade80] block mb-3">02</span>
            <div className="w-10 h-10 rounded-xl bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] flex items-center justify-center mb-4">
              <Handshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#1f3427] dark:text-[#f4f8f5] mb-2">{t.step2Title}</h3>
            <p className="text-xs sm:text-sm text-[#5e7164] dark:text-[#9ab0a2] leading-relaxed">{t.step2Desc}</p>
          </div>

          <div className="relative p-6 rounded-2xl bg-[#fbf8ef] dark:bg-[#0e1a14] border border-[#e5dec9] dark:border-[#223f30]">
            <span className="font-heading font-bold text-2xl text-[#1e5634] dark:text-[#4ade80] block mb-3">03</span>
            <div className="w-10 h-10 rounded-xl bg-[#e4f1cd] dark:bg-[#163824] text-[#1e5634] flex items-center justify-center mb-4">
              <Sprout className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#1f3427] dark:text-[#f4f8f5] mb-2">{t.step3Title}</h3>
            <p className="text-xs sm:text-sm text-[#5e7164] dark:text-[#9ab0a2] leading-relaxed">{t.step3Desc}</p>
          </div>

        </div>
      </div>

      {/* Rewards / Voucher Section */}
      <div className="rounded-3xl bg-[#1e5634] text-white p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-[#1e5634]/15 relative overflow-hidden">
        <div className="space-y-3 max-w-lg">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f7c244] uppercase tracking-wider">
            <Gift className="w-4 h-4" />
            <span>Welcome Offer for Families</span>
          </div>

          <h2 
            className="font-heading text-2xl sm:text-3xl font-bold leading-tight"
            dangerouslySetInnerHTML={{ __html: t.rewardsHeading }}
          />

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            {t.rewardsSub}
          </p>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f7c244] hover:bg-[#e6b338] text-[#1f3427] font-bold text-xs shadow-md transition-all cursor-pointer mt-2"
          >
            {copied ? <Check className="w-4 h-4 text-[#1e5634]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied code to checkout!' : t.copyCouponBtn}</span>
          </button>
        </div>

        {/* Voucher Ticket Visual */}
        <div className="relative w-64 p-6 rounded-2xl bg-[#f7c244] text-[#1f3427] shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300 border-2 border-dashed border-[#1e5634]/40 text-center shrink-0">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#1f3427]/70">
            APNA ANAJ FIRST HARVEST
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-bold tracking-wider my-2 text-[#1f3427]">
            {t.couponCodeText}
          </div>
          <div className="text-[11px] font-bold text-[#1f3427]/80">
            {t.couponDesc}
          </div>
        </div>
      </div>

      {/* Community Stories & Testimonials */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase text-[#1e5634] dark:text-[#4ade80] tracking-widest mb-1">
              Community Voices
            </p>
            <h2 
              className="font-heading text-2xl sm:text-3xl font-bold text-[#1f3427] dark:text-[#f4f8f5]"
              dangerouslySetInnerHTML={{ __html: t.storiesHeading }}
            />
          </div>
          <p className="text-xs sm:text-sm text-[#5e7164] dark:text-[#9ab0a2] max-w-sm">
            {t.storiesSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <div 
              key={test.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#15271e] border border-[#e5dec9] dark:border-[#223f30] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-[#f28b47] mb-3">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="font-heading text-sm text-[#1f3427] dark:text-[#f4f8f5] leading-relaxed italic mb-6">
                  "{test.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#e5dec9]/60 dark:border-[#223f30]">
                <div className="w-10 h-10 rounded-full bg-[#1e5634] text-white flex items-center justify-center font-bold text-xs">
                  {test.avatar}
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-[#1f3427] dark:text-[#f4f8f5]">{test.name}</div>
                  <div className="text-[11px] text-[#5e7164] dark:text-[#9ab0a2]">{test.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-8 pb-12 border-t border-[#e5dec9] dark:border-[#223f30] text-center text-xs text-[#5e7164] dark:text-[#9ab0a2] space-y-2">
        <div className="flex items-center justify-center gap-2 font-heading font-bold text-lg text-[#1f3427] dark:text-[#f4f8f5]">
          <Wheat className="w-5 h-5 text-[#1e5634]" />
          <span>Apna<span className="text-[#1e5634] dark:text-[#4ade80]">Anaj</span></span>
        </div>
        <p>{t.footerTagline}</p>
        <p className="text-[11px] text-[#5e7164]/70">{t.footerCopyright}</p>
      </footer>

    </div>
  );
};
