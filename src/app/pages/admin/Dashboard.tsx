import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import AdminLayout from '../../components/admin/AdminLayout';
import { apiRequest } from '../../utils/api';
import { canDelete, canExport } from '../../utils/adminAuth';
import type { Application } from '../../utils/mockAdminData';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    newApplications: 0,
    pendingReview: 0,
    acceptedThisWeek: 0,
    totalPartnerships: 0,
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastIdCounter, setToastIdCounter] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (message: string, type: ToastType) => {
    const newToast: Toast = {
      id: toastIdCounter,
      message,
      type,
    };

    setToastIdCounter((prev) => prev + 1);
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id));
    }, 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [applicationData, statsData] = await Promise.all([
        apiRequest<{ items: Application[] }>('/admin/applications?limit=5'),
        apiRequest<{
          summary: {
            newApplications: number;
            pendingReview: number;
            acceptedThisWeek: number;
            totalPartnerships: number;
          };
        }>('/admin/stats'),
      ]);

      setApplications(applicationData.items);
      setStats(statsData.summary);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      new: 'bg-[#F71C56] text-white',
      reviewed: 'bg-[#F59E0B] text-white',
      accepted: 'bg-[#10B981] text-white',
      rejected: 'bg-[#6B7280] text-white',
    };

    return badges[status as keyof typeof badges] || 'bg-gray-200 text-gray-800';
  };

  const chartItems = [
    { label: 'New', value: stats.newApplications, color: '#F71C56' },
    { label: 'Reviewing', value: stats.pendingReview, color: '#F59E0B' },
    { label: 'Accepted', value: stats.acceptedThisWeek, color: '#10B981' },
    { label: 'Partnerships', value: stats.totalPartnerships, color: '#0A1C3A' },
  ];

  const sparklinePoints = chartItems.map((item, index) => {
    const x = 40 + index * 120;
    const y = 170 - Math.max(item.value * 18, 24);
    return `${x},${y}`;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      setDeletingId(id);
      await apiRequest(`/admin/applications/${id}`, { method: 'DELETE' });
      await loadData();
      showToast('Application deleted.', 'info');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Delete failed.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="fixed top-24 right-4 sm:right-8 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-5 py-4 rounded shadow-lg min-w-[280px] sm:min-w-[300px] animate-slide-in ${
              toast.type === 'success'
                ? 'bg-green-600'
                : toast.type === 'error'
                  ? 'bg-red-600'
                  : 'bg-blue-600'
            } text-white`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h1 className="font-bold text-[28px] sm:text-[32px] text-[#0A1C3A] mb-2">
          Welcome back, Dr. Nia
        </h1>
        <p className="text-[#737576]">
          Here&apos;s what&apos;s happening with your learning mobility programs today.
        </p>
      </div>

      <div
        className="bg-white border border-[#e6bcbf] mb-8"
        style={{ clipPath: 'polygon(0 0, 99% 0, 100% 1%, 100% 100%, 1% 100%, 0 99%)' }}
      >
        <div className="p-6 border-b border-[#e6bcbf]">
          <h2 className="font-bold text-xl text-[#0A1C3A]">Recent Applications</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-[#f7fafd] border-b border-[#e6bcbf]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">
                  Program
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6bcbf]">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-4 bg-slate-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-40 bg-slate-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
                  </tr>
                ))
              ) : applications.map((app) => (
                <tr key={app.id} className="hover:bg-[#f7fafd] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0A1C3A]">
                    {app.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#737576]">{app.program}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#737576]">
                    {app.submittedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded ${getStatusBadge(app.status)}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link to="/admin/applications" className="text-[#F71C56] hover:underline mr-3">
                      View
                    </Link>
                    {canDelete() && (
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-[#737576] hover:text-red-600 disabled:opacity-60"
                        disabled={deletingId === app.id}
                      >
                        {deletingId === app.id ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/admin/applications"
          className="bg-white border-2 border-[#F71C56] text-[#F71C56] font-bold px-6 py-4 text-center hover:bg-[#F71C56] hover:text-white transition-all uppercase tracking-wider"
        >
          View All Applications
        </Link>
        <Link
          to="/admin/programs"
          className="bg-white border-2 border-[#0A1C3A] text-[#0A1C3A] font-bold px-6 py-4 text-center hover:bg-[#0A1C3A] hover:text-white transition-all uppercase tracking-wider"
        >
          Manage Programs
        </Link>
        {canExport() && (
          <button
            onClick={() => showToast('Data export initiated. Check console for output.', 'success')}
            className="bg-white border-2 border-[#737576] text-[#737576] font-bold px-6 py-4 hover:bg-[#737576] hover:text-white transition-all uppercase tracking-wider"
          >
            Export All Data
          </button>
        )}
      </div>

      <div
        className="bg-[#f7fafd] border border-[#e6bcbf] p-6 sm:p-8 shadow-xl"
        style={{ clipPath: 'polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F71C56] mb-2">
              Analytics
            </p>
            <h3 className="font-bold text-xl text-[#0A1C3A]">Pipeline Overview</h3>
          </div>
          <p className="text-sm text-[#737576] max-w-md">
            A quick view of the current application and partnership mix in the system.
          </p>
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-[#e6bcbf] p-5 sm:p-6" style={{ clipPath: 'polygon(0 0, 99% 0, 100% 1%, 100% 100%, 1% 100%, 0 99%)' }}>
            <div className="flex items-center justify-between mb-5">
              <p className="font-bold text-[#0A1C3A] uppercase tracking-[0.2em] text-xs">Activity mix</p>
              <p className="text-xs text-[#737576]">Live snapshot</p>
            </div>

            <svg viewBox="0 0 520 240" className="w-full h-[220px]">
              <defs>
                <linearGradient id="cardinalLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F71C56" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#F71C56" stopOpacity="0" />
                </linearGradient>
              </defs>

              <line x1="20" y1="200" x2="500" y2="200" stroke="#e6bcbf" strokeWidth="2" />
              <line x1="20" y1="160" x2="500" y2="160" stroke="#f0d8db" strokeWidth="1" />
              <line x1="20" y1="120" x2="500" y2="120" stroke="#f0d8db" strokeWidth="1" />
              <line x1="20" y1="80" x2="500" y2="80" stroke="#f0d8db" strokeWidth="1" />

              <polyline
                fill="none"
                stroke="#F71C56"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={sparklinePoints.join(' ')}
              />

              <polygon
                fill="url(#cardinalLine)"
                points={`40,200 ${sparklinePoints.join(' ')} 400,200`}
                opacity="0.55"
              />

              {chartItems.map((item, index) => {
                const x = 40 + index * 120;
                const y = 170 - Math.max(item.value * 18, 24);
                return (
                  <g key={item.label}>
                    <circle cx={x} cy={y} r="7" fill={item.color} stroke="white" strokeWidth="3" />
                    <text
                      x={x}
                      y="224"
                      textAnchor="middle"
                      className="fill-[#737576] text-[12px] uppercase tracking-[0.2em]"
                    >
                      {item.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div
            className="bg-white border border-[#e6bcbf] p-4 sm:p-5"
            style={{ clipPath: 'polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)' }}
          >
            <div className="flex flex-wrap gap-4 sm:gap-6">
              {chartItems.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-sm font-bold text-[#0A1C3A]">{item.label}</p>
                    <p className="text-xs text-[#737576]">{item.value} records</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </AdminLayout>
  );
}
