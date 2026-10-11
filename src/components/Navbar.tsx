import React from 'react';
import { 
  Gift, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Snowflake, 
  FileText, 
  SlidersHorizontal, 
  LogOut, 
  KeyRound, 
  LayoutGrid, 
  Layers 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../utils/audio';

interface NavbarProps {
  viewMode: 'deck' | 'grid';
  setViewMode: (mode: 'deck' | 'grid') => void;
  snowActive: boolean;
  setSnowActive: (active: boolean | ((prev: boolean) => boolean)) => void;
  soundActive: boolean;
  setSoundActive: (active: boolean | ((prev: boolean) => boolean)) => void;
  onOpenLetter: () => void;
  onOpenAdmin: () => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  snowActive,
  setSnowActive,
  soundActive,
  setSoundActive,
  onOpenLetter,
  onOpenAdmin,
  onOpenLogin,
}) => {
  const { session, isAdmin, logout } = useAuth();

  const handleSoundToggle = () => {
    setSoundActive(prev => {
      const next = !prev;
      sounds.enabled = next;
      if (next) sounds.playClick();
      return next;
    });
  };

  const handleSnowToggle = () => {
    sounds.playClick();
    setSnowActive(prev => !prev);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-festive-dark/90 border-b border-festive-pine/60 transition-colors">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-15 sm:h-20 flex items-center justify-between gap-1.5 sm:gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 cursor-pointer group shrink-0" onClick={onOpenLetter}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-festive-cranberry to-festive-wine flex items-center justify-center text-festive-gold border border-festive-gold/40 shadow-glow-ruby group-hover:scale-105 transition-transform">
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-festive-goldLight" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-serif font-bold text-sm sm:text-lg text-slate-100 tracking-tight group-hover:text-festive-goldLight transition-colors">
                Regalos de Rafael
              </span>
              <Sparkles className="w-3 h-3 text-festive-gold animate-pulse hidden md:inline-block" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-400/90 uppercase tracking-widest font-sans font-semibold hidden xs:block">
              Navidad & Cumpleaños
            </p>
          </div>
        </div>

        {/* View Switcher (Deck / Grid) */}
        <div className="flex items-center p-0.5 sm:p-1 bg-festive-forest/90 rounded-xl border border-festive-pine/80 shadow-inner shrink-0">
          <button
            onClick={() => { sounds.playClick(); setViewMode('deck'); }}
            className={`flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'deck'
                ? 'bg-festive-emerald text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Modo Deslizar (Tinder)"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Deslizar</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setViewMode('grid'); }}
            className={`flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-festive-emerald text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Modo Galería Completa"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Galería</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Read Letter Button */}
          <button
            onClick={() => { sounds.playPaper(); onOpenLetter(); }}
            className="p-1.5 sm:px-3 sm:py-2 rounded-xl bg-festive-wine/50 hover:bg-festive-wine/80 text-festive-goldLight border border-festive-gold/30 flex items-center gap-1.5 text-xs font-medium transition-all shadow-sm"
            title="Leer carta personal"
          >
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-festive-gold" />
            <span className="hidden sm:inline">Carta</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            className={`p-1.5 sm:p-2 rounded-xl border text-xs transition-all ${
              soundActive 
                ? 'bg-festive-forest/80 text-festive-gold border-festive-gold/30' 
                : 'bg-festive-forest/40 text-slate-500 border-festive-pine/50'
            }`}
            title={soundActive ? 'Efectos de sonido: Activados' : 'Efectos de sonido: Silenciados'}
          >
            {soundActive ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Snow Toggle */}
          <button
            onClick={handleSnowToggle}
            className={`p-1.5 sm:p-2 rounded-xl border text-xs transition-all ${
              snowActive 
                ? 'bg-festive-forest/80 text-blue-200 border-blue-400/30' 
                : 'bg-festive-forest/40 text-slate-500 border-festive-pine/50'
            }`}
            title={snowActive ? 'Nieve: Activa' : 'Nieve: En pausa'}
          >
            <Snowflake className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Admin Panel Button */}
          {isAdmin && (
            <button
              onClick={() => { sounds.playClick(); onOpenAdmin(); }}
              className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-festive-cranberry text-white border border-festive-gold/50 flex items-center gap-1.5 text-xs font-semibold shadow-glow-ruby hover:bg-festive-ruby transition-all"
              title="Abrir Panel de Administración"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-festive-goldLight" />
              <span>Admin</span>
            </button>
          )}

          {/* User Status / Access with Key */}
          {session ? (
            <div className="flex items-center gap-1 pl-0.5">
              <div 
                className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-festive-pine/80 border border-festive-gold/30 text-[11px] sm:text-xs text-festive-goldLight font-medium flex items-center gap-1"
                title={session.isAdmin ? 'Sesión de Administrador activa' : `Regalos exclusivos desbloqueados para ${session.name}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                <span className="max-w-[65px] sm:max-w-[120px] truncate">
                  {session.name}
                </span>
              </div>
              <button
                onClick={() => { sounds.playClick(); logout(); }}
                className="p-1.5 sm:p-2 rounded-xl bg-festive-forest/60 hover:bg-festive-wine/80 text-slate-400 hover:text-white border border-festive-pine/50 transition-colors"
                title="Cerrar sesión especial"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { sounds.playClick(); onOpenLogin(); }}
              className="p-1.5 sm:px-3 sm:py-2 rounded-xl bg-festive-forest hover:bg-festive-pine text-slate-200 hover:text-festive-goldLight border border-festive-pine/80 flex items-center gap-1 text-xs font-medium transition-all"
              title="Entrar con clave para desbloquear regalos exclusivos o modo admin"
            >
              <KeyRound className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-festive-gold" />
              <span className="hidden sm:inline">Clave</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
