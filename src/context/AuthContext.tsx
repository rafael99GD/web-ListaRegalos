import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';
import type { AppUser } from '../types';
import { DEFAULT_USERS } from '../data/initialData';
import { giftService } from '../services/giftService';

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  surpriseMode: boolean;
  toggleSurpriseMode: () => void;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  quickLoginAs: (user: AppUser) => void;
  logout: () => Promise<void>;
  registeredUsers: AppUser[];
  addRegisteredUser: (user: AppUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_STORAGE_KEY = 'lista_regalos_current_user_v2';
const SURPRISE_MODE_STORAGE_KEY = 'lista_regalos_surprise_mode_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [registeredUsers, setRegisteredUsers] = useState<AppUser[]>(DEFAULT_USERS);
  const [surpriseMode, setSurpriseMode] = useState<boolean>(() => {
    return localStorage.getItem(SURPRISE_MODE_STORAGE_KEY) === 'true';
  });

  // Load saved local user or listen to Firebase
  useEffect(() => {
    // Load registered users list
    const users = giftService.getUsers();
    setRegisteredUsers(users);

    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          // Fetch user metadata from Firestore if available
          let role: 'admin' | 'user' = 'user';
          let group: 'familia' | 'amigos' | 'general' = 'general';
          let displayName = fbUser.displayName || fbUser.email?.split('@')[0] || 'Invitado';

          if (db) {
            try {
              const uDoc = await getDoc(doc(db, 'users', fbUser.uid));
              if (uDoc.exists()) {
                const data = uDoc.data();
                role = data.role || role;
                group = data.group || group;
                displayName = data.displayName || displayName;
              }
            } catch (e) {
              console.warn('Error fetching user doc:', e);
            }
          }

          // Special check: if email starts with rafael or is admin
          if (fbUser.email?.toLowerCase().includes('rafael')) {
            role = 'admin';
          }

          const userObj: AppUser = {
            uid: fbUser.uid,
            username: fbUser.email?.split('@')[0] || 'usuario',
            displayName,
            role,
            group
          };

          setCurrentUser(userObj);
          localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(userObj));
        } else {
          // Check local storage for persistent guest / local login
          const saved = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
          if (saved) {
            try {
              setCurrentUser(JSON.parse(saved));
            } catch {
              setCurrentUser(null);
            }
          } else {
            setCurrentUser(null);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Local demo mode: load from localStorage
      const saved = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (saved) {
        try {
          setCurrentUser(JSON.parse(saved));
        } catch {
          setCurrentUser(null);
        }
      } else {
        // Default to a cozy guest or family view initially
        setCurrentUser(null);
      }
      setLoading(false);
    }
  }, []);

  const toggleSurpriseMode = () => {
    setSurpriseMode(prev => {
      const next = !prev;
      localStorage.setItem(SURPRISE_MODE_STORAGE_KEY, String(next));
      return next;
    });
  };

  const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    const cleanInput = usernameOrEmail.trim().toLowerCase();
    
    // Check if input is standard email or username
    const emailToUse = cleanInput.includes('@') 
      ? cleanInput 
      : `${cleanInput}@regalos.local`;

    if (isFirebaseConfigured && auth) {
      try {
        await signInWithEmailAndPassword(auth, emailToUse, password);
        return true;
      } catch (err: unknown) {
        console.error('Firebase Auth error:', err);
        // If Firebase fails, check if there is a local user match for demo/fallback
        const found = registeredUsers.find(u => 
          u.username.toLowerCase() === cleanInput || 
          u.displayName.toLowerCase() === cleanInput
        );
        if (found) {
          setCurrentUser(found);
          localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(found));
          return true;
        }
        throw err;
      }
    }

    // Local / Demo mode login
    const found = registeredUsers.find(u => 
      u.username.toLowerCase() === cleanInput || 
      u.displayName.toLowerCase() === cleanInput
    );

    if (found) {
      setCurrentUser(found);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(found));
      return true;
    }

    // If typing 'admin' or 'rafael' with any password in demo mode:
    if (cleanInput === 'rafael' || cleanInput === 'admin') {
      const adminUser: AppUser = {
        uid: 'admin-rafael',
        username: 'rafael',
        displayName: 'Rafael (Admin)',
        role: 'admin',
        group: 'general'
      };
      setCurrentUser(adminUser);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(adminUser));
      return true;
    }

    // Create a new guest session with this username
    const guestUser: AppUser = {
      uid: 'user-' + cleanInput,
      username: cleanInput,
      displayName: usernameOrEmail.trim(),
      role: 'user',
      group: 'general'
    };
    setCurrentUser(guestUser);
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(guestUser));
    return true;
  };

  const quickLoginAs = (user: AppUser) => {
    setCurrentUser(user);
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await fbSignOut(auth);
      } catch (e) {
        console.warn('Error signing out of Firebase:', e);
      }
    }
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  };

  const addRegisteredUser = (newUser: AppUser) => {
    const updated = [...registeredUsers, newUser];
    setRegisteredUsers(updated);
    giftService.saveUsers(updated);

    if (isFirebaseConfigured && db) {
      try {
        setDoc(doc(db, 'users', newUser.uid), newUser);
      } catch (e) {
        console.warn('Error saving user to Firestore:', e);
      }
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAdmin,
        surpriseMode,
        toggleSurpriseMode,
        login,
        quickLoginAs,
        logout,
        registeredUsers,
        addRegisteredUser
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
