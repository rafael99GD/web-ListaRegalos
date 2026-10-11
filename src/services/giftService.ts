import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import type { Gift, LetterConfig, SpecialUser } from '../types';
import { INITIAL_GIFTS, INITIAL_LETTER, INITIAL_SPECIAL_USERS } from '../data/initialData';

const LOCAL_STORAGE_GIFTS_KEY = 'lista_regalos_items_v3';
const LOCAL_STORAGE_LETTER_KEY = 'lista_regalos_letter_v3';
const LOCAL_STORAGE_SPECIAL_USERS_KEY = 'lista_regalos_special_users_v3';

// Helper for local storage
const getLocalGifts = (): Gift[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_GIFTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_GIFTS_KEY, JSON.stringify(INITIAL_GIFTS));
      return INITIAL_GIFTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_GIFTS;
  }
};

const saveLocalGifts = (gifts: Gift[]) => {
  localStorage.setItem(LOCAL_STORAGE_GIFTS_KEY, JSON.stringify(gifts));
};

export const giftService = {
  // Subscribe to real-time gifts (Firestore or local storage listener)
  subscribeGifts(onGiftsUpdated: (gifts: Gift[]) => void): () => void {
    if (isFirebaseConfigured && db) {
      try {
        const giftsCol = collection(db, 'gifts');
        const q = query(giftsCol, orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (snapshot.empty) {
            console.log('🌱 [Firestore] Colección vacía. Sembrando regalos iniciales...');
            this.seedFirestore();
            onGiftsUpdated(INITIAL_GIFTS);
          } else {
            const items: Gift[] = [];
            snapshot.forEach((docSnap) => {
              items.push({ id: docSnap.id, ...(docSnap.data() as Omit<Gift, 'id'>) });
            });
            onGiftsUpdated(items);
          }
        }, (error) => {
          console.warn('⚠️ [Firestore] Error en snapshot, cayendo en modo local:', error);
          onGiftsUpdated(getLocalGifts());
        });

        return unsubscribe;
      } catch (err) {
        console.warn('⚠️ [Firestore] Error al conectar colección:', err);
      }
    }

    onGiftsUpdated(getLocalGifts());
    const handler = () => onGiftsUpdated(getLocalGifts());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  },

  // Seed Firestore on first boot
  async seedFirestore() {
    if (!isFirebaseConfigured || !db) return;
    try {
      for (const gift of INITIAL_GIFTS) {
        const docRef = doc(db, 'gifts', gift.id);
        await setDoc(docRef, {
          ...gift,
          updatedAt: serverTimestamp()
        });
      }
      const letterDoc = doc(db, 'config', 'letter');
      await setDoc(letterDoc, INITIAL_LETTER);

      for (const user of INITIAL_SPECIAL_USERS) {
        const uDoc = doc(db, 'special_users', user.id);
        await setDoc(uDoc, user);
      }
    } catch (e) {
      console.warn('Error sembrando datos en Firestore:', e);
    }
  },

  // Toggle reservation (Completely anonymous - NO buyer names stored anywhere!)
  async toggleReserveGift(gift: Gift, shouldReserve: boolean, isAdmin: boolean): Promise<boolean> {
    // SECURITY RULE:
    // Only Rafael (Admin) can un-reserve a gift!
    if (!shouldReserve && gift.isReserved) {
      if (!isAdmin) {
        throw new Error('🔒 Seguridad: Una vez marcado como comprado, solo Rafael puede desmarcarlo. Por favor avísale para que lo restaure.');
      }
    }

    const updatedData: Partial<Gift> = shouldReserve
      ? {
          isReserved: true,
          reservedAt: new Date().toISOString()
        }
      : {
          isReserved: false,
          reservedAt: null
        };

    if (isFirebaseConfigured && db) {
      try {
        const giftRef = doc(db, 'gifts', gift.id);
        await updateDoc(giftRef, updatedData);
        return true;
      } catch (err) {
        console.error('Error actualizando regalo en Firestore:', err);
        throw err;
      }
    }

    // Local fallback
    const list = getLocalGifts();
    const idx = list.findIndex(g => g.id === gift.id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updatedData };
      saveLocalGifts(list);
      window.dispatchEvent(new Event('storage'));
      return true;
    }
    return false;
  },

  // Add new gift (Admin)
  async addGift(giftData: Omit<Gift, 'id' | 'createdAt' | 'isReserved' | 'reservedAt'>): Promise<Gift> {
    const newId = 'regalo-' + Date.now();
    const newGift: Gift = {
      ...giftData,
      id: newId,
      isReserved: false,
      reservedAt: null,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      const docRef = doc(db, 'gifts', newId);
      await setDoc(docRef, newGift);
      return newGift;
    }

    const list = getLocalGifts();
    list.unshift(newGift);
    saveLocalGifts(list);
    window.dispatchEvent(new Event('storage'));
    return newGift;
  },

  // Update gift (Admin)
  async updateGift(id: string, updates: Partial<Gift>): Promise<void> {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, 'gifts', id);
      await updateDoc(docRef, updates);
      return;
    }

    const list = getLocalGifts();
    const idx = list.findIndex(g => g.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      saveLocalGifts(list);
      window.dispatchEvent(new Event('storage'));
    }
  },

  // Delete gift (Admin)
  async deleteGift(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, 'gifts', id);
      await deleteDoc(docRef);
      return;
    }

    const list = getLocalGifts().filter(g => g.id !== id);
    saveLocalGifts(list);
    window.dispatchEvent(new Event('storage'));
  },

  // Restore defaults
  async resetToDefaults(): Promise<void> {
    if (isFirebaseConfigured && db) {
      await this.seedFirestore();
      return;
    }
    saveLocalGifts(INITIAL_GIFTS);
    window.dispatchEvent(new Event('storage'));
  },

  // Letter Config
  subscribeLetter(onLetterUpdated: (letter: LetterConfig) => void): () => void {
    if (isFirebaseConfigured && db) {
      try {
        const letterDoc = doc(db, 'config', 'letter');
        const unsub = onSnapshot(letterDoc, (snap) => {
          if (snap.exists()) {
            onLetterUpdated(snap.data() as LetterConfig);
          } else {
            setDoc(letterDoc, INITIAL_LETTER);
            onLetterUpdated(INITIAL_LETTER);
          }
        });
        return unsub;
      } catch (err) {
        console.warn('Error suscribiendo a carta:', err);
      }
    }

    const raw = localStorage.getItem(LOCAL_STORAGE_LETTER_KEY);
    if (raw) {
      try {
        onLetterUpdated(JSON.parse(raw));
      } catch {
        onLetterUpdated(INITIAL_LETTER);
      }
    } else {
      onLetterUpdated(INITIAL_LETTER);
    }
    return () => {};
  },

  async saveLetterConfig(letter: LetterConfig): Promise<void> {
    const updated = {
      ...letter,
      ultimaActualizacion: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      const letterDoc = doc(db, 'config', 'letter');
      await setDoc(letterDoc, updated);
      return;
    }

    localStorage.setItem(LOCAL_STORAGE_LETTER_KEY, JSON.stringify(updated));
  },

  // Special Users Management (Name & Password without email)
  subscribeSpecialUsers(onUsersUpdated: (users: SpecialUser[]) => void): () => void {
    if (isFirebaseConfigured && db) {
      try {
        const usersCol = collection(db, 'special_users');
        const unsub = onSnapshot(usersCol, (snap) => {
          if (snap.empty) {
            onUsersUpdated(INITIAL_SPECIAL_USERS);
          } else {
            const list: SpecialUser[] = [];
            snap.forEach(d => list.push({ id: d.id, ...(d.data() as Omit<SpecialUser, 'id'>) }));
            onUsersUpdated(list);
          }
        });
        return unsub;
      } catch (err) {
        console.warn('Error en special_users:', err);
      }
    }

    const getLocal = (): SpecialUser[] => {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_SPECIAL_USERS_KEY);
        if (!raw) {
          localStorage.setItem(LOCAL_STORAGE_SPECIAL_USERS_KEY, JSON.stringify(INITIAL_SPECIAL_USERS));
          return INITIAL_SPECIAL_USERS;
        }
        return JSON.parse(raw);
      } catch {
        return INITIAL_SPECIAL_USERS;
      }
    };

    onUsersUpdated(getLocal());
    const handler = () => onUsersUpdated(getLocal());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  },

  async addSpecialUser(name: string, password: string): Promise<SpecialUser> {
    const newId = 'user-' + name.trim().toLowerCase().replace(/\s+/g, '-');
    const newUser: SpecialUser = {
      id: newId,
      name: name.trim(),
      password: password.trim(),
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      const docRef = doc(db, 'special_users', newId);
      await setDoc(docRef, newUser);
      return newUser;
    }

    const raw = localStorage.getItem(LOCAL_STORAGE_SPECIAL_USERS_KEY);
    const list: SpecialUser[] = raw ? JSON.parse(raw) : INITIAL_SPECIAL_USERS;
    const filtered = list.filter(u => u.name.toLowerCase() !== name.trim().toLowerCase());
    filtered.push(newUser);
    localStorage.setItem(LOCAL_STORAGE_SPECIAL_USERS_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('storage'));
    return newUser;
  },

  async deleteSpecialUser(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, 'special_users', id);
      await deleteDoc(docRef);
      return;
    }

    const raw = localStorage.getItem(LOCAL_STORAGE_SPECIAL_USERS_KEY);
    if (raw) {
      const list: SpecialUser[] = JSON.parse(raw);
      const filtered = list.filter(u => u.id !== id);
      localStorage.setItem(LOCAL_STORAGE_SPECIAL_USERS_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new Event('storage'));
    }
  },

  // Admin Password Management (Synced across all devices via Firestore)
  subscribeAdminPassword(onPasswordUpdated: (pass: string) => void): () => void {
    if (isFirebaseConfigured && db) {
      try {
        const authDoc = doc(db, 'config', 'auth');
        const unsub = onSnapshot(authDoc, (snap) => {
          if (snap.exists() && snap.data()?.password) {
            onPasswordUpdated(snap.data().password);
          } else {
            setDoc(authDoc, { password: 'admin1234' });
            onPasswordUpdated('admin1234');
          }
        });
        return unsub;
      } catch (err) {
        console.warn('Error suscribiendo a admin password:', err);
      }
    }

    const localPass = localStorage.getItem('lista_regalos_admin_pass_v3') || 'admin1234';
    onPasswordUpdated(localPass);
    return () => {};
  },

  async saveAdminPassword(newPassword: string): Promise<void> {
    const trimmed = newPassword.trim();
    if (!trimmed) return;

    if (isFirebaseConfigured && db) {
      const authDoc = doc(db, 'config', 'auth');
      await setDoc(authDoc, { password: trimmed, updatedAt: new Date().toISOString() });
    }

    localStorage.setItem('lista_regalos_admin_pass_v3', trimmed);
  }
};
