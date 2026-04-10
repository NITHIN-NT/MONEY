"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const StartupFlow = dynamic(() => import("@/components/StartupFlow").then(mod => mod.default), { ssr: false });
const Header = dynamic(() => import("@/components/dashboard/Header").then(mod => mod.default));
const SummarySection = dynamic(() => import("@/components/dashboard/SummarySection").then(mod => mod.default));
const BankSection = dynamic(() => import("@/components/dashboard/BankSection").then(mod => mod.default));
const ActivitySection = dynamic(() => import("@/components/dashboard/ActivitySection").then(md => md.default));
const EntryModal = dynamic(() => import("@/components/dashboard/EntryModal").then(mod => mod.default), { ssr: false });
const BottomNavbar = dynamic(() => import("@/components/dashboard/BottomNavbar").then(mod => mod.default));
const OptionsSection = dynamic(() => import("@/components/dashboard/OptionsSection").then(mod => mod.default), { ssr: false });
const FeatureHighlight = dynamic(() => import("@/components/dashboard/FeatureHighlight").then(mod => mod.default), { ssr: false });
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

type RiskLevel = "Low" | "Medium" | "High";

interface BankAccount {
  id: string;
  name: string;
  balance: number;
}

interface Transaction {
  id: string;
  type: "gave" | "borrowed";
  amount: number;
  contact: string;
  risk?: RiskLevel;
  date: string;
  promiseDate?: string;
  isSettled?: boolean;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [currency, setCurrency] = useState("$");
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<"home" | "settings">("home");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"gave" | "borrowed" | "bank">("gave");
  const [editingItem, setEditingItem] = useState<Transaction | null>(null);
  const [showUpdateHighlight, setShowUpdateHighlight] = useState(false);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (authUser) {
        const docRef = doc(db, "users", authUser.uid);
        const unsubSnap = onSnapshot(docRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setCurrency(data.currency || "$");
            setBankAccounts(data.banks || []);
            setTransactions(data.transactions || []);
            setIsOnboarded(data.isOnboarded === true);
            if (data.isOnboarded === true && data.hasSeenContactUpdate !== true) {
              setShowUpdateHighlight(true);
            }
          } else {
            setIsOnboarded(false);
          }
        });
        return () => unsubSnap();
      } else {
        setIsOnboarded(false);
      }
    });
    return () => unsubAuth();
  }, []);

  const balance = transactions.reduce((acc: number, curr: Transaction) => {
    if (curr.isSettled) return acc;
    return curr.type === "gave" ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const syncToCloud = async (updates: Partial<{ currency: string; banks: BankAccount[]; transactions: Transaction[]; isOnboarded: boolean; fcmToken: string; hasSeenContactUpdate: boolean; }>) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), updates, { merge: true });
    } catch {
    }
  };

  const openForm = (type: "gave" | "borrowed" | "bank") => {
    setModalType(type);
    setShowModal(true);
  };

  const handleSaveEntry = (data: { id?: string; bankName?: string; amount: number; contact?: string; date: string; promiseDate?: string }) => {
    if (modalType === "bank") {
      const newBank: BankAccount = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.bankName || "Unknown Bank",
        balance: data.amount,
      };
      syncToCloud({ banks: [...bankAccounts, newBank] });
    } else {
      if (data.id) {
        // Edit existing transaction
        const newTx = transactions.map(tx => 
          tx.id === data.id ? { ...tx, amount: data.amount, contact: data.contact || tx.contact, promiseDate: data.promiseDate } : tx
        );
        syncToCloud({ transactions: newTx });
      } else {
        // New transaction
        const newTx: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          type: modalType as "gave" | "borrowed",
          amount: data.amount,
          contact: data.contact || "Unknown Contact",
          risk: "Low",
          date: data.date,
          promiseDate: data.promiseDate,
          isSettled: false,
        };
        syncToCloud({ transactions: [newTx, ...transactions] });
      }
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setModalType(tx.type);
    setEditingItem(tx);
    setShowModal(true);
  };

  const handleDeleteTransaction = (id: string) => {
    const newTx = transactions.filter(tx => tx.id !== id);
    syncToCloud({ transactions: newTx });
  };

  const toggleSettle = (id: string) => {
    const newTx = transactions.map(tx => 
      tx.id === id ? { ...tx, isSettled: !tx.isSettled } : tx
    );
    syncToCloud({ transactions: newTx });
  };

  const handleEditBank = (id: string, newBalance: number) => {
    const newBanks = bankAccounts.map(b => b.id === id ? { ...b, balance: newBalance } : b);
    syncToCloud({ banks: newBanks });
  };
  const totalBankBalance = bankAccounts.reduce((acc: number, curr: BankAccount) => acc + curr.balance, 0);
  
  const recentContacts = Array.from(new Set(transactions.map(tx => tx.contact))).filter(name => name && name !== "Unknown Contact");

  const luxColors = {
    bg: "bg-[#F2F4F7]",
    textMain: "text-[#0F172A]",
    textMuted: "text-[#64748B]",
    lent: "text-[#059669]",
    debt: "text-[#E11D48]",
  };

  if (isOnboarded === null) return <div className={`min-h-screen ${luxColors.bg}`} />;
  if (!isOnboarded || !user) return <StartupFlow 
    user={user}
    onComplete={async (cur) => {
      setCurrency(cur);
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
           isOnboarded: true,
           currency: cur,
           banks: [],
           transactions: []
        }, { merge: true });
      }
  }} />;

  return (
    <main className={`min-h-screen flex flex-col ${luxColors.bg} ${luxColors.textMain} selection:bg-[#E2E8F0] antialiased`}>
      <Header />

      <section className="flex-1 overflow-y-auto overflow-x-hidden pt-16 pwa-safe-area-pb pb-[400px] no-scrollbar scroll-smooth">
        {activeTab === "home" ? (
          <>
            <SummarySection 
              currency={currency}
              totalBankBalance={totalBankBalance}
              balance={balance}
              luxColors={luxColors}
            />

            <BankSection 
              bankAccounts={bankAccounts}
              currency={currency}
              onOpenForm={() => openForm("bank")}
              onEditBank={handleEditBank}
            />
            <ActivitySection 
              transactions={transactions}
              currency={currency}
              onToggleSettle={toggleSettle}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              luxColors={luxColors}
            />
          </>
        ) : (
          <OptionsSection />
        )}
        {/* Empty footer area for free scrolling */}
        <div className="h-[15vh] transition-all" aria-hidden="true" />
      </section>
 
      <BottomNavbar onOpenForm={(type: "gave" | "borrowed" | "bank") => openForm(type)} activeTab={activeTab} onChangeTab={setActiveTab} />
 
      <EntryModal 
        show={showModal}
        onClose={() => { setShowModal(false); setEditingItem(null); }}
        type={modalType}
        currency={currency}
        initialData={editingItem}
        recentContacts={recentContacts}
        onSave={handleSaveEntry}
        luxColors={luxColors}
      />

      <FeatureHighlight 
        show={showUpdateHighlight} 
        onClose={() => {
          setShowUpdateHighlight(false);
          syncToCloud({ hasSeenContactUpdate: true });
        }}
      />
    </main>
  );
}
