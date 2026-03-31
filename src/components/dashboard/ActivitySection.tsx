"use client";

import React, { useState, memo } from "react";
import { RotateCcw, Calendar, AlertCircle, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";

interface Transaction {
  id: string;
  type: "gave" | "borrowed";
  amount: number;
  contact: string;
  date: string;
  promiseDate?: string;
  isSettled?: boolean;
}

interface ActivitySectionProps {
  transactions: Transaction[];
  currency: string;
  onToggleType: (id: string) => void;
  onToggleSettle: (id: string) => void;
  luxColors: {
    textMuted: string;
    lent: string;
    debt: string;
  };
}

const ActivitySection = memo(({ 
  transactions, 
  currency, 
  onToggleType, 
  onToggleSettle,
  luxColors
}: ActivitySectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "gave" | "borrowed">("all");
  const itemsPerPage = 5;

  const filteredTransactions = transactions.filter(tx => filter === 'all' ? true : tx.type === filter);

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (a.isSettled && !b.isSettled) return 1;
    if (!a.isSettled && b.isSettled) return -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const displayedTransactions = sortedTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="px-8 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pr-1">
        <h3 className={`text-[11px] uppercase font-bold tracking-wider ${luxColors.textMuted} font-sans`}>recent activity</h3>
        <div className="flex bg-[#E2E8F0]/50 p-1 rounded-[16px]">
          <button onClick={() => { setFilter("all"); setCurrentPage(1); }} className={`px-4 py-2 text-[9px] font-bold uppercase tracking-wider rounded-[12px] transition-all font-sans ${filter === 'all' ? 'bg-[#0F172A] text-white shadow-md' : 'text-[#64748B] hover:text-[#0F172A]'}`}>All</button>
          <button onClick={() => { setFilter("gave"); setCurrentPage(1); }} className={`px-4 py-2 text-[9px] font-bold uppercase tracking-wider rounded-[12px] transition-all font-sans ${filter === 'gave' ? 'bg-[#0F172A] text-white shadow-md' : 'text-[#64748B] hover:text-[#0F172A]'}`}>Lent</button>
          <button onClick={() => { setFilter("borrowed"); setCurrentPage(1); }} className={`px-4 py-2 text-[9px] font-bold uppercase tracking-wider rounded-[12px] transition-all font-sans ${filter === 'borrowed' ? 'bg-[#0F172A] text-white shadow-md' : 'text-[#64748B] hover:text-[#0F172A]'}`}>Borrow</button>
        </div>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center py-16 mb-20 bg-white/20 rounded-[28px] border-2 border-dashed border-[#E2E8F0]">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-10 font-sans">No items added yet.</p>
          </div>
        ) : (
          displayedTransactions.map((tx) => (
            <div key={tx.id} className={`group flex items-start gap-8 transition-all ${tx.isSettled ? 'opacity-20' : 'opacity-100'} p-6 bg-white rounded-[28px] border border-[#E2E8F0] shadow-sm hover:shadow-lg transition-all duration-700`}>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4 mb-6">
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-xl font-luxury font-bold tracking-tighter lowercase flex items-center gap-3">
                      <span className="truncate">@{tx.contact.replace(/\s+/g, '')}</span>
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${luxColors.textMuted} font-sans whitespace-nowrap`}>
                        {tx.type === 'gave' ? 'Money Lent' : 'Money Owed'}
                      </span>
                      {tx.isSettled && <span className="bg-[#E2E8F0] text-[#0F172A] text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-sans whitespace-nowrap">Settled</span>}
                    </div>
                  </div>
                  <span className={`text-xl md:text-2xl font-luxury font-bold tracking-tight shrink-0 text-right max-w-[50%] break-all ${tx.type === 'gave' ? luxColors.lent : luxColors.debt}`}>
                    {tx.type === 'gave' ? '+' : '-'}{currency}{tx.amount.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-[#94A3B8]">
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold uppercase tracking-wider flex items-center gap-2 font-sans">
                      <Calendar className="w-3 h-3 opacity-20" /> {tx.date}
                    </p>
                    {tx.promiseDate && (
                      <p className="text-[9px] font-bold uppercase tracking-wider flex items-center gap-2 text-red-800/20 font-sans">
                        <AlertCircle className="w-3 h-3" /> Due {tx.promiseDate}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-6 items-center opacity-0 group-hover:opacity-100 transition-all">
                    {!tx.isSettled && <button onClick={() => onToggleType(tx.id)} className="hover:text-[#0F172A] transition-colors"><RotateCcw className="w-3.5 h-3.5 font-bold" /></button>}
                    <button onClick={() => onToggleSettle(tx.id)} className="text-[9px] font-bold uppercase tracking-wider hover:text-[#0F172A] transition-colors font-sans">
                      {tx.isSettled ? 'Undo' : 'Done'}
                    </button>
                    <MoreVertical className="w-4 h-4 opacity-10" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-8">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
            className={`flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider ${currentPage === 1 ? 'opacity-5 cursor-default' : 'opacity-40 hover:opacity-100'} transition-all`}
          >
            <ChevronLeft className="w-4 h-4" /> Newer
          </button>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-10">
            {currentPage} <span className="mx-2">/</span> {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider ${currentPage === totalPages ? 'opacity-5 cursor-default' : 'opacity-40 hover:opacity-100'} transition-all`}
          >
            Older <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
});

ActivitySection.displayName = "ActivitySection";

export default ActivitySection;
