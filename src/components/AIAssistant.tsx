import React, { useEffect, useRef, useState } from 'react';
import { Bot, Mic, MicOff, Send, Volume2, VolumeX, X, Sparkles, ChevronDown } from 'lucide-react';
import { askAssistant } from '../services/aiService';
import { LanguageCode } from '../types';

interface Props { currentLang: LanguageCode; currentPage: string; }

type AssistantLanguage = 'hi' | 'en' | 'hinglish';

const localeMap: Record<AssistantLanguage, string> = {
  hi: 'hi-IN',
  en: 'en-IN',
  hinglish: 'hi-IN'
};

const languageLabels: Record<AssistantLanguage, string> = {
  hi: 'हिंदी',
  en: 'English',
  hinglish: 'Hinglish'
};

function recognitionFactory(): any {
  const w = window as any;
  const C = w.SpeechRecognition || w.webkitSpeechRecognition;
  return C ? new C() : null;
}

const welcomeByLanguage: Record<AssistantLanguage, string> = {
  hi: 'नमस्ते! मैं Apna Anaj AI हूँ। आप मुझसे किसी भी विषय या Apna Anaj के फीचर के बारे में पूछ सकते हैं।',
  en: 'Hello! I am Apna Anaj AI. Ask me anything about general topics or Apna Anaj features.',
  hinglish: 'Namaste! Main Apna Anaj AI hoon. Aap mujhse kisi bhi topic ya Apna Anaj feature ke baare mein pooch sakte ho.'
};

function initialLanguage(currentLang: LanguageCode): AssistantLanguage {
  if (currentLang === 'en') return 'en';
  if (currentLang === 'hinglish') return 'hinglish';
  return 'hi';
}

