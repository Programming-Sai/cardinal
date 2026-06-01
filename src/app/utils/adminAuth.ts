import { apiRequest, clearAuth, getStoredAdmin, setStoredAdmin, setStoredToken } from './api';

export interface Admin {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'admin' | 'viewer';
  createdAt: string;
  lastLogin: string | null;
  isActive?: boolean;
}

export const initializeAdmins = () => false;

export const getAdmins = async (): Promise<Admin[]> => apiRequest<Admin[]>('/admin/admins');

export const getCurrentAdmin = (): Admin | null => getStoredAdmin<Admin>();

export const loginAdmin = async (email: string, password: string): Promise<Admin | null> => {
  try {
    const result = await apiRequest<{ token: string; admin: Admin }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setStoredToken(result.token);
    setStoredAdmin(result.admin);
    return result.admin;
  } catch {
    return null;
  }
};

export const logoutAdmin = () => {
  clearAuth();
};

export const isSuperAdmin = (): boolean => getCurrentAdmin()?.role === 'super_admin';
export const isAdminOrHigher = (): boolean => {
  const role = getCurrentAdmin()?.role;
  return role === 'super_admin' || role === 'admin';
};
export const isViewer = (): boolean => getCurrentAdmin()?.role === 'viewer';

export const canUpdateStatus = (): boolean => isAdminOrHigher();
export const canDelete = (): boolean => isSuperAdmin();
export const canManagePrograms = (): boolean => isAdminOrHigher();
export const canExport = (): boolean => isAdminOrHigher();
export const canManageAdmins = (): boolean => isSuperAdmin();

export const addAdmin = async (email: string, fullName: string, role: Admin['role'], password: string, sendInvite = false): Promise<Admin> => {
  return apiRequest<Admin>('/admin/admins', {
    method: 'POST',
    body: JSON.stringify({ email, fullName, role, password, sendInvite }),
  });
};

export const updateAdmin = async (
  id: string,
  updates: Partial<Omit<Admin, 'id' | 'createdAt'>> & { password?: string; isActive?: boolean },
): Promise<Admin> => {
  return apiRequest<Admin>(`/admin/admins/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

export const deleteAdmin = async (id: string): Promise<void> => {
  await apiRequest<{ deleted: boolean }>(`/admin/admins/${id}`, {
    method: 'DELETE',
  });
};

export const getRoleBadgeClass = (role: Admin['role']): string => {
  const badges = {
    super_admin: 'bg-[var(--brand-red)] text-white',
    admin: 'bg-[var(--brand-navy)] text-white',
    viewer: 'bg-[var(--brand-blue)] text-white',
  };
  return badges[role];
};

export const getRoleDisplayName = (role: Admin['role']): string => {
  const names = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    viewer: 'Viewer',
  };
  return names[role];
};

