import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SpecialUser, AppUserSession } from '../types';
import { giftService } from '../services/giftService';

const ADMIN_PASSWORD_STORAGE_KEY = 'lista_regalos_admin_pass_v3';
const SESSION_STORAGE_KEY = 'lista_regalos_session_v3';

interface AuthContextType {
  session: AppUserSession | null;
  isAdmin: boolean;
  specialUsers: SpecialUser[];
  adminPassword: string;
  login: (name: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  setAdminPassword: (newPass: string) => void;
  addSpecialUser: (name: string, pass: string) => Promise<SpecialUser>;
  deleteSpecialUser: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AppUserSession | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [specialUsers, setSpecialUsers] = useState<SpecialUser[]>([]);
  const [adminPassword, setAdminPasswordState] = useState<string>(() => {
    return localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY) || 'admin1234';
  });

  // Subscribe to special users from Firestore / local storage
  useEffect(() => {
    const unsub = giftService.subscribeSpecialUsers((users) => {
      setSpecialUsers(users);
    });
    return () => unsub();
  }, []);

  const setAdminPassword = (newPass: string) => {
    const trimmed = newPass.trim();
    if (!trimmed) return;
    setAdminPasswordState(trimmed);
    localStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, trimmed);
  };

  const login = async (name: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    const cleanName = name.trim();
    const cleanPass = pass.trim();

    if (!cleanName || !cleanPass) {
      return { success: false, message: 'Por favor introduce nombre y contraseña.' };
    }

    // 1. Check if Admin (Rafael)
    if (cleanName.toLowerCase() === 'rafael') {
      if (cleanPass === adminPassword) {
        const adminSession: AppUserSession = {
          name: 'Rafael',
          isAdmin: true
        };
        setSession(adminSession);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(adminSession));
        return { success: true };
      } else {
        return { success: false, message: 'Contraseña de administrador incorrecta.' };
      }
    }

    // 2. Check if Special User (e.g. Susana)
    const match = specialUsers.find(
      u => u.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (match) {
      if (match.password === cleanPass) {
        const specialSession: AppUserSession = {
          name: match.name,
          isAdmin: false
        };
        setSession(specialSession);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(specialSession));
        return { success: true };
      } else {
        return { success: false, message: `Contraseña incorrecta para ${match.name}.` };
      }
    }

    return { 
      success: false, 
      message: `No se encontró ningún usuario con el nombre "${cleanName}". Verifica el nombre o pídele acceso a Rafael.` 
    };
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const addSpecialUser = async (name: string, pass: string) => {
    return await giftService.addSpecialUser(name, pass);
  };

  const deleteSpecialUser = async (id: string) => {
    return await giftService.deleteSpecialUser(id);
  };

  const isAdmin = Boolean(session?.isAdmin);

  return (
    <AuthContext.Provider
      value={{
        session,
        isAdmin,
        specialUsers,
        adminPassword,
        login,
        logout,
        setAdminPassword,
        addSpecialUser,
        deleteSpecialUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
