import React, { useState } from 'react';
import { 
  Layers, 
  LayoutGrid, 
  SlidersHorizontal, 
  Mail, 
  KeyRound, 
  Crown, 
  UserCheck, 
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../utils/audio';

interface MobileBottomNavProps {
  viewMode: 'deck' | 'grid';
  setViewMode: (mode: 'deck' | 'grid') => void;
  onOpenFilters: () => void;
  isFiltered: boolean;
  onOpenLetter: () => void;
  onOpenAdmin: () => void;
  onOpenLogin: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  viewMode,
  setViewMode,
  onOpenFilters,
  isFiltered,
  onOpenLetter,
  onOpenAdmin,
  onOpenLogin,
}) => {
  const { session, isAdmin, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      {/* User Quick Menu Modal for Logged In Guests */}
      {showUserMenu && session && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden px-4 pb-20">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowUserMenu(false)}
          />
          <div className="relative w-full max-w-sm bg-[#0f1d14] border border-festive-gold/30 rounded-2xl p-4 shadow-2xl z-10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-festive-pine/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-serif font-bold text-sm text-festive-goldLight">
                  Sesión activa: {session.name}
                </span>
              </div>
              <button 
                onClick={() => setShowUserMenu(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-slate-300">
              {isAdmin 
                ? 'Tienes permisos completos de Administrador.' 
                : 'Tus regalos exclusivos están desbloqueados en la lista.'}
            </p>

            <button
              onClick={() => {
                sounds.playClick();
                logout();
                setShowUserMenu(false);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-festive-wine/80 hover:bg-festive-wine text-white text-xs font-semibold flex items-center justify-center gap-2 border border-festive-ruby/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Bottom Bar */}
      <nav 
        aria-label="Navegación móvil"
        className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#0a140e]/95 backdrop-blur-xl border-t border-festive-pine/80 shadow-[0_-8px_30px_rgba(0,0,0,0.7)] px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
      >
        <div className="grid grid-cols-5 items-center justify-between max-w-md mx-auto">
          
          {/* Tab 1: Deslizar */}
          <button
            onClick={() => {
              sounds.playClick();
              setViewMode('deck');
            }}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              viewMode === 'deck'
                ? 'text-festive-gold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg transition-all ${
              viewMode === 'deck' 
                ? 'bg-festive-emerald/30 shadow-[0_0_12px_rgba(46,125,50,0.4)] text-festive-gold' 
                : ''
            }`}>
              <Layers className="w-5 h-5" />
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight ${
              viewMode === 'deck' ? 'font-bold text-festive-goldLight' : 'font-medium'
            }`}>
              Deslizar
            </span>
          </button>

          {/* Tab 2: Catálogo */}
          <button
            onClick={() => {
              sounds.playClick();
              setViewMode('grid');
            }}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              viewMode === 'grid'
                ? 'text-festive-gold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg transition-all ${
              viewMode === 'grid' 
                ? 'bg-festive-emerald/30 shadow-[0_0_12px_rgba(46,125,50,0.4)] text-festive-gold' 
                : ''
            }`}>
              <LayoutGrid className="w-5 h-5" />
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight ${
              viewMode === 'grid' ? 'font-bold text-festive-goldLight' : 'font-medium'
            }`}>
              Catálogo
            </span>
          </button>

          {/* Tab 3: Filtros */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenFilters();
            }}
            className="relative flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-400 hover:text-slate-200 transition-all"
          >
            <div className="relative p-1 rounded-lg">
              <SlidersHorizontal className="w-5 h-5" />
              {isFiltered && (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-festive-gold animate-ping" />
              )}
              {isFiltered && (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-festive-gold" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 font-medium tracking-tight">
              Filtros
            </span>
          </button>

          {/* Tab 4: Carta */}
          <button
            onClick={() => {
              sounds.playPaper();
              onOpenLetter();
            }}
            className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-400 hover:text-festive-goldLight transition-all"
          >
            <div className="relative p-1 rounded-lg">
              <Mail className="w-5 h-5 text-festive-goldLight" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-festive-ruby border border-[#0a140e]" />
            </div>
            <span className="text-[10px] mt-0.5 font-medium tracking-tight">
              Carta
            </span>
          </button>

          {/* Tab 5: Acceso / Admin */}
          {isAdmin ? (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenAdmin();
              }}
              className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-festive-gold hover:scale-105 transition-all"
            >
              <div className="p-1 rounded-lg bg-festive-wine/50 border border-festive-gold/40 shadow-glow-ruby">
                <Crown className="w-5 h-5 text-festive-goldLight animate-pulse" />
              </div>
              <span className="text-[10px] mt-0.5 font-bold text-festive-gold tracking-tight">
                Admin
              </span>
            </button>
          ) : session ? (
            <button
              onClick={() => {
                sounds.playClick();
                setShowUserMenu(true);
              }}
              className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-emerald-400 transition-all"
            >
              <div className="p-1 rounded-lg bg-festive-forest border border-emerald-500/40">
                <UserCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-[10px] mt-0.5 font-semibold text-emerald-300 tracking-tight max-w-[50px] truncate">
                {session.name}
              </span>
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenLogin();
              }}
              className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-400 hover:text-festive-goldLight transition-all"
            >
              <div className="p-1 rounded-lg">
                <KeyRound className="w-5 h-5 text-festive-gold" />
              </div>
              <span className="text-[10px] mt-0.5 font-medium tracking-tight">
                Clave
              </span>
            </button>
          )}

        </div>
      </nav>
    </>
  );
};
