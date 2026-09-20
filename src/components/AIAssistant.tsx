import React, { useEffect, useRef, useState } from 'react';
import { Bot, Mic, MicOff, Send, Volume2, VolumeX, X, Sparkles } from 'lucide-react';
import { askAssistant } from '../services/aiService';
import { LanguageCode } from '../types';

interface Props { currentLang: LanguageCode; currentPage: string; }

const localeMap: Record<LanguageCode, string> = {
  en:'en-IN', hinglish:'hi-IN', hi:'hi-IN', mr:'mr-IN', pa:'pa-IN', gu:'gu-IN',
  bn:'bn-IN', te:'te-IN', ta:'ta-IN', kn:'kn-IN'
};

function recognitionFactory(): any {
  const w = window as any;
  const C = w.SpeechRecognition || w.webkitSpeechRecognition;
  return C ? new C() : null;
}

export const AIAssistant: React.FC<Props> = ({ currentLang, currentPage }) => {
  const [open,setOpen]=useState(false);
  const [input,setInput]=useState('');
  const [messages,setMessages]=useState<Array<{role:'user'|'assistant';text:string}>>([]);
  const [loading,setLoading]=useState(false);
  const [listening,setListening]=useState(false);
  const [voiceOn,setVoiceOn]=useState(true);
  const recognitionRef=useRef<any>(null);

  useEffect(()=>()=>{ recognitionRef.current?.stop(); window.speechSynthesis?.cancel(); },[]);

  const speak=(text:string)=>{
    if(!voiceOn || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.lang=localeMap[currentLang];
    u.rate=1;
    window.speechSynthesis.speak(u);
  };

  const send=async(textOverride?:string)=>{
    const text=(textOverride ?? input).trim();
    if(!text || loading) return;
    setMessages(m=>[...m,{role:'user',text}]);
    setInput('');
    setLoading(true);
    try {
      const answer=await askAssistant(text,currentPage,currentLang);
      setMessages(m=>[...m,{role:'assistant',text:answer}]);
      speak(answer);
    } catch(e) {
      const msg=e instanceof Error ? e.message : 'AI assistant unavailable.';
      setMessages(m=>[...m,{role:'assistant',text:msg}]);
      speak(msg);
    } finally { setLoading(false); }
  };

  const listen=()=>{
    if(listening){ recognitionRef.current?.stop(); return; }
    const r=recognitionFactory();
    if(!r){
      setMessages(m=>[...m,{role:'assistant',text:'Voice input is not supported in this browser. You can type your question.'}]);
      return;
    }
    r.lang=localeMap[currentLang];
    r.continuous=false;
    r.interimResults=false;
    r.onresult=(e:any)=>{
      const text=Array.from(e.results).map((x:any)=>x[0]?.transcript||'').join(' ').trim();
      setListening(false); recognitionRef.current=null;
      if(text) void send(text);
    };
    r.onend=()=>{setListening(false);recognitionRef.current=null;};
    r.onerror=()=>{setListening(false);recognitionRef.current=null;};
    recognitionRef.current=r; setListening(true); r.start();
  };

  if(!open) return <button type="button" onClick={()=>setOpen(true)} aria-label="Open Apna Anaj AI" className="fixed right-5 bottom-24 sm:right-7 sm:bottom-7 z-[90] w-14 h-14 rounded-full bg-[#1e5634] text-white shadow-2xl border-2 border-white flex items-center justify-center hover:scale-105 transition-transform"><Bot className="w-6 h-6"/><span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#f7c244] border-2 border-[#1e5634]"/></button>;

  return <div className="fixed right-4 bottom-24 sm:right-6 sm:bottom-6 z-[95] w-[min(390px,calc(100vw-2rem))]">
    <div className="rounded-3xl overflow-hidden bg-white dark:bg-[#15271e] border border-[#dce8df] dark:border-[#294634] shadow-2xl">
      <div className="px-4 py-3 bg-[#1e5634] text-white flex items-center justify-between">
        <div className="flex items-center gap-2"><div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center"><Sparkles className="w-4 h-4"/></div><div><div className="text-sm font-black">Apna Anaj AI</div><div className="text-[10px] text-white/80">{currentPage.replace(/^view-/,'').replaceAll('-',' ')}</div></div></div>
        <div className="flex gap-1">
          <button onClick={()=>setVoiceOn(v=>!v)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center" aria-label="Toggle voice">{voiceOn?<Volume2 className="w-4 h-4"/>:<VolumeX className="w-4 h-4"/>}</button>
          <button onClick={()=>{window.speechSynthesis?.cancel();setOpen(false);}} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center" aria-label="Close"><X className="w-4 h-4"/></button>
        </div>
      </div>
      <div className="max-h-[46vh] min-h-[220px] overflow-y-auto p-3 space-y-2">
        {messages.length===0 && <div className="text-xs leading-relaxed text-[#5e7164] dark:text-[#a7b9ad] p-2">Namaste! Main Apna Anaj AI hoon. Text ya voice se sawaal poochho.</div>}
        {messages.map((m,i)=><div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${m.role==='user'?'bg-[#1e5634] text-white':'bg-[#eef6ef] dark:bg-[#1d3427] text-[#1f3427] dark:text-[#f4f8f5]'}`}>{m.text}</div></div>)}
        {loading && <div className="text-xs text-[#5e7164] px-2">Thinking…</div>}
      </div>
      <div className="p-3 border-t border-[#e5dec9] dark:border-[#294634]">
        <div className="flex items-center gap-2">
          <button onClick={listen} className={`w-10 h-10 rounded-xl flex items-center justify-center ${listening?'bg-[#f28b47] text-white':'bg-[#eef6ef] dark:bg-[#1d3427] text-[#1e5634]'}`} aria-label="Voice input">{listening?<MicOff className="w-4 h-4"/>:<Mic className="w-4 h-4"/>}</button>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')void send();}} placeholder="Ask Apna Anaj AI..." className="min-w-0 flex-1 px-3 py-2.5 rounded-xl border border-[#dce8df] dark:border-[#294634] bg-white dark:bg-[#122219] text-xs outline-none"/>
          <button onClick={()=>void send()} disabled={!input.trim()||loading} className="w-10 h-10 rounded-xl bg-[#1e5634] text-white flex items-center justify-center disabled:opacity-40" aria-label="Send"><Send className="w-4 h-4"/></button>
        </div>
      </div>
    </div>
  </div>;
};
