import { AuditForm } from "../../components/forms/AuditForm";

export default function AuditPage() {
  return (
    <div className="flex-1 bg-black text-[#E1E0CC] relative min-h-screen flex flex-col pt-32 pb-20 overflow-hidden">
      
      {/* Immersive Background */}
      <div className="absolute inset-0 aurora-bg opacity-30" />
      <div className="absolute inset-0 mesh-gradient opacity-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay" />
      
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        
        {/* Balanced Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16 border-b border-[#E1E0CC]/10 pb-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#E1E0CC]/20 bg-[#E1E0CC]/5 px-4 py-1.5 backdrop-blur-xl">
              <div className="h-4 w-4 overflow-hidden rounded-sm">
                <img 
                  src="/images/logo.png" 
                  alt="" 
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E1E0CC]">
                Intelligence Suite
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tight font-heading leading-tight text-[#E1E0CC]">
              Analyze your <br />
              <span className="text-[#E1E0CC]/40">Intelligence Stack.</span>
            </h1>
          </div>

          <div className="max-w-xs space-y-4">
            <p className="text-sm text-[#E1E0CC]/50 font-light leading-relaxed">
              Verify your toolchain efficiency and identify immediate capital reclamation opportunities.
            </p>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#E1E0CC]/20">
              <span className="flex items-center gap-1.5"><div className="h-1 w-1 rounded-full bg-[#E1E0CC]/30" /> SECURE</span>
              <span className="flex items-center gap-1.5"><div className="h-1 w-1 rounded-full bg-[#E1E0CC]/30" /> ENCRYPTED</span>
            </div>
          </div>
        </div>

        {/* The Audit Interface */}
        <div className="w-full">
          <AuditForm />
        </div>

      </div>
    </div>
  );
}
