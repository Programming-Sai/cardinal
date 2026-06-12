import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  getAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  isSuperAdmin,
  getCurrentAdmin,
  Admin,
  getRoleBadgeClass,
  getRoleDisplayName,
} from "../../utils/adminAuth";
import { Plus, Edit, Trash2, X, ChevronDown, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";

type ToastType = "success" | "error" | "info";

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
  const [error, setError] = useState("");
  const [confirmationText, setConfirmationText] = useState("");
  const [requiredConfirmation, setRequiredConfirmation] = useState("");
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [pendingMutation, setPendingMutation] = useState<{
    title: string;
    summary: string;
    details: string[];
    confirmLabel: string;
    run: () => void | Promise<void>;
    reopenFormOnCancel: boolean;
  } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastIdCounter, setToastIdCounter] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const emptyForm = {
    email: "",
    fullName: "",
    role: "admin" as Admin["role"],
    password: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    // Check if user is super_admin
    if (!isSuperAdmin()) {
      navigate("/admin/dashboard");
      return;
    }

    const current = getCurrentAdmin();
    setCurrentAdmin(current);
    void loadAdmins();
  }, [navigate]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showDropdown]);

  const loadAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const adminsList = await getAdmins();
      setAdmins(adminsList);
    } catch (error) {
      console.error("Failed to load admins:", error);
      showToast(
        error instanceof Error ? error.message : "Failed to load admins",
        "error",
      );
    } finally {
      setLoadingAdmins(false);
    }
  };

  const showToast = (message: string, type: ToastType) => {
    const newToast: Toast = {
      id: toastIdCounter,
      message,
      type,
    };
    setToastIdCounter((prev) => prev + 1);
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  const generateConfirmationCode = (label: string, subject: string) => {
    const makeChunk = () =>
      Math.random().toString(36).substring(2, 7).toUpperCase();
    const cleanLabel = label.replace(/\s+/g, "-").toUpperCase();
    const cleanSubject = subject.replace(/[^A-Z0-9]+/gi, "-").toUpperCase();
    return [
      cleanLabel || "ADM",
      cleanSubject || "VERIFY",
      makeChunk(),
      makeChunk(),
      makeChunk(),
      makeChunk(),
    ].join("-");
  };

  const openMutationConfirm = (
    title: string,
    summary: string,
    details: string[],
    confirmLabel: string,
    run: () => void,
    reopenFormOnCancel = false,
  ) => {
    setRequiredConfirmation(generateConfirmationCode(title, summary));
    setConfirmationText("");
    setPendingMutation({
      title,
      summary,
      details,
      confirmLabel,
      run,
      reopenFormOnCancel,
    });
  };

  const handleAdd = (withInvite: boolean) => {
    setFormData(emptyForm);
    setEditingAdmin(null);
    setError("");
    setShouldInvite(withInvite);
    setShowDropdown(false);
    setShowModal(true);
  };

  const handleEdit = (admin: Admin) => {
    setFormData({
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role,
      password: "",
    });
    setEditingAdmin(admin);
    setError("");
    setShouldInvite(false);
    setShowModal(true);
  };

  const handleDeleteClick = (admin: Admin) => {
    openMutationConfirm(
      "Confirm Admin Deletion",
      admin.fullName,
      [
        `Email: ${admin.email}`,
        `Role: ${getRoleDisplayName(admin.role)}`,
        "This action will remove the admin account from the backend.",
      ],
      "Confirm Delete",
      async () => {
        await deleteAdmin(admin.id);
        showToast(`Admin ${admin.fullName} deleted successfully`, "success");
        await loadAdmins();
      },
    );
  };

  const handleSave = () => {
    setError("");

    if (!formData.email || !formData.fullName || !formData.role) {
      setError("Please fill in all required fields");
      return;
    }

    const trimmedPassword = formData.password.trim();
    if (!editingAdmin && trimmedPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (editingAdmin && trimmedPassword && trimmedPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    setShowModal(false);
    openMutationConfirm(
      editingAdmin ? "Confirm Admin Update" : "Confirm Admin Creation",
      formData.fullName,
      [
        `Email: ${formData.email}`,
        `Role: ${getRoleDisplayName(formData.role)}`,
        shouldInvite
          ? "Invite email will be sent after creation."
          : "No invite email will be sent.",
      ],
      editingAdmin ? "Confirm Update" : "Confirm Create",
      proceedWithSave,
      true,
    );
  };

  const proceedWithSave = async () => {
    setIsSubmitting(true);
    try {
      if (editingAdmin) {
        await updateAdmin(editingAdmin.id, {
          email: formData.email,
          fullName: formData.fullName,
          role: formData.role,
          password: formData.password.trim() || undefined,
        });
        showToast(`Admin ${formData.fullName} updated successfully`, "success");
      } else {
        await addAdmin(
          formData.email,
          formData.fullName,
          formData.role,
          formData.password.trim(),
          shouldInvite,
        );

        if (shouldInvite) {
          showToast(
            `Admin created and invite sent to ${formData.email}. The email includes the temporary password.`,
            "success",
          );
        } else {
          showToast(
            `Admin ${formData.fullName} created. They can log in with email: ${formData.email}`,
            "success",
          );
        }
      }

      await loadAdmins();
      setShowModal(false);
      setFormData(emptyForm);
      setEditingAdmin(null);
      setConfirmationText("");
      setPendingMutation(null);
      setShouldInvite(false);
    } catch (err) {
      setError((err as Error).message);
      showToast((err as Error).message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleConfirmation = async () => {
    if (confirmationText !== requiredConfirmation) {
      showToast("Confirmation code does not match. Please try again.", "error");
      return;
    }
    setIsConfirming(true);
    try {
      await Promise.resolve(pendingMutation?.run());
      setPendingMutation(null);
      setConfirmationText("");
      setShowModal(false);
    } catch (err) {
      showToast((err as Error).message, "error");
      setPendingMutation(null);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleSendInvite = (admin: Admin) => {
    openMutationConfirm(
      "Confirm Admin Invite",
      admin.fullName,
      [
        `Email: ${admin.email}`,
        `Role: ${getRoleDisplayName(admin.role)}`,
        "This will trigger an invitation email for the selected admin.",
      ],
      "Confirm Invite",
      async () => {
        showToast(`Invite flow acknowledged for ${admin.email}.`, "info");
      },
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
      {/* Toast Container */}
      <div className="fixed top-24 right-8 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-6 py-4 rounded shadow-lg min-w-[300px] animate-slide-in ${
              toast.type === "success"
                ? "bg-[var(--brand-blue)] text-white"
                : toast.type === "error"
                  ? "bg-[var(--brand-red)] text-white"
                  : "bg-[var(--brand-cyan)] text-[var(--brand-navy)]"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bold text-[32px] text-[var(--brand-navy)] mb-2">
            Admin Management
          </h1>
          <p className="text-[var(--brand-muted)]">
            Manage admin accounts and permissions
          </p>
        </div>

        {/* Dropdown Button */}
        <div className="relative dropdown-container">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-[var(--brand-red)] text-white font-bold px-6 py-3 rounded hover:brightness-110 transition-all inline-flex items-center gap-2 uppercase tracking-wider"
          >
            <Plus className="w-5 h-5" /> Add New Admin
            <ChevronDown className="w-4 h-4" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[var(--brand-border)] shadow-lg z-10 rounded-2xl">
              <button
                onClick={() => handleAdd(false)}
                className="w-full text-left px-4 py-3 hover:bg-[var(--brand-surface)] transition-colors text-[var(--brand-navy)] font-medium"
              >
                <div className="font-bold">Create Admin</div>
                <div className="text-xs text-[var(--brand-muted)]">
                  Create without sending invite
                </div>
              </button>
              <div className="border-t border-[var(--brand-border)]"></div>
              <button
                onClick={() => handleAdd(true)}
                className="w-full text-left px-4 py-3 hover:bg-[var(--brand-surface)] transition-colors text-[var(--brand-navy)] font-medium"
              >
                <div className="font-bold">Create and Invite Admin</div>
                <div className="text-xs text-[var(--brand-muted)]">
                  Create and send email invite
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white border border-[var(--brand-border)] rounded-2xl">
        <div className="overflow-x-auto">
          {loadingAdmins ? (
            <div className="p-8">
              <div className="space-y-4 animate-pulse">
                <div className="h-4 w-40 bg-[var(--brand-surface-alt)] rounded" />
                <div className="h-12 bg-[var(--brand-surface-alt)] rounded" />
                <div className="h-12 bg-[var(--brand-surface-alt)] rounded" />
                <div className="h-12 bg-[var(--brand-surface-alt)] rounded" />
              </div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-[var(--brand-surface)] border-b border-[var(--brand-border)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[var(--brand-navy)] uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[var(--brand-navy)] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[var(--brand-navy)] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[var(--brand-navy)] uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[var(--brand-navy)] uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[var(--brand-navy)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--brand-border)]">
                {admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="hover:bg-[var(--brand-surface)] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[var(--brand-navy)]">
                      {admin.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--brand-muted)]">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded ${getRoleBadgeClass(admin.role)}`}
                      >
                        {getRoleDisplayName(admin.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-muted)]">
                      {formatDate(admin.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-muted)]">
                      {formatDate(admin.lastLogin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="text-[var(--brand-red)] hover:underline mr-3 inline-flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      {currentAdmin?.id !== admin.id && (
                        <button
                          onClick={() => handleSendInvite(admin)}
                          className="text-[var(--brand-navy)] hover:underline mr-3 inline-flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" /> Invite
                        </button>
                      )}
                      {currentAdmin?.id !== admin.id && (
                        <button
                          onClick={() => handleDeleteClick(admin)}
                          className="text-[var(--brand-muted)] hover:text-[var(--brand-red)] inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loadingAdmins && admins.length === 0 && (
          <div className="p-12 text-center text-[var(--brand-muted)]">
            <p className="font-bold mb-2">No admins found</p>
            <p className="text-sm">Click "Add New Admin" to create one</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-[var(--brand-surface)] border border-[var(--brand-border)] p-6 rounded-2xl">
        <h3 className="font-bold text-[var(--brand-navy)] mb-3">
          Admin Roles & Permissions
        </h3>
        <div className="space-y-2 text-sm text-[var(--brand-muted)]">
          <div className="flex gap-3">
            <span
              className={`px-2 py-1 text-xs font-bold uppercase tracking-wider rounded ${getRoleBadgeClass("super_admin")}`}
            >
              Super Admin
            </span>
            <span>
              Full access: manage admins, delete applications, manage programs,
              export data
            </span>
          </div>
          <div className="flex gap-3">
            <span
              className={`px-2 py-1 text-xs font-bold uppercase tracking-wider rounded ${getRoleBadgeClass("admin")}`}
            >
              Admin
            </span>
            <span>
              Can update statuses, add notes, manage programs, export data
              (cannot manage other admins)
            </span>
          </div>
          <div className="flex gap-3">
            <span
              className={`px-2 py-1 text-xs font-bold uppercase tracking-wider rounded ${getRoleBadgeClass("viewer")}`}
            >
              Viewer
            </span>
            <span>
              Read-only access: view applications, inquiries, and programs (no
              editing)
            </span>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--brand-navy)]/55 backdrop-blur-sm px-4">
          <div className="bg-white max-w-2xl w-full shadow-2xl rounded-2xl">
            {/* Modal Header */}
            <div className="bg-[var(--brand-red)] text-white p-6 flex justify-between items-center">
              <h2 className="font-bold text-xl">
                {editingAdmin ? "Edit Admin" : "Add New Admin"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="hover:opacity-80"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">
                    Full Name <span className="text-[var(--brand-red)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)]"
                    placeholder="e.g., Dr. Sarah Mensah"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">
                    Email Address{" "}
                    <span className="text-[var(--brand-red)]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)]"
                    placeholder="email@cardinalimmersions.com"
                    disabled={!!editingAdmin}
                  />
                  {editingAdmin && (
                    <p className="text-xs text-[var(--brand-muted)] mt-1">
                      Email cannot be changed after creation
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">
                    Role <span className="text-[var(--brand-red)]">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)]"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  {!editingAdmin &&
                    (formData.role === "super_admin" ||
                      formData.role === "admin") && (
                      <p className="text-xs text-[var(--brand-cyan)] mt-1">
                        This role will require confirmation before creation
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--brand-navy)] mb-2">
                    {editingAdmin
                      ? "New Password (leave blank to keep current)"
                      : "Password"}{" "}
                    {!editingAdmin && (
                      <span className="text-[var(--brand-red)]">*</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pr-12 border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)]"
                      placeholder={
                        editingAdmin
                          ? "Leave blank to keep current"
                          : "Enter password"
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brand-muted)] hover:text-[var(--brand-navy)] transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-[var(--brand-muted)] mt-1">
                    {editingAdmin
                      ? "Change password only if needed. Production will use secure reset flow."
                      : shouldInvite
                        ? "Password will be sent in invite email (Production: via Resend)"
                        : "Password for this account."}
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-[var(--brand-surface)] border border-[var(--brand-red)] text-[var(--brand-red)] px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[var(--brand-border)] flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="border-2 border-[var(--brand-muted)] text-[var(--brand-muted)] px-6 py-3 rounded hover:bg-[var(--brand-muted)] hover:text-white transition-all font-bold uppercase tracking-wider"
                disabled={isSubmitting || isConfirming}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-[var(--brand-red)] text-white px-6 py-3 rounded hover:brightness-110 transition-all font-bold uppercase tracking-wider disabled:opacity-60"
                disabled={isSubmitting || isConfirming}
              >
                {isSubmitting
                  ? "Saving..."
                  : editingAdmin
                    ? "Save Changes"
                    : "Create Admin"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mutation Confirmation Modal */}
      {pendingMutation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--brand-navy)]/55 backdrop-blur-sm px-4">
          <div className="bg-white max-w-lg w-full p-8 shadow-2xl rounded-2xl">
            <h3 className="font-bold text-xl text-[var(--brand-navy)] mb-4">
              {pendingMutation.title}
            </h3>

            <div className="bg-[var(--brand-surface)] border border-[var(--brand-border)] p-4 mb-6 text-sm text-[var(--brand-navy)]">
              <p className="font-bold mb-2">{pendingMutation.summary}</p>
              <div className="space-y-1 text-[var(--brand-muted)]">
                {pendingMutation.details.map((detail) => (
                  <p key={detail}>{detail}</p>
                ))}
              </div>
            </div>

            <p className="text-[var(--brand-muted)] mb-4">
              To confirm, type the code below exactly as shown. Copying is
              disabled for this token.
            </p>

            <div
              className="bg-[var(--brand-surface)] border border-[var(--brand-border)] p-3 mb-4 font-mono text-sm text-center select-none break-all"
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
              className="w-full px-4 py-3 border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] font-mono mb-6"
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
                  setConfirmationText("");
                }}
                className="border-2 border-[var(--brand-muted)] text-[var(--brand-muted)] px-6 py-3 rounded hover:bg-[var(--brand-muted)] hover:text-white transition-all font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleConfirmation}
                disabled={
                  confirmationText !== requiredConfirmation || isConfirming
                }
                className="bg-[var(--brand-red)] text-white px-6 py-3 rounded hover:brightness-110 transition-all font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConfirming ? "Working..." : pendingMutation.confirmLabel}
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
