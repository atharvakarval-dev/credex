"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Home, Briefcase, Shield, Settings } from "lucide-react";
import { InteractiveMenu, InteractiveMenuItem } from "../ui/modern-mobile-menu";

export function Navbar() {
  const pathname = usePathname();
  const isAuditPage = pathname === "/audit";

  const menuItems: InteractiveMenuItem[] = [
    { label: 'home', icon: Home, href: "/" },
    { label: 'audit', icon: Briefcase, href: "/audit" },
    { label: 'security', icon: Shield, href: "/security" },
    { label: 'settings', icon: Settings, href: "/settings" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
      <div className="container max-w-7xl flex items-center justify-between pointer-events-auto">
        
        {/* Logo Section */}
        <Link href="/" className="group flex items-center gap-4 transition-all hover:scale-105 active:scale-95">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-[0_0_20px_rgba(225,224,204,0.2)]">
            <img 
              src="/images/logo.png" 
              alt="Credex Logo" 
              className="h-full w-full object-cover transition-transform group-hover:scale-110"
            />
          </div>
          <div className="flex flex-col -gap-1">
            <span className="text-2xl font-black uppercase tracking-tighter text-[#E1E0CC] font-heading leading-none">Credex</span>
            <span className="text-[9px] uppercase tracking-[0.5em] text-[#E1E0CC]/30 font-black">Intelligence</span>
          </div>
        </Link>

        {/* Center Navigation */}
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
          <InteractiveMenu items={menuItems} />
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-6">
          {!isAuditPage && (
            <Link href="/audit">
              <button className="group relative overflow-hidden rounded-full bg-[#E1E0CC] px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(225,224,204,0.3)] active:scale-95">
                <span className="relative z-10">Run Audit</span>
                <div className="absolute inset-0 translate-y-full bg-white transition-transform group-hover:translate-y-0" />
              </button>
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}
