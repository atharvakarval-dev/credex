"use client";

import Link from "next/link";
import { ArrowUpRight, Globe, Shield, Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 pt-32 pb-16 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E1E0CC]/20 to-transparent" />
      <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] bg-[#E1E0CC]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-20 mb-32">
          
          {/* Brand Engine */}
          <div className="md:col-span-5 space-y-12">
            <Link href="/" className="group flex items-center gap-5 transition-all self-start inline-flex">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl shadow-[0_0_40px_rgba(225,224,204,0.1)] group-hover:shadow-[0_0_60px_rgba(225,224,204,0.2)] transition-all">
                <img 
                  src="/images/logo.png" 
                  alt="Credex Logo" 
                  className="h-full w-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                />
              </div>
              <div className="flex flex-col -gap-1">
                <span className="text-3xl font-black uppercase tracking-tighter text-[#E1E0CC] font-heading leading-none">Credex</span>
                <span className="text-[9px] uppercase tracking-[0.6em] text-[#E1E0CC]/30 font-black">Intelligence Layer</span>
              </div>
            </Link>
            
            <p className="text-xl text-[#E1E0CC]/40 leading-relaxed font-light max-w-sm">
              Proprietary intelligence suite for right-sizing the modern AI-first organization. <br />
              <span className="text-[#E1E0CC]/10 text-sm mt-4 block uppercase tracking-widest font-black italic">Synthesized in San Francisco.</span>
            </p>
          </div>

          {/* Navigation Matrix */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#E1E0CC]/20">Protocol</h4>
              <ul className="space-y-6">
                <li><Link href="/audit" className="group flex items-center gap-2 text-sm text-[#E1E0CC]/40 hover:text-[#E1E0CC] transition-all font-bold">Audit Engine <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
                <li><Link href="#" className="group flex items-center gap-2 text-sm text-[#E1E0CC]/40 hover:text-[#E1E0CC] transition-all font-bold">Syndicate <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
                <li><Link href="#" className="group flex items-center gap-2 text-sm text-[#E1E0CC]/40 hover:text-[#E1E0CC] transition-all font-bold">Security Hub <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              </ul>
            </div>

            <div className="space-y-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#E1E0CC]/20">Entity</h4>
              <ul className="space-y-6">
                <li><Link href="#" className="group flex items-center gap-2 text-sm text-[#E1E0CC]/40 hover:text-[#E1E0CC] transition-all font-bold">Intelligence <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
                <li><Link href="#" className="group flex items-center gap-2 text-sm text-[#E1E0CC]/40 hover:text-[#E1E0CC] transition-all font-bold">Network <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
                <li><Link href="#" className="group flex items-center gap-2 text-sm text-[#E1E0CC]/40 hover:text-[#E1E0CC] transition-all font-bold">Reach Us <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              </ul>
            </div>

            <div className="space-y-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#E1E0CC]/20">Satellite</h4>
              <ul className="space-y-6">
                <li><Link href="#" className="group flex items-center gap-2 text-sm text-[#E1E0CC]/40 hover:text-[#E1E0CC] transition-all font-bold">X Protocol <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
                <li><Link href="#" className="group flex items-center gap-2 text-sm text-[#E1E0CC]/40 hover:text-[#E1E0CC] transition-all font-bold">LinkedIn Entity <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              </ul>
            </div>
          </div>

        </div>
        
        {/* System Status Line */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2.5 text-[9px] font-black uppercase tracking-[0.4em] text-[#E1E0CC]/10">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/40 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              Operational Network
            </div>
            <div className="flex items-center gap-2.5 text-[9px] font-black uppercase tracking-[0.4em] text-[#E1E0CC]/10">
              <Shield className="h-3 w-3" />
              Encrypted Tunneling
            </div>
            <div className="flex items-center gap-2.5 text-[9px] font-black uppercase tracking-[0.4em] text-[#E1E0CC]/10">
              <Activity className="h-3 w-3" />
              Real-time Synthesis
            </div>
          </div>

          <div className="flex items-center gap-10">
             <div className="text-[9px] font-black uppercase tracking-[0.5em] text-[#E1E0CC]/10">
              Â© {new Date().getFullYear()} Credex Entity
            </div>
            <div className="flex gap-8">
              <Link href="#" className="text-[9px] font-black uppercase tracking-[0.5em] text-[#E1E0CC]/20 hover:text-[#E1E0CC] transition-colors">Privacy_v2</Link>
              <Link href="#" className="text-[9px] font-black uppercase tracking-[0.5em] text-[#E1E0CC]/20 hover:text-[#E1E0CC] transition-colors">Terms_of_Use</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

