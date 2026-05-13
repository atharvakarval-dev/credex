"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Zap, Database, Cpu, Terminal } from "lucide-react";

import { Globe } from "../../components/ui/rotating-earth";

export default function SecurityPage() {
  const securityLayers = [
    {
      title: "Data Encryption",
      desc: "All audit data and lead information is encrypted using AES-256 at rest and TLS 1.3 in transit.",
      icon: Lock,
      status: "Active"
    },
    {
      title: "Vulnerability Scanning",
      desc: "Continuous real-time scanning of the intelligence suite to detect and patch potential entry points.",
      icon: Eye,
      status: "Scanning"
    },
    {
      title: "Edge Firewall",
      desc: "Global WAF protection ensuring zero-latency protection against DDoS and injection attacks.",
      icon: Shield,
      status: "Shielded"
    },
    {
      title: "Neural Threat Analysis",
      desc: "AI-driven anomaly detection to identify suspicious patterns in lead generation and audit requests.",
      icon: Zap,
      status: "Learning"
    }
  ];

  // 14 major global edge locations for the security mesh
  const activeNodes = [
    { id: "nyc", location: [40.7128, -74.0060] as [number, number], label: "New York" },
    { id: "lon", location: [51.5074, -0.1278] as [number, number], label: "London" },
    { id: "tyo", location: [35.6762, 139.6503] as [number, number], label: "Tokyo" },
    { id: "syd", location: [-33.8688, 151.2093] as [number, number], label: "Sydney" },
    { id: "sfo", location: [37.7749, -122.4194] as [number, number], label: "San Francisco" },
    { id: "sin", location: [1.3521, 103.8198] as [number, number], label: "Singapore" },
    { id: "fra", location: [50.1109, 8.6821] as [number, number], label: "Frankfurt" },
    { id: "gru", location: [-23.5505, -46.6333] as [number, number], label: "Sao Paulo" },
    { id: "bom", location: [19.0760, 72.8777] as [number, number], label: "Mumbai" },
    { id: "cpt", location: [-33.9249, 18.4241] as [number, number], label: "Cape Town" },
    { id: "dxb", location: [25.2048, 55.2708] as [number, number], label: "Dubai" },
    { id: "hkg", location: [22.3193, 114.1694] as [number, number], label: "Hong Kong" },
    { id: "yyz", location: [43.6510, -79.3470] as [number, number], label: "Toronto" },
    { id: "cdg", location: [48.8566, 2.3522] as [number, number], label: "Paris" },
  ];

  return (
    <div className="min-h-screen relative bg-[#050505] flex flex-col justify-center overflow-hidden">
      
      {/* Immersive Background (No Video) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.4] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#E1E0CC] opacity-[0.03] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#E1E0CC] opacity-[0.02] blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-40 pb-20 w-full">
        
        {/* Header */}
        <div className="mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E1E0CC]/5 border border-[#E1E0CC]/10 backdrop-blur-md mb-6"
          >
            <Shield className="h-3 w-3 text-[#E1E0CC]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#E1E0CC] font-bold">Security Protocol v4.0</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-bold leading-[0.85] tracking-[-0.05em] text-[12vw] sm:text-[10vw] md:text-[8vw] mb-6 text-[#E1E0CC] uppercase"
          >
            Fortified<span className="text-[#E1E0CC]/30 font-light">*</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-[#E1E0CC]/60 max-w-2xl mx-auto text-lg font-light leading-relaxed"
          >
            Credex operates at the intersection of extreme performance and uncompromising security. Our multi-layer infrastructure ensures your business intelligence is protected by enterprise-grade protocols.
          </motion.p>
        </div>

        {/* Global Protection Interactive Globe */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative w-full rounded-[2rem] overflow-hidden border border-[#E1E0CC]/10 bg-black/40 backdrop-blur-2xl mb-20 shadow-[0_0_100px_rgba(225,224,204,0.02)] group"
        >
          {/* Top Info Bar */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 border border-[#E1E0CC]/10 backdrop-blur-md">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#E1E0CC] font-bold">Global Mesh Active</span>
            </div>
          </div>

          <div className="relative w-full flex items-center justify-center py-10 overflow-hidden" style={{ minHeight: '600px' }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-80 mix-blend-screen pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,224,204,0.15)_0%,transparent_60%)]" />
            </div>
            <Globe markers={activeNodes} className="w-[600px] h-[600px] z-10" />
          </div>
          
          <div className="absolute bottom-8 left-8 space-y-4 pointer-events-none z-20">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-black/80 backdrop-blur-md border border-[#E1E0CC]/20 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <Cpu className="h-5 w-5 text-[#E1E0CC]" />
              </div>
              <div className="flex flex-col drop-shadow-md">
                <span className="text-[10px] text-[#E1E0CC]/60 uppercase font-bold tracking-[0.2em]">Active Nodes</span>
                <span className="text-base font-black text-[#E1E0CC]">14</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security Layers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityLayers.map((layer, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-[2rem] bg-black/40 backdrop-blur-md border border-[#E1E0CC]/5 transition-all hover:bg-[#E1E0CC]/[0.02] hover:border-[#E1E0CC]/20 group"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="h-14 w-14 rounded-2xl bg-[#E1E0CC]/5 border border-[#E1E0CC]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <layer.icon className="h-6 w-6 text-[#E1E0CC]" />
                </div>
                <span className="text-[9px] px-3 py-1 rounded-full bg-[#E1E0CC]/5 text-[#E1E0CC] font-bold uppercase tracking-widest border border-[#E1E0CC]/10">
                  {layer.status}
                </span>
              </div>
              <h3 className="text-2xl font-black text-[#E1E0CC] uppercase tracking-tight mb-3">
                {layer.title}
              </h3>
              <p className="text-[#E1E0CC]/50 font-light leading-relaxed">
                {layer.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
