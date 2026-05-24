import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAdmins, addAdmin, updateAdmin, deleteAdmin, isSuperAdmin, getCurrentAdmin, Admin, getRoleBadgeClass, getRoleDisplayName } from '../../utils/adminAuth';
import { Plus, Edit, Trash2, X, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export default function AdminManagement() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [shouldInvite, setShouldInvite] = useState(false);
  const [error, setError] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [requiredConfirmation, setRequiredConfirmation] = useState('');
  const [pendingMutation, setPendingMutation] = useState<{
    title: string;
    summary: string;
    details: string[];
    confirmLabel: string;
    run: () => void;
    reopenFormOnCancel: boolean;
  } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastIdCounter, setToastIdCounter] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const emptyForm = {
    email: '',
    fullName: '',
    role: 'admin' as Admin['role'],
    password: ''
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    // Check if user is super_admin
    if (!isSuperAdmin()) {
      navigate('/admin/dashboard');
      return;
    }

    const current = getCurrentAdmin();
    setCurrentAdmin(current);
    loadAdmins();
  }, [navigate]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showDropdown]);

  const loadAdmins = () => {
    // TODO: Replace with API call to GET /api/admins
    const adminsList = getAdmins();
    setAdmins(adminsList);
  };

  const showToast = (message: string, type: ToastType) => {
    const newToast: Toast = {
      id: toastIdCounter,
      message,
      type
    };
    setToastIdCounter(prev => prev + 1);
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4000);
  };

  const generateConfirmationCode = (label: string, subject: string) => {
    const makeChunk = () => Math.random().toString(36).substring(2, 7).toUpperCase();
    const cleanLabel = label.replace(/\s+/g, '-').toUpperCase();
    const cleanSubject = subject.replace(/[^A-Z0-9]+/gi, '-').toUpperCase();
    return [cleanLabel || 'ADM', cleanSubject || 'VERIFY', makeChunk(), makeChunk(), makeChunk(), makeChunk()].join('-');
  };

  const openMutationConfirm = (
    title: string,
    summary: string,
    details: string[],
    confirmLabel: string,
    run: () => void,
    reopenFormOnCancel = false
  ) => {
    setRequiredConfirmation(generateConfirmationCode(title, summary));
    setConfirmationText('');
    setPendingMutation({
      title,
      summary,
      details,
      confirmLabel,
      run,
      reopenFormOnCancel
    });
  };

  const handleAdd = (withInvite: boolean) => {
    setFormData(emptyForm);
    setEditingAdmin(null);
    setError('');
    setShouldInvite(withInvite);
    setShowDropdown(false);
    setShowModal(true);
  };

  const handleEdit = (admin: Admin) => {
    setFormData({
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role,
      password: ''
    });
    setEditingAdmin(admin);
    setError('');
    setShouldInvite(false);
    setShowModal(true);
  };

  const handleDeleteClick = (admin: Admin) => {
    openMutationConfirm(
      'Confirm Admin Deletion',
      admin.fullName,
      [
        `Email: ${admin.email}`,
        `Role: ${getRoleDisplayName(admin.role)}`,
        'This action will remove the admin account from local storage.'
      ],
      'Confirm Delete',
      () => {
        deleteAdmin(admin.id);
        showToast(`Admin ${admin.fullName} deleted successfully`, 'success');
        loadAdmins();
      }
    );
  };

  const handleSave = () => {
    setError('');

    if (!formData.email || !formData.fullName || !formData.role) {
      setError('Please fill in all required fields');
      return;
    }

    setShowModal(false);
    openMutationConfirm(
      editingAdmin ? 'Confirm Admin Update' : 'Confirm Admin Creation',
      formData.fullName,
      [
        `Email: ${formData.email}`,
        `Role: ${getRoleDisplayName(formData.role)}`,
        shouldInvite ? 'Invite email will be sent after creation.' : 'No invite email will be sent.'
      ],
      editingAdmin ? 'Confirm Update' : 'Confirm Create',
      proceedWithSave,
      true
    );
  };

  const proceedWithSave = () => {
    try {
      if (editingAdmin) {
        // Update existing
        // TODO: Replace with API call to PUT /api/admins/:id
        updateAdmin(editingAdmin.id, {
          email: formData.email,
          fullName: formData.fullName,
          role: formData.role
        });
        showToast(`Admin ${formData.fullName} updated successfully`, 'success');
      } else {
        // Add new
        // TODO: Replace with API call to POST /api/admins + optionally send invite via Resend
        addAdmin(formData.email, formData.fullName, formData.role);

        if (shouldInvite) {
          // TODO: Send invite email via Resend
          showToast(
            `Admin created and invite sent to ${formData.email}. In production, this will use Resend.`,
            'success'
          );
        } else {
          showToast(
            `Admin ${formData.fullName} created. They can log in with email: ${formData.email}`,
            'success'
          );
        }
      }

      loadAdmins();
      setShowModal(false);
      setFormData(emptyForm);
      setEditingAdmin(null);
      setConfirmationText('');
      setPendingMutation(null);
      setShouldInvite(false);
    } catch (err) {
      setError((err as Error).message);
      showToast((err as Error).message, 'error');
    }
  };

  const handleRoleConfirmation = () => {
    if (confirmationText !== requiredConfirmation) {
      showToast('Confirmation code does not match. Please try again.', 'error');
      return;
    }
    try {
      pendingMutation?.run();
      setPendingMutation(null);
      setConfirmationText('');
      setShowModal(false);
    } catch (err) {
      showToast((err as Error).message, 'error');
      setPendingMutation(null);
    }
  };

  const handleSendInvite = (admin: Admin) => {
    openMutationConfirm(
      'Confirm Admin Invite',
      admin.fullName,
      [
        `Email: ${admin.email}`,
        `Role: ${getRoleDisplayName(admin.role)}`,
        'This will trigger an invitation email for the selected admin.'
      ],
      'Confirm Invite',
      () => {
        showToast(
          `Invite will be sent to ${admin.email}. In production, this will use Resend email service.`,
          'info'
        );
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      {/* Toast Container */}
      <div className="fixed top-24 right-8 z-50 space-y-3">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-6 py-4 rounded shadow-lg min-w-[300px] animate-slide-in ${
              toast.type === 'success' ? 'bg-green-600' :
              toast.type === 'error' ? 'bg-red-600' :
              'bg-blue-600'
            } text-white`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bold text-[32px] text-[#0A1C3A] mb-2">Admin Management</h1>
          <p className="text-[#737576]">Manage admin accounts and permissions</p>
        </div>

        {/* Dropdown Button */}
        <div className="relative dropdown-container">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-[#F71C56] text-white font-bold px-6 py-3 rounded hover:brightness-110 transition-all inline-flex items-center gap-2 uppercase tracking-wider"
          >
            <Plus className="w-5 h-5" /> Add New Admin
            <ChevronDown className="w-4 h-4" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#e6bcbf] shadow-lg z-10" style={{ clipPath: 'polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)' }}>
              <button
                onClick={() => handleAdd(false)}
                className="w-full text-left px-4 py-3 hover:bg-[#f7fafd] transition-colors text-[#0A1C3A] font-medium"
              >
                <div className="font-bold">Create Admin</div>
                <div className="text-xs text-[#737576]">Create without sending invite</div>
              </button>
              <div className="border-t border-[#e6bcbf]"></div>
              <button
                onClick={() => handleAdd(true)}
                className="w-full text-left px-4 py-3 hover:bg-[#f7fafd] transition-colors text-[#0A1C3A] font-medium"
              >
                <div className="font-bold">Create and Invite Admin</div>
                <div className="text-xs text-[#737576]">Create and send email invite</div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white border border-[#e6bcbf]" style={{ clipPath: 'polygon(0 0, 99% 0, 100% 1%, 100% 100%, 1% 100%, 0 99%)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f7fafd] border-b border-[#e6bcbf]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#0A1C3A] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6bcbf]">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-[#f7fafd] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[#0A1C3A]">{admin.fullName}</td>
                  <td className="px-6 py-4 text-sm text-[#737576]">{admin.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded ${getRoleBadgeClass(admin.role)}`}>
                      {getRoleDisplayName(admin.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#737576]">
                    {formatDate(admin.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#737576]">
                    {formatDate(admin.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(admin)}
                      className="text-[#F71C56] hover:underline mr-3 inline-flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    {currentAdmin?.id !== admin.id && (
                      <button
                        onClick={() => handleSendInvite(admin)}
                        className="text-[#0A1C3A] hover:underline mr-3 inline-flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" /> Invite
                      </button>
                    )}
                    {currentAdmin?.id !== admin.id && (
                      <button
                        onClick={() => handleDeleteClick(admin)}
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

        {admins.length === 0 && (
          <div className="p-12 text-center text-[#737576]">
            <p className="font-bold mb-2">No admins found</p>
            <p className="text-sm">Click "Add New Admin" to create one</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 p-6" style={{ clipPath: 'polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)' }}>
        <h3 className="font-bold text-[#0A1C3A] mb-3">Admin Roles & Permissions</h3>
        <div className="space-y-2 text-sm text-[#737576]">
          <div className="flex gap-3">
            <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider rounded ${getRoleBadgeClass('super_admin')}`}>
              Super Admin
            </span>
            <span>Full access: manage admins, delete applications, manage programs, export data</span>
          </div>
          <div className="flex gap-3">
            <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider rounded ${getRoleBadgeClass('admin')}`}>
              Admin
            </span>
            <span>Can update statuses, add notes, manage programs, export data (cannot manage other admins)</span>
          </div>
          <div className="flex gap-3">
            <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider rounded ${getRoleBadgeClass('viewer')}`}>
              Viewer
            </span>
            <span>Read-only access: view applications, inquiries, and programs (no editing)</span>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1C3A]/55 backdrop-blur-sm px-4">
          <div className="bg-white max-w-2xl w-full shadow-2xl" style={{ clipPath: 'polygon(0 0, 99% 0, 100% 1%, 100% 100%, 1% 100%, 0 99%)' }}>
            {/* Modal Header */}
            <div className="bg-[#F71C56] text-white p-6 flex justify-between items-center">
              <h2 className="font-bold text-xl">{editingAdmin ? 'Edit Admin' : 'Add New Admin'}</h2>
              <button onClick={() => setShowModal(false)} className="hover:opacity-80">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#0A1C3A] mb-2">
                    Full Name <span className="text-[#F71C56]">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56]"
                    placeholder="e.g., Dr. Sarah Mensah"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0A1C3A] mb-2">
                    Email Address <span className="text-[#F71C56]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56]"
                    placeholder="email@andylcc.com"
                    disabled={!!editingAdmin}
                  />
                  {editingAdmin && (
                    <p className="text-xs text-[#737576] mt-1">Email cannot be changed after creation</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0A1C3A] mb-2">
                    Role <span className="text-[#F71C56]">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56]"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  {!editingAdmin && (formData.role === 'super_admin' || formData.role === 'admin') && (
                    <p className="text-xs text-[#F59E0B] mt-1">This role will require confirmation before creation</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0A1C3A] mb-2">
                    {editingAdmin ? 'New Password (leave blank to keep current)' : 'Password'} {!editingAdmin && <span className="text-[#F71C56]">*</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pr-12 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56]"
                      placeholder={editingAdmin ? 'Leave blank to keep current' : 'Enter password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737576] hover:text-[#0A1C3A] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-[#737576] mt-1">
                    {editingAdmin
                      ? 'Change password only if needed. Production will use secure reset flow.'
                      : shouldInvite
                        ? 'Password will be sent in invite email (Production: via Resend)'
                        : 'Password for this account.'
                    }
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#e6bcbf] flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="border-2 border-[#737576] text-[#737576] px-6 py-3 rounded hover:bg-[#737576] hover:text-white transition-all font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-[#F71C56] text-white px-6 py-3 rounded hover:brightness-110 transition-all font-bold uppercase tracking-wider"
              >
                {editingAdmin ? 'Save Changes' : 'Create Admin'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mutation Confirmation Modal */}
      {pendingMutation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1C3A]/55 backdrop-blur-sm px-4">
          <div className="bg-white max-w-lg w-full p-8 shadow-2xl" style={{ clipPath: 'polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)' }}>
            <h3 className="font-bold text-xl text-[#0A1C3A] mb-4">{pendingMutation.title}</h3>

            <div className="bg-[#f7fafd] border border-[#e6bcbf] p-4 mb-6 text-sm text-[#0A1C3A]">
              <p className="font-bold mb-2">{pendingMutation.summary}</p>
              <div className="space-y-1 text-[#737576]">
                {pendingMutation.details.map((detail) => (
                  <p key={detail}>{detail}</p>
                ))}
              </div>
            </div>

            <p className="text-[#737576] mb-4">
              To confirm, type the code below exactly as shown. Copying is disabled for this token.
            </p>

            <div
              className="bg-[#f7fafd] border border-[#e6bcbf] p-3 mb-4 font-mono text-sm text-center select-none break-all"
              onCopy={(event) => event.preventDefault()}
              onContextMenu={(event) => event.preventDefault()}
              onDragStart={(event) => event.preventDefault()}
            >
              {requiredConfirmation}
            </div>

            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="w-full px-4 py-3 border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56] font-mono mb-6"
              placeholder="Type confirmation code here"
              autoFocus
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  if (pendingMutation.reopenFormOnCancel) {
                    setShowModal(true);
                  }
                  setPendingMutation(null);
                  setConfirmationText('');
                }}
                className="border-2 border-[#737576] text-[#737576] px-6 py-3 rounded hover:bg-[#737576] hover:text-white transition-all font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleConfirmation}
                disabled={confirmationText !== requiredConfirmation}
                className="bg-[#F71C56] text-white px-6 py-3 rounded hover:brightness-110 transition-all font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pendingMutation.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
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
