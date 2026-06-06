import { Mail } from "lucide-react";
import BrandLogo from "./brand/BrandLogo";

export default function Footer() {
  return (
    <footer
      className="w-full bg-gradient-to-b from-brand-navy to-brand-navy-deep text-white relative  pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-20 z-0 overflow-hidden -mt-50 md:-mt-25"
      style={{ clipPath: "polygon(0 14%, 100% 0, 100% 100%, 0 100%)" }}
    >
      <div className="py-20">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute -top-24 right-8 h-72 w-72 rounded-full bg-brand-red/20 blur-3xl" />
          <div className="absolute top-24 left-1/4 h-64 w-64 rounded-full bg-brand-blue/15 blur-3xl" />
          <div className="absolute bottom-8 right-1/3 h-48 w-48 rounded-full bg-brand-cyan/10 blur-3xl" />
          <div className="absolute bottom-0 left-[-4rem] h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative py-4 sm:py-0">
          <div className="flex flex-col gap-6">
            <BrandLogo to="/" size="lg" mode="light" />
            <p className="text-white/80">
              Dedicated to international learning mobility, not tourism.
              Academic excellence across borders.
            </p>
            <div className="flex gap-4">
              <a
                className="text-white hover:text-brand-cyan transition-colors flex items-center gap-2"
                href="mailto:hello@andylcc.com"
              >
                <Mail className="h-4 w-4" />
                hello@andylcc.com
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold uppercase tracking-widest">Resources</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  className="text-white/80 hover:text-white hover:underline decoration-brand-cyan decoration-2 underline-offset-4 transition-all"
                  href="/programs"
                >
                  Programs
                </a>
              </li>
              <li>
                <a
                  className="text-white/80 hover:text-white hover:underline decoration-brand-cyan decoration-2 underline-offset-4 transition-all"
                  href="/partners"
                >
                  Case Studies
                </a>
              </li>
              <li>
                <a
                  className="text-white/80 hover:text-white hover:underline decoration-brand-cyan decoration-2 underline-offset-4 transition-all"
                  href="/programs/institutional-partnerships"
                >
                  Institutional Services
                </a>
              </li>
              <li>
                <a
                  className="text-white/80 hover:text-white hover:underline decoration-brand-cyan decoration-2 underline-offset-4 transition-all"
                  href="/contact"
                >
                  Alumni Portal
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold uppercase tracking-widest">Information</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  className="text-white/80 hover:text-white hover:underline decoration-brand-blue decoration-2 underline-offset-4 transition-all"
                  href="/contact"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  className="text-white/80 hover:text-white hover:underline decoration-brand-blue decoration-2 underline-offset-4 transition-all"
                  href="/contact"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  className="text-white/80 hover:text-white hover:underline decoration-brand-blue decoration-2 underline-offset-4 transition-all"
                  href="/contact"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  className="text-white/80 hover:text-white hover:underline decoration-brand-blue decoration-2 underline-offset-4 transition-all"
                  href="/"
                >
                  Sitemap
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="font-bold uppercase tracking-widest">Connect</h4>
            <div className="flex flex-col gap-4">
              <input
                className="bg-transparent border border-white/30 p-3 text-white text-sm font-bold focus:border-brand-cyan outline-none transition-all placeholder:text-white/50"
                style={{
                  clipPath:
                    "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                }}
                placeholder="ENTER YOUR EMAIL"
                type="email"
              />
              <button
                className="bg-brand-red text-white py-3 font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-colors"
                style={{
                  clipPath:
                    "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                }}
              >
                Join Mobility Network
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 mt-16 pt-8 sm:pt-10 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
          <p className="text-white/60 text-xs">
            Copyright Cardinal Immersions. Dedicated to international learning
            mobility, not tourism. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="font-bold text-xs uppercase tracking-tighter opacity-40">
              Accredited Member 2024
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
