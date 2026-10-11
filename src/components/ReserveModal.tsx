import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift as GiftIcon, X, Sparkles, AlertCircle, Undo2, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Gift } from '../types';
import { sounds } from '../utils/audio';

interface ReserveModalProps {
  gift: Gift | null;
  mode: 'reserve' | 'unreserve';
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (gift: Gift) => Promise<void>;
}

export const ReserveModal: React.FC<ReserveModalProps> = ({
  gift,
  mode,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !gift) return null;

  const triggerCelebration = () => {
    sounds.playChime();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#B32638', '#235942', '#F3E5AB']
    });
  };

  const handleAction = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await onConfirm(gift);
      if (mode === 'reserve') {
        triggerCelebration();
      } else {
        sounds.playClick();
      }
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || 'Ocurrió un error al actualizar el regalo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-gradient-to-b from-[#162F24] to-[#0D2119] border-2 border-festive-gold/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-5"
        >
          {/* Close button */}
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="absolute top-4 right-4 p-2 rounded-full bg-festive-forest hover:bg-festive-wine text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon Header */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg ${
              mode === 'reserve' 
                ? 'bg-festive-cranberry border-festive-gold text-festive-goldLight shadow-glow-ruby'
                : 'bg-festive-pine border-festive-pine/60 text-slate-300'
            }`}>
              {mode === 'reserve' ? <GiftIcon className="w-6 h-6" /> : <Undo2 className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-festive-goldLight">
                {mode === 'reserve' ? '¿Vas a comprar este regalo?' : 'Reactivar regalo'}
              </h3>
              <p className="text-xs text-slate-300">
                {mode === 'reserve' ? 'Confirmación para evitar duplicados' : 'Función de Administrador'}
              </p>
            </div>
          </div>

          {/* Gift summary box */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-black/40 border border-festive-pine/60">
            <img
              src={gift.img}
              alt={gift.name}
              className="w-16 h-16 rounded-xl object-cover border border-festive-gold/30"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-serif font-semibold text-sm text-slate-100 truncate">
                {gift.name}
              </h4>
              <p className="text-xs text-festive-gold font-bold mt-0.5">
                {gift.price}
              </p>
              <span className="inline-block text-[10px] text-slate-400 mt-0.5">
                {gift.category === 'navidad' ? '🎄 Reyes / Navidad' : gift.category === 'cumpleanos' ? '🎂 Cumpleaños' : '✨ Navidad & Cumple'}
              </span>
            </div>
          </div>

          {/* Important instructions */}
          {mode === 'reserve' ? (
            <div className="p-3.5 bg-festive-forest/80 rounded-2xl border border-festive-pine space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-festive-gold shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <span className="font-bold text-festive-goldLight">Importante: </span>
                  Al marcarlo, aparecerá como comprado para el resto de la familia y amigos para que nadie más lo compre.
                </p>
              </div>
              <p className="text-[11px] text-amber-200/80 pl-6">
                ⚠️ Una vez marcado <span className="underline">no podrás desmarcarlo tú</span>. Si te equivocas, tendrás que avisar a Rafael para que lo reactive.
              </p>
            </div>
          ) : (
            <div className="p-3.5 bg-festive-forest/80 rounded-2xl border border-festive-pine text-xs text-slate-300">
              <p>
                ¿Deseas restaurar <span className="text-white font-semibold">"{gift.name}"</span> a disponible?
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Volverá a aparecer como libre para que cualquier persona pueda comprarlo.
              </p>
            </div>
          )}

          {/* Error notice */}
          {error && (
            <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-end gap-2 sm:gap-3 pt-2">
            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              disabled={submitting}
              className="w-full xs:w-auto px-4 py-2.5 rounded-xl bg-festive-forest hover:bg-festive-pine text-slate-300 hover:text-white text-xs font-medium transition-colors text-center"
            >
              Cancelar
            </button>

            <button
              onClick={handleAction}
              disabled={submitting}
              className={`w-full xs:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                mode === 'reserve'
                  ? 'bg-gradient-to-r from-festive-cranberry to-festive-wine text-white border border-festive-gold hover:scale-102 active:scale-98 shadow-glow-ruby'
                  : 'bg-festive-wine hover:bg-festive-ruby text-white border border-festive-ruby/40'
              }`}
            >
              {submitting ? (
                <span>Guardando...</span>
              ) : mode === 'reserve' ? (
                <>
                  <Sparkles className="w-4 h-4 text-festive-gold" />
                  <span>¡Sí, lo he comprado!</span>
                </>
              ) : (
                <>
                  <Undo2 className="w-4 h-4" />
                  <span>Sí, reactivar regalo</span>
                </>
              )}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
