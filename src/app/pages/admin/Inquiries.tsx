import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { apiRequest } from '../../utils/api';
import type { Inquiry } from '../../utils/mockAdminData';
import { canUpdateStatus, canDelete, canExport } from '../../utils/adminAuth';
import { Search, X, Eye, Trash2 } from 'lucide-react';

export default function AdminInquiries() {
  const [inquiries, setInquiriesState] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadInquiries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [inquiries, typeFilter, statusFilter, searchQuery]);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<{ items: Inquiry[] }>('/admin/inquiries?limit=200');
      setInquiriesState(data.items);
    } catch (error) {
      console.error('Failed to load inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...inquiries];

    if (typeFilter !== 'all') {
      filtered = filtered.filter(i => i.organizationType === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(i => i.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(i =>
        i.organizationName.toLowerCase().includes(query) ||
        i.contactEmail.toLowerCase().includes(query) ||
        i.contactName.toLowerCase().includes(query)
      );
    }

    setFilteredInquiries(filtered);
  };

  const clearFilters = () => {
    setTypeFilter('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  const handleView = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      try {
        setDeletingId(id);
        await apiRequest(`/admin/inquiries/${id}`, { method: 'DELETE' });
        await loadInquiries();
      } catch (error) {
        console.error('Failed to delete inquiry:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleSaveInquiry = async () => {
    if (selectedInquiry) {
      try {
        setSaving(true);
        await apiRequest(`/admin/inquiries/${selectedInquiry.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            status: selectedInquiry.status,
            internalNotes: selectedInquiry.notes || '',
          }),
        });
        setShowModal(false);
        setSelectedInquiry(null);
        await loadInquiries();
      } catch (error) {
        console.error('Failed to save inquiry:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredInquiries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredInquiries.map(i => i.id));
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      new: 'bg-[var(--brand-red)] text-white',
      reviewed: 'bg-[var(--brand-blue)] text-white',
      contacted: 'bg-[var(--brand-cyan)] text-[var(--brand-navy)]',
      partnered: 'bg-[var(--brand-navy)] text-white',
      closed: 'bg-[var(--brand-blue-soft)] text-[var(--brand-navy)]'
    };
    return badges[status as keyof typeof badges] || 'bg-[var(--brand-surface-alt)] text-[var(--brand-navy)]';
  };

  const getInterestLabel = (interests: string[]) => {
    const labels = {
      send: 'Send',
      codesign: 'Co-design',
      host: 'Host',
      faculty: 'Faculty',
      other: 'Other'
    };
    return interests.map(i => labels[i as keyof typeof labels] || i).join(', ');
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-[32px] text-[var(--brand-navy)]">Institutional Inquiries</h1>
          <span className="bg-[var(--brand-red)] text-white px-3 py-1 rounded font-bold">
            {filteredInquiries.length}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-6 border border-[var(--brand-border)] mb-6 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">Organization Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)]"
            >
              <option value="all">All Types</option>
              <option value="university">University</option>
              <option value="college">College</option>
              <option value="professional">Professional Body</option>
              <option value="ngo">NGO</option>
              <option value="government">Government</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)]"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="contacted">Contacted</option>
              <option value="partnered">Partnered</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-[var(--brand-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Organization or contact"
                className="w-full pl-10 pr-4 py-2 border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)]"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full text-[var(--brand-red)] hover:underline font-bold"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <div className="bg-[var(--brand-surface)] p-4 border border-[var(--brand-border)] mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedIds.length === filteredInquiries.length && filteredInquiries.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4"
            />
            <span className="text-sm font-bold text-[var(--brand-navy)]">
              Select All ({selectedIds.length} selected)
            </span>
          </label>
        </div>
        <div className="flex items-center gap-3">
          {canExport() && (
            <button
              onClick={() => alert('Export inquiries to console')}
              className="border-2 border-[var(--brand-red)] text-[var(--brand-red)] px-4 py-2 rounded hover:bg-[var(--brand-red)] hover:text-white transition-all text-sm font-bold uppercase tracking-wider"
            >
              Export {selectedIds.length > 0 ? 'Selected' : 'All'}
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-[var(--brand-border)] rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--brand-surface)] border-b border-[var(--brand-border)]">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="w-4 h-4" onChange={toggleSelectAll} checked={selectedIds.length === filteredInquiries.length && filteredInquiries.length > 0} />
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[var(--brand-navy)] uppercase tracking-wider">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[var(--brand-navy)] uppercase tracking-wider">Contact Person</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[var(--brand-navy)] uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[var(--brand-navy)] uppercase tracking-wider">Interest</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[var(--brand-navy)] uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[var(--brand-navy)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[var(--brand-navy)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--brand-border)]">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-4 bg-[var(--brand-surface-alt)] rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-[var(--brand-surface-alt)] rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-[var(--brand-surface-alt)] rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-40 bg-[var(--brand-surface-alt)] rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-28 bg-[var(--brand-surface-alt)] rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-[var(--brand-surface-alt)] rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-[var(--brand-surface-alt)] rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-[var(--brand-surface-alt)] rounded" /></td>
                  </tr>
                ))
              ) : filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-[var(--brand-surface)] transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(inquiry.id)}
                      onChange={() => toggleSelect(inquiry.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--brand-navy)]">{inquiry.organizationName}</td>
                  <td className="px-6 py-4 text-sm text-[var(--brand-muted)]">{inquiry.contactName}</td>
                  <td className="px-6 py-4 text-sm text-[var(--brand-muted)]">{inquiry.contactEmail}</td>
                  <td className="px-6 py-4 text-sm text-[var(--brand-muted)]">{getInterestLabel(inquiry.interests)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-muted)]">{inquiry.submittedDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded ${getStatusBadge(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleView(inquiry)}
                      className="text-[var(--brand-red)] hover:underline mr-3 inline-flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    {canDelete() && (
                      <button
                        onClick={() => handleDelete(inquiry.id)}
                        className="text-[var(--brand-muted)] hover:text-[var(--brand-red)] inline-flex items-center gap-1 disabled:opacity-60"
                        disabled={deletingId === inquiry.id}
                      >
                        <Trash2 className="w-4 h-4" /> {deletingId === inquiry.id ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && filteredInquiries.length === 0 && (
          <div className="p-12 text-center text-[var(--brand-muted)]">
            <p className="font-bold mb-2">No inquiries found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* View/Edit Modal */}
      {showModal && selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--brand-navy)]/55 backdrop-blur-sm px-4">
          <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl rounded-2xl">
            {/* Modal Header */}
            <div className="bg-[var(--brand-red)] text-white p-6 flex justify-between items-center sticky top-0 z-10">
              <h2 className="font-bold text-xl">Inquiry Details</h2>
              <button onClick={() => setShowModal(false)} className="hover:opacity-80">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              <div>
                <h3 className="font-bold text-lg text-[var(--brand-navy)] mb-4 border-b border-[var(--brand-border)] pb-2">Organization Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">Organization Name</label>
                    <p className="text-[var(--brand-muted)]">{selectedInquiry.organizationName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">Type</label>
                    <p className="text-[var(--brand-muted)] capitalize">{selectedInquiry.organizationType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">Country</label>
                    <p className="text-[var(--brand-muted)]">{selectedInquiry.organizationCountry}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">Website</label>
                    <p className="text-[var(--brand-muted)]">{selectedInquiry.website || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg text-[var(--brand-navy)] mb-4 border-b border-[var(--brand-border)] pb-2">Contact Person</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">Name</label>
                    <p className="text-[var(--brand-muted)]">{selectedInquiry.contactName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">Title</label>
                    <p className="text-[var(--brand-muted)]">{selectedInquiry.contactTitle}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">Email</label>
                    <p className="text-[var(--brand-muted)]">{selectedInquiry.contactEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">Phone</label>
                    <p className="text-[var(--brand-muted)]">{selectedInquiry.contactPhone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg text-[var(--brand-navy)] mb-4 border-b border-[var(--brand-border)] pb-2">Partnership Interest</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">Interests</label>
                    <p className="text-[var(--brand-muted)]">{getInterestLabel(selectedInquiry.interests)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">Cohort Size</label>
                    <p className="text-[var(--brand-muted)]">{selectedInquiry.cohortSize}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">Timeline</label>
                    <p className="text-[var(--brand-muted)]">{selectedInquiry.timeline}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">Submitted</label>
                    <p className="text-[var(--brand-muted)]">{selectedInquiry.submittedDate}</p>
                  </div>
                </div>
              </div>

              {selectedInquiry.additionalInfo && (
                <div>
                  <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">Additional Information</label>
                  <p className="text-[var(--brand-muted)] leading-7 bg-[var(--brand-surface)] p-4 border border-[var(--brand-border)]">
                    {selectedInquiry.additionalInfo}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">Status</label>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => setSelectedInquiry({ ...selectedInquiry, status: e.target.value as any })}
                  disabled={!canUpdateStatus()}
                  className="w-full px-4 py-2 border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] disabled:bg-[var(--brand-surface-alt)] disabled:cursor-not-allowed"
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="contacted">Contacted</option>
                  <option value="partnered">Partnered</option>
                  <option value="closed">Closed</option>
                </select>
                {!canUpdateStatus() && (
                  <p className="text-xs text-[var(--brand-muted)] mt-1">Viewers cannot update status</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">Internal Notes</label>
                <textarea
                  value={selectedInquiry.notes || ''}
                  onChange={(e) => setSelectedInquiry({ ...selectedInquiry, notes: e.target.value })}
                  disabled={!canUpdateStatus()}
                  rows={4}
                  className="w-full px-4 py-3 border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] resize-none disabled:bg-[var(--brand-surface-alt)] disabled:cursor-not-allowed"
                  placeholder="Add internal notes about this inquiry..."
                />
                {!canUpdateStatus() && (
                  <p className="text-xs text-[var(--brand-muted)] mt-1">Viewers cannot add notes</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[var(--brand-border)] flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="border-2 border-[var(--brand-muted)] text-[var(--brand-muted)] px-6 py-3 rounded hover:bg-[var(--brand-muted)] hover:text-white transition-all font-bold uppercase tracking-wider"
              >
                {canUpdateStatus() ? 'Cancel' : 'Close'}
              </button>
              {canUpdateStatus() && (
                <button
                  onClick={handleSaveInquiry}
                  className="bg-[var(--brand-red)] text-white px-6 py-3 rounded hover:brightness-110 transition-all font-bold uppercase tracking-wider disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

