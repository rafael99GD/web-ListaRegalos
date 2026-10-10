import React from 'react';
import type { Gift } from '../types';
import { GiftCard } from './GiftCard';
import { Sparkles } from 'lucide-react';

interface GiftGridProps {
  gifts: Gift[];
  onReserveClick: (gift: Gift) => void;
  onUnreserveClick: (gift: Gift) => void;
}

export const GiftGrid: React.FC<GiftGridProps> = ({
  gifts,
  onReserveClick,
  onUnreserveClick,
}) => {
  if (gifts.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto py-16 px-6 text-center bg-festive-card rounded-3xl border border-festive-pine/60 shadow-xl">
        <Sparkles className="w-12 h-12 text-festive-gold mx-auto mb-4 animate-bounce" />
        <h3 className="font-serif text-2xl font-bold text-festive-goldLight">
          No hay regalos que coincidan
        </h3>
        <p className="text-slate-400 text-sm mt-2">
          Intenta cambiar los filtros seleccionados o la búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {gifts.map(gift => (
          <GiftCard
            key={gift.id}
            gift={gift}
            onReserveClick={onReserveClick}
            onUnreserveClick={onUnreserveClick}
          />
        ))}
      </div>
    </div>
  );
};
