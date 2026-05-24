import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getApplications, setApplications, Application } from '../../utils/mockAdminData';
import { canUpdateStatus, canDelete, canExport } from '../../utils/adminAuth';
import { Search, X, Eye, Trash2 } from 'lucide-react';

export default function AdminApplications() {
  const [applications, setApplicationsState] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filters
  const [programFilter, setProgramFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applications, programFilter, statusFilter, searchQuery]);

  const loadApplications = () => {
    const apps = getApplications();
    setApplicationsState(apps);
  };

  const applyFilters = () => {
    let filtered = [...applications];

    if (programFilter !== 'all') {
      filtered = filtered.filter(a => a.programType === programFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query)
      );
    }

    setFilteredApplications(filtered);
  };

  const clearFilters = () => {
    setProgramFilter('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  const handleView = (app: Application) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      const updated = applications.filter(a => a.id !== id);
      setApplications(updated);
      setApplicationsState(updated);
    }
  };

  const handleBulkUpdate = () => {
    if (selectedIds.length === 0) {
      return;
    }
    const newStatus = prompt('Enter new status (new, reviewed, accepted, rejected):');
    if (newStatus && ['new', 'reviewed', 'accepted', 'rejected'].includes(newStatus)) {
      const updated = applications.map(a =>
        selectedIds.includes(a.id) ? { ...a, status: newStatus as any } : a
      );
      setApplications(updated);
      setApplicationsState(updated);
      setSelectedIds([]);
    }
  };

  const handleExport = () => {
    const data = selectedIds.length > 0
      ? applications.filter(a => selectedIds.includes(a.id))
      : filteredApplications;
    console.log('Exporting:', data);
    // Toast handled in component
  };

  const handleSaveApplication = () => {
    if (selectedApp) {
      const updated = applications.map(a =>
        a.id === selectedApp.id ? selectedApp : a
      );
      setApplications(updated);
      setApplicationsState(updated);
      setShowModal(false);
      setSelectedApp(null);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredApplications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApplications.map(a => a.id));
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      new: 'bg-[#F71C56] text-white',
      reviewed: 'bg-[#F59E0B] text-white',
      accepted: 'bg-[#10B981] text-white',
      rejected: 'bg-[#6B7280] text-white'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-200 text-gray-800';
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-[32px] text-[#0A1C3A]">Individual Applications</h1>
          <span className="bg-[#F71C56] text-white px-3 py-1 rounded font-bold">
            {filteredApplications.length}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-6 border border-[#e6bcbf] mb-6" style={{ clipPath: 'polygon(0 0, 99% 0, 100% 1%, 100% 100%, 1% 100%, 0 99%)' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Program Type</label>
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="w-full px-4 py-2 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56]"
            >
              <option value="all">All Programs</option>
              <option value="student">Student Mobility</option>
              <option value="professional">Professional Fellowship</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56]"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-[#737576]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name or email"
                className="w-full pl-10 pr-4 py-2 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56]"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full text-[#F71C56] hover:underline font-bold"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <div className="bg-[#f7fafd] p-4 border border-[#e6bcbf] mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedIds.length === filteredApplications.length && filteredApplications.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4"
            />
            <span className="text-sm font-bold text-[#0A1C3A]">
              Select All ({selectedIds.length} selected)
            </span>
          </label>
        </div>
        <div className="flex items-center gap-3">
          {canUpdateStatus() && (
            <button
              onClick={handleBulkUpdate}
              disabled={selectedIds.length === 0}
              className="border-2 border-[#0A1C3A] text-[#0A1C3A] px-4 py-2 rounded hover:bg-[#0A1C3A] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold uppercase tracking-wider"
            >
              Bulk Update Status
            </button>
          )}
          {canExport() && (
            <button
              onClick={() => {
                handleExport();
                const data = selectedIds.length > 0
                  ? applications.filter(a => selectedIds.includes(a.id))
                  : filteredApplications;
                alert(`Export: ${data.length} applications exported to console`);
              }}
              className="border-2 border-[#F71C56] text-[#F71C56] px-4 py-2 rounded hover:bg-[#F71C56] hover:text-white transition-all text-sm font-bold uppercase tracking-wider"
            >
              Export {selectedIds.length > 0 ? 'Selected' : 'All'}
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-[#e6bcbf]" style={{ clipPath: 'polygon(0 0, 99% 0, 100% 1%, 100% 100%, 1% 100%, 0 99%)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f7fafd] border-b border-[#e6bcbf]">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="w-4 h-4" onChange={toggleSelectAll} checked={selectedIds.length === filteredApplications.length && filteredApplications.length > 0} />
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Program</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6bcbf]">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-[#f7fafd] transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(app.id)}
                      onChange={() => toggleSelect(app.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0A1C3A]">{app.name}</td>
                  <td className="px-6 py-4 text-sm text-[#737576]">{app.email}</td>
                  <td className="px-6 py-4 text-sm text-[#737576]">{app.program}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#737576]">{app.submittedDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleView(app)}
                      className="text-[#F71C56] hover:underline mr-3 inline-flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    {canDelete() && (
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-[#737576] hover:text-red-600 inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="p-12 text-center text-[#737576]">
            <p className="font-bold mb-2">No applications found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* View/Edit Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1C3A]/55 backdrop-blur-sm px-4">
          <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" style={{ clipPath: 'polygon(0 0, 99% 0, 100% 1%, 100% 100%, 1% 100%, 0 99%)' }}>
            {/* Modal Header */}
            <div className="bg-[#F71C56] text-white p-6 flex justify-between items-center sticky top-0 z-10">
              <h2 className="font-bold text-xl">Application Details</h2>
              <button onClick={() => setShowModal(false)} className="hover:opacity-80">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Full Name</label>
                  <p className="text-[#737576]">{selectedApp.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Email</label>
                  <p className="text-[#737576]">{selectedApp.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Institution/Employer</label>
                  <p className="text-[#737576]">{selectedApp.institution}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Country</label>
                  <p className="text-[#737576]">{selectedApp.country}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Phone</label>
                  <p className="text-[#737576]">{selectedApp.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Submitted Date</label>
                  <p className="text-[#737576]">{selectedApp.submittedDate}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Program</label>
                <p className="text-[#737576]">{selectedApp.program}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Motivation Statement</label>
                <p className="text-[#737576] leading-7 bg-[#f7fafd] p-4 border border-[#e6bcbf]">
                  {selectedApp.motivation}
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Status</label>
                <select
                  value={selectedApp.status}
                  onChange={(e) => setSelectedApp({ ...selectedApp, status: e.target.value as any })}
                  disabled={!canUpdateStatus()}
                  className="w-full px-4 py-2 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                {!canUpdateStatus() && (
                  <p className="text-xs text-[#737576] mt-1">Viewers cannot update status</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Internal Notes</label>
                <textarea
                  value={selectedApp.notes || ''}
                  onChange={(e) => setSelectedApp({ ...selectedApp, notes: e.target.value })}
                  disabled={!canUpdateStatus()}
                  rows={4}
                  className="w-full px-4 py-3 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56] resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Add internal notes about this application..."
                />
                {!canUpdateStatus() && (
                  <p className="text-xs text-[#737576] mt-1">Viewers cannot add notes</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#e6bcbf] flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="border-2 border-[#737576] text-[#737576] px-6 py-3 rounded hover:bg-[#737576] hover:text-white transition-all font-bold uppercase tracking-wider"
              >
                {canUpdateStatus() ? 'Cancel' : 'Close'}
              </button>
              {canUpdateStatus() && (
                <button
                  onClick={handleSaveApplication}
                  className="bg-[#F71C56] text-white px-6 py-3 rounded hover:brightness-110 transition-all font-bold uppercase tracking-wider"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
