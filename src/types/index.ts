export type GiftCategory = 'navidad' | 'cumpleanos' | 'ambos';
export type GiftPriority = 'deseado' | 'muy-deseado' | 'ilusion-maxima';
export type UserRole = 'admin' | 'user';
export type UserGroup = 'familia' | 'amigos' | 'general';

export interface Gift {
  id: string;
  name: string;
  price: string;
  img: string;
  link: string;
  descripcion: string;
  category: GiftCategory;
  priority: GiftPriority;
  visibleTo: string[]; // e.g. ['all'] or ['familia', 'mama', 'carlos']
  isReserved: boolean;
  reservedBy: string | null; // UID or username
  reservedByName: string | null; // e.g. "Mamá", "Tía Carmen"
  reservedAt: string | null;
  createdAt: string;
}

export interface AppUser {
  uid: string;
  username: string;
  displayName: string;
  role: UserRole;
  group: UserGroup;
  createdAt?: string;
}

export interface LetterConfig {
  titulo: string;
  subtitulo: string;
  parrafos: string[];
  firma: string;
  temporada: string;
  ultimaActualizacion?: string;
}
