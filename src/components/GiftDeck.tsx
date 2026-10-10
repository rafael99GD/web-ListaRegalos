import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Gift as GiftIcon, 
  ExternalLink, 
  Check, 
  Sparkles, 
  Undo2, 
  Lock, 
  Tag 
} from 'lucide-react';
import type { Gift } from '../types';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../utils/audio';

interface GiftDeckProps {
  gifts: Gift[];
  onReserveClick: (gift: Gift) => void;
  onUnreserveClick: (gift: Gift) => void;
}

export const GiftDeck: React.FC<GiftDeckProps> = ({
  gifts,
  onReserveClick,
  onUnreserveClick,
}) => {
  const { currentUser, isAdmin, surpriseMode } = useAuth();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Reset index if gifts list changes or shrinks
  useEffect(() => {
    if (currentIndex >= gifts.length && gifts.length > 0) {
      setCurrentIndex(0);
    }
    setIsFlipped(false);
  }, [gifts.length]);

  const currentGift = gifts[currentIndex];

  // Motion values for swipe physics
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacityLike = useTransform(x, [50, 150], [0, 1]);
  const opacityPass = useTransform(x, [-150, -50], [1, 0]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        sounds.playClick();
        setIsFlipped(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, gifts.length]);

  const handleNext = () => {
    if (gifts.length === 0) return;
    sounds.playClick();
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % gifts.length);
  };

  const handlePrev = () => {
    if (gifts.length === 0) return;
    sounds.playClick();
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + gifts.length) % gifts.length);
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipeThreshold = 100;
    if (info.offset.x > swipeThreshold || info.velocity.x > 500) {
      // Swiped right: Want to reserve!
      if (currentGift && !currentGift.isReserved) {
        sounds.playChime();
        onReserveClick(currentGift);
      }
      handleNext();
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -500) {
      // Swiped left: Next gift
      handleNext();
    }
  };

  if (!currentGift || gifts.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto py-16 px-6 text-center bg-festive-card rounded-3xl border border-festive-pine/60 shadow-xl">
        <Sparkles className="w-12 h-12 text-festive-gold mx-auto mb-4 animate-bounce" />
        <h3 className="font-serif text-2xl font-bold text-festive-goldLight">
          No hay regalos en este filtro
        </h3>
        <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
          Prueba cambiando los filtros de categoría o disponibilidad en la barra superior.
        </p>
      </div>
    );
  }

  // Reservation permissions
  const isReservedByMe = Boolean(
    currentUser &&
    currentGift.isReserved &&
    (currentGift.reservedBy === currentUser.uid || currentGift.reservedBy === currentUser.username)
  );

  const canUnreserve = Boolean(
    currentGift.isReserved && (isReservedByMe || isAdmin)
  );

  let buyerLabel = '';
  if (currentGift.isReserved) {
    if (isReservedByMe) {
      buyerLabel = '¡Reservado por ti!';
    } else if (isAdmin && surpriseMode) {
      buyerLabel = 'Reservado (🤫 Sorpresa)';
    } else {
      buyerLabel = currentGift.reservedByName 
        ? `Reservado por ${currentGift.reservedByName}` 
        : 'Reservado por alguien';
    }
  }

  const nextGift = gifts[(currentIndex + 1) % gifts.length];

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto px-4 pb-12 flex flex-col items-center select-none">
      
      {/* Progress & Counter */}
      <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-400">
        <span className="font-serif text-festive-gold font-semibold">
          Deseo {currentIndex + 1} de {gifts.length}
        </span>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span>Usa las flechas ⬅️ ➡️ o desliza</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-festive-forest rounded-full overflow-hidden mb-6 border border-festive-pine/60">
        <div 
          className="h-full bg-gradient-to-r from-festive-wine via-festive-gold to-festive-emerald transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / gifts.length) * 100}%` }}
        />
      </div>

      {/* Stacked Cards Area */}
      <div className="relative w-full h-[470px] sm:h-[510px] perspective-1000">
        
        {/* Background Ghost Card (Next card preview) */}
        {gifts.length > 1 && nextGift && (
          <div 
            className="absolute inset-0 w-full h-full rounded-3xl bg-festive-card border border-festive-pine/40 shadow-lg transform scale-95 translate-y-3 opacity-60 pointer-events-none overflow-hidden"
          >
            <img 
              src={nextGift.img} 
              alt={nextGift.name} 
              className="w-full h-3/5 object-cover filter blur-[2px] opacity-40" 
            />
          </div>
        )}

        {/* Top Active Swipeable Card */}
        <motion.div
          key={currentGift.id + currentIndex}
          style={{ x, rotate }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          animate={{ scale: 1, y: 0 }}
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={`absolute inset-0 w-full h-full rounded-3xl cursor-grab active:cursor-grabbing transform-style-3d shadow-card-holiday border border-festive-pine/80 bg-festive-card ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Swiping Badges */}
          <motion.div
            style={{ opacity: opacityLike }}
            className="absolute top-8 left-8 z-30 pointer-events-none rotate-[-15deg] px-4 py-2 border-4 border-emerald-400 text-emerald-400 bg-black/60 rounded-xl font-display font-black text-xl tracking-wider backdrop-blur-sm"
          >
            ¡ME LO PIDO! 🎁
          </motion.div>

          <motion.div
            style={{ opacity: opacityPass }}
            className="absolute top-8 right-8 z-30 pointer-events-none rotate-[15deg] px-4 py-2 border-4 border-festive-ruby text-festive-ruby bg-black/60 rounded-xl font-display font-black text-xl tracking-wider backdrop-blur-sm"
          >
            SIGUIENTE ➡️
          </motion.div>

          {/* ================= FRONT ================= */}
          <div className="w-full h-full flex flex-col justify-between p-5 backface-hidden">
            
            {/* Image & Tags */}
            <div className="space-y-3">
              <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-black/50 border border-festive-pine/40 shadow-inner">
                <img
                  src={currentGift.img || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'}
                  alt={currentGift.name}
                  draggable={false}
                  className={`w-full h-full object-cover pointer-events-none ${
                    currentGift.isReserved ? 'filter grayscale-[30%] opacity-90' : ''
                  }`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80';
                  }}
                />

                {/* Price Pill */}
                <div className="absolute top-3 right-3 px-3.5 py-1.5 rounded-full bg-festive-dark/90 backdrop-blur-md border border-festive-gold/60 text-festive-goldLight font-bold text-sm shadow-xl flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-festive-gold" />
                  <span>{currentGift.price}</span>
                </div>

                {/* Category Pill */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="px-3 py-1 rounded-full bg-festive-forest/90 backdrop-blur-md border border-festive-pine text-xs text-slate-200 font-medium">
                    {currentGift.category === 'navidad' && '🎄 Reyes / Navidad'}
                    {currentGift.category === 'cumpleanos' && '🎂 Cumpleaños'}
                    {currentGift.category === 'ambos' && '✨ Navidad & Cumple'}
                  </span>
                  {currentGift.priority === 'ilusion-maxima' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-festive-wine/90 backdrop-blur-md border border-festive-gold/40 text-[10px] text-festive-goldLight font-semibold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-festive-gold" />
                      Ilusión Máxima
                    </span>
                  )}
                </div>

                {/* Reserved Stamp */}
                {currentGift.isReserved && (
                  <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center p-4">
                    <div className="stamp-reserved px-5 py-2 text-sm sm:text-base bg-festive-wine/90 text-festive-goldLight border-2 border-festive-gold rounded-xl shadow-2xl tracking-wider">
                      {isReservedByMe ? '🎁 RESERVADO POR TI' : '🎁 YA RESERVADO'}
                    </div>
                  </div>
                )}
              </div>

              {/* Title & snippet */}
              <div className="pt-1">
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-slate-100 leading-tight">
                  {currentGift.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mt-1.5 leading-relaxed font-light">
                  {currentGift.descripcion || 'Toca el botón girar para leer más detalles o ver el enlace.'}
                </p>
              </div>
            </div>

            {/* Bottom Status info */}
            <div className="pt-2 border-t border-festive-pine/60 flex items-center justify-between text-xs">
              {currentGift.isReserved ? (
                <span className="text-festive-gold font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-festive-gold" />
                  <span className="truncate max-w-[200px]">{buyerLabel}</span>
                </span>
              ) : (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Disponible
                </span>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playClick();
                  setIsFlipped(true);
                }}
                className="text-festive-goldLight hover:text-white flex items-center gap-1 text-xs underline underline-offset-2"
              >
                <span>Detalles</span>
                <RotateCw className="w-3 h-3" />
              </button>
            </div>

          </div>

          {/* ================= BACK ================= */}
          <div className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-[#122A20] via-[#0E221A] to-[#081510] border-2 border-festive-gold/40 p-6 flex flex-col justify-between rotate-y-180 backface-hidden text-slate-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-festive-pine pb-3">
                <span className="text-xs uppercase tracking-widest text-festive-gold font-serif font-bold">
                  Ficha del Deseo
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playClick();
                    setIsFlipped(false);
                  }}
                  className="p-1.5 rounded-full bg-festive-forest text-slate-300 hover:text-white"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h4 className="font-serif font-bold text-xl text-festive-goldLight">
                  {currentGift.name}
                </h4>
                <p className="text-sm font-semibold text-slate-300 mt-1">
                  Precio: <span className="text-festive-gold text-base">{currentGift.price}</span>
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-festive-goldLight uppercase tracking-wider">
                  Notas personales:
                </p>
                <div className="bg-festive-forest/70 p-4 rounded-2xl border border-festive-pine text-sm text-slate-300 leading-relaxed max-h-48 overflow-y-auto">
                  {currentGift.descripcion || 'Sin notas adicionales.'}
                </div>
              </div>

              {isAdmin && (
                <div className="text-xs text-slate-400 bg-black/40 p-2.5 rounded-xl border border-white/5 space-y-1">
                  <p>👁️ Visible para: <span className="text-slate-200">{currentGift.visibleTo.join(', ')}</span></p>
                  {currentGift.reservedByName && (
                    <p>👤 Comprador: <span className="text-festive-gold">{currentGift.reservedByName}</span></p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-festive-pine">
              {currentGift.link ? (
                <a
                  href={currentGift.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-festive-gold text-festive-dark font-bold text-sm flex items-center justify-center gap-2 hover:bg-festive-goldLight transition-colors shadow-lg"
                >
                  <span>Ver en Tienda Oficial</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <p className="text-center text-xs text-slate-400 italic py-2">
                  No requiere enlace externo
                </p>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playClick();
                  setIsFlipped(false);
                }}
                className="w-full py-2 text-xs text-slate-400 hover:text-white"
              >
                Volver a la portada
              </button>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Tactile Control Buttons Bar */}
      <div className="w-full max-w-sm flex items-center justify-center gap-3 sm:gap-4 mt-6">
        
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-festive-forest border border-festive-pine text-slate-300 hover:text-white hover:bg-festive-pine flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
          title="Regalo anterior (Flecha Izquierda)"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Flip Button */}
        <button
          onClick={() => {
            sounds.playClick();
            setIsFlipped(prev => !prev);
          }}
          className="w-12 h-12 rounded-full bg-festive-forest border border-festive-pine text-festive-goldLight hover:text-festive-gold hover:bg-festive-pine flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
          title="Girar tarjeta para ver detalles"
        >
          <RotateCw className="w-5 h-5" />
        </button>

        {/* Reserve / Unreserve Main Action */}
        {!currentGift.isReserved ? (
          <button
            onClick={() => {
              sounds.playClick();
              onReserveClick(currentGift);
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-festive-wine via-festive-cranberry to-festive-wine text-white font-bold text-sm sm:text-base border border-festive-gold/50 shadow-glow-ruby hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <GiftIcon className="w-4 h-4 text-festive-goldLight" />
            <span>¡Me lo pido!</span>
          </button>
        ) : canUnreserve ? (
          <button
            onClick={() => {
              sounds.playClick();
              onUnreserveClick(currentGift);
            }}
            className="flex-1 py-3 px-3 rounded-2xl bg-festive-wine/50 hover:bg-festive-wine text-slate-200 font-medium text-xs sm:text-sm border border-festive-ruby/50 flex items-center justify-center gap-1.5 transition-all"
          >
            <Undo2 className="w-4 h-4" />
            <span>Restaurar</span>
          </button>
        ) : (
          <div className="flex-1 py-3 px-4 rounded-2xl bg-festive-forest/60 text-slate-400 font-medium text-xs sm:text-sm border border-festive-pine/50 flex items-center justify-center gap-2 cursor-not-allowed">
            <Lock className="w-4 h-4 text-slate-500" />
            <span>Ya Reservado</span>
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-festive-forest border border-festive-pine text-slate-300 hover:text-white hover:bg-festive-pine flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
          title="Siguiente regalo (Flecha Derecha)"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>

    </div>
  );
};
