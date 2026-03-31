"use client";

import React, { useState } from "react";
import { Building2, Plus, Eye, EyeOff, Pencil } from "lucide-react";

interface BankAccount {
  id: string;
  name: string;
  balance: number;
}

interface BankSectionProps {
  bankAccounts: BankAccount[];
  currency: string;
  onOpenForm: () => void;
  onEditBank: (id: string, newBalance: number) => void;
}

export default function BankSection({ bankAccounts, currency, onOpenForm, onEditBank }: BankSectionProps) {
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const toggleVisibility = (id: string) => {
    setVisibleItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const startEditing = (id: string, currentBalance: number) => {
    setEditingId(id);
    setEditValue(currentBalance.toString());
    setVisibleItems(prev => ({ ...prev, [id]: true })); // Auto reveal to edit
  };

  const saveEdit = (id: string) => {
    const num = parseFloat(editValue);
    if (!isNaN(num)) {
      onEditBank(id, num);
    }
    setEditingId(null);
  };

  return (
    <div className="px-8 mt-12 mb-8">
      <div className="flex justify-between items-center mb-8 pr-1">
        <h3 className="text-[11px] uppercase font-bold tracking-wider text-[#64748B] font-sans">bank accounts</h3>
        <button 
          onClick={onOpenForm} 
          className="group flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider opacity-20 hover:opacity-100 transition-all font-sans"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Add New
        </button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar snap-x">
        {bankAccounts.map(account => (
          <div key={account.id} className="min-w-[260px] snap-center group p-6 bg-white rounded-[28px] border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all duration-700">
            <div className="flex justify-between items-center mb-5 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full shrink-0 bg-[#F1F5F9] flex items-center justify-center group-hover:bg-[#0F172A] group-hover:text-white transition-all shadow-sm">
                  <Building2 className="w-3.5 h-3.5 opacity-20 group-hover:opacity-100" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#64748B] group-hover:text-[#0F172A] font-sans truncate">{account.name}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={() => startEditing(account.id, account.balance)}
                  className="opacity-20 hover:opacity-100 transition-opacity"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => toggleVisibility(account.id)}
                  className="opacity-20 hover:opacity-100 transition-opacity"
                >
                  {visibleItems[account.id] ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
              </div>
            </div>
            
            {editingId === account.id ? (
              <div className="flex items-center">
                <span className="text-2xl font-luxury font-bold tracking-tight">{currency}</span>
                <input
                  type="number"
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => saveEdit(account.id)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(account.id)}
                  className="w-full text-2xl font-luxury font-bold tracking-tight bg-transparent border-b border-[#0F172A] outline-none ml-1 pb-1"
                />
              </div>
            ) : (
              <p 
                onDoubleClick={() => startEditing(account.id, account.balance)}
                className="text-2xl font-luxury font-bold tracking-tight cursor-text"
              >
                {currency}{visibleItems[account.id] ? account.balance.toLocaleString() : "••••"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
