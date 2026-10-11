import type { Gift, LetterConfig, SpecialUser } from '../types';

export const INITIAL_LETTER: LetterConfig = {
  titulo: 'Queridos Reyes Magos, Familia y Amigos 🎄',
  subtitulo: 'Bienvenidos a mi lista oficial de deseos de Navidad y Cumpleaños',
  parrafos: [
    'Este año ha sido intenso y lleno de retos, pero también de grandes momentos. He intentado ponerle ganas a los estudios, a los proyectos y a estar con la gente que quiero.',
    'He ayudado un montón en casa (bueno, según a quién le preguntes jeje), pero sobre todo tengo muchas ganas de celebrar estas fiestas juntos y compartir buenos ratos.',
    'Aquí tenéis mi selección de cosillas que me harían mucha ilusión para Navidad, Reyes o mi Cumpleaños. Podéis ver detalles, precios y enlaces directos.',
    '¡Muchísimas gracias por estar siempre ahí y por hacer cada año tan especial!'
  ],
  firma: 'Con mucho cariño, Rafaelito ❤️',
  temporada: 'Navidad 2026 & Cumpleaños',
  ultimaActualizacion: new Date().toISOString()
};

// No gifts by default - Rafael will populate his own gifts
export const INITIAL_GIFTS: Gift[] = [];

// No initial special users by default
export const INITIAL_SPECIAL_USERS: SpecialUser[] = [];
