
"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface EntryModalProps {
  show: boolean;
  onClose: () => void;
  type: "gave" | "borrowed" | "bank";
  currency: string;
  onSave: (data: { bankName?: string; amount: number; contact?: string; date: string; promiseDate?: string }) => void;
  luxColors: {
    textMuted: string;
  };
}

export default function EntryModal({ show, onClose, type, currency, onSave, luxColors }: EntryModalProps) {
  const [amount, setAmount] = useState("");
  const [contact, setContact] = useState("");
  const [bankName, setBankName] = useState("");
  const [promiseDate, setPromiseDate] = useState("");

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
      amount: parseFloat(amount), 
      contact, 
      bankName, 
      promiseDate, 
      date: new Date().toISOString().split("T")[0] 
    });
    // Reset form
    setAmount("");
    setContact("");
    setBankName("");
    setPromiseDate("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-sm bg-white p-10 py-12 rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300 overflow-hidden border border-[#E2E8F0]">
        <button 
          type="button" 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#E2E8F0] transition-colors active:scale-95"
        >
          <X className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity" />
        </button>

        <div className="flex flex-col items-center mb-10 text-center">
          <h3 className={`text-[10px] font-bold uppercase tracking-wider ${luxColors.textMuted} mb-3 font-sans`}>Add Item</h3>
          <h4 className="text-2xl font-luxury font-bold tracking-tighter lowercase">
            New {type === "bank" ? "Account" : (type === "gave" ? "Lent Item" : "Borrowed Item")}
          </h4>
        </div>

        <div className="space-y-8">
          <div className="relative">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-luxury font-bold opacity-10">{currency}</span>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="0.00" 
                className="w-[140px] bg-transparent text-5xl font-luxury font-bold text-center outline-none text-[#0F172A] placeholder:opacity-30" 
                autoFocus 
                required 
              />
            </div>
          </div>

          <div className="space-y-6 pt-10 border-t border-[#E2E8F0]">
            {type === 'bank' ? (
              <div className="flex flex-col gap-2 text-center">
                <label className={`text-[9px] font-bold uppercase ${luxColors.textMuted} tracking-wider font-sans`}>Account Name</label>
                <input 
                  type="text" 
                  value={bankName} 
                  onChange={(e) => setBankName(e.target.value)} 
                  placeholder="e.g. Chase / Savings" 
                  className="bg-transparent w-full font-luxury font-bold text-2xl outline-none text-center text-[#0F172A] placeholder:opacity-30 font-sans" 
                  required 
                />
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2 text-center">
                  <label className={`text-[9px] font-bold uppercase ${luxColors.textMuted} tracking-wider font-sans`}>Person&apos;s Name</label>
                  <input 
                    type="text" 
                    value={contact} 
                    onChange={(e) => setContact(e.target.value)} 
                    placeholder="e.g. John Smith" 
                    className="bg-transparent w-full font-luxury font-bold text-2xl outline-none text-center text-[#0F172A] placeholder:opacity-30 font-sans" 
                    required 
                  />
                </div>
                <div className="flex flex-col gap-2 text-center">
                  <label className={`text-[9px] font-bold uppercase ${luxColors.textMuted} tracking-wider font-sans`}>Due Date</label>
                  <input 
                    type="date" 
                    value={promiseDate} 
                    onChange={(e) => setPromiseDate(e.target.value)} 
                    className="bg-transparent w-full font-bold text-lg outline-none text-center text-[#0F172A] font-sans" 
                  />
                </div>
              </>
            )}
          </div>

          <button type="submit" className="w-full py-5 bg-[#0F172A] text-white font-bold uppercase tracking-wider text-[10px] rounded-[16px] mt-8 shadow-xl hover:bg-[#0F172A] transition-all font-sans">
            Save Entry
          </button>
        </div>
      </form>
    </div>
  );
}
