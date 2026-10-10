import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, X, Feather } from 'lucide-react';
import type { LetterConfig } from '../types';
import { sounds } from '../utils/audio';

interface IntroLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  letter: LetterConfig;
  userDisplayName?: string;
}

export const IntroLetterModal: React.FC<IntroLetterModalProps> = ({
  isOpen,
  onClose,
  letter,
  userDisplayName
}) => {
  const [isUnsealed, setIsUnsealed] = useState<boolean>(false);

  const handleOpenEnvelope = () => {
    sounds.playPaper();
    sounds.playChime();
    setIsUnsealed(true);
  };

  const handleDismiss = () => {
    sounds.playClick();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

        {/* Envelope or Letter Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl my-auto z-10"
        >
          {/* Close button top right */}
          <button
            onClick={handleDismiss}
            aria-label="Cerrar carta"
            className="absolute -top-3 -right-3 z-30 w-10 h-10 rounded-full bg-festive-wine text-festive-goldLight border border-festive-gold/40 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {!isUnsealed ? (
            /* SEALED ENVELOPE VIEW */
            <div className="relative bg-[#1A3125] rounded-2xl border-2 border-festive-gold/30 p-8 sm:p-12 text-center shadow-2xl overflow-hidden">
              {/* Gold foil decorative corner flourishes */}
              <div className="absolute top-3 left-3 text-festive-gold/40 text-xl font-serif">✧</div>
              <div className="absolute top-3 right-3 text-festive-gold/40 text-xl font-serif">✧</div>
              <div className="absolute bottom-3 left-3 text-festive-gold/40 text-xl font-serif">✧</div>
              <div className="absolute bottom-3 right-3 text-festive-gold/40 text-xl font-serif">✧</div>

              <div className="max-w-md mx-auto space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-festive-forest/60 border border-festive-gold/20 text-festive-goldLight text-xs tracking-wider uppercase">
                  <Mail className="w-3.5 h-3.5 text-festive-gold" />
                  {letter.temporada || 'Edición Especial 2026'}
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl text-festive-gold font-bold leading-tight drop-shadow-sm">
                  Tienes una carta personal
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                  {userDisplayName ? `Para ti, ${userDisplayName}: ` : ''}
                  Una nota especial antes de ver la lista de deseos de este año.
                </p>

                {/* Interactive Wax Seal */}
                <div className="pt-4 flex flex-col items-center">
                  <motion.button
                    onClick={handleOpenEnvelope}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative cursor-pointer focus:outline-none"
                    title="Romper sello y abrir carta"
                  >
                    {/* Glowing ring */}
                    <div className="absolute -inset-3 rounded-full bg-festive-ruby/20 blur-md group-hover:bg-festive-ruby/40 transition-all animate-pulse" />
                    
                    {/* Wax Seal Circle */}
                    <div className="relative w-24 h-24 rounded-full wax-seal border-2 border-amber-300/40 flex flex-col items-center justify-center text-white shadow-glow-ruby">
                      <span className="font-serif text-3xl font-extrabold text-amber-100 tracking-wider">
                        R
                      </span>
                      <span className="text-[9px] uppercase tracking-widest text-amber-200/80 font-sans mt-0.5">
                        Abrir
                      </span>
                    </div>
                  </motion.button>
                  <p className="mt-4 text-xs text-amber-200/70 font-sans flex items-center gap-1.5 animate-bounce">
                    <Sparkles className="w-3.5 h-3.5 text-festive-gold" />
                    Toca el sello para abrir la carta
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* UNFOLDED PARCHMENT LETTER */
            <motion.div
              initial={{ rotateX: 20, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative bg-gradient-to-b from-[#FDFBF7] to-[#F5EFE3] text-[#25282A] rounded-2xl shadow-2xl p-6 sm:p-10 border-4 border-[#D4AF37]/50 max-h-[85vh] overflow-y-auto"
            >
              {/* Paper texture overlay decoration */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-festive-wine via-festive-gold to-festive-emerald opacity-70" />

              <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Feather className="w-5 h-5 text-festive-cranberry" />
                  <span className="text-xs uppercase tracking-widest text-[#7C6354] font-medium font-serif">
                    {letter.temporada || 'Lista de Deseos & Reyes'}
                  </span>
                </div>
                <span className="text-xs text-[#8C7A6B] italic font-serif">
                  Hecho con ilusión
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="font-serif text-2xl sm:text-3xl text-festive-wine font-bold tracking-tight">
                  {letter.titulo}
                </h1>

                {letter.subtitulo && (
                  <p className="text-sm text-[#5C554E] italic font-serif">
                    {letter.subtitulo}
                  </p>
                )}

                <div className="space-y-3.5 text-[#37352F] text-sm sm:text-base leading-relaxed font-sans">
                  {letter.parrafos.map((p, idx) => (
                    <p key={idx} className="first-letter:font-serif first-letter:text-xl first-letter:font-semibold">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Signature */}
                <div className="pt-6 border-t border-[#D4AF37]/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase text-[#8C7A6B] tracking-wider font-sans">
                      Firmado:
                    </p>
                    <p className="font-handwriting text-3xl sm:text-4xl text-festive-cranberry font-bold mt-1">
                      {letter.firma}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleDismiss}
                    className="px-6 py-3.5 rounded-xl bg-festive-emerald text-white font-medium text-sm sm:text-base shadow-lg hover:bg-festive-emerald/90 flex items-center justify-center gap-2 border border-festive-gold/40 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-festive-gold" />
                    <span>¡Descubrir los Regalos!</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
