"use client";

export default function Header() {
  return (
    <nav className="fixed top-0 left-0 w-full px-8 pwa-safe-area-pt py-6 flex justify-center items-center bg-[#F2F4F7]/85 backdrop-blur-3xl z-50 border-b border-[#E2E8F0]/30 shadow-none">
      <div className="flex flex-col items-center justify-center font-luxury">
        <h1 className="text-3xl font-bold tracking-tighter lowercase">money</h1>
      </div>
    </nav>
  );
}
