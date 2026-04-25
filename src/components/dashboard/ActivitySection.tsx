"use client";

import React, { useState, memo } from "react";
import { RotateCcw, Calendar, AlertCircle, ChevronLeft, ChevronRight, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Transaction {
  id: string;
  type: "gave" | "borrowed";
  amount: number;
  contact: string;
  date: string;
  promiseDate?: string;
  isSettled?: boolean;
  risk?: "Low" | "Medium" | "High";
}

interface ActivitySectionProps {
  transactions: Transaction[];
  currency: string;
  onToggleSettle: (id: string) => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  luxColors: {
    textMuted: string;
    lent: string;
    debt: string;
  };
}

const ActivitySection = memo(({
  transactions,
  currency,
  onToggleSettle,
  onEdit,
  onDelete,
  luxColors
}: ActivitySectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "gave" | "borrowed">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const itemsPerPage = 10;

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

      <div className="grid grid-cols-2 gap-4">
        {transactions.length === 0 ? (
          <div className="col-span-full text-center py-16 mb-20 bg-white/20 rounded-[28px] border-2 border-dashed border-[#E2E8F0]">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-10 font-sans">No items added yet.</p>
          </div>
        ) : (
          displayedTransactions.map((tx) => (
            <div key={tx.id} className={`group relative flex flex-col transition-all ${tx.isSettled ? 'opacity-20' : 'opacity-100'} p-4 bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all duration-700`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0 pr-1">
                  <p className="text-sm font-luxury font-bold tracking-tighter lowercase truncate">
                    @{tx.contact.replace(/\s+/g, '')}
                  </p>
                  <p className={`text-[7px] font-bold uppercase tracking-wider ${luxColors.textMuted} font-sans mt-0.5`}>
                    {tx.type === 'gave' ? 'Lent' : 'Owed'}
                  </p>
                </div>
                <span className={`text-xs font-luxury font-bold tracking-tight shrink-0 ${tx.type === 'gave' ? luxColors.lent : luxColors.debt}`}>
                  {tx.type === 'gave' ? '+' : '-'}{currency}{tx.amount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-end mt-auto">
                <div className="space-y-1">
                  <p className="text-[8px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#94A3B8] font-sans">
                    <Calendar className="w-2.5 h-2.5 opacity-30" /> {tx.date}
                  </p>
                  {tx.promiseDate && (
                    <p className="text-[8px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-red-800/20 font-sans">
                      <AlertCircle className="w-2.5 h-2.5" /> {tx.promiseDate}
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setExpandedId(tx.id); }} 
                    className="w-10 h-10 flex items-center justify-center text-[#CBD5E1] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-full transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <AnimatePresence>
                    {expandedId === tx.id && (
                      <>
                        {/* Backdrop */}
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={(e) => { e.stopPropagation(); setExpandedId(null); }}
                          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
                        />
                        {/* Bottom Sheet */}
                        <motion.div 
                          drag="y"
                          dragConstraints={{ top: 0 }}
                          dragElastic={0.2}
                          onDragEnd={(_, info) => {
                            if (info.offset.y > 100 || info.velocity.y > 500) {
                              setExpandedId(null);
                            }
                          }}
                          initial={{ y: "100%" }}
                          animate={{ y: 0 }}
                          exit={{ y: "100%" }}
                          transition={{ type: "spring", damping: 25, stiffness: 200 }}
                          className="fixed bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:max-w-xl md:bottom-10 md:rounded-[48px] bg-white rounded-t-[40px] shadow-[0_-20px_80px_-20px_rgba(0,0,0,0.2)] md:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] z-[101] p-8 pb-12 md:pb-10 border-t md:border border-[#E2E8F0] touch-none"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="w-12 h-1.5 bg-[#E2E8F0] rounded-full mx-auto mb-8 opacity-50 md:hidden" />
                          
                          <div className="flex flex-col gap-6 mb-10">
                             <div>
                               <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748B] mb-2 opacity-50">Transaction Details</p>
                               <div className="flex justify-between items-center">
                                 <h4 className="text-2xl font-bold tracking-tight text-[#0F172A] lowercase font-sans">@{tx.contact}</h4>
                                 <span className={`text-2xl font-luxury font-black tracking-tighter ${tx.type === 'gave' ? 'text-[#059669]' : 'text-[#E11D48]'}`}>
                                   {tx.type === 'gave' ? '+' : '-'}{currency}{tx.amount.toLocaleString()}
                                 </span>
                               </div>
                             </div>
                          </div>

                          <div className="grid grid-cols-4 gap-4 md:gap-8">
                            <button 
                              onClick={(e) => { e.stopPropagation(); onEdit(tx); setExpandedId(null); }} 
                              className="flex flex-col items-center gap-3 group"
                            >
                              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-[#F8FAFC] text-[#64748B] group-hover:bg-[#0F172A] group-hover:text-white rounded-[22px] md:rounded-[26px] transition-all shadow-sm">
                                <Pencil className="w-5 h-5 md:w-6 md:h-6" />
                              </div>
                              <span className="text-[9px] font-bold uppercase tracking-widest text-[#64748B]">Edit</span>
                            </button>

                            <button 
                              onClick={(e) => { e.stopPropagation(); onDelete(tx.id); setExpandedId(null); }} 
                              className="flex flex-col items-center gap-3 group"
                            >
                              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-red-50 text-red-400 group-hover:bg-red-500 group-hover:text-white rounded-[22px] md:rounded-[26px] transition-all shadow-sm">
                                <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                              </div>
                              <span className="text-[9px] font-bold uppercase tracking-widest text-[#64748B]">Delete</span>
                            </button>

                            <button 
                              onClick={(e) => { e.stopPropagation(); onToggleSettle(tx.id); setExpandedId(null); }} 
                              className="flex flex-col items-center gap-3 group"
                            >
                              <div className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-[22px] md:rounded-[26px] transition-all shadow-sm ${tx.isSettled ? 'bg-[#F8FAFC] text-[#0F172A] group-hover:bg-[#0F172A] group-hover:text-white' : 'bg-[#0F172A] text-white shadow-xl hover:scale-105 active:scale-95'}`}>
                                {tx.isSettled ? <RotateCcw className="w-5 h-5 md:w-6 md:h-6" /> : <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />}
                              </div>
                              <span className="text-[9px] font-bold uppercase tracking-widest text-[#64748B]">{tx.isSettled ? 'Undo' : 'Settle'}</span>
                            </button>

                            <button 
                              onClick={(e) => { e.stopPropagation(); setExpandedId(null); }} 
                              className="flex flex-col items-center gap-3 group"
                            >
                              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-[#F8FAFC] text-[#64748B] group-hover:bg-[#0F172A] group-hover:text-white rounded-[22px] md:rounded-[26px] transition-all shadow-sm">
                                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                              </div>
                              <span className="text-[9px] font-bold uppercase tracking-widest text-[#64748B]">Close</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
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
