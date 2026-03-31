"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AlertTriangle, Download, RefreshCw, Trash2, Globe, ShieldAlert, X, CheckCircle } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";

export default function OptionsSection() {
  const [confirmAction, setConfirmAction] = useState<"wipe" | "logout" | null>(null);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState("");
  const [hasNotifications, setHasNotifications] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "JPY", symbol: "¥", name: "Yen" },
    { code: "AED", symbol: "د.إ", name: "Dirham" },
  ];

  useEffect(() => {
    if (auth.currentUser) {
      getDoc(doc(db, "users", auth.currentUser.uid)).then(snap => {
        if (snap.exists()) {
          const data = snap.data();
          setActiveCurrency(data.currency || "$");
          setHasNotifications(!!data.fcmToken);
        }
      });
    }
  }, []);

  const executeAction = async () => {
    if (!auth.currentUser) return;
    
    if (confirmAction === "wipe") {
      await deleteDoc(doc(db, "users", auth.currentUser.uid));
      await signOut(auth);
      window.location.reload();
    } else if (confirmAction === "logout") {
      await signOut(auth);
      window.location.reload();
    }
  };

  const handleSelectCurrency = async (symbol: string) => {
    if (auth.currentUser) {
      await updateDoc(doc(db, "users", auth.currentUser.uid), { currency: symbol });
    }
    setActiveCurrency(symbol);
    setShowCurrencyModal(false);
  };

  const handleExportData = async () => {
    if (!auth.currentUser) return;
    const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
    const data = snap.exists() ? snap.data() : {};
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `money_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 md:px-8 mt-4 mb-8 max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-10 pr-1">
        <h3 className="text-[11px] uppercase font-bold tracking-wider text-[#64748B] font-sans">app settings</h3>
      </div>

      <div className="space-y-4">
        {/* PROFILE SECTION */}
        {auth.currentUser && (
          <div className="group p-6 bg-white rounded-[28px] border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all duration-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               {auth.currentUser.photoURL ? (
                 <Image src={auth.currentUser.photoURL} alt="Profile" width={56} height={56} className="w-14 h-14 rounded-full shadow-sm object-cover bg-[#F1F5F9]" />
               ) : (
                 <div className="w-14 h-14 rounded-full bg-[#0F172A] flex items-center justify-center text-white text-xl font-bold shadow-sm">
                   {auth.currentUser.displayName?.charAt(0) || "U"}
                 </div>
               )}
               <div>
                  <h4 className="text-xl font-bold tracking-tight text-[#0F172A] font-sans mb-0.5">{auth.currentUser.displayName || "Unknown User"}</h4>
                  <p className="text-[11px] text-[#64748B] font-sans">{auth.currentUser.email}</p>
               </div>
            </div>
            <button 
              onClick={() => setConfirmAction("logout")}
              className="w-full md:w-auto px-6 py-3.5 md:py-3 bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#0F172A] text-[10px] font-bold uppercase tracking-widest rounded-2xl md:rounded-full transition-colors flex items-center justify-center gap-3 font-sans"
            >
              Sign Out
            </button>
          </div>
        )}

        <div className="group p-6 bg-white rounded-[28px] border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all duration-700">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] group-hover:bg-[#0F172A] group-hover:text-white transition-colors">
               <Globe className="w-5 h-5" />
             </div>
             <div>
               <h4 className="text-xl font-luxury font-bold tracking-tight lowercase">money & alerts</h4>
               <p className="text-[9px] uppercase tracking-widest text-[#64748B] font-sans">Notifications & Currency</p>
             </div>
          </div>

          <div className="space-y-3">
             <button 
              onClick={async () => {
                 if (hasNotifications || isLoadingNotifications) return;
                 setIsLoadingNotifications(true);
                 try {
                   const { requestForToken } = await import("@/lib/firebase");
                   const token = await requestForToken();
                   if (token && auth.currentUser) {
                      await updateDoc(doc(db, "users", auth.currentUser.uid), { fcmToken: token });
                      setHasNotifications(true);
                   }
                 } catch (e) {
                   console.error("Failed to enable notifications:", e);
                 } finally {
                   setIsLoadingNotifications(false);
                 }
              }}
              disabled={hasNotifications || isLoadingNotifications}
              className={`w-full flex items-center justify-between py-4 px-6 rounded-2xl transition-all ${hasNotifications ? 'bg-green-50 text-green-600' : 'bg-[#F8FAFC] hover:bg-[#0F172A] hover:text-white group/btn disabled:opacity-50'}`}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest font-sans">
                {isLoadingNotifications ? "Requesting..." : (hasNotifications ? "Notifications Enabled" : "Get Notifications")}
              </span>
              {hasNotifications ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                isLoadingNotifications ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#64748B]" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#64748B] group-hover/btn:text-white" />
                )
              )}
            </button>

             <button 
              onClick={() => setShowCurrencyModal(true)}
              className="w-full flex items-center justify-between py-4 px-6 bg-[#F8FAFC] hover:bg-[#0F172A] hover:text-white transition-colors rounded-2xl group/btn"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest font-sans">Change Currency</span>
              <RefreshCw className="w-4 h-4 text-[#64748B] group-hover/btn:text-white" />
            </button>
          </div>
        </div>

        <div className="group p-6 bg-white rounded-[28px] border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all duration-700">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] group-hover:bg-[#0F172A] group-hover:text-white transition-colors">
               <ShieldAlert className="w-5 h-5" />
             </div>
              <div>
               <h4 className="text-xl font-luxury font-bold tracking-tight lowercase">my data</h4>
               <p className="text-[9px] uppercase tracking-widest text-[#059669] font-sans">Saved in Cloud</p>
             </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={handleExportData}
              className="w-full flex items-center justify-between py-4 px-6 bg-[#F8FAFC] hover:bg-[#E2E8F0] rounded-2xl transition-colors group/btn"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F172A] font-sans">Download Backup</span>
              <Download className="w-4 h-4 text-[#64748B] group-hover/btn:text-[#0F172A]" />
            </button>
            <button 
              onClick={() => setConfirmAction("wipe")}
              className="w-full flex items-center justify-between py-4 px-6 bg-red-50 hover:bg-red-100 rounded-2xl transition-colors group/btn"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 font-sans">Delete Everything</span>
              <Trash2 className="w-4 h-4 text-red-500 group-hover/btn:text-red-600" />
            </button>
          </div>
        </div>

      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-[100] bg-[#0F172A]/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-white animate-in zoom-in-95 duration-300">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-inner ${confirmAction === 'wipe' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-luxury font-bold lowercase tracking-tight mb-3">
              {confirmAction === "wipe" ? "erase all data?" : "sign out?"}
            </h3>
            <p className="text-xs md:text-sm tracking-wide text-[#64748B] mb-10 leading-relaxed font-sans">
              {confirmAction === "wipe" 
                 ? "This will permanently obliterate your account and all your financial records from the cloud. This action is absolutely irreversible."
                 : "Are you sure you want to sign out? Your data will remain securely synced in the cloud."
              }
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-4 bg-[#F1F5F9] text-[#0F172A] text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-[#E2E8F0] active:scale-95 transition-all font-sans"
              >
                Cancel
              </button>
              <button 
                onClick={executeAction}
                className={`flex-1 py-4 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl active:scale-95 transition-all font-sans shadow-lg ${confirmAction === 'wipe' ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'}`}
              >
                {confirmAction === "wipe" ? "Erase Everything" : "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCurrencyModal && (
        <div className="fixed inset-0 z-[100] bg-[#0F172A]/40 backdrop-blur-md flex items-end md:items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-8 md:zoom-in-95 duration-300 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-luxury font-bold lowercase tracking-tight">
                choose currency
              </h3>
              <button onClick={() => setShowCurrencyModal(false)} className="p-2 -mr-2 text-[#94A3B8] hover:text-[#0F172A] transition-colors rounded-full hover:bg-[#F1F5F9]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto pr-2 pb-4 space-y-3 no-scrollbar shrink">
              {currencies.map((c) => (
                <button
                  key={c.code}
                  onClick={() => handleSelectCurrency(c.symbol)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all active:scale-[0.98] ${activeCurrency === c.symbol ? 'border-[#0F172A] bg-[#0F172A] text-white shadow-xl shadow-black/10' : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] text-[#0F172A]'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl font-luxury font-bold w-6 text-center ${activeCurrency === c.symbol ? 'opacity-100' : 'opacity-40'}`}>{c.symbol}</span>
                    <div className="text-left">
                      <p className="text-sm font-bold tracking-tight font-sans">{c.name}</p>
                      <p className={`text-[9px] uppercase tracking-widest font-sans ${activeCurrency === c.symbol ? 'opacity-70' : 'opacity-40 text-[#64748B]'}`}>{c.code}</p>
                    </div>
                  </div>
                  {activeCurrency === c.symbol && <CheckCircle className="w-5 h-5" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
