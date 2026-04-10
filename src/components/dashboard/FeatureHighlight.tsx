"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, X } from "lucide-react";

interface FeatureHighlightProps {
  show: boolean;
  onClose: () => void;
}

export default function FeatureHighlight({ show, onClose }: FeatureHighlightProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md" 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-white p-10 py-12 rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-[#E2E8F0] text-center"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F1F5F9] transition-colors active:scale-95"
            >
              <X className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity" />
            </button>

            <div className="w-16 h-16 bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.06)] border border-[#CBD5E1] rounded-[30px] flex items-center justify-center mb-10 mx-auto">
              <Users className="w-7 h-7 text-blue-500 opacity-80" />
            </div>

            <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-4">New Update</p>
            <h2 className="text-3xl font-luxury font-bold mb-6 leading-none lowercase tracking-tighter">find people fast.</h2>
            <p className="text-sm text-[#64748B] mb-10 leading-relaxed font-sans px-2">
              Pick names directly from your phone&apos;s contacts when giving or borrowing money.
            </p>

            <button
              onClick={onClose}
              className="w-full py-5 bg-[#0F172A] text-white font-bold uppercase tracking-widest text-[10px] rounded-[22px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-all active:scale-95"
            >
              Got it
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
