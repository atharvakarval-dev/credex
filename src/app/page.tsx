"use client";

import { CredexHero } from "../components/ui/credex-hero";
import { TrendingDown, Layers, Shield, CheckCircle2, ArrowRight, Zap, Globe, Lock } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Button } from "../components/ui/button";

export default function Home() {
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 500], [0, 20]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.3]);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <motion.div 
        style={{ 
          filter: useTransform(blur, (v) => `blur(${v}px)`),
          opacity
        }}
        className="relative z-0 w-full"
      >
        <CredexHero />
      </motion.div>

      {/* Trust Bar */}
      <section className="py-20 border-y border-white/5 bg-black relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
              Backing the efficiency of 500+ global teams
            </span>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale transition-all hover:grayscale-0">
              {/* Using text logos for premium feel since I don't have actual SVG assets for these companies */}
              <span className="text-xl font-black tracking-tighter text-white">LINEAR</span>
              <span className="text-xl font-bold tracking-tight text-white italic">Vercel</span>
              <span className="text-xl font-extrabold tracking-tighter text-white uppercase">Brex</span>
              <span className="text-xl font-semibold tracking-tight text-white">Ramp</span>
              <span className="text-xl font-black tracking-widest text-white">STRIPE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-40 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mb-32">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-10 font-heading"
            >
              Maximum Efficiency. <br />
              <span className="text-white/30 italic font-light">Minimum Administration.</span>
            </motion.h2>
            <p className="text-lg md:text-2xl text-white/50 font-light leading-relaxed max-w-2xl">
              The AI industry is moving too fast for traditional SaaS management. We provide the intelligence layer to keep your stack lean and your capital productive.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingDown,
                title: "Right-size Seats",
                desc: "Identify inactive accounts and ghost licenses. We automate the downgrade path so you only pay for what's productive.",
                label: "Audit"
              },
              {
                icon: Layers,
                title: "Consolidate Logic",
                desc: "Feature overlap is the #1 silent budget killer. We map tool functionality to eliminate redundant subscriptions.",
                label: "Map"
              },
              {
                icon: Shield,
                title: "Wholesale Access",
                desc: "Leverage the aggregate buying power of our global network to negotiate enterprise rates for team-tier pricing.",
                label: "Negotiate"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-700 hover:bg-white/[0.04] relative"
              >
                <div className="mb-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 group-hover:text-white/60 transition-colors">
                  {feature.label}
                </div>
                <div className="bg-white h-16 w-16 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-white/5">
                  <feature.icon className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white font-heading">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed font-light group-hover:text-white/60 transition-colors">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Intelligence Section */}
      <section className="py-40 bg-[#050505] relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square md:aspect-video lg:aspect-square rounded-[3rem] overflow-hidden border border-white/10 group"
            >
              <img
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop"
                alt="AI Intelligence"
                className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-12 left-12 right-12">
                <div className="flex gap-4 mb-6">
                  <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest">Neural Engine</div>
                  <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest">Real-time Data</div>
                </div>
                <p className="text-2xl font-bold text-white mb-2 font-heading">Benchmark Intelligence</p>
                <p className="text-white/50 text-sm font-light">Comparing your spend against 10M+ anonymized SaaS invoice data points.</p>
              </div>
            </motion.div>

            <div className="space-y-12">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-heading">
                Engineered for <br />
                <span className="italic font-light opacity-30">Modern Finance.</span>
              </h2>
              <div className="space-y-10">
                {[
                  { icon: Zap, title: "Instant Analysis", desc: "Our engine processes your stack in under 120 seconds." },
                  { icon: Globe, title: "Global Benchmarks", desc: "Access pricing benchmarks from companies of your exact scale." },
                  { icon: Lock, title: "Secure & Private", desc: "Bank-grade encryption for all your uploaded invoice data." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-white/80" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                      <p className="text-white/40 text-sm leading-relaxed font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ultimate CTA */}
      <section className="py-60 relative overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl bg-white/[0.03] blur-[150px] rounded-full" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-5xl md:text-9xl font-bold tracking-tighter text-white font-heading">
              Ready to <br />
              <span className="italic font-light opacity-20">Right-size?</span>
            </h2>
            <p className="text-lg md:text-2xl text-white/40 font-light max-w-2xl mx-auto leading-relaxed">
              Join the elite teams managing their AI capital with Credex. The audit is free, the savings are absolute.
            </p>
            <div className="flex flex-col items-center gap-10 pt-10">
              <Link href="/audit">
                <Button className="group h-20 rounded-full bg-white px-16 text-2xl font-black uppercase tracking-[0.1em] text-black shadow-[0_0_80px_rgba(255,255,255,0.15)] transition-all hover:scale-110 active:scale-95">
                  Start Free Audit
                  <ArrowRight className="ml-4 h-8 w-8 transition-transform group-hover:translate-x-2" />
                </Button>
              </Link>
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
                <CheckCircle2 className="h-4 w-4" />
                Trusted by 500+ startups worldwide
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
