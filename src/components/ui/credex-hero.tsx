"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";

/* ---------------- WordsPullUp ---------------- */
interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
}

export const WordsPullUp = ({ text, className = "", showAsterisk = false, style }: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.05em] -right-[0.55em] text-[0.45em] font-light opacity-30 select-none">
                *
              </span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------- Hero ---------------- */
const CredexHero = () => {
  return (
    <section className="h-screen w-full relative">
      <div className="relative h-full w-full overflow-hidden">

        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
        />

        {/* Noise overlay */}
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.4] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-12 sm:px-6 md:px-10 lg:pb-20">
          <div className="grid grid-cols-12 items-end gap-6 max-w-7xl mx-auto">

            <div className="col-span-12 lg:col-span-8">
              <h1
                className="font-bold leading-[0.85] tracking-[-0.07em] text-[22vw] sm:text-[20vw] md:text-[18vw] lg:text-[16vw] xl:text-[15vw]"
                style={{ color: "#E1E0CC" }}
              >
                <WordsPullUp text="Credex" showAsterisk />
              </h1>
            </div>

            <div className="col-span-12 flex flex-col gap-6 lg:col-span-4 lg:pb-4">

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm md:text-base lg:text-lg font-light leading-relaxed"
                style={{ color: "rgba(225, 224, 204, 0.8)" }}
              >
                Stop paying for ghost licenses. Our worldwide network of AI auditors helps you reclaim wasted spend, right-size your stack, and unlock hidden potential.
              </motion.p>

              <div className="flex items-center gap-4">
                <Link href="/audit">
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="group inline-flex items-center gap-2 rounded-full py-1 pl-6 pr-1 text-sm font-medium transition-all hover:gap-3 sm:text-base border border-[#E1E0CC]/30 hover:border-[#E1E0CC]"
                    style={{ backgroundColor: "#E1E0CC", color: "#000" }}
                  >
                    Start Free Audit
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                      <ArrowRight className="h-4 w-4" style={{ color: "#E1E0CC" }} />
                    </span>
                  </motion.button>
                </Link>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="hidden sm:block text-[10px] uppercase tracking-widest font-medium opacity-50"
                  style={{ color: "#E1E0CC" }}
                >
                  No credit card required
                </motion.div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { CredexHero };

