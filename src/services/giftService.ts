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
import type { Gift, LetterConfig, AppUser } from '../types';
import { INITIAL_GIFTS, INITIAL_LETTER, DEFAULT_USERS } from '../data/initialData';

const LOCAL_STORAGE_GIFTS_KEY = 'lista_regalos_items_v2';
const LOCAL_STORAGE_LETTER_KEY = 'lista_regalos_letter_v2';
const LOCAL_STORAGE_USERS_KEY = 'lista_regalos_users_v2';

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
  // Subscribe to real-time gifts (Firestore or local listener)
  subscribeGifts(onGiftsUpdated: (gifts: Gift[]) => void): () => void {
    if (isFirebaseConfigured && db) {
      try {
        const giftsCol = collection(db, 'gifts');
        const q = query(giftsCol, orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (snapshot.empty) {
            // First time setup: seed with initial gifts!
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

    // Local storage fallback with interval / storage event
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
    } catch (e) {
      console.warn('Error sembrando regalos en Firestore:', e);
    }
  },

  // Toggle reservation with security checks
  async toggleReserveGift(gift: Gift, user: AppUser, shouldReserve: boolean): Promise<boolean> {
    // SECURITY VALIDATION:
    // Only the user who reserved it OR an admin can un-reserve!
    if (!shouldReserve && gift.isReserved) {
      const isOwner = gift.reservedBy === user.uid || gift.reservedBy === user.username;
      const isAdmin = user.role === 'admin';
      if (!isOwner && !isAdmin) {
        throw new Error('🔒 Seguridad: Solo quien reservó este regalo o Rafael pueden desmarcarlo.');
      }
    }

    const updatedData: Partial<Gift> = shouldReserve
      ? {
          isReserved: true,
          reservedBy: user.uid,
          reservedByName: user.displayName || user.username,
          reservedAt: new Date().toISOString()
        }
      : {
          isReserved: false,
          reservedBy: null,
          reservedByName: null,
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
  async addGift(giftData: Omit<Gift, 'id' | 'createdAt' | 'isReserved' | 'reservedBy' | 'reservedByName' | 'reservedAt'>): Promise<Gift> {
    const newId = 'regalo-' + Date.now();
    const newGift: Gift = {
      ...giftData,
      id: newId,
      isReserved: false,
      reservedBy: null,
      reservedByName: null,
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

  // Restore initial gifts (Admin convenience)
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

  // Users management in Firestore or local
  getUsers(): AppUser[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      if (!raw) {
        localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      return JSON.parse(raw);
    } catch {
      return DEFAULT_USERS;
    }
  },

  saveUsers(users: AppUser[]) {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
  }
};
