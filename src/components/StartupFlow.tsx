"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, CheckCircle, ArrowRight, ArrowLeft, Bell } from "lucide-react";
import { User, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface StartupFlowProps {
  user?: User | null;
  onComplete: (currency: string) => void;
}

const currencies = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Yen" },
  { code: "AED", symbol: "د.إ", name: "Dirham" },
];

export default function StartupFlow({ user, onComplete }: StartupFlowProps) {
  const [step, setStep] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("₹");
  useEffect(() => {
    if (user && step === 0) {
      setStep(1);
    }
  }, [user, step]);

  const handleLogin = async () => {
    if (user) {
      nextStep();
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      nextStep();
    } catch {
    }
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(0, s - 1));

  const variants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#F2F4F7] text-[#0F172A] flex flex-col items-center justify-center overflow-hidden font-sans antialiased">
      {/* GLOBAL BACK BUTTON */}
      {step > 0 && (
        <button 
          onClick={prevStep}
          className="absolute top-8 left-6 md:left-12 p-3 rounded-full bg-black/5 hover:bg-[#0F172A] hover:text-white transition-all duration-300 z-50 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      )}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.section
            key="welcome"
            {...variants}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center p-12"
          >
            <motion.h1
              initial={{ letterSpacing: "0.2em", opacity: 0 }}
              animate={{ letterSpacing: "0.5em", opacity: 1 }}
              transition={{ duration: 2.5, delay: 0.3 }}
              className="text-5xl sm:text-7xl md:text-9xl font-luxury font-bold lowercase tracking-widest mb-8 md:mb-16 text-center"
            >
              money
            </motion.h1>
            <button
              onClick={handleLogin}
              className="px-10 py-4 md:px-20 md:py-6 bg-[#0F172A] text-white text-[10px] md:text-[12px] font-bold uppercase tracking-widest transition-all duration-700 rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] tap-active hover:scale-105 group flex items-center gap-4"
            >
              {user ? "Continue" : "Sign in with Google"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </motion.section>
        )}

        {step === 1 && (
          <motion.section
            key="currency"
            {...variants}
            className="w-full max-w-lg px-8 md:px-20 flex flex-col"
          >
            <p className="text-[11px] uppercase font-bold tracking-widest text-[#64748B] mb-6">Setup</p>
            <h2 className="text-4xl md:text-5xl font-luxury font-bold mb-10 md:mb-16 leading-none lowercase tracking-tighter">Choose currency.</h2>
            
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-4 pb-2 no-scrollbar">
              {currencies.map((c) => {
                const isActive = selectedCurrency === c.symbol;
                return (
                  <button
                    key={c.code}
                    onClick={() => setSelectedCurrency(c.symbol)}
                    className={`w-full flex items-center justify-between py-6 px-6 transition-all group border rounded-[24px] shadow-sm hover:shadow-xl active:scale-[0.98] ${
                      isActive 
                        ? 'bg-[#0F172A] border-[#0F172A] shadow-black/10' 
                        : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <span className={`text-2xl md:text-3xl font-luxury font-bold w-8 text-center transition-colors ${isActive ? 'text-white' : 'text-[#94A3B8] group-hover:text-[#0F172A]'}`}>
                        {c.symbol}
                      </span>
                      <div className="text-left">
                        <p className={`text-base md:text-lg font-bold tracking-tight transition-colors font-sans ${isActive ? 'text-white' : 'text-[#0F172A]'}`}>
                          {c.name}
                        </p>
                        <p className={`text-[10px] uppercase tracking-widest font-sans mt-0.5 ${isActive ? 'text-white/70' : 'text-[#94A3B8]'}`}>
                          {c.code}
                        </p>
                      </div>
                    </div>
                    {isActive ? (
                       <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                       <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-40 transition-all translate-x-4 group-hover:translate-x-0 text-[#0F172A]" />
                    )}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={nextStep}
              className="w-full mt-8 flex items-center justify-center gap-5 py-6 bg-[#0F172A] text-white font-bold uppercase tracking-widest text-[11px] rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-all active:scale-95"
            >
              Continue
            </button>
          </motion.section>
        )}



        {step === 2 && (
          <motion.section
            key="notifications"
            {...variants}
            className="w-full max-w-lg px-8 md:px-20 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.06)] border border-[#CBD5E1] rounded-[40px] flex items-center justify-center mb-12 md:mb-16">
               <Bell className="w-8 h-8 md:w-10 md:h-10 text-amber-500 opacity-80" />
            </div>
            <p className="text-[11px] uppercase font-bold tracking-widest text-[#64748B] mb-6">Alerts</p>
            <h2 className="text-4xl md:text-5xl font-luxury font-bold mb-8 md:mb-10 leading-none lowercase tracking-tighter">stay updated.</h2>
            <p className="text-base text-[#64748B] mb-12 md:mb-20 leading-loose px-6 font-sans">
              Enable notifications to instantly sync your transactions across multiple devices in <span className="text-amber-600 font-bold">real-time</span>.
            </p>
            
            <div className="w-full space-y-4">
              <button
                onClick={async () => {
                   const { requestForToken } = await import("@/lib/firebase");
                   const token = await requestForToken();
                   if (token && auth.currentUser) {
                      await updateDoc(doc(db, "users", auth.currentUser.uid), { fcmToken: token });
                   }
                   nextStep();
                }}
                className="w-full flex items-center justify-center gap-5 py-8 bg-[#0F172A] text-white font-bold uppercase tracking-widest text-[11px] rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] hover:bg-[#0F172A] transition-all active:scale-95"
              >
                Enable Notifications
              </button>
              <button
                onClick={nextStep}
                className="w-full flex items-center justify-center gap-5 py-6 bg-transparent text-[#64748B] font-bold uppercase tracking-widest text-[10px] rounded-3xl transition-all hover:text-[#0F172A]"
              >
                Maybe Later
              </button>
            </div>
          </motion.section>
        )}

        {step === 3 && (
          <motion.section
            key="launch"
            {...variants}
            className="w-full max-w-lg px-8 md:px-20 flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="mb-12 md:mb-16"
            >
              <CheckCircle className="w-20 h-20 md:w-24 md:h-24 text-[#0F172A] opacity-10" />
            </motion.div>
            <p className="text-[11px] uppercase font-bold tracking-widest text-[#64748B] mb-6">All Set</p>
            <h2 className="text-4xl md:text-5xl font-luxury font-bold mb-16 md:mb-20 leading-none lowercase tracking-tighter">You&apos;re ready.</h2>
            
            <button
              onClick={() => onComplete(selectedCurrency)}
              className="w-full py-8 bg-[#0F172A] text-white font-black uppercase tracking-widest text-[12px] rounded-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] hover:scale-105 transition-all active:scale-95"
            >
              Go to Dashboard
            </button>
          </motion.section>
        )}
      </AnimatePresence>

      {/* LUXURY STEP INDICATOR */}
      {step > 0 && (
        <div className="absolute bottom-20 flex gap-12 md:gap-16">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-px w-8 md:w-12 transition-all duration-1000 rounded-full ${
                step >= i ? "bg-[#0F172A]" : "bg-[#CBD5E1]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
