import type { Gift, LetterConfig, AppUser } from '../types';

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

export const INITIAL_GIFTS: Gift[] = [
  {
    id: 'regalo-1',
    name: 'Brazo de Pared para Portátil',
    price: "59'99€",
    img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    link: 'https://amzn.eu/d/f5IfOLn',
    descripcion: 'Para jugar cómodamente desde la tele o la cama con el portátil bien sujeto.',
    category: 'ambos',
    priority: 'muy-deseado',
    visibleTo: ['all'],
    isReserved: false,
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    createdAt: '2026-10-10T12:00:00.000Z'
  },
  {
    id: 'regalo-2',
    name: 'Spotify Premium - 6 meses',
    price: '66€',
    img: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=800&q=80',
    link: 'https://www.game.es/SPOTIFY/MONEDERO-DIGITAL/PREPAGOS/CODIGO-SPOTIFY-DIGITAL-6-MESES/249057',
    descripcion: 'Necesito mi música sin anuncios en el coche y mientras programo o estudio.',
    category: 'navidad',
    priority: 'deseado',
    visibleTo: ['all'],
    isReserved: false,
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    createdAt: '2026-10-10T12:01:00.000Z'
  },
  {
    id: 'regalo-3',
    name: 'Cartera Vulkit Negra',
    price: "24'99€",
    img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    link: 'https://amzn.eu/d/gSd14av',
    descripcion: 'Diseño minimalista con bloqueo RFID y eyector rápido de tarjetas.',
    category: 'ambos',
    priority: 'muy-deseado',
    visibleTo: ['all'],
    isReserved: false,
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    createdAt: '2026-10-10T12:02:00.000Z'
  },
  {
    id: 'regalo-4',
    name: 'Vale por Silksong Edición Coleccionista',
    price: '75€ - 100€',
    img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    link: 'https://www.fangamer.eu/collections/hollow-knight-silksong',
    descripcion: 'Cuando salga por fin lo necesito sí o sí. ¡Un vale para asegurarlo cuando abran reservas!',
    category: 'cumpleanos',
    priority: 'ilusion-maxima',
    visibleTo: ['all'],
    isReserved: false,
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    createdAt: '2026-10-10T12:03:00.000Z'
  },
  {
    id: 'regalo-5',
    name: 'Bombilla Inteligente Multicolor',
    price: "14'99€",
    img: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=800&q=80',
    link: 'https://amzn.eu/d/4YgSpus',
    descripcion: 'Para apagar y cambiar el tono de luz desde el móvil cuando ya estoy en la cama.',
    category: 'navidad',
    priority: 'deseado',
    visibleTo: ['all'],
    isReserved: false,
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    createdAt: '2026-10-10T12:04:00.000Z'
  },
  {
    id: 'regalo-6',
    name: 'Taza Oficial Undertale (Ruins)',
    price: '28€',
    img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    link: 'https://www.fangamer.eu/collections/undertale/products/undertale-ruins-mug',
    descripcion: 'Taza cerámica de coleccionista inspirada en las Ruinas de Undertale.',
    category: 'ambos',
    priority: 'deseado',
    visibleTo: ['all'],
    isReserved: false,
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    createdAt: '2026-10-10T12:05:00.000Z'
  },
  {
    id: 'regalo-7',
    name: 'Lámpara Napstablook Undertale',
    price: '34€',
    img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    link: 'https://www.fangamer.eu/collections/undertale/products/undertale-napstablook-lamp',
    descripcion: 'Luz ambiental suave con el fantasmita más entrañable para la mesa de noche.',
    category: 'navidad',
    priority: 'muy-deseado',
    visibleTo: ['all'],
    isReserved: false,
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    createdAt: '2026-10-10T12:06:00.000Z'
  },
  {
    id: 'regalo-8',
    name: 'Peluche Bing Bong Oficial',
    price: "29'99€",
    img: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    link: 'https://www.makeship.com/products/bing-bong-plushie',
    descripcion: 'Edición limitada de Makeship. ¡Bing Bong es el rey!',
    category: 'cumpleanos',
    priority: 'muy-deseado',
    visibleTo: ['all'],
    isReserved: false,
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    createdAt: '2026-10-10T12:07:00.000Z'
  },
  {
    id: 'regalo-9',
    name: 'Peluche Pulga Silksong Artesanal',
    price: "21'06€",
    img: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?auto=format&fit=crop&w=800&q=80',
    link: 'https://www.etsy.com',
    descripcion: 'Muñeco artesanal hecho a mano de las pequeñas pulguitas de Silksong.',
    category: 'ambos',
    priority: 'deseado',
    visibleTo: ['all'],
    isReserved: false,
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    createdAt: '2026-10-10T12:08:00.000Z'
  },
  {
    id: 'regalo-10',
    name: 'Dinero Dinerete para Ahorros / Caprichos',
    price: 'A tu elección (€)',
    img: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80',
    link: '',
    descripcion: 'Siempre viene genial para el colchón de emergencias o proyectos futuros.',
    category: 'ambos',
    priority: 'ilusion-maxima',
    visibleTo: ['all'],
    isReserved: false,
    reservedBy: null,
    reservedByName: null,
    reservedAt: null,
    createdAt: '2026-10-10T12:09:00.000Z'
  }
];

export const DEFAULT_USERS: AppUser[] = [
  {
    uid: 'admin-rafael',
    username: 'rafael',
    displayName: 'Rafael (Admin)',
    role: 'admin',
    group: 'general'
  },
  {
    uid: 'user-familia',
    username: 'familia',
    displayName: 'Familia Querida',
    role: 'user',
    group: 'familia'
  },
  {
    uid: 'user-amigos',
    username: 'amigos',
    displayName: 'Amigos',
    role: 'user',
    group: 'amigos'
  },
  {
    uid: 'user-mama',
    username: 'mama',
    displayName: 'Mamá ❤️',
    role: 'user',
    group: 'familia'
  },
  {
    uid: 'user-papa',
    username: 'papa',
    displayName: 'Papá 👑',
    role: 'user',
    group: 'familia'
  }
];
