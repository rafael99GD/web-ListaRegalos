import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, KeyRound, User, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../utils/audio';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor escribe tu nombre.');
      return;
    }
    if (!password.trim()) {
      setError('Por favor escribe tu contraseña.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await login(name, password);
      if (res.success) {
        sounds.playChime();
        onClose();
      } else {
        setError(res.message || 'Nombre o contraseña incorrectos.');
      }
    } catch (err: unknown) {
      console.error(err);
      setError('Error al verificar las credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-gradient-to-b from-[#142B20] to-[#0A1812] border-2 border-festive-gold/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6"
        >
          {/* Close */}
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="absolute top-4 right-4 p-2 rounded-full bg-festive-forest hover:bg-festive-wine text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-festive-wine border border-festive-gold/50 mx-auto flex items-center justify-center text-festive-gold shadow-glow-ruby">
              <KeyRound className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-festive-goldLight">
              Acceso con Clave
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Introduce tu nombre y clave para desbloquear regalos exclusivos creados solo para ti, o para entrar como Administrador.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-festive-goldLight flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-festive-gold" />
                <span>Nombre:</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej: Susana, Rafael..."
                autoComplete="name"
                className="w-full px-4 py-2.5 bg-festive-forest border border-festive-pine rounded-xl text-[16px] sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-festive-gold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-festive-goldLight flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-festive-gold" />
                <span>Contraseña:</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu clave secreta..."
                autoComplete="current-password"
                className="w-full px-4 py-2.5 bg-festive-forest border border-festive-pine rounded-xl text-[16px] sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-festive-gold"
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-festive-wine via-festive-cranberry to-festive-wine text-white font-bold text-sm border border-festive-gold/60 shadow-glow-ruby hover:scale-101 active:scale-99 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-festive-goldLight" />
              <span>{loading ? 'Comprobando clave...' : 'Desbloquear Acceso'}</span>
            </button>
          </form>

          {/* Quick info note */}
          <div className="pt-3 border-t border-festive-pine/60 text-center">
            <p className="text-[11px] text-slate-400">
              💡 <span className="text-slate-300 font-medium">¿Solo quieres ver los regalos normales?</span> No necesitas ninguna clave, la web pública ya tiene todos los regalos generales abiertos para ti.
            </p>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
