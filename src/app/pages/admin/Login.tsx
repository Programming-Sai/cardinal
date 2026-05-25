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
    <div className="min-h-screen bg-[#0A1C3A] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div
          className="bg-white p-8 sm:p-10 shadow-2xl border border-[#e6bcbf]"
          style={{
            clipPath: 'polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)',
          }}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <BrandLogo to="/" size="lg" />
            </div>
            <div className="w-16 h-1 bg-[#F71C56] mx-auto mb-4" />
            <h2 className="font-bold text-xl text-[#0A1C3A]">Admin Login</h2>
          </div>

          <div className="bg-[#f7fafd] border border-[#e6bcbf] p-4 mb-6 text-sm text-[#0A1C3A]">
            <p className="font-bold mb-1">Admin access</p>
            <p>Sign in with your Cardinal Immersions admin credentials.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-[#0A1C3A] mb-2 font-bold">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56] transition-colors"
                placeholder="admin@cardinalimmersions.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[#0A1C3A] mb-2 font-bold">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-white border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56] transition-colors"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737576] hover:text-[#0A1C3A] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F71C56] text-white font-bold px-8 py-4 rounded transition-all hover:brightness-110 uppercase tracking-widest text-sm disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-white hover:text-[#F71C56] transition-colors text-sm">
            Back to Main Website
          </a>
        </div>
      </div>
    </div>
  );
}
