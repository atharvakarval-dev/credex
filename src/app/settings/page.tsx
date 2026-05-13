"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Mail, Building2, Calendar, ArrowUpRight, BarChart3, ShieldCheck } from "lucide-react";

interface Lead {
  id: string;
  email: string;
  companyName?: string;
  auditId: string;
  createdAt: string;
}

export default function SettingsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLeads(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch leads:", err);
        setLoading(false);
      });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen relative bg-[#050505] flex flex-col overflow-hidden">
      
      {/* Immersive Background (No Video) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.4] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] rounded-full bg-[#E1E0CC] opacity-[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-20 w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-4 px-3 py-1 w-fit rounded-full bg-[#E1E0CC]/5 border border-[#E1E0CC]/10 backdrop-blur-md"
            >
              <div className="h-2 w-2 rounded-full bg-[#E1E0CC] animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#E1E0CC] font-bold">System Intelligence</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-bold leading-[0.85] tracking-[-0.05em] text-[10vw] sm:text-[8vw] md:text-[6vw] text-[#E1E0CC] uppercase"
            >
              Captured<span className="text-[#E1E0CC]/30 font-light">*</span>
            </motion.h1>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <div className="px-6 py-4 rounded-[1.5rem] bg-black/40 backdrop-blur-md border border-[#E1E0CC]/10 flex flex-col min-w-[140px]">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#E1E0CC]/40 font-bold mb-2">Total Leads</span>
              <span className="text-3xl font-black text-[#E1E0CC] leading-none">{leads.length}</span>
            </div>
            <div className="px-6 py-4 rounded-[1.5rem] bg-black/40 backdrop-blur-md border border-[#E1E0CC]/10 flex flex-col min-w-[140px]">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#E1E0CC]/40 font-bold mb-2">Conversion</span>
              <span className="text-3xl font-black text-[#E1E0CC] leading-none">14.2%</span>
            </div>
          </motion.div>
        </div>

        {/* Intelligence Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-[2rem] bg-[#E1E0CC]/[0.02] border border-[#E1E0CC]/5" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-40 rounded-[2rem] border border-dashed border-[#E1E0CC]/10 bg-black/20 backdrop-blur-md"
          >
            <Users className="h-12 w-12 text-[#E1E0CC]/20 mb-4" />
            <p className="text-[#E1E0CC]/50 font-medium tracking-wide">No intelligence captured yet.</p>
            <p className="text-[#E1E0CC]/30 text-sm mt-1">Run an audit and submit the lead form to see data here.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {leads.map((lead) => (
              <motion.div 
                key={lead.id}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-[2rem] bg-black/40 backdrop-blur-md border border-[#E1E0CC]/10 p-8 transition-all hover:bg-[#E1E0CC]/[0.02] hover:border-[#E1E0CC]/20"
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="h-5 w-5 text-[#E1E0CC]" />
                </div>

                <div className="flex items-start gap-4 mb-8">
                  <div className="h-14 w-14 rounded-2xl bg-[#E1E0CC]/5 flex items-center justify-center border border-[#E1E0CC]/10">
                    <Building2 className="h-6 w-6 text-[#E1E0CC]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#E1E0CC] truncate max-w-[200px]">
                      {lead.companyName || "Anonymous Entity"}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-3 w-3 text-[#E1E0CC]/30" />
                      <span className="text-sm text-[#E1E0CC]/50">{lead.email}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-[#E1E0CC]/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-[#E1E0CC]/30" />
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#E1E0CC]/40 font-bold">Captured</span>
                    </div>
                    <span className="text-xs text-[#E1E0CC]/70 font-medium">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-3 w-3 text-[#E1E0CC]/30" />
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#E1E0CC]/40 font-bold">Source Audit</span>
                    </div>
                    <span className="text-[10px] text-[#E1E0CC] font-mono bg-[#E1E0CC]/10 px-2 py-1 rounded-md">
                      #{lead.auditId.slice(0, 8)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Security & System Status */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 rounded-[2rem] bg-gradient-to-br from-black/60 to-black/20 backdrop-blur-xl border border-[#E1E0CC]/10 p-10">
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck className="h-6 w-6 text-[#E1E0CC]" />
              <h2 className="text-2xl font-black text-[#E1E0CC] uppercase tracking-tight">System Integrity</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: "Database Health", status: "Optimal", val: "99.9%" },
                { label: "Lead Encryption", status: "Active", val: "AES-256" },
                { label: "API Latency", status: "Nominal", val: "24ms" },
                { label: "Firewall Status", status: "Shielded", val: "WAF: ON" },
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-black/40 border border-[#E1E0CC]/5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#E1E0CC]/40 font-bold">{stat.label}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#E1E0CC]/10 text-[#E1E0CC] font-bold uppercase">{stat.status}</span>
                  </div>
                  <span className="text-2xl font-black text-[#E1E0CC]">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="rounded-[2rem] bg-[#E1E0CC] p-10 flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute -right-8 -bottom-8 opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12">
               <BarChart3 className="h-48 w-48 text-black" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-black uppercase tracking-tighter leading-none mb-3">
                Export<br/>Intelligence
              </h2>
              <p className="text-black/70 text-sm font-medium">Download full lead manifest in secure JSON format.</p>
            </div>
            <button className="relative z-10 mt-8 w-full py-4 bg-black rounded-xl text-white text-[10px] font-black uppercase tracking-[0.2em] transition-transform hover:scale-[1.02] active:scale-[0.98]">
              Download Report
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

