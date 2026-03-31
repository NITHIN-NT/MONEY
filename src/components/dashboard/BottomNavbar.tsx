"use client";

import React, { useState, useEffect, useRef } from "react";
import { LayoutDashboard, Plus, Settings, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface BottomNavbarProps {
  onOpenForm: (type: "gave" | "borrowed") => void;
  activeTab: "home" | "settings";
  onChangeTab: (tab: "home" | "settings") => void;
}

export default function BottomNavbar({ onOpenForm, activeTab, onChangeTab }: BottomNavbarProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full pwa-safe-area-pb bg-gradient-to-t from-[#F2F4F7] via-[#F2F4F7]/80 to-transparent pt-12 px-4 md:px-8 z-40 pointer-events-none">
      <nav className="mb-3 md:mb-5 max-w-md mx-auto bg-white/70 backdrop-blur-2xl backdrop-saturate-[1.8] rounded-[2rem] border border-white/60 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.1)] p-1.5 md:p-2 grid grid-cols-[1fr_auto_1fr] items-center pointer-events-auto relative">
        <button 
          onClick={() => onChangeTab('home')}
          className={`w-full flex flex-col items-center justify-center py-2.5 md:py-3 rounded-[24px] transition-all duration-300 ${activeTab === 'home' ? 'bg-[#E2E8F0] text-[#0F172A]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
        >
          <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5 mb-0.5 md:mb-1" />
          <span className="text-[8px] md:text-[7px] font-bold uppercase tracking-widest font-sans">Home</span>
        </button>
        
        <div className="flex justify-center px-1 md:px-4" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className={`w-12 h-12 md:w-14 md:h-14 shrink-0 bg-[#0F172A] text-white rounded-full flex items-center justify-center -mt-6 md:-mt-8 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] transition-all border-4 border-[#F2F4F7] ${showMenu ? 'rotate-45 scale-95 shadow-none' : 'hover:scale-105 active:scale-95'}`}
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Apple-style floating action menu */}
          <div className={`absolute bottom-[130%] left-1/2 -translate-x-1/2 w-[180px] bg-white rounded-[24px] p-2 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.15)] border border-[#E2E8F0] transition-all origin-bottom ${showMenu ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'}`}>
             <button
                onClick={() => { onOpenForm('gave'); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-[16px] hover:bg-black/5 tap-active transition-colors text-left"
             >
                <div className="w-8 h-8 rounded-full bg-[#059669]/10 text-[#059669] flex items-center justify-center shrink-0">
                   <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                   <p className="text-[11px] font-bold uppercase tracking-widest text-[#059669] font-sans">Lent</p>
                   <p className="text-[8px] uppercase tracking-wider text-[#64748B] font-sans">You gave</p>
                </div>
             </button>
             <div className="h-px bg-black/5 mx-2 my-1" />
             <button
                onClick={() => { onOpenForm('borrowed'); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-[16px] hover:bg-black/5 tap-active transition-colors text-left"
             >
                <div className="w-8 h-8 rounded-full bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center shrink-0">
                   <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div>
                   <p className="text-[11px] font-bold uppercase tracking-widest text-[#E11D48] font-sans">Borrowed</p>
                   <p className="text-[8px] uppercase tracking-wider text-[#64748B] font-sans">You received</p>
                </div>
             </button>
          </div>
        </div>
        
        <button 
          onClick={() => onChangeTab('settings')}
          className={`w-full flex flex-col items-center justify-center py-2.5 md:py-3 rounded-[24px] transition-all duration-300 ${activeTab === 'settings' ? 'bg-[#E2E8F0] text-[#0F172A]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
        >
          <Settings className="w-4 h-4 md:w-5 md:h-5 mb-0.5 md:mb-1" />
          <span className="text-[8px] md:text-[7px] font-bold uppercase tracking-widest font-sans">Options</span>
        </button>
      </nav>
    </div>
  );
}
