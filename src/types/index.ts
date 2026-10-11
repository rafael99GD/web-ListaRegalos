export type GiftCategory = 'navidad' | 'cumpleanos' | 'ambos';
export type GiftPriority = 'deseado' | 'muy-deseado' | 'ilusion-maxima';

export interface Gift {
  id: string;
  name: string;
  price: string;
  img: string;
  link: string;
  descripcion: string;
  category: GiftCategory;
  priority: GiftPriority;
  visibleTo: string[]; // ['all'] or specific usernames like ['Susana']
  isReserved: boolean;
  reservedAt: string | null;
  createdAt: string;
}

export interface SpecialUser {
  id: string;
  name: string;
  password: string;
  createdAt: string;
}

export interface AppUserSession {
  name: string;
  isAdmin: boolean;
}

export interface LetterConfig {
  titulo: string;
  subtitulo: string;
  parrafos: string[];
  firma: string;
  temporada: string;
  ultimaActualizacion?: string;
}
