import React from 'react';
import { Search, Sparkles, Gift } from 'lucide-react';
import type { GiftCategory } from '../types';
import { sounds } from '../utils/audio';

export type StatusFilter = 'all' | 'available' | 'reserved';

interface FiltersBarProps {
  selectedCategory: GiftCategory | 'all';
  setSelectedCategory: (cat: GiftCategory | 'all') => void;
  statusFilter: StatusFilter;
  setStatusFilter: (status: StatusFilter) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  totalCount: number;
  filteredCount: number;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  selectedCategory,
  setSelectedCategory,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  totalCount,
  filteredCount,
}) => {

  return (
    <div className="w-full max-w-5xl mx-auto mb-4 sm:mb-6 px-2.5 sm:px-4 space-y-2.5 sm:space-y-3.5">
      {/* Search and counters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar regalo, tienda o detalle..."
            className="w-full pl-10 pr-8 py-2 sm:py-2.5 bg-festive-forest/70 border border-festive-pine rounded-xl text-[16px] sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-festive-gold/60 focus:ring-1 focus:ring-festive-gold/40 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Counter badge */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-sans">
          <span>Mostrando:</span>
          <span className="px-2.5 py-1 bg-festive-pine/60 rounded-full border border-festive-gold/20 text-festive-goldLight font-medium">
            {filteredCount} de {totalCount} deseos
          </span>
        </div>
      </div>

      {/* Pill Buttons for Categories & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => { sounds.playClick(); setSelectedCategory('all'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-festive-gold text-festive-dark font-semibold shadow-sm'
                : 'bg-festive-forest/60 text-slate-300 hover:bg-festive-pine/70 border border-festive-pine/50'
            }`}
          >
            Todos los regalos
          </button>
          <button
            onClick={() => { sounds.playClick(); setSelectedCategory('navidad'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              selectedCategory === 'navidad'
                ? 'bg-festive-cranberry text-white font-semibold shadow-sm border border-festive-gold/40'
                : 'bg-festive-forest/60 text-slate-300 hover:bg-festive-pine/70 border border-festive-pine/50'
            }`}
          >
            <span>🎄 Reyes & Navidad</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setSelectedCategory('cumpleanos'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              selectedCategory === 'cumpleanos'
                ? 'bg-amber-600 text-white font-semibold shadow-sm border border-amber-400/40'
                : 'bg-festive-forest/60 text-slate-300 hover:bg-festive-pine/70 border border-festive-pine/50'
            }`}
          >
            <span>🎂 Cumpleaños</span>
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => { sounds.playClick(); setStatusFilter('all'); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-festive-pine text-festive-goldLight font-medium border border-festive-gold/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cualquier estado
          </button>
          <button
            onClick={() => { sounds.playClick(); setStatusFilter('available'); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              statusFilter === 'available'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Disponibles</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setStatusFilter('reserved'); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              statusFilter === 'reserved'
                ? 'bg-festive-wine text-festive-goldLight border border-festive-gold/30'
                : 'text-slate-400 hover:text-red-300'
            }`}
          >
            <Gift className="w-3 h-3 text-festive-ruby" />
            <span>Ya reservados</span>
          </button>
        </div>
      </div>
    </div>
  );
};
