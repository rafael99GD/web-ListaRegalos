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
  LogIn, 
  Eye, 
  EyeOff, 
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
  const { currentUser, isAdmin, surpriseMode, toggleSurpriseMode, logout } = useAuth();

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
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-festive-dark/85 border-b border-festive-pine/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group" onClick={onOpenLetter}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-festive-cranberry to-festive-wine flex items-center justify-center text-festive-gold border border-festive-gold/40 shadow-glow-ruby group-hover:scale-105 transition-transform">
            <Gift className="w-5 h-5 text-festive-goldLight" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-base sm:text-lg text-slate-100 tracking-tight group-hover:text-festive-goldLight transition-colors">
                Regalos de Rafael
              </span>
              <Sparkles className="w-3.5 h-3.5 text-festive-gold animate-pulse hidden sm:inline-block" />
            </div>
            <p className="text-[11px] text-emerald-400/90 uppercase tracking-widest font-sans font-semibold">
              Navidad & Cumpleaños
            </p>
          </div>
        </div>

        {/* View Switcher (Deck / Grid) */}
        <div className="flex items-center p-1 bg-festive-forest/90 rounded-xl border border-festive-pine/80 shadow-inner">
          <button
            onClick={() => { sounds.playClick(); setViewMode('deck'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'deck'
                ? 'bg-festive-emerald text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Modo Deslizar (Tinder)"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Deslizar</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setViewMode('grid'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-festive-emerald text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Modo Galería Completa"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Galería</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Read Letter Button */}
          <button
            onClick={() => { sounds.playPaper(); onOpenLetter(); }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-festive-wine/50 hover:bg-festive-wine/80 text-festive-goldLight border border-festive-gold/30 flex items-center gap-1.5 text-xs font-medium transition-all shadow-sm"
            title="Leer carta personal"
          >
            <FileText className="w-4 h-4 text-festive-gold" />
            <span className="hidden lg:inline">Carta</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            className={`p-2 rounded-xl border text-xs transition-all ${
              soundActive 
                ? 'bg-festive-forest/80 text-festive-gold border-festive-gold/30' 
                : 'bg-festive-forest/40 text-slate-500 border-festive-pine/50'
            }`}
            title={soundActive ? 'Efectos de sonido: Activados' : 'Efectos de sonido: Silenciados'}
          >
            {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Snow Toggle */}
          <button
            onClick={handleSnowToggle}
            className={`p-2 rounded-xl border text-xs transition-all ${
              snowActive 
                ? 'bg-festive-forest/80 text-blue-200 border-blue-400/30' 
                : 'bg-festive-forest/40 text-slate-500 border-festive-pine/50'
            }`}
            title={snowActive ? 'Nieve: Activa' : 'Nieve: En pausa'}
          >
            <Snowflake className={`w-4 h-4 ${snowActive ? 'animate-spin-slow' : ''}`} />
          </button>

          {/* Admin Controls */}
          {isAdmin && (
            <>
              {/* Surprise Mode Toggle (Hide or show who bought what) */}
              <button
                onClick={() => { sounds.playClick(); toggleSurpriseMode(); }}
                className={`p-2 sm:px-2.5 sm:py-2 rounded-xl border flex items-center gap-1.5 text-xs transition-all ${
                  surpriseMode 
                    ? 'bg-purple-950/70 text-purple-200 border-purple-500/40' 
                    : 'bg-amber-950/70 text-amber-200 border-amber-500/40'
                }`}
                title={surpriseMode ? "Modo Sorpresa ACTIVO (Ocultando nombres de compradores)" : "Modo Supervisor (Viendo quién compró cada cosa)"}
              >
                {surpriseMode ? <EyeOff className="w-4 h-4 text-purple-400" /> : <Eye className="w-4 h-4 text-amber-400" />}
                <span className="hidden xl:inline">
                  {surpriseMode ? 'Sorpresa ON' : 'Ver Compradores'}
                </span>
              </button>

              {/* Admin Panel Button */}
              <button
                onClick={() => { sounds.playClick(); onOpenAdmin(); }}
                className="px-2.5 sm:px-3 py-2 rounded-xl bg-festive-cranberry text-white border border-festive-gold/50 flex items-center gap-1.5 text-xs font-semibold shadow-glow-ruby hover:bg-festive-ruby transition-all"
                title="Abrir Panel de Administración"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-festive-goldLight" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </>
          )}

          {/* User Status / Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 pl-1">
              <div 
                className="px-2.5 py-1.5 rounded-xl bg-festive-pine/60 border border-festive-gold/30 text-xs text-festive-goldLight font-medium flex items-center gap-1.5"
                title={`Identificado como: ${currentUser.displayName} (${currentUser.username})`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                <span className="max-w-[90px] sm:max-w-[120px] truncate">
                  {currentUser.displayName}
                </span>
              </div>
              <button
                onClick={() => { sounds.playClick(); logout(); }}
                className="p-2 rounded-xl bg-festive-forest/60 hover:bg-festive-wine/80 text-slate-400 hover:text-white border border-festive-pine/50 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { sounds.playClick(); onOpenLogin(); }}
              className="px-3 py-2 rounded-xl bg-festive-forest hover:bg-festive-pine text-slate-200 hover:text-festive-goldLight border border-festive-pine/80 flex items-center gap-1.5 text-xs font-medium transition-all"
            >
              <LogIn className="w-4 h-4 text-festive-gold" />
              <span>Entrar</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
