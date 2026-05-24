// Admin authentication and authorization utilities.
// Local-storage backed for now; replace with real backend auth in production.

export interface Admin {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'admin' | 'viewer';
  createdAt: string;
  lastLogin: string | null;
}

const ADMINS_KEY = 'andylcc_admins';
const CURRENT_ADMIN_KEY = 'currentAdminId';

const safeLocalStorage = {
  getItem(key: string) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // noop
    }
  },
  removeItem(key: string) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // noop
    }
  },
};

const safeSessionStorage = {
  getItem(key: string) {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      // noop
    }
  },
  removeItem(key: string) {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // noop
    }
  },
};

export const initializeAdmins = () => {
  const admins = getAdmins();
  if (admins.length === 0) {
    safeLocalStorage.setItem(ADMINS_KEY, JSON.stringify([]));
    return true;
  }

  return false;
};

export const getAdmins = (): Admin[] => {
  const raw = safeLocalStorage.getItem(ADMINS_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Admin[];
  } catch {
    return [];
  }
};

export const setAdmins = (admins: Admin[]) => {
  safeLocalStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
};

export const getCurrentAdmin = (): Admin | null => {
  const currentAdminId = safeSessionStorage.getItem(CURRENT_ADMIN_KEY);
  if (!currentAdminId) return null;

  const admins = getAdmins();
  return admins.find((a) => a.id === currentAdminId) || null;
};

export const loginAdmin = (email: string): Admin | null => {
  const admins = getAdmins();
  const admin = admins.find((a) => a.email.toLowerCase() === email.toLowerCase());

  if (!admin) return null;

  admin.lastLogin = new Date().toISOString();
  setAdmins(admins.map((a) => (a.id === admin.id ? admin : a)));
  safeSessionStorage.setItem(CURRENT_ADMIN_KEY, admin.id);

  return admin;
};

export const logoutAdmin = () => {
  safeSessionStorage.removeItem(CURRENT_ADMIN_KEY);
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

export const addAdmin = (email: string, fullName: string, role: Admin['role']): Admin => {
  const admins = getAdmins();

  if (admins.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Admin with this email already exists');
  }

  const newAdmin: Admin = {
    id: `admin_${Date.now()}`,
    email,
    fullName,
    role,
    createdAt: new Date().toISOString(),
    lastLogin: null,
  };

  setAdmins([...admins, newAdmin]);
  return newAdmin;
};

export const updateAdmin = (
  id: string,
  updates: Partial<Omit<Admin, 'id' | 'createdAt'>>
): Admin => {
  const admins = getAdmins();
  const index = admins.findIndex((a) => a.id === id);

  if (index === -1) {
    throw new Error('Admin not found');
  }

  const updatedAdmin = { ...admins[index], ...updates };
  admins[index] = updatedAdmin;
  setAdmins(admins);

  return updatedAdmin;
};

export const deleteAdmin = (id: string): void => {
  const admins = getAdmins();
  const superAdmins = admins.filter((a) => a.role === 'super_admin');
  const adminToDelete = admins.find((a) => a.id === id);

  if (adminToDelete?.role === 'super_admin' && superAdmins.length === 1) {
    throw new Error('Cannot delete the last super admin');
  }

  setAdmins(admins.filter((a) => a.id !== id));

  if (safeSessionStorage.getItem(CURRENT_ADMIN_KEY) === id) {
    logoutAdmin();
  }
};

export const getRoleBadgeClass = (role: Admin['role']): string => {
  const badges = {
    super_admin: 'bg-[#F71C56] text-white',
    admin: 'bg-[#0A1C3A] text-white',
    viewer: 'bg-[#6B7280] text-white',
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
