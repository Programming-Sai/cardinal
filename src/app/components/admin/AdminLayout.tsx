import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import BrandLogo from "../brand/BrandLogo";
import {
  getCurrentAdmin,
  getRoleBadgeClass,
  getRoleDisplayName,
  isSuperAdmin,
  logoutAdmin,
  type Admin,
} from "../../utils/adminAuth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Applications", href: "/admin/applications" },
  { label: "Inquiries", href: "/admin/inquiries" },
  { label: "Programs", href: "/admin/programs" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const currentAdmin = getCurrentAdmin();
    if (!currentAdmin) {
      navigate("/admin/login");
      return;
    }

    setAdmin(currentAdmin);
  }, [navigate, location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const currentPath = useMemo(() => location.pathname, [location.pathname]);

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-brand-surface text-brand-ink">
      <header className="bg-brand-navy text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-3">
          <div className="flex items-center justify-between h-16 gap-4">
            <BrandLogo to="/admin/dashboard" size="md" mode="light" />

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 text-sm text-white/80">
                <span>{admin.fullName}</span>
                <span
                  className={`px-2 py-1 text-xs font-bold uppercase tracking-wider rounded ${getRoleBadgeClass(admin.role)}`}
                >
                  {getRoleDisplayName(admin.role)}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex border-2 border-brand-red text-brand-red font-bold px-4 py-2 rounded hover:bg-brand-red hover:text-white transition-all text-sm uppercase tracking-wider"
              >
                Logout
              </button>
              <button
                type="button"
                className="sm:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/20 bg-white/10"
                onClick={() => setMenuOpen((value) => !value)}
                aria-label={menuOpen ? "Close admin menu" : "Open admin menu"}
                aria-expanded={menuOpen}
                aria-controls="admin-navigation"
              >
                {menuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <nav
            id="admin-navigation"
            className={`items-center gap-6 border-t border-white/10 overflow-hidden transition-[max-height,opacity,padding] duration-300 ease-out ${
              menuOpen
                ? "max-h-96 opacity-100 pt-3 pb-3 pointer-events-auto"
                : "max-h-0 opacity-0 pt-0 pb-0 pointer-events-none"
            } sm:flex sm:max-h-none sm:opacity-100 sm:pt-3 sm:pb-3 sm:pointer-events-auto`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              {navItems.map((item) => {
                const active = currentPath === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-brand-red ${
                      active
                        ? "text-brand-cyan border-b-2 border-brand-cyan pb-1"
                        : "text-white/80"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {isSuperAdmin() && (
                <Link
                  to="/admin/admin-management"
                  className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-brand-red ${
                    currentPath === "/admin/admin-management"
                      ? "text-brand-cyan border-b-2 border-brand-cyan pb-1"
                      : "text-white/80"
                  }`}
                >
                  Admin Management
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="sm:hidden inline-flex items-center justify-center border-2 border-brand-red text-brand-red font-bold px-4 py-2 rounded hover:bg-brand-red hover:text-white transition-all text-sm uppercase tracking-wider w-full"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-brand-border py-4 mt-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-brand-muted">
          <p>
            Cardinal Immersions Admin Panel · Logged in as{" "}
            <span className="font-bold">{admin.email}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}


