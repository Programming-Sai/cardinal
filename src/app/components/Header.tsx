import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import BrandLogo from './brand/BrandLogo';

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className="w-full top-0 left-0 fixed z-50 border-b border-brand-border/70 bg-white/78 backdrop-blur-md shadow-sm"
      style={{ WebkitBackdropFilter: 'blur(16px)', backdropFilter: 'blur(16px)' }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 flex justify-between items-center h-20 gap-3">
        <BrandLogo to="/" size="md" />
        <nav className="hidden lg:flex gap-6 xl:gap-8 items-center">
          <Link
            to="/"
            className={`font-bold text-sm uppercase tracking-wider transition-colors ${
              isActive('/')
                ? 'text-brand-red border-b-2 border-brand-red pb-1'
                : 'text-brand-navy hover:text-brand-red'
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`font-bold text-sm uppercase tracking-wider transition-colors ${
              isActive('/about')
                ? 'text-brand-red border-b-2 border-brand-red pb-1'
                : 'text-brand-navy hover:text-brand-red'
            }`}
          >
            About
          </Link>
          <Link
            to="/programs"
            className={`font-bold text-sm uppercase tracking-wider transition-colors ${
              isActive('/programs')
                ? 'text-brand-red border-b-2 border-brand-red pb-1'
                : 'text-brand-navy hover:text-brand-red'
            }`}
          >
            Programs
          </Link>
          <Link
            to="/partners"
            className={`font-bold text-sm uppercase tracking-wider transition-colors ${
              isActive('/partners')
                ? 'text-brand-red border-b-2 border-brand-red pb-1'
                : 'text-brand-navy hover:text-brand-red'
            }`}
          >
            Partners
          </Link>
          <Link
            to="/contact"
            className={`font-bold text-sm uppercase tracking-wider transition-colors ${
              isActive('/contact')
                ? 'text-brand-red border-b-2 border-brand-red pb-1'
                : 'text-brand-navy hover:text-brand-red'
            }`}
          >
            Contact
          </Link>
          <Link
            to="/apply"
            className={`font-bold text-sm uppercase tracking-wider transition-all px-4 py-2 rounded border-2 ${
              isActive('/apply')
                ? 'bg-brand-red text-white border-brand-red'
                : 'text-brand-red border-brand-red hover:bg-brand-red hover:text-white'
            }`}
          >
            Apply
          </Link>
        </nav>
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border border-brand-border bg-white/80 text-brand-navy hover:border-brand-red hover:text-brand-red transition-colors"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      <div
        id="mobile-navigation"
        className={`md:hidden border-t border-brand-border/70 bg-white/92 backdrop-blur-xl transition-all duration-300 ease-out overflow-hidden ${
          menuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ WebkitBackdropFilter: 'blur(18px)', backdropFilter: 'blur(18px)' }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-4 flex flex-col gap-2">
          {[
            ['Home', '/'],
            ['About', '/about'],
            ['Programs', '/programs'],
            ['Partners', '/partners'],
            ['Contact', '/contact'],
            ['Apply', '/apply']
          ].map(([label, path]) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center justify-between px-4 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-colors ${
                  active
                    ? 'bg-brand-red text-white'
                    : 'bg-brand-surface text-brand-navy hover:bg-brand-surface-hover hover:text-brand-red'
                }`}
              >
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}



