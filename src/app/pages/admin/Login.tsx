import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import BrandLogo from '../../components/brand/BrandLogo';
import { loginAdmin } from '../../utils/adminAuth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const admin = await loginAdmin(email, password);
      if (!admin) {
        setError('No admin account found or password is incorrect.');
        return;
      }

      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--brand-navy)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div
          className="bg-white p-8 sm:p-10 shadow-2xl border border-[var(--brand-border)]"
          style={{
            clipPath: 'polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)',
          }}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <BrandLogo to="/" size="lg" />
            </div>
            <div className="w-16 h-1 bg-[var(--brand-red)] mx-auto mb-4" />
            <h2 className="font-bold text-xl text-[var(--brand-navy)]">Admin Login</h2>
          </div>

          <div className="bg-[var(--brand-surface)] border border-[var(--brand-border)] p-4 mb-6 text-sm text-[var(--brand-navy)]">
            <p className="font-bold mb-1">Admin access</p>
            <p>Sign in with your Cardinal Immersions admin credentials.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-[var(--brand-navy)] mb-2 font-bold">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                placeholder="admin@cardinalimmersions.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[var(--brand-navy)] mb-2 font-bold">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brand-muted)] hover:text-[var(--brand-navy)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-[var(--brand-surface)] border border-[var(--brand-red)] text-[var(--brand-red)] px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--brand-red)] text-white font-bold px-8 py-4 rounded transition-all hover:brightness-110 uppercase tracking-widest text-sm disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-white hover:text-[var(--brand-red)] transition-colors text-sm">
            Back to Main Website
          </a>
        </div>
      </div>
    </div>
  );
}

