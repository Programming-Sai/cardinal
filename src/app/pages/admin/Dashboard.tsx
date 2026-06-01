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
      new: 'bg-[var(--brand-red)] text-white',
      reviewed: 'bg-[var(--brand-blue)] text-white',
      accepted: 'bg-[var(--brand-cyan)] text-[var(--brand-navy)]',
      rejected: 'bg-[var(--brand-navy)] text-white',
    };

    return badges[status as keyof typeof badges] || 'bg-[var(--brand-surface-alt)] text-[var(--brand-navy)]';
  };

  const chartItems = [
    { label: 'New', value: stats.newApplications, color: 'var(--brand-red)' },
    { label: 'Reviewing', value: stats.pendingReview, color: 'var(--brand-blue)' },
    { label: 'Accepted', value: stats.acceptedThisWeek, color: 'var(--brand-cyan)' },
    { label: 'Partnerships', value: stats.totalPartnerships, color: 'var(--brand-navy)' },
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
                ? 'bg-[var(--brand-blue)] text-white'
                : toast.type === 'error'
                  ? 'bg-[var(--brand-red)] text-white'
                  : 'bg-[var(--brand-cyan)] text-[var(--brand-navy)]'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h1 className="font-bold text-[28px] sm:text-[32px] text-[var(--brand-navy)] mb-2">
          Welcome back, Dr. Nia
        </h1>
        <p className="text-[var(--brand-muted)]">
          Here&apos;s what&apos;s happening with your learning mobility programs today.
        </p>
      </div>

      <div
        className="bg-white border border-[var(--brand-border)] mb-8"
        style={{ clipPath: 'polygon(0 0, 99% 0, 100% 1%, 100% 100%, 1% 100%, 0 99%)' }}
      >
        <div className="p-6 border-b border-[var(--brand-border)]">
          <h2 className="font-bold text-xl text-[var(--brand-navy)]">Recent Applications</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-[var(--brand-surface)] border-b border-[var(--brand-border)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-[var(--brand-navy)] uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[var(--brand-navy)] uppercase tracking-wider">
                  Program
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[var(--brand-navy)] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[var(--brand-navy)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[var(--brand-navy)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--brand-border)]">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-4 bg-[var(--brand-surface-alt)] rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-[var(--brand-surface-alt)] rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-40 bg-[var(--brand-surface-alt)] rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-[var(--brand-surface-alt)] rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-[var(--brand-surface-alt)] rounded" /></td>
                  </tr>
                ))
              ) : applications.map((app) => (
                <tr key={app.id} className="hover:bg-[var(--brand-surface)] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--brand-navy)]">
                    {app.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--brand-muted)]">{app.program}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-muted)]">
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
                    <Link to="/admin/applications" className="text-[var(--brand-red)] hover:underline mr-3">
                      View
                    </Link>
                    {canDelete() && (
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-[var(--brand-muted)] hover:text-[var(--brand-red)] disabled:opacity-60"
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
          className="bg-white border-2 border-[var(--brand-red)] text-[var(--brand-red)] font-bold px-6 py-4 text-center hover:bg-[var(--brand-red)] hover:text-white transition-all uppercase tracking-wider"
        >
          View All Applications
        </Link>
        <Link
          to="/admin/programs"
          className="bg-white border-2 border-[var(--brand-navy)] text-[var(--brand-navy)] font-bold px-6 py-4 text-center hover:bg-[var(--brand-navy)] hover:text-white transition-all uppercase tracking-wider"
        >
          Manage Programs
        </Link>
        {canExport() && (
          <button
            onClick={() => showToast('Data export initiated. Check console for output.', 'success')}
            className="bg-white border-2 border-[var(--brand-muted)] text-[var(--brand-muted)] font-bold px-6 py-4 hover:bg-[var(--brand-muted)] hover:text-white transition-all uppercase tracking-wider"
          >
            Export All Data
          </button>
        )}
      </div>

      <div
        className="bg-[var(--brand-surface)] border border-[var(--brand-border)] p-6 sm:p-8 shadow-xl"
        style={{ clipPath: 'polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-red)] mb-2">
              Analytics
            </p>
            <h3 className="font-bold text-xl text-[var(--brand-navy)]">Pipeline Overview</h3>
          </div>
          <p className="text-sm text-[var(--brand-muted)] max-w-md">
            A quick view of the current application and partnership mix in the system.
          </p>
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-[var(--brand-border)] p-5 sm:p-6" style={{ clipPath: 'polygon(0 0, 99% 0, 100% 1%, 100% 100%, 1% 100%, 0 99%)' }}>
            <div className="flex items-center justify-between mb-5">
              <p className="font-bold text-[var(--brand-navy)] uppercase tracking-[0.2em] text-xs">Activity mix</p>
              <p className="text-xs text-[var(--brand-muted)]">Live snapshot</p>
            </div>

            <svg viewBox="0 0 520 240" className="w-full h-[220px]">
              <defs>
                <linearGradient id="cardinalLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand-red)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--brand-red)" stopOpacity="0" />
                </linearGradient>
              </defs>

              <line x1="20" y1="200" x2="500" y2="200" stroke="var(--brand-border)" strokeWidth="2" />
              <line x1="20" y1="160" x2="500" y2="160" stroke="#f0d8db" strokeWidth="1" />
              <line x1="20" y1="120" x2="500" y2="120" stroke="#f0d8db" strokeWidth="1" />
              <line x1="20" y1="80" x2="500" y2="80" stroke="#f0d8db" strokeWidth="1" />

              <polyline
                fill="none"
                stroke="var(--brand-red)"
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
                      className="fill-[var(--brand-muted)] text-[12px] uppercase tracking-[0.2em]"
                    >
                      {item.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div
            className="bg-white border border-[var(--brand-border)] p-4 sm:p-5"
            style={{ clipPath: 'polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)' }}
          >
            <div className="flex flex-wrap gap-4 sm:gap-6">
              {chartItems.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-sm font-bold text-[var(--brand-navy)]">{item.label}</p>
                    <p className="text-xs text-[var(--brand-muted)]">{item.value} records</p>
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

