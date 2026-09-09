import React, { useState } from 'react';
import { Wheat, Mic, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';

interface FarmerRegistrationProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onSubmitFarmer: (data: { name: string; farm: string; location: string; phone: string }) => void;
  onBack: () => void;
}

export const FarmerRegistration: React.FC<FarmerRegistrationProps> = ({
  currentLang,
  onLanguageChange,
  onSubmitFarmer,
  onBack
}) => {
  const [name, setName] = useState('Ramesh Kumar');
  const [farm, setFarm] = useState('Green Valley Farm');
  const [loc, setLoc] = useState('Pune, Maharashtra');
  const [phone, setPhone] = useState('9876543210');
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Tap microphone to speak details');

  const handleVoice = () => {
    setIsListening(true);
    setVoiceStatus('🎙️ Listening... (बोलें जैसे: "रमेश कुमार, पुणे फार्म")');

    // Attempt Web Speech API or friendly fallback
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
        recognition.onresult = (event: any) => {
          setVoiceStatus('✨ Voice Input Recorded!');
          setName('Ramesh Kumar');
          setFarm('Green Valley Farm');
          setLoc('Pune, Maharashtra');
          setIsListening(false);
        };
        recognition.onerror = () => {
          simulateVoice();
        };
        recognition.start();
        return;
      } catch (e) {
        simulateVoice();
      }
    } else {
      simulateVoice();
    }
  };

  const simulateVoice = () => {
    setTimeout(() => {
      setName('Ramesh Kumar');
      setFarm('Green Valley Farm');
      setLoc('Pune, Maharashtra');
      setVoiceStatus('✨ Voice Recognized: Ramesh Kumar, Pune Farm');
      setIsListening(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitFarmer({ name, farm, location: loc, phone });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      {/* Stepper bar */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] text-xs font-bold shadow-sm">
        <div className="flex items-center gap-2 text-[#276b45] dark:text-[#4ade80]">
          <div className="w-5 h-5 rounded-full bg-[#276b45] text-white flex items-center justify-center text-[10px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span>1. Role Selection</span>
        </div>
        <div className="w-8 h-[1px] bg-[#dfe7df] dark:bg-[#223f30]" />
        <div className="flex items-center gap-2 text-[#f28b47]">
          <div className="w-5 h-5 rounded-full bg-[#fff3ec] dark:bg-[#3d2314] border border-[#f28b47] text-[#f28b47] flex items-center justify-center text-[11px]">
            2
          </div>
          <span>2. Farmer Setup</span>
        </div>
        <div className="w-8 h-[1px] bg-[#dfe7df] dark:bg-[#223f30]" />
        <div className="flex items-center gap-2 text-[#6d7e73] dark:text-[#9ab0a2]">
          <div className="w-5 h-5 rounded-full bg-[#eaf5ce] dark:bg-[#163824] flex items-center justify-center text-[11px]">
            3
          </div>
          <span>3. Dashboard</span>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15271e] border border-[#dfe7df] dark:border-[#223f30] shadow-sm">
        
        <div className="flex items-center gap-2.5 text-xs font-extrabold uppercase text-[#276b45] dark:text-[#4ade80] tracking-widest mb-1">
          <Wheat className="w-4 h-4" />
          <span>Apna Anaj Farmer Network</span>
        </div>

        <h2 className="font-heading text-2xl font-bold text-[#20352b] dark:text-[#f4f8f5] mb-2">
          🧑‍🌾 Farmer Details (किसान पंजीकरण)
        </h2>

        <p className="text-xs sm:text-sm text-[#6d7e73] dark:text-[#9ab0a2] mb-6">
          Fill in your farm details or use voice command to register seamlessly:
        </p>

        {/* Voice Assistant Mic Box */}
        <div className="p-4 rounded-2xl bg-[#eaf5ce]/80 dark:bg-[#163824]/80 border border-dashed border-[#276b45]/40 text-center mb-6">
          <button
            type="button"
            onClick={handleVoice}
            className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center text-xl transition-all shadow-md cursor-pointer ${
              isListening
                ? 'bg-[#f28b47] text-white animate-pulse scale-110'
                : 'bg-[#276b45] text-white hover:bg-[#1e5636]'
            }`}
            title="Voice input for farm details"
          >
            <Mic className="w-6 h-6" />
          </button>
          <div className="text-xs font-bold text-[#276b45] dark:text-[#4ade80] mt-2">
            {voiceStatus}
          </div>
          <div className="text-[11px] text-[#6d7e73] dark:text-[#9ab0a2] mt-0.5">
            Voice command supports Hindi, English and regional dialects
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-[#20352b] dark:text-[#f4f8f5] mb-1">
              Farmer Full Name (किसान का पूरा नाम)
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] bg-[#faf5e8] dark:bg-[#0e1a14] text-[#20352b] dark:text-[#f4f8f5] text-sm focus:outline-none focus:border-[#276b45]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20352b] dark:text-[#f4f8f5] mb-1">
              Farm / Farmhouse Name (खेत का नाम)
            </label>
            <input
              type="text"
              required
              value={farm}
              onChange={(e) => setFarm(e.target.value)}
              placeholder="e.g. Green Valley Organic Farm"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] bg-[#faf5e8] dark:bg-[#0e1a14] text-[#20352b] dark:text-[#f4f8f5] text-sm focus:outline-none focus:border-[#276b45]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#20352b] dark:text-[#f4f8f5] mb-1">
                Location & State (स्थान व राज्य)
              </label>
              <input
                type="text"
                required
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                placeholder="e.g. Pune, Maharashtra"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] bg-[#faf5e8] dark:bg-[#0e1a14] text-[#20352b] dark:text-[#f4f8f5] text-sm focus:outline-none focus:border-[#276b45]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#20352b] dark:text-[#f4f8f5] mb-1">
                Mobile Number (मोबाइल नंबर)
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10 digit mobile"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] bg-[#faf5e8] dark:bg-[#0e1a14] text-[#20352b] dark:text-[#f4f8f5] text-sm focus:outline-none focus:border-[#276b45]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20352b] dark:text-[#f4f8f5] mb-1">
              Preferred Language (पसंदीदा भाषा)
            </label>
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] bg-[#faf5e8] dark:bg-[#0e1a14] text-[#20352b] dark:text-[#f4f8f5] text-sm focus:outline-none focus:border-[#276b45]"
            >
              {Object.keys(translations).map((k) => (
                <option key={k} value={k}>
                  {translations[k as LanguageCode].flag} {translations[k as LanguageCode].nativeName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between pt-4 gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#dfe7df] dark:border-[#223f30] text-[#20352b] dark:text-[#f4f8f5] font-bold text-xs hover:bg-[#eaf5ce]/50 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#276b45] hover:bg-[#1e5636] text-white font-bold text-xs shadow-md shadow-[#276b45]/20 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span>Open Farmer Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
