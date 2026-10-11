import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  ShieldCheck, 
  Layers, 
  FileText, 
  Users, 
  Flame, 
  Check, 
  Sparkles,
  AlertTriangle,
  KeyRound,
  Undo2
} from 'lucide-react';
import type { Gift, LetterConfig, GiftCategory, GiftPriority } from '../types';
import { isFirebaseConfigured, firebaseConfig } from '../config/firebase';
import { giftService } from '../services/giftService';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../utils/audio';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  gifts: Gift[];
  letter: LetterConfig;
  onSaveLetter: (letter: LetterConfig) => Promise<void>;
  onUnreserveGift: (gift: Gift) => Promise<void>;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  gifts,
  letter,
  onSaveLetter,
  onUnreserveGift,
}) => {
  const { specialUsers, addSpecialUser, deleteSpecialUser, adminPassword, setAdminPassword } = useAuth();
  const [activeTab, setActiveTab] = useState<'gifts' | 'letter' | 'users' | 'firebase'>('gifts');

  // Gift Form State
  const [editingGiftId, setEditingGiftId] = useState<string | null>(null);
  const [giftForm, setGiftForm] = useState({
    name: '',
    price: '',
    img: '',
    link: '',
    descripcion: '',
    category: 'ambos' as GiftCategory,
    priority: 'deseado' as GiftPriority,
    visibleTo: ['all'] as string[]
  });

  // Letter Form State
  const [letterForm, setLetterForm] = useState<LetterConfig>(letter);
  const [letterSaving, setLetterSaving] = useState(false);
  const [letterSavedMsg, setLetterSavedMsg] = useState(false);

  // New Special User Form State
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    password: '',
  });

  // Change Admin Pass State
  const [newAdminPass, setNewAdminPass] = useState(adminPassword);
  const [adminPassSavedMsg, setAdminPassSavedMsg] = useState(false);

  if (!isOpen) return null;

  const resetGiftForm = () => {
    setEditingGiftId(null);
    setGiftForm({
      name: '',
      price: '',
      img: '',
      link: '',
      descripcion: '',
      category: 'ambos',
      priority: 'deseado',
      visibleTo: ['all']
    });
  };

  const handleStartEdit = (gift: Gift) => {
    sounds.playClick();
    setEditingGiftId(gift.id);
    setGiftForm({
      name: gift.name,
      price: gift.price,
      img: gift.img,
      link: gift.link,
      descripcion: gift.descripcion,
      category: gift.category,
      priority: gift.priority,
      visibleTo: gift.visibleTo || ['all']
    });
  };

  const handleSaveGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftForm.name.trim()) return;

    sounds.playChime();
    if (editingGiftId) {
      await giftService.updateGift(editingGiftId, giftForm);
    } else {
      await giftService.addGift(giftForm);
    }
    resetGiftForm();
  };

  const handleDeleteGift = async (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este regalo permanentemente?')) {
      sounds.playClick();
      await giftService.deleteGift(id);
    }
  };

  const handleSaveLetterForm = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    setLetterSaving(true);
    await onSaveLetter(letterForm);
    setLetterSaving(false);
    setLetterSavedMsg(true);
    setTimeout(() => setLetterSavedMsg(false), 3000);
  };

  const handleAddSpecialUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name.trim() || !newUserForm.password.trim()) return;

    sounds.playChime();
    await addSpecialUser(newUserForm.name, newUserForm.password);
    setNewUserForm({
      name: '',
      password: '',
    });
  };

  const handleDeleteSpecialUser = async (id: string) => {
    if (window.confirm('¿Eliminar este usuario con clave especial?')) {
      sounds.playClick();
      await deleteSpecialUser(id);
    }
  };

  const handleChangeAdminPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPass.trim()) return;
    setAdminPassword(newAdminPass);
    sounds.playChime();
    setAdminPassSavedMsg(true);
    setTimeout(() => setAdminPassSavedMsg(false), 3000);
  };

  const toggleVisibilityUser = (userName: string) => {
    setGiftForm(prev => {
      let current = [...prev.visibleTo];
      if (userName === 'all') {
        return { ...prev, visibleTo: ['all'] };
      }
      current = current.filter(item => item !== 'all');
      if (current.includes(userName)) {
        current = current.filter(item => item !== userName);
        if (current.length === 0) current = ['all'];
      } else {
        current.push(userName);
      }
      return { ...prev, visibleTo: current };
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-gradient-to-b from-[#14291F] via-[#0E2018] to-[#091510] border-2 border-festive-gold/40 rounded-3xl p-4 sm:p-8 shadow-2xl text-slate-100 flex flex-col max-h-[90vh]"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-festive-pine/80">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-festive-cranberry border border-festive-gold/50 flex items-center justify-center text-festive-gold shadow-glow-ruby">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg sm:text-xl text-festive-goldLight flex items-center gap-2">
                  <span>Panel de Control de Rafael</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Gestiona regalos, audiencias privadas y carta personal
                </p>
              </div>
            </div>

            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="p-2 rounded-full bg-festive-forest hover:bg-festive-wine text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 pt-4 pb-2 border-b border-festive-pine/50 overflow-x-auto text-xs sm:text-sm">
            <button
              onClick={() => { sounds.playClick(); setActiveTab('gifts'); }}
              className={`px-3.5 py-2 rounded-xl font-medium transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'gifts'
                  ? 'bg-festive-gold text-festive-dark font-bold shadow-md'
                  : 'bg-festive-forest/60 text-slate-300 hover:bg-festive-pine'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Regalos ({gifts.length})</span>
            </button>

            <button
              onClick={() => { sounds.playClick(); setActiveTab('letter'); }}
              className={`px-3.5 py-2 rounded-xl font-medium transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'letter'
                  ? 'bg-festive-gold text-festive-dark font-bold shadow-md'
                  : 'bg-festive-forest/60 text-slate-300 hover:bg-festive-pine'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Editar Carta</span>
            </button>

            <button
              onClick={() => { sounds.playClick(); setActiveTab('users'); }}
              className={`px-3.5 py-2 rounded-xl font-medium transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'users'
                  ? 'bg-festive-gold text-festive-dark font-bold shadow-md'
                  : 'bg-festive-forest/60 text-slate-300 hover:bg-festive-pine'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Usuarios con Clave ({specialUsers.length})</span>
            </button>

            <button
              onClick={() => { sounds.playClick(); setActiveTab('firebase'); }}
              className={`px-3.5 py-2 rounded-xl font-medium transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'firebase'
                  ? 'bg-festive-gold text-festive-dark font-bold shadow-md'
                  : 'bg-festive-forest/60 text-slate-300 hover:bg-festive-pine'
              }`}
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Estado Firebase</span>
            </button>
          </div>

          {/* Tab Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-6">
            
            {/* ================= TAB 1: GIFTS ================= */}
            {activeTab === 'gifts' && (
              <div className="space-y-6">
                
                {/* Add / Edit Gift Form Box */}
                <div className="bg-festive-forest/80 rounded-2xl p-4 sm:p-6 border border-festive-pine shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-base sm:text-lg text-festive-goldLight flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-festive-gold" />
                      {editingGiftId ? 'Editando Regalo' : 'Añadir Nuevo Regalo'}
                    </h3>
                    {editingGiftId && (
                      <button
                        onClick={resetGiftForm}
                        className="text-xs text-slate-400 hover:text-white underline"
                      >
                        Cancelar edición
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveGift} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Nombre del regalo:</label>
                      <input
                        type="text"
                        required
                        value={giftForm.name}
                        onChange={(e) => setGiftForm({ ...giftForm, name: e.target.value })}
                        placeholder="ej: Lámpara Hollow Knight, Juego X..."
                        className="w-full px-3 py-2 bg-black/40 border border-festive-pine rounded-xl text-[16px] sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-festive-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Precio estimado o rango:</label>
                      <input
                        type="text"
                        required
                        value={giftForm.price}
                        onChange={(e) => setGiftForm({ ...giftForm, price: e.target.value })}
                        placeholder="ej: 29.99€ o 50€ - 80€"
                        className="w-full px-3 py-2 bg-black/40 border border-festive-pine rounded-xl text-[16px] sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-festive-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Enlace a tienda o producto:</label>
                      <input
                        type="url"
                        value={giftForm.link}
                        onChange={(e) => setGiftForm({ ...giftForm, link: e.target.value })}
                        placeholder="https://amazon.es/... (opcional)"
                        className="w-full px-3 py-2 bg-black/40 border border-festive-pine rounded-xl text-[16px] sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-festive-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">URL de imagen:</label>
                      <input
                        type="url"
                        value={giftForm.img}
                        onChange={(e) => setGiftForm({ ...giftForm, img: e.target.value })}
                        placeholder="https://... imagen o foto del regalo"
                        className="w-full px-3 py-2 bg-black/40 border border-festive-pine rounded-xl text-[16px] sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-festive-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Categoría:</label>
                      <select
                        value={giftForm.category}
                        onChange={(e) => setGiftForm({ ...giftForm, category: e.target.value as GiftCategory })}
                        className="w-full px-3 py-2 bg-black/40 border border-festive-pine rounded-xl text-[16px] sm:text-sm text-slate-100 focus:outline-none focus:border-festive-gold"
                      >
                        <option value="ambos">✨ Navidad & Cumpleaños (Ambos)</option>
                        <option value="navidad">🎄 Solo Reyes / Navidad</option>
                        <option value="cumpleanos">🎂 Solo Cumpleaños</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Nivel de ilusión:</label>
                      <select
                        value={giftForm.priority}
                        onChange={(e) => setGiftForm({ ...giftForm, priority: e.target.value as GiftPriority })}
                        className="w-full px-3 py-2 bg-black/40 border border-festive-pine rounded-xl text-[16px] sm:text-sm text-slate-100 focus:outline-none focus:border-festive-gold"
                      >
                        <option value="deseado">Deseado</option>
                        <option value="muy-deseado">Muy deseado ⭐</option>
                        <option value="ilusion-maxima">¡Ilusión Máxima! 🔥</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Descripción o notas personales (opcional):</label>
                      <textarea
                        rows={2}
                        value={giftForm.descripcion}
                        onChange={(e) => setGiftForm({ ...giftForm, descripcion: e.target.value })}
                        placeholder="Talla, color, por qué te gusta o detalles para quien te lo regale..."
                        className="w-full px-3 py-2 bg-black/40 border border-festive-pine rounded-xl text-[16px] sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-festive-gold"
                      />
                    </div>

                    {/* Visibility Options */}
                    <div className="sm:col-span-2 space-y-2 p-3 bg-black/30 rounded-xl border border-festive-pine/60">
                      <label className="text-xs font-semibold text-festive-goldLight flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-festive-gold" />
                        <span>Visibilidad de este regalo:</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => toggleVisibilityUser('all')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            giftForm.visibleTo.includes('all')
                              ? 'bg-festive-gold text-festive-dark border-festive-gold font-bold shadow-sm'
                              : 'bg-festive-forest text-slate-300 border-festive-pine'
                          }`}
                        >
                          🌐 Todos (Acceso público general)
                        </button>

                        {specialUsers.map(u => (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => toggleVisibilityUser(u.name)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                              giftForm.visibleTo.includes(u.name)
                                ? 'bg-purple-600 text-white border-purple-400 font-bold shadow-sm'
                                : 'bg-festive-forest text-slate-300 border-festive-pine'
                            }`}
                          >
                            <span>🔒 Solo {u.name}</span>
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {giftForm.visibleTo.includes('all') 
                          ? 'Cualquier persona que entre a la web verá este regalo.' 
                          : `Solo las personas con clave que desbloqueen a: ${giftForm.visibleTo.join(', ')}.`}
                      </p>
                    </div>

                    <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
                      {editingGiftId && (
                        <button
                          type="button"
                          onClick={resetGiftForm}
                          className="px-4 py-2 rounded-xl bg-festive-forest text-slate-300 hover:text-white text-xs"
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-festive-gold text-festive-dark font-bold text-xs sm:text-sm hover:bg-festive-goldLight shadow-md transition-all flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>{editingGiftId ? 'Actualizar Regalo' : 'Añadir a la Lista'}</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Existing Gifts List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-base text-slate-200">
                      Regalos en la lista ({gifts.length}):
                    </h4>
                  </div>

                  <div className="space-y-2.5">
                    {gifts.map(g => (
                      <div
                        key={g.id}
                        className="p-3 sm:p-4 rounded-xl bg-festive-forest/60 border border-festive-pine flex items-center justify-between gap-3 hover:border-festive-gold/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={g.img}
                            alt={g.name}
                            className="w-12 h-12 rounded-lg object-cover border border-festive-pine shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-slate-100 truncate">
                              {g.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                              <span className="text-festive-gold font-bold">{g.price}</span>
                              <span>•</span>
                              <span>{g.category}</span>
                              <span>•</span>
                              <span>👁️ {g.visibleTo.includes('all') ? 'Todos' : g.visibleTo.join(', ')}</span>
                            </div>
                            {g.isReserved && (
                              <p className="text-[11px] text-amber-300 font-bold mt-0.5 flex items-center gap-1">
                                <span>🎁 Estado: Comprado</span>
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* UNRESERVE BUTTON FOR ADMIN */}
                          {g.isReserved && (
                            <button
                              onClick={() => onUnreserveGift(g)}
                              className="px-2.5 py-1.5 rounded-lg bg-festive-wine hover:bg-festive-ruby text-white text-xs flex items-center gap-1 font-medium shadow-sm transition-colors"
                              title="Reactivar regalo como no comprado"
                            >
                              <Undo2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Reactivar</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleStartEdit(g)}
                            className="p-2 rounded-lg bg-festive-forest text-slate-300 hover:text-white hover:bg-festive-pine"
                            title="Editar este regalo"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGift(g.id)}
                            className="p-2 rounded-lg bg-festive-forest text-red-300 hover:text-white hover:bg-festive-wine"
                            title="Eliminar este regalo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ================= TAB 2: LETTER ================= */}
            {activeTab === 'letter' && (
              <form onSubmit={handleSaveLetterForm} className="space-y-5 bg-festive-forest/70 p-4 sm:p-6 rounded-2xl border border-festive-pine">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-festive-goldLight">Título de la Carta:</label>
                  <input
                    type="text"
                    required
                    value={letterForm.titulo}
                    onChange={(e) => setLetterForm({ ...letterForm, titulo: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-festive-pine rounded-xl text-sm text-slate-100 focus:outline-none focus:border-festive-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-festive-goldLight">Subtítulo / Introducción:</label>
                  <input
                    type="text"
                    value={letterForm.subtitulo}
                    onChange={(e) => setLetterForm({ ...letterForm, subtitulo: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-festive-pine rounded-xl text-sm text-slate-100 focus:outline-none focus:border-festive-gold"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-festive-goldLight">Párrafos de la Carta:</label>
                    <button
                      type="button"
                      onClick={() => setLetterForm({ ...letterForm, parrafos: [...letterForm.parrafos, ''] })}
                      className="text-xs text-festive-gold hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir párrafo</span>
                    </button>
                  </div>
                  {letterForm.parrafos.map((p, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <textarea
                        rows={2}
                        value={p}
                        onChange={(e) => {
                          const updated = [...letterForm.parrafos];
                          updated[idx] = e.target.value;
                          setLetterForm({ ...letterForm, parrafos: updated });
                        }}
                        className="flex-1 px-3 py-2 bg-black/40 border border-festive-pine rounded-xl text-sm text-slate-100 focus:outline-none focus:border-festive-gold"
                      />
                      {letterForm.parrafos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = letterForm.parrafos.filter((_, i) => i !== idx);
                            setLetterForm({ ...letterForm, parrafos: updated });
                          }}
                          className="p-2 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-festive-goldLight">Firma final:</label>
                    <input
                      type="text"
                      required
                      value={letterForm.firma}
                      onChange={(e) => setLetterForm({ ...letterForm, firma: e.target.value })}
                      className="w-full px-3 py-2 bg-black/40 border border-festive-pine rounded-xl text-sm text-slate-100 focus:outline-none focus:border-festive-gold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-festive-goldLight">Temporada / Etiqueta:</label>
                    <input
                      type="text"
                      value={letterForm.temporada}
                      onChange={(e) => setLetterForm({ ...letterForm, temporada: e.target.value })}
                      className="w-full px-3 py-2 bg-black/40 border border-festive-pine rounded-xl text-sm text-slate-100 focus:outline-none focus:border-festive-gold"
                    />
                  </div>
                </div>

                {letterSavedMsg && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>¡Carta actualizada correctamente!</span>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={letterSaving}
                    className="px-6 py-2.5 rounded-xl bg-festive-gold text-festive-dark font-bold text-xs sm:text-sm hover:bg-festive-goldLight shadow-md transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{letterSaving ? 'Guardando...' : 'Guardar Carta'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* ================= TAB 3: SPECIAL USERS ================= */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                
                {/* Create Special User */}
                <div className="bg-festive-forest/70 p-4 sm:p-6 rounded-2xl border border-festive-pine space-y-4">
                  <h3 className="font-serif font-bold text-base text-festive-goldLight flex items-center gap-2">
                    <Plus className="w-4 h-4 text-festive-gold" />
                    Crear Invitado Especial (Nombre y Contraseña)
                  </h3>
                  <p className="text-xs text-slate-300">
                    Crea una clave para una persona concreta (ej: <span className="text-white font-semibold">Susana</span> con clave <span className="text-white font-semibold">contraseña1.</span>). Así podrá acceder para ver regalos exclusivos que solo ella puede ver.
                  </p>

                  <form onSubmit={handleAddSpecialUser} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Nombre de la persona:</label>
                      <input
                        type="text"
                        required
                        value={newUserForm.name}
                        onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                        placeholder="ej: Susana, Tía Carmen, Carlos"
                        className="w-full px-3 py-2 bg-black/40 border border-festive-pine rounded-xl text-sm text-slate-100 focus:outline-none focus:border-festive-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Contraseña que le darás:</label>
                      <input
                        type="text"
                        required
                        value={newUserForm.password}
                        onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                        placeholder="ej: contraseña1., navidad2026"
                        className="w-full px-3 py-2 bg-black/40 border border-festive-pine rounded-xl text-sm text-slate-100 focus:outline-none focus:border-festive-gold"
                      />
                    </div>

                    <div className="sm:col-span-2 flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-festive-gold text-festive-dark font-bold text-xs hover:bg-festive-goldLight shadow-sm flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir Invitado Especial</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* List of Special Users */}
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-base text-slate-200">
                    Invitados especiales actuales ({specialUsers.length}):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {specialUsers.map(u => (
                      <div
                        key={u.id}
                        className="p-3 rounded-xl bg-festive-forest/60 border border-festive-pine flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-sm text-slate-100">
                            👤 {u.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Clave: <code className="text-festive-goldLight bg-black/30 px-1 py-0.5 rounded">{u.password}</code>
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteSpecialUser(u.id)}
                          className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Change Admin Password */}
                <div className="bg-festive-forest/50 p-4 rounded-2xl border border-festive-pine/60 space-y-3">
                  <h4 className="font-serif font-bold text-sm text-festive-goldLight flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-festive-gold" />
                    <span>Tu Contraseña de Administrador (Rafael)</span>
                  </h4>
                  <form onSubmit={handleChangeAdminPass} className="flex gap-2">
                    <input
                      type="text"
                      value={newAdminPass}
                      onChange={(e) => setNewAdminPass(e.target.value)}
                      placeholder="Nueva clave admin..."
                      className="flex-1 px-3 py-2 bg-black/40 border border-festive-pine rounded-xl text-sm text-slate-100 focus:outline-none focus:border-festive-gold"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-festive-forest hover:bg-festive-pine text-slate-200 border border-festive-pine text-xs font-semibold"
                    >
                      Guardar Clave Admin
                    </button>
                  </form>
                  {adminPassSavedMsg && (
                    <p className="text-xs text-emerald-400 font-medium">
                      ✓ Contraseña de administrador actualizada.
                    </p>
                  )}
                </div>

              </div>
            )}

            {/* ================= TAB 4: FIREBASE ================= */}
            {activeTab === 'firebase' && (
              <div className="space-y-5 bg-festive-forest/70 p-4 sm:p-6 rounded-2xl border border-festive-pine">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                    isFirebaseConfigured 
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400' 
                      : 'bg-amber-950/80 border-amber-500 text-amber-400'
                  }`}>
                    <Flame className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-100">
                      Estado de Conexión Firebase
                    </h3>
                    <p className="text-xs text-slate-300">
                      {isFirebaseConfigured
                        ? `Conectado al proyecto: ${firebaseConfig.projectId}`
                        : 'Modo local activo (Firebase pendiente de enlazar)'}
                    </p>
                  </div>
                </div>

                {isFirebaseConfigured ? (
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs space-y-2">
                    <p className="font-semibold flex items-center gap-1.5 text-emerald-300">
                      <Check className="w-4 h-4" />
                      ¡Firebase está activo y sincronizando en tiempo real!
                    </p>
                    <p>
                      Todos los regalos comprados se actualizan al instante en los móviles de los familiares sin que nadie sepa quién compró qué.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs space-y-2">
                    <p className="font-semibold flex items-center gap-1.5 text-amber-300">
                      <AlertTriangle className="w-4 h-4" />
                      Modo local activo
                    </p>
                    <p>
                      Para que todos compartan la misma lista en vivo desde sus móviles, solo tienes que copiar las claves de tu app web en <code className="bg-black/40 px-1 py-0.5 rounded text-white">src/config/firebase.ts</code>.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Footer note */}
          <div className="pt-3 border-t border-festive-pine/60 flex items-center justify-between text-xs text-slate-400">
            <span>Sesión Administrador (Rafael)</span>
            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="px-4 py-1.5 rounded-lg bg-festive-forest text-slate-300 hover:text-white"
            >
              Cerrar panel
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
