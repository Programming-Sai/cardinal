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
      new: 'bg-[#F71C56] text-white',
      reviewed: 'bg-[#F59E0B] text-white',
      contacted: 'bg-[#3B82F6] text-white',
      partnered: 'bg-[#10B981] text-white',
      closed: 'bg-[#6B7280] text-white'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-200 text-gray-800';
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
          <h1 className="font-bold text-[32px] text-[#0A1C3A]">Institutional Inquiries</h1>
          <span className="bg-[#F71C56] text-white px-3 py-1 rounded font-bold">
            {filteredInquiries.length}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-6 border border-[#e6bcbf] mb-6" style={{ clipPath: 'polygon(0 0, 99% 0, 100% 1%, 100% 100%, 1% 100%, 0 99%)' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Organization Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56]"
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
            <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56]"
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
            <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-[#737576]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Organization or contact"
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
              checked={selectedIds.length === filteredInquiries.length && filteredInquiries.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4"
            />
            <span className="text-sm font-bold text-[#0A1C3A]">
              Select All ({selectedIds.length} selected)
            </span>
          </label>
        </div>
        <div className="flex items-center gap-3">
          {canExport() && (
            <button
              onClick={() => alert('Export inquiries to console')}
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
                  <input type="checkbox" className="w-4 h-4" onChange={toggleSelectAll} checked={selectedIds.length === filteredInquiries.length && filteredInquiries.length > 0} />
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Contact Person</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Interest</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6bcbf]">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-4 bg-slate-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-40 bg-slate-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-28 bg-slate-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-200 rounded" /></td>
                  </tr>
                ))
              ) : filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-[#f7fafd] transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(inquiry.id)}
                      onChange={() => toggleSelect(inquiry.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0A1C3A]">{inquiry.organizationName}</td>
                  <td className="px-6 py-4 text-sm text-[#737576]">{inquiry.contactName}</td>
                  <td className="px-6 py-4 text-sm text-[#737576]">{inquiry.contactEmail}</td>
                  <td className="px-6 py-4 text-sm text-[#737576]">{getInterestLabel(inquiry.interests)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#737576]">{inquiry.submittedDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded ${getStatusBadge(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleView(inquiry)}
                      className="text-[#F71C56] hover:underline mr-3 inline-flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    {canDelete() && (
                      <button
                        onClick={() => handleDelete(inquiry.id)}
                        className="text-[#737576] hover:text-red-600 inline-flex items-center gap-1 disabled:opacity-60"
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
          <div className="p-12 text-center text-[#737576]">
            <p className="font-bold mb-2">No inquiries found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* View/Edit Modal */}
      {showModal && selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1C3A]/55 backdrop-blur-sm px-4">
          <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" style={{ clipPath: 'polygon(0 0, 99% 0, 100% 1%, 100% 100%, 1% 100%, 0 99%)' }}>
            {/* Modal Header */}
            <div className="bg-[#F71C56] text-white p-6 flex justify-between items-center sticky top-0 z-10">
              <h2 className="font-bold text-xl">Inquiry Details</h2>
              <button onClick={() => setShowModal(false)} className="hover:opacity-80">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              <div>
                <h3 className="font-bold text-lg text-[#0A1C3A] mb-4 border-b border-[#e6bcbf] pb-2">Organization Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Organization Name</label>
                    <p className="text-[#737576]">{selectedInquiry.organizationName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Type</label>
                    <p className="text-[#737576] capitalize">{selectedInquiry.organizationType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Country</label>
                    <p className="text-[#737576]">{selectedInquiry.organizationCountry}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Website</label>
                    <p className="text-[#737576]">{selectedInquiry.website || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg text-[#0A1C3A] mb-4 border-b border-[#e6bcbf] pb-2">Contact Person</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Name</label>
                    <p className="text-[#737576]">{selectedInquiry.contactName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Title</label>
                    <p className="text-[#737576]">{selectedInquiry.contactTitle}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Email</label>
                    <p className="text-[#737576]">{selectedInquiry.contactEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Phone</label>
                    <p className="text-[#737576]">{selectedInquiry.contactPhone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg text-[#0A1C3A] mb-4 border-b border-[#e6bcbf] pb-2">Partnership Interest</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Interests</label>
                    <p className="text-[#737576]">{getInterestLabel(selectedInquiry.interests)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Cohort Size</label>
                    <p className="text-[#737576]">{selectedInquiry.cohortSize}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Timeline</label>
                    <p className="text-[#737576]">{selectedInquiry.timeline}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Submitted</label>
                    <p className="text-[#737576]">{selectedInquiry.submittedDate}</p>
                  </div>
                </div>
              </div>

              {selectedInquiry.additionalInfo && (
                <div>
                  <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Additional Information</label>
                  <p className="text-[#737576] leading-7 bg-[#f7fafd] p-4 border border-[#e6bcbf]">
                    {selectedInquiry.additionalInfo}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Status</label>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => setSelectedInquiry({ ...selectedInquiry, status: e.target.value as any })}
                  disabled={!canUpdateStatus()}
                  className="w-full px-4 py-2 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="contacted">Contacted</option>
                  <option value="partnered">Partnered</option>
                  <option value="closed">Closed</option>
                </select>
                {!canUpdateStatus() && (
                  <p className="text-xs text-[#737576] mt-1">Viewers cannot update status</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Internal Notes</label>
                <textarea
                  value={selectedInquiry.notes || ''}
                  onChange={(e) => setSelectedInquiry({ ...selectedInquiry, notes: e.target.value })}
                  disabled={!canUpdateStatus()}
                  rows={4}
                  className="w-full px-4 py-3 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56] resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Add internal notes about this inquiry..."
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
                  onClick={handleSaveInquiry}
                  className="bg-[#F71C56] text-white px-6 py-3 rounded hover:brightness-110 transition-all font-bold uppercase tracking-wider disabled:opacity-60"
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
