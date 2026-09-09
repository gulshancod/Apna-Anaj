import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#20352b] text-white shadow-2xl border border-white/10 text-xs font-bold max-w-sm">
        <CheckCircle2 className="w-4 h-4 text-[#f8ce58] shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
};
