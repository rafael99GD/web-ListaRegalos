import React, { useState } from 'react';
import { 
  ExternalLink, 
  Gift as GiftIcon, 
  RotateCw, 
  Check, 
  Lock, 
  Undo2, 
  Sparkles, 
  Tag 
} from 'lucide-react';
import type { Gift } from '../types';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../utils/audio';

interface GiftCardProps {
  gift: Gift;
  onReserveClick: (gift: Gift) => void;
  onUnreserveClick: (gift: Gift) => void;
}

export const GiftCard: React.FC<GiftCardProps> = ({
  gift,
  onReserveClick,
  onUnreserveClick,
}) => {
  const { isAdmin } = useAuth();
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    setIsFlipped(prev => !prev);
  };

  return (
    <div className="relative group w-full perspective-1000">
      <div 
        className={`relative w-full rounded-2xl transition-transform duration-500 transform-style-3d shadow-card-holiday border border-festive-pine/60 bg-festive-card ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ minHeight: '440px' }}
      >
        {/* ================= FRONT OF CARD ================= */}
        <div className="w-full h-full flex flex-col justify-between p-4 backface-hidden">
          
          {/* Top Badges & Image */}
          <div className="space-y-3">
            <div className="relative w-full h-52 sm:h-56 rounded-xl overflow-hidden bg-black/40 border border-festive-pine/40">
              <img
                src={gift.img || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'}
                alt={gift.name}
                loading="lazy"
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                  gift.isReserved ? 'filter grayscale-[30%] opacity-90' : ''
                }`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80';
                }}
              />

              {/* Price Tag (Top Right) */}
              <div className="absolute top-2.5 right-2.5 px-3 py-1 rounded-full bg-festive-dark/90 backdrop-blur-md border border-festive-gold/50 text-festive-goldLight font-bold text-xs sm:text-sm shadow-lg flex items-center gap-1">
                <Tag className="w-3 h-3 text-festive-gold" />
                <span>{gift.price}</span>
              </div>

              {/* Category Badge (Top Left) */}
              <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-festive-forest/90 backdrop-blur-md border border-festive-pine text-[11px] text-slate-200 font-medium">
                  {gift.category === 'navidad' && '🎄 Reyes / Navidad'}
                  {gift.category === 'cumpleanos' && '🎂 Cumpleaños'}
                  {gift.category === 'ambos' && '✨ Navidad & Cumple'}
                </span>

                {gift.priority === 'ilusion-maxima' && (
                  <span className="px-2 py-0.5 rounded-full bg-festive-wine/90 backdrop-blur-md border border-festive-gold/40 text-[10px] text-festive-goldLight font-semibold flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-festive-gold" />
                    Ilusión Máxima
                  </span>
                )}
              </div>

              {/* RESERVED STAMP OVERLAY (100% Anonymous - No names ever) */}
              {gift.isReserved && (
                <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center p-4">
                  <div className="stamp-reserved px-4 py-2 text-xs sm:text-sm bg-festive-wine/90 text-festive-goldLight border-2 border-festive-gold rounded-lg shadow-xl tracking-wider">
                    🎁 REGALO YA COMPRADO
                  </div>
                </div>
              )}

              {/* Flip Button overlay on photo */}
              <button
                onClick={handleFlip}
                className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-festive-dark/80 backdrop-blur-md border border-white/20 text-slate-200 flex items-center justify-center hover:bg-festive-forest transition-colors shadow-md"
                title="Girar para ver detalles"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Gift Title & Brief description */}
            <div className="px-1 pt-1">
              <h3 className="font-serif font-bold text-base sm:text-lg text-slate-100 line-clamp-1 group-hover:text-festive-goldLight transition-colors">
                {gift.name}
              </h3>
              {gift.descripcion && gift.descripcion.trim() ? (
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 min-h-[32px] leading-relaxed">
                  {gift.descripcion}
                </p>
              ) : null}
            </div>
          </div>

          {/* Bottom Actions & Status */}
          <div className="pt-3 border-t border-festive-pine/50 mt-2 space-y-2">
            
            {/* Status indicator line */}
            <div className="flex items-center justify-between text-xs px-1">
              {gift.isReserved ? (
                <span className="text-festive-gold font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-festive-gold" />
                  <span>Ya comprado</span>
                </span>
              ) : (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Disponible para comprar
                </span>
              )}

              {gift.link && (
                <a
                  href={gift.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sounds.playClick()}
                  className="text-slate-400 hover:text-festive-gold flex items-center gap-1 text-[11px] underline underline-offset-2 transition-colors"
                >
                  <span>Ver tienda</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Main Action Button */}
            {!gift.isReserved ? (
              <button
                onClick={() => { sounds.playClick(); onReserveClick(gift); }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-festive-forest via-festive-emerald to-festive-forest hover:from-festive-emerald hover:to-festive-pine text-white font-medium text-xs sm:text-sm border border-festive-gold/40 shadow-sm flex items-center justify-center gap-2 group-hover:border-festive-gold transition-all"
              >
                <GiftIcon className="w-4 h-4 text-festive-gold" />
                <span>¡Me lo pido para regalárselo!</span>
              </button>
            ) : isAdmin ? (
              /* ONLY ADMIN CAN RESTORE */
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  sounds.playClick(); 
                  onUnreserveClick(gift); 
                }}
                className="w-full py-2 px-3 rounded-xl bg-festive-wine/50 hover:bg-festive-wine text-festive-goldLight font-medium text-xs border border-festive-ruby/50 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Reactivar regalo (Solo Admin)</span>
              </button>
            ) : (
              /* REGULAR USERS SEE LOCK & CONTACT RAFAEL NOTICE */
              <div className="w-full py-2 px-2.5 rounded-xl bg-festive-forest/50 text-slate-400 text-[11px] border border-festive-pine/40 flex items-center justify-center gap-1.5 text-center">
                <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Comprado. Si te equivocaste, avisa a Rafael para reactivarlo.</span>
              </div>
            )}
          </div>

        </div>

        {/* ================= BACK OF CARD (DETAILS) ================= */}
        <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-[#122A20] to-[#0A1813] border border-festive-gold/30 p-5 flex flex-col justify-between rotate-y-180 backface-hidden text-slate-200">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-festive-pine pb-3">
              <span className="text-xs uppercase tracking-widest text-festive-gold font-serif font-bold">
                Detalles del Deseo
              </span>
              <button
                onClick={handleFlip}
                className="p-1.5 rounded-full bg-festive-forest text-slate-300 hover:text-white"
                title="Volver al frente"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h4 className="font-serif font-bold text-lg text-festive-goldLight">
                {gift.name}
              </h4>
              <p className="text-sm font-semibold text-slate-300 mt-0.5">
                Precio estimado: <span className="text-festive-gold">{gift.price}</span>
              </p>
            </div>

            {gift.descripcion && gift.descripcion.trim() ? (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-festive-goldLight uppercase tracking-wider">
                  Notas y por qué lo quiero:
                </p>
                <div className="bg-festive-forest/70 p-3 rounded-xl border border-festive-pine text-xs text-slate-300 leading-relaxed max-h-36 overflow-y-auto">
                  {gift.descripcion}
                </div>
              </div>
            ) : null}

            {isAdmin && (
              <div className="text-[11px] text-slate-400 bg-black/30 p-2 rounded-lg border border-white/5 space-y-1">
                <p>👁️ <span className="text-slate-300">Visible para:</span> {gift.visibleTo.includes('all') ? 'Todos' : gift.visibleTo.join(', ')}</p>
                <p>🔒 <span className="text-slate-300">Estado:</span> {gift.isReserved ? 'Comprado' : 'Disponible'}</p>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-festive-pine">
            {gift.link ? (
              <a
                href={gift.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-festive-gold text-festive-dark font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 hover:bg-festive-goldLight transition-colors"
              >
                <span>Abrir tienda oficial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <p className="text-center text-xs text-slate-400 italic">
                Sin enlace directo disponible
              </p>
            )}

            <button
              onClick={handleFlip}
              className="w-full py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Volver a la foto
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
