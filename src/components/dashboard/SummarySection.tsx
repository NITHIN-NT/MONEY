"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface SummarySectionProps {
  currency: string;
  totalBankBalance: number;
  balance: number;
  showBalance?: boolean; // We'll handle showBalance locally now
  luxColors: {
    lent: string;
    debt: string;
    textMuted: string;
  };
}

export default function SummarySection({ currency, totalBankBalance, balance, luxColors }: SummarySectionProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [showLent, setShowLent] = useState(true);

  return (
    <div className="px-8 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.03)] group transition-all duration-500">
        <div className="flex justify-between items-start mb-3">
          <p className={`text-[10px] font-bold uppercase tracking-wider ${luxColors.textMuted} font-sans`}>Your Balance</p>
          <button 
            onClick={() => setShowBalance(!showBalance)}
            className="opacity-10 group-hover:opacity-40 hover:!opacity-100 transition-opacity"
            title={showBalance ? "Hide Balance" : "Show Balance"}
          >
            {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>
        <h2 className="text-3xl md:text-4xl font-luxury font-extrabold tracking-tight flex items-baseline">
          <span className="text-lg md:text-xl font-normal opacity-10 mr-3">{currency}</span>
          {showBalance ? totalBankBalance.toLocaleString() : "••••"}
        </h2>
      </div>

      <div className="p-8 rounded-[32px] bg-white border border-[#E2E8F0] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.03)] group transition-all duration-500">
        <div className="flex justify-between items-start mb-3">
          <p className={`text-[10px] font-bold uppercase tracking-wider ${luxColors.textMuted} font-sans`}>Lent & Borrowed</p>
          <button 
            onClick={() => setShowLent(!showLent)}
            className="opacity-10 group-hover:opacity-40 hover:!opacity-100 transition-opacity"
            title={showLent ? "Hide Status" : "Show Status"}
          >
            {showLent ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>
        <h2 className={`text-3xl md:text-4xl font-luxury font-extrabold tracking-tight ${balance >= 0 ? luxColors.lent : luxColors.debt}`}>
          {balance >= 0 ? '+ ' : '- '}{showLent ? `${currency}${Math.abs(balance).toLocaleString()}` : "••••"}
        </h2>
      </div>
    </div>
  );
}
