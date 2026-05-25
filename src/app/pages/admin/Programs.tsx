import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { apiRequest } from '../../utils/api';
import { type Program as LocalProgram } from '../../utils/mockAdminData';
import { type Program as BackendProgram } from '../../utils/programApi';
import { canManagePrograms } from '../../utils/adminAuth';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function AdminPrograms() {
  const [programs, setProgramsState] = useState<LocalProgram[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<LocalProgram | null>(null);
  const [programToDelete, setProgramToDelete] = useState<LocalProgram | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const emptyProgram: Omit<LocalProgram, 'id'> = {
    name: '',
    category: 'student',
    location: '',
    startDate: '',
    endDate: '',
    status: 'coming-soon',
    deadline: '',
    description: '',
    imageUrl: ''
  };

  const [formData, setFormData] = useState<Omit<LocalProgram, 'id'>>(emptyProgram);

  useEffect(() => {
    void loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const progs = await apiRequest<BackendProgram[]>('/admin/programs');
      const mapped = progs.map((program) => ({
        id: program.id,
        name: program.title,
        category: program.category,
        location: program.location || '',
        startDate: program.deadline || '',
        endDate: program.deadline || '',
        status:
          program.status === 'coming_soon'
            ? 'coming-soon'
            : program.status,
        deadline: program.deadline || '',
        description: program.summary || '',
        imageUrl: program.image || '',
      })) as LocalProgram[];
      setProgramsState(mapped);
    } catch (error) {
      console.error('Failed to load programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData(emptyProgram);
    setEditingProgram(null);
    setImagePreview('');
    setShowModal(true);
  };

  const handleEdit = (program: LocalProgram) => {
    setFormData(program);
    setEditingProgram(program);
    setImagePreview(program.imageUrl || '');
    setShowModal(true);
  };

  const handleDeleteClick = (program: LocalProgram) => {
    setProgramToDelete(program);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (programToDelete) {
      try {
        setDeleting(true);
        await apiRequest(`/admin/programs/${programToDelete.id}`, { method: 'DELETE' });
        await loadPrograms();
        setShowDeleteConfirm(false);
        setProgramToDelete(null);
      } catch (error) {
        console.error('Failed to delete program:', error);
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.location || !formData.startDate || !formData.endDate || !formData.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    const payload = {
      slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
      category: formData.category,
      title: formData.name,
      location: formData.location,
      deadline: formData.deadline,
      status: formData.status === 'coming-soon' ? 'coming_soon' : formData.status,
      summary: formData.description || '',
      image: formData.imageUrl || '',
      availability: 'By request',
    };

    try {
      setSaving(true);
      if (editingProgram) {
        await apiRequest(`/admin/programs/${editingProgram.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest('/admin/programs', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      await loadPrograms();
      setShowModal(false);
      setFormData(emptyProgram);
      setEditingProgram(null);
      setImagePreview('');
    } catch (error) {
      console.error('Failed to save program:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setFormData((current) => ({
        ...current,
        imageUrl: result
      }));
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'accepting': 'bg-[#10B981] text-white',
      'coming-soon': 'bg-[#F59E0B] text-white',
      'full': 'bg-[#F71C56] text-white',
      'closed': 'bg-[#6B7280] text-white'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-200 text-gray-800';
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bold text-[32px] text-[#0A1C3A] mb-2">Manage Programs Calendar</h1>
          {!canManagePrograms() && (
            <p className="text-sm text-[#737576]">You have read-only access to programs</p>
          )}
        </div>
        {canManagePrograms() && (
          <button
            onClick={handleAdd}
            className="bg-[#F71C56] text-white font-bold px-6 py-3 rounded hover:brightness-110 transition-all inline-flex items-center gap-2 uppercase tracking-wider"
          >
            <Plus className="w-5 h-5" /> Add New Program
          </button>
        )}
      </div>

      {/* Programs Table */}
      <div className="bg-white border border-[#e6bcbf]" style={{ clipPath: 'polygon(0 0, 99% 0, 100% 1%, 100% 100%, 1% 100%, 0 99%)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f7fafd] border-b border-[#e6bcbf]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Program Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6bcbf]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10">
                    <div className="space-y-4 animate-pulse">
                      <div className="h-4 w-40 bg-slate-200 rounded" />
                      <div className="h-12 bg-slate-100 rounded" />
                      <div className="h-12 bg-slate-100 rounded" />
                    </div>
                  </td>
                </tr>
              ) : programs.map((program) => (
                <tr key={program.id} className="hover:bg-[#f7fafd] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[#0A1C3A]">{program.name}</td>
                  <td className="px-6 py-4 text-sm text-[#737576] capitalize">{program.category}</td>
                  <td className="px-6 py-4 text-sm text-[#737576]">{program.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#737576]">{program.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#737576]">{program.endDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded ${getStatusBadge(program.status)}`}>
                      {program.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#737576]">{program.deadline}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {canManagePrograms() ? (
                      <>
                    <button
                      onClick={() => handleEdit(program)}
                      className="text-[#F71C56] hover:underline mr-3 inline-flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(program)}
                          className="text-[#737576] hover:text-red-600 inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </>
                    ) : (
                      <span className="text-[#737576] text-xs">View only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && programs.length === 0 && (
          <div className="p-12 text-center text-[#737576]">
            <p className="font-bold mb-2">No programs found</p>
            <p className="text-sm">Click "Add New Program" to create one</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1C3A]/55 backdrop-blur-sm px-4">
          <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" style={{ clipPath: 'polygon(0 0, 99% 0, 100% 1%, 100% 100%, 1% 100%, 0 99%)' }}>
            {/* Modal Header */}
            <div className="bg-[#F71C56] text-white p-6 flex justify-between items-center sticky top-0 z-10">
              <h2 className="font-bold text-xl">{editingProgram ? 'Edit Program' : 'Add New Program'}</h2>
              <button onClick={() => setShowModal(false)} className="hover:opacity-80">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#0A1C3A] mb-2">
                    Program Name <span className="text-[#F71C56]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56]"
                    placeholder="e.g., Urban Innovation Lab"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0A1C3A] mb-2">
                    Category <span className="text-[#F71C56]">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56]"
                  >
                    <option value="student">Student Mobility</option>
                    <option value="professional">Professional Fellowship</option>
                    <option value="institutional">Institutional Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0A1C3A] mb-2">
                    Location <span className="text-[#F71C56]">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56]"
                    placeholder="e.g., Nairobi, Kenya"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0A1C3A] mb-2">
                    Start Date <span className="text-[#F71C56]">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0A1C3A] mb-2">
                    End Date <span className="text-[#F71C56]">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0A1C3A] mb-2">
                    Status <span className="text-[#F71C56]">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56]"
                  >
                    <option value="accepting">Accepting Applications</option>
                    <option value="coming-soon">Coming Soon</option>
                    <option value="full">Full</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0A1C3A] mb-2">
                    Application Deadline <span className="text-[#F71C56]">*</span>
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56] resize-none"
                    placeholder="Brief description of the program..."
                  />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Upload Program Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-4 py-2 border border-[#cbcdd1] rounded bg-white focus:outline-none focus:border-[#F71C56]"
                    />
                    <p className="mt-2 text-xs text-[#737576]">
                      Upload an image to use as the program visual. A pasted image URL still works as a fallback.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#0A1C3A] mb-2">Image URL</label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => {
                        handleChange(e);
                        setImagePreview(e.target.value);
                      }}
                      className="w-full px-4 py-2 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56]"
                      placeholder="https://example.com/image.jpg (optional)"
                    />
                  </div>

                  {imagePreview && (
                    <div
                      className="bg-[#f7fafd] border border-[#e6bcbf] p-3"
                      style={{ clipPath: 'polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)' }}
                    >
                      <p className="text-xs font-bold uppercase tracking-wider text-[#0A1C3A] mb-3">
                        Image Preview
                      </p>
                      <img
                        src={imagePreview}
                        alt="Program preview"
                        className="w-full h-48 object-cover bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#e6bcbf] flex justify-between">
              <div>
                {editingProgram && (
                  <button
                    onClick={() => handleDeleteClick(editingProgram)}
                    className="border-2 border-red-600 text-red-600 px-6 py-3 rounded hover:bg-red-600 hover:text-white transition-all font-bold uppercase tracking-wider"
                  >
                    Delete Program
                  </button>
                )}
              </div>
              <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="border-2 border-[#737576] text-[#737576] px-6 py-3 rounded hover:bg-[#737576] hover:text-white transition-all font-bold uppercase tracking-wider"
                disabled={saving || deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-[#F71C56] text-white px-6 py-3 rounded hover:brightness-110 transition-all font-bold uppercase tracking-wider disabled:opacity-60"
                disabled={saving || deleting}
              >
                  {saving ? 'Saving...' : editingProgram ? 'Save Changes' : 'Create Program'}
              </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && programToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1C3A]/55 backdrop-blur-sm px-4">
          <div className="bg-white max-w-md w-full p-8 shadow-2xl" style={{ clipPath: 'polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)' }}>
            <h3 className="font-bold text-xl text-[#0A1C3A] mb-4">Confirm Delete</h3>
            <p className="text-[#737576] mb-6">
              Are you sure you want to delete <strong>{programToDelete.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="border-2 border-[#737576] text-[#737576] px-6 py-3 rounded hover:bg-[#737576] hover:text-white transition-all font-bold uppercase tracking-wider"
                disabled={saving || deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-600 text-white px-6 py-3 rounded hover:brightness-110 transition-all font-bold uppercase tracking-wider disabled:opacity-60"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
