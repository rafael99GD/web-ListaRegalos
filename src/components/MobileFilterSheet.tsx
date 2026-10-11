import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Sparkles, RotateCcw, Check } from 'lucide-react';
import type { GiftCategory } from '../types';
import type { StatusFilter } from './FiltersBar';
import { sounds } from '../utils/audio';

interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: GiftCategory | 'all';
  setSelectedCategory: (cat: GiftCategory | 'all') => void;
  statusFilter: StatusFilter;
  setStatusFilter: (status: StatusFilter) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  totalCount: number;
  filteredCount: number;
}

export const MobileFilterSheet: React.FC<MobileFilterSheetProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  setSelectedCategory,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  totalCount,
  filteredCount,
}) => {
  const isFiltered = selectedCategory !== 'all' || statusFilter !== 'all' || searchQuery.trim() !== '';

  const handleReset = () => {
    sounds.playClick();
    setSelectedCategory('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-h-[85vh] bg-[#0f1d14] border-t border-festive-gold/30 rounded-t-3xl shadow-2xl overflow-hidden flex flex-col z-10 pb-[max(1rem,env(safe-area-inset-bottom))]"
          >
            {/* Sheet Handle */}
            <div className="w-full flex items-center justify-center pt-3 pb-1" onClick={onClose}>
              <div className="w-12 h-1.5 rounded-full bg-slate-600/70" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-festive-pine/60">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-festive-gold" />
                <h3 className="font-serif font-bold text-base text-slate-100">
                  Filtros & Búsqueda
                </h3>
              </div>
              <button
                onClick={() => { sounds.playClick(); onClose(); }}
                className="p-1.5 rounded-full bg-festive-forest/80 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="px-5 py-4 overflow-y-auto space-y-5">
              
              {/* Search Bar */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar regalo, tienda..."
                    className="w-full pl-10 pr-8 py-2.5 bg-festive-forest/90 border border-festive-pine rounded-xl text-[16px] text-slate-100 placeholder-slate-400 focus:outline-none focus:border-festive-gold/60"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Categorías */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Ocasión / Categoría
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => { sounds.playClick(); setSelectedCategory('all'); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-festive-gold text-festive-dark font-bold shadow-md'
                        : 'bg-festive-forest/60 text-slate-300 border border-festive-pine/50'
                    }`}
                  >
                    <span>Todos los regalos</span>
                    {selectedCategory === 'all' && <Check className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => { sounds.playClick(); setSelectedCategory('navidad'); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                      selectedCategory === 'navidad'
                        ? 'bg-festive-cranberry text-white font-bold shadow-md border border-festive-gold/40'
                        : 'bg-festive-forest/60 text-slate-300 border border-festive-pine/50'
                    }`}
                  >
                    <span>🎄 Reyes & Navidad</span>
                    {selectedCategory === 'navidad' && <Check className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => { sounds.playClick(); setSelectedCategory('cumpleanos'); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                      selectedCategory === 'cumpleanos'
                        ? 'bg-amber-600 text-white font-bold shadow-md border border-amber-400/40'
                        : 'bg-festive-forest/60 text-slate-300 border border-festive-pine/50'
                    }`}
                  >
                    <span>🎂 Cumpleaños</span>
                    {selectedCategory === 'cumpleanos' && <Check className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Disponibilidad */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Disponibilidad
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { sounds.playClick(); setStatusFilter('all'); }}
                    className={`py-2 px-2 rounded-xl text-xs font-medium text-center transition-all ${
                      statusFilter === 'all'
                        ? 'bg-festive-emerald text-white font-bold shadow-sm'
                        : 'bg-festive-forest/60 text-slate-400 border border-festive-pine/50'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => { sounds.playClick(); setStatusFilter('available'); }}
                    className={`py-2 px-2 rounded-xl text-xs font-medium text-center transition-all ${
                      statusFilter === 'available'
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : 'bg-festive-forest/60 text-slate-400 border border-festive-pine/50'
                    }`}
                  >
                    Libres
                  </button>
                  <button
                    onClick={() => { sounds.playClick(); setStatusFilter('reserved'); }}
                    className={`py-2 px-2 rounded-xl text-xs font-medium text-center transition-all ${
                      statusFilter === 'reserved'
                        ? 'bg-festive-wine text-white font-bold shadow-sm border border-festive-ruby/40'
                        : 'bg-festive-forest/60 text-slate-400 border border-festive-pine/50'
                    }`}
                  >
                    Comprados
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-festive-pine/60 bg-[#0d1811] flex items-center gap-3">
              {isFiltered && (
                <button
                  onClick={handleReset}
                  className="p-3 rounded-xl bg-festive-forest/80 text-slate-400 hover:text-white border border-festive-pine/60 flex items-center justify-center shrink-0"
                  title="Restablecer filtros"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => { sounds.playClick(); onClose(); }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-festive-cranberry to-festive-wine text-white font-bold text-sm border border-festive-gold/40 shadow-glow-ruby active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>Ver {filteredCount} {filteredCount === 1 ? 'regalo' : 'regalos'}</span>
                <span className="text-xs text-festive-goldLight opacity-80">({totalCount} totales)</span>
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
