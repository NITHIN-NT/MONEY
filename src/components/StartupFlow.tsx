"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowRight, ArrowLeft, Bell } from "lucide-react";
import { User, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";

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
    <div className="fixed inset-0 z-[100] bg-[#F2F4F7] text-[#0F172A] flex flex-col items-center justify-between overflow-y-auto overflow-x-hidden font-sans antialiased pb-safe pt-safe px-6">
      {/* GLOBAL HEADER */}
      <div className="w-full flex items-center justify-start pt-14 md:pt-20 z-50">
        {step > 0 && (
          <button
            onClick={prevStep}
            className="p-3 rounded-full bg-black/5 hover:bg-[#0F172A] hover:text-white transition-all duration-300 group flex items-center justify-center text-[#0F172A]"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.section
            key="welcome"
            {...variants}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col items-center justify-center w-full"
          >
            <motion.h1
              initial={{ letterSpacing: "0.1em", opacity: 0 }}
              animate={{ letterSpacing: "0.3em", opacity: 1 }}
              transition={{ duration: 2.5, delay: 0.3 }}
              className="text-4xl sm:text-7xl md:text-9xl font-luxury font-bold lowercase mb-10 md:mb-16 text-center whitespace-nowrap"
            >
              money
            </motion.h1>
            <button
              onClick={handleLogin}
              className="w-full sm:w-auto px-10 py-5 md:px-20 md:py-6 bg-[#0F172A] text-white text-[11px] md:text-[12px] font-bold uppercase tracking-widest transition-all duration-700 rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] tap-active hover:scale-105 group flex items-center justify-center gap-4"
            >
              {user ? "Continue" : "Sign in with Google"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </motion.section>
        )}

        {step === 1 && (
          <motion.section
            key="currency"
            {...variants}
            className="flex-1 w-full max-w-lg flex flex-col pt-4"
          >
            <div className="mb-10 md:mb-14">
              <p className="text-[10px] md:text-[11px] uppercase font-bold tracking-widest text-[#64748B] mb-3 md:mb-5">Setup</p>
              <h2 className="text-2xl md:text-5xl font-luxury font-bold leading-none lowercase tracking-tighter whitespace-nowrap">choose currency.</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-4">
              {currencies.map((c) => {
                const isActive = selectedCurrency === c.symbol;
                return (
                  <button
                    key={c.code}
                    onClick={() => setSelectedCurrency(c.symbol)}
                    className={`flex flex-col items-center justify-center pt-5 pb-4 px-3 transition-all group border rounded-[22px] shadow-sm hover:shadow-xl active:scale-[0.98] relative ${isActive
                        ? 'bg-[#0F172A] border-[#0F172A] shadow-black/10'
                        : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                      }`}
                  >
                    <span className={`text-2xl font-luxury font-bold mb-2 transition-colors ${isActive ? 'text-white' : 'text-[#94A3B8] group-hover:text-[#0F172A]'}`}>
                      {c.symbol}
                    </span>
                    <div className="text-center">
                      <p className={`text-[11px] font-bold tracking-tight transition-colors font-sans ${isActive ? 'text-white' : 'text-[#0F172A]'}`}>
                        {c.name}
                      </p>
                      <p className={`text-[8px] uppercase tracking-widest font-sans mt-0.5 ${isActive ? 'text-white/70' : 'text-[#94A3B8]'}`}>
                        {c.code}
                      </p>
                    </div>
                    {isActive && (
                      <CheckCircle className="absolute top-2 right-2 w-3.5 h-3.5 text-white" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={nextStep}
              className="w-full mt-10 md:mt-12 flex items-center justify-center gap-5 py-5 md:py-6 bg-[#0F172A] text-white font-bold uppercase tracking-widest text-[10px] md:text-[11px] rounded-[22px] md:rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-all active:scale-95"
            >
              Continue
            </button>
          </motion.section>
        )}

        {step === 2 && (
          <motion.section
            key="notifications"
            {...variants}
            className="flex-1 w-full max-w-lg px-6 md:px-20 flex flex-col items-center text-center justify-center"
          >
            <div className="w-16 h-16 md:w-24 md:h-24 bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.06)] border border-[#CBD5E1] rounded-[30px] md:rounded-[40px] flex items-center justify-center mb-10 md:mb-16">
              <Bell className="w-7 h-7 md:w-10 md:h-10 text-amber-500 opacity-80" />
            </div>
            <p className="text-[10px] md:text-[11px] uppercase font-bold tracking-widest text-[#64748B] mb-4 md:mb-6">Alerts</p>
            <h2 className="text-3xl md:text-5xl font-luxury font-bold mb-6 md:mb-10 leading-none lowercase tracking-tighter">stay updated.</h2>
            <p className="text-sm md:text-base text-[#64748B] mb-10 md:mb-20 leading-relaxed md:leading-loose px-4 md:px-6 font-sans">
              Enable notifications to instantly sync your transactions across multiple devices in <span className="text-amber-600 font-bold">real-time</span>.
            </p>

            <div className="w-full space-y-3 md:space-y-4">
              <button
                onClick={async (e) => {
                  const btn = e.currentTarget;
                  btn.disabled = true;
                  btn.innerHTML = "Requesting...";
                  try {
                    const { requestForToken } = await import("@/lib/firebase");
                    const token = await requestForToken();
                    if (token && auth.currentUser) {
                      const { updateDoc, doc } = await import("firebase/firestore");
                      const { db } = await import("@/lib/firebase");
                      await updateDoc(doc(db, "users", auth.currentUser.uid), { fcmToken: token });
                    }
                  } catch (err) {
                    console.error("Onboarding notification error:", err);
                  } finally {
                    nextStep();
                  }
                }}
                className="w-full flex items-center justify-center gap-5 py-6 md:py-8 bg-[#0F172A] text-white font-bold uppercase tracking-widest text-[10px] md:text-[11px] rounded-[22px] md:rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] hover:bg-[#0F172A] transition-all active:scale-95 disabled:opacity-50"
              >
                Enable Notifications
              </button>
              <button
                onClick={nextStep}
                className="w-full flex items-center justify-center gap-5 py-5 md:py-6 bg-transparent text-[#64748B] font-bold uppercase tracking-widest text-[9px] md:text-[10px] rounded-3xl transition-all hover:text-[#0F172A]"
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
            className="flex-1 w-full max-w-lg px-6 md:px-20 flex flex-col items-center text-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="mb-10 md:mb-16"
            >
              <CheckCircle className="w-16 h-16 md:w-24 md:h-24 text-[#0F172A] opacity-10" />
            </motion.div>
            <p className="text-[10px] md:text-[11px] uppercase font-bold tracking-widest text-[#64748B] mb-4 md:mb-6">All Set</p>
            <h2 className="text-3xl md:text-5xl font-luxury font-bold mb-12 md:mb-20 leading-none lowercase tracking-tighter">You&apos;re ready.</h2>

            <button
              onClick={() => onComplete(selectedCurrency)}
              className="w-full py-6 md:py-8 bg-[#0F172A] text-white font-black uppercase tracking-widest text-[11px] md:text-[12px] rounded-[22px] md:rounded-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] hover:scale-105 transition-all active:scale-95"
            >
              Go to Dashboard
            </button>
          </motion.section>
        )}
      </AnimatePresence>

      {/* LUXURY STEP INDICATOR */}
      {step > 0 && (
        <div className="w-full flex justify-center items-center py-10 md:py-16">
          <div className="flex gap-8 md:gap-16">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-px w-6 md:w-12 transition-all duration-1000 rounded-full ${step >= i ? "bg-[#0F172A]" : "bg-[#CBD5E1]"
                  }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