export const AIAssistant: React.FC<Props> = ({ currentLang, currentPage }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [lastProvider, setLastProvider] = useState('');
  const [assistantLanguage, setAssistantLanguage] = useState<AssistantLanguage>(initialLanguage(currentLang));
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', text: welcomeByLanguage[assistantLanguage] }]);
    }
  }, [open, assistantLanguage, messages.length]);

  useEffect(() => () => {
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
  }, []);

  const changeLanguage = (next: AssistantLanguage) => {
    setAssistantLanguage(next);
    setMessages([{ role: 'assistant', text: welcomeByLanguage[next] }]);
    setInput('');
    setLastProvider('');
    window.speechSynthesis?.cancel();
  };

  const speak = (text: string) => {
    if (!voiceOn || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = localeMap[assistantLanguage];
    utterance.rate = assistantLanguage === 'hi' || assistantLanguage === 'hinglish' ? 0.9 : 0.96;
    utterance.pitch = 1.08;
    utterance.volume = 1;

    const voices = synth.getVoices();
    const locale = localeMap[assistantLanguage].toLowerCase();
    const preferred = voices.find((voice) => {
      const name = voice.name.toLowerCase();
      const lang = voice.lang.toLowerCase();
      return lang.startsWith(locale.split('-')[0]) && /female|zira|google|heera|veena|lekha|sangeeta|kalpana|aarti|neerja/.test(name);
    }) || voices.find((voice) => voice.lang?.toLowerCase().startsWith(locale.split('-')[0]));

    if (preferred) utterance.voice = preferred;
    synth.speak(utterance);
  };

  const send = async (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;
    setMessages((items) => [...items, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const result = await askAssistant(text, currentPage, assistantLanguage);
      setLastProvider(result.provider || 'ai');
      setMessages((items) => [...items, { role: 'assistant', text: result.answer }]);
      speak(result.answer);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'AI assistant unavailable.';
      setMessages((items) => [...items, { role: 'assistant', text: message }]);
      speak(message);
    } finally {
      setLoading(false);
    }
  };

  const listen = () => {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = recognitionFactory();
    if (!recognition) {
      setMessages((items) => [...items, {
        role: 'assistant',
        text: assistantLanguage === 'en' ? 'Voice input is not supported in this browser. Please type your question.' : 'इस ब्राउज़र में voice input उपलब्ध नहीं है। कृपया अपना सवाल टाइप करें।'
      }]);
      return;
    }

    recognition.lang = localeMap[assistantLanguage];
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((item: any) => item[0]?.transcript || '').join(' ').trim();
      setListening(false);
      recognitionRef.current = null;
      if (transcript) void send(transcript);
    };
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = (event: any) => {
      setListening(false);
      recognitionRef.current = null;
      if (!['aborted', 'no-speech'].includes(String(event?.error || ''))) {
        setMessages((items) => [...items, { role: 'assistant', text: 'Microphone permission allow करके फिर प्रयास करें।' }]);
      }
    };

    recognitionRef.current = recognition;
    setListening(true);
    try {
      recognition.start();
    } catch {
      setListening(false);
      recognitionRef.current = null;
    }
  };

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} aria-label="Open Apna Anaj AI" className="fixed right-5 bottom-24 sm:right-7 sm:bottom-7 z-[90] w-14 h-14 rounded-full bg-[#1e5634] text-white shadow-2xl border-2 border-white flex items-center justify-center hover:scale-105 transition-transform">
        <Bot className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#f7c244] border-2 border-[#1e5634]" />
      </button>
    );
  }

  return (
    <div className="fixed right-4 bottom-24 sm:right-6 sm:bottom-6 z-[95] w-[min(390px,calc(100vw-2rem))]">
      <div className="rounded-3xl overflow-hidden bg-white dark:bg-[#15271e] border border-[#dce8df] dark:border-[#294634] shadow-2xl">
        <div className="px-4 py-3 bg-[#1e5634] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center"><Sparkles className="w-4 h-4" /></div>
            <div><div className="text-sm font-black">Apna Anaj AI</div><div className="text-[10px] text-white/80">{currentPage.replace(/^view-/, '').replaceAll('-', ' ')}</div></div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setVoiceOn((value) => !value)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center" aria-label="Toggle voice">{voiceOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}</button>
            <button onClick={() => { window.speechSynthesis?.cancel(); setOpen(false); }} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center" aria-label="Close"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="px-3 py-2 bg-[#f6faf7] dark:bg-[#193125] border-b border-[#e5eee7] dark:border-[#294634]">
          <label className="flex items-center justify-between gap-2 text-xs font-semibold text-[#31543f] dark:text-white">
            <span>भाषा / Language</span>
            <div className="relative flex items-center">
              <select value={assistantLanguage} onChange={(event) => changeLanguage(event.target.value as AssistantLanguage)} className="appearance-none pr-7 pl-3 py-1.5 rounded-lg border border-[#cfe0d3] bg-white text-[#1e5634] text-xs font-semibold outline-none">
                <option value="hi">हिंदी</option>
                <option value="en">English</option>
                <option value="hinglish">Hinglish</option>
              </select>
              <ChevronDown className="absolute right-2 w-3 h-3 text-[#1e5634] pointer-events-none" />
            </div>
          </label>
        </div>

        <div className="max-h-[42vh] min-h-[220px] overflow-y-auto p-3 space-y-2">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${message.role === 'user' ? 'bg-[#1e5634] text-white' : 'bg-[#eef6ef] dark:bg-[#1d3427] text-[#1f3427] dark:text-[#f4f8f5]'}`}>{message.text}</div>
            </div>
          ))}
          {loading && <div className="flex items-center gap-2 text-xs text-[#5e7164] px-2"><span className="w-2 h-2 rounded-full bg-[#1e5634] animate-pulse" />सोच रही हूँ…</div>}
        </div>

        <div className="px-3 pb-2 flex items-center justify-between text-[10px] text-[#6f8275]">
          <span>{lastProvider === 'openai' || lastProvider === 'openai-web' ? 'OpenAI + Web' : lastProvider || 'Select language first'}</span>
          <button onClick={() => setMessages([{ role: 'assistant', text: welcomeByLanguage[assistantLanguage] }])} className="underline hover:no-underline">Clear</button>
        </div>

        <div className="p-3 border-t border-[#e5dec9] dark:border-[#294634]">
          <div className="flex items-center gap-2">
            <button onClick={listen} className={`w-10 h-10 rounded-xl flex items-center justify-center ${listening ? 'bg-[#f28b47] text-white' : 'bg-[#eef6ef] dark:bg-[#1d3427] text-[#1e5634]'}`} aria-label="Voice input">{listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}</button>
            <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void send(); }} placeholder={assistantLanguage === 'en' ? 'Ask your question...' : assistantLanguage === 'hinglish' ? 'Apna sawaal poochho...' : 'अपना सवाल पूछिए...'} className="min-w-0 flex-1 px-3 py-2.5 rounded-xl border border-[#dce8df] dark:border-[#294634] bg-white dark:bg-[#122219] text-xs outline-none" />
            <button onClick={() => void send()} disabled={!input.trim() || loading} className="w-10 h-10 rounded-xl bg-[#1e5634] text-white flex items-center justify-center disabled:opacity-40" aria-label="Send"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};
