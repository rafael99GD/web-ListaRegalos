import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { SnowEffect } from './components/SnowEffect';
import { FiltersBar } from './components/FiltersBar';
import type { StatusFilter } from './components/FiltersBar';
import { GiftDeck } from './components/GiftDeck';
import { GiftGrid } from './components/GiftGrid';
import { IntroLetterModal } from './components/IntroLetterModal';
import { ReserveModal } from './components/ReserveModal';
import { LoginModal } from './components/LoginModal';
import { AdminModal } from './components/AdminModal';
import type { Gift, LetterConfig, GiftCategory } from './types';
import { INITIAL_LETTER } from './data/initialData';
import { giftService } from './services/giftService';
import { useAuth } from './context/AuthContext';
import { Sparkles, Heart } from 'lucide-react';

const SEEN_LETTER_KEY = 'lista_regalos_letter_seen_v2';
const VIEW_MODE_KEY = 'lista_regalos_view_mode_v2';

export const AppContent: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();

  // App data state
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [letter, setLetter] = useState<LetterConfig>(INITIAL_LETTER);

  // UI preferences
  const [viewMode, setViewMode] = useState<'deck' | 'grid'>(() => {
    return (localStorage.getItem(VIEW_MODE_KEY) as 'deck' | 'grid') || 'deck';
  });
  const [snowActive, setSnowActive] = useState<boolean>(true);
  const [soundActive, setSoundActive] = useState<boolean>(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<GiftCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [letterOpen, setLetterOpen] = useState<boolean>(false);
  const [adminOpen, setAdminOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [reserveModalState, setReserveModalState] = useState<{
    gift: Gift;
    mode: 'reserve' | 'unreserve';
  } | null>(null);

  // Save viewMode preference
  const handleSetViewMode = (mode: 'deck' | 'grid') => {
    setViewMode(mode);
    localStorage.setItem(VIEW_MODE_KEY, mode);
  };

  // Subscribe to real-time gifts and letter
  useEffect(() => {
    const unsubGifts = giftService.subscribeGifts((updatedGifts) => {
      setGifts(updatedGifts);
    });

    const unsubLetter = giftService.subscribeLetter((updatedLetter) => {
      setLetter(updatedLetter);
    });

    // Check if letter has been seen this session
    const seen = sessionStorage.getItem(SEEN_LETTER_KEY);
    if (!seen) {
      setLetterOpen(true);
      sessionStorage.setItem(SEEN_LETTER_KEY, 'true');
    }

    return () => {
      unsubGifts();
      unsubLetter();
    };
  }, []);

  // Filter gifts by:
  // 1. Audience / User Permissions
  // 2. Category
  // 3. Status
  // 4. Search query
  const filteredGifts = useMemo(() => {
    return gifts.filter((gift) => {
      // 1. AUDIENCE PERMISSIONS:
      // If admin, can see everything!
      if (!isAdmin) {
        const allowedTargets = gift.visibleTo || ['all'];
        const isPublic = allowedTargets.includes('all');

        if (currentUser) {
          const isUserMatch = 
            allowedTargets.includes(currentUser.username) || 
            allowedTargets.includes(currentUser.uid);
          const isGroupMatch = 
            currentUser.group && allowedTargets.includes(currentUser.group);

          if (!isPublic && !isUserMatch && !isGroupMatch) {
            return false;
          }
        } else {
          // Unauthenticated guest only sees 'all'
          if (!isPublic) return false;
        }
      }

      // 2. CATEGORY:
      if (selectedCategory !== 'all') {
        if (gift.category !== 'ambos' && gift.category !== selectedCategory) {
          return false;
        }
      }

      // 3. STATUS:
      if (statusFilter === 'available' && gift.isReserved) {
        return false;
      }
      if (statusFilter === 'reserved' && !gift.isReserved) {
        return false;
      }
      if (statusFilter === 'mine') {
        if (!currentUser) return false;
        const isMine = gift.reservedBy === currentUser.uid || gift.reservedBy === currentUser.username;
        if (!isMine) return false;
      }

      // 4. SEARCH QUERY:
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = gift.name.toLowerCase().includes(query);
        const matchesDesc = gift.descripcion?.toLowerCase().includes(query);
        const matchesPrice = gift.price?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesPrice) {
          return false;
        }
      }

      return true;
    });
  }, [gifts, isAdmin, currentUser, selectedCategory, statusFilter, searchQuery]);

  // Reservation actions
  const handleOpenReserve = (gift: Gift) => {
    setReserveModalState({ gift, mode: 'reserve' });
  };

  const handleOpenUnreserve = (gift: Gift) => {
    setReserveModalState({ gift, mode: 'unreserve' });
  };

  const handleConfirmReservation = async (gift: Gift, customBuyerName?: string) => {
    const userToRecord = currentUser || {
      uid: 'invitado-' + (customBuyerName || 'anonimo').toLowerCase().replace(/\s+/g, '-'),
      username: (customBuyerName || 'Invitado').toLowerCase(),
      displayName: customBuyerName || 'Invitado Especial',
      role: 'user' as const,
      group: 'general' as const
    };

    if (reserveModalState?.mode === 'reserve') {
      await giftService.toggleReserveGift(gift, userToRecord, true);
    } else {
      await giftService.toggleReserveGift(gift, userToRecord, false);
    }
  };

  const handleSaveLetter = async (newLetter: LetterConfig) => {
    await giftService.saveLetterConfig(newLetter);
    setLetter(newLetter);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-festive-wine selection:text-white">
      {/* Background Snow Particles */}
      <SnowEffect active={snowActive} />

      {/* Main Festive Navigation Bar */}
      <Navbar
        viewMode={viewMode}
        setViewMode={handleSetViewMode}
        snowActive={snowActive}
        setSnowActive={setSnowActive}
        soundActive={soundActive}
        setSoundActive={setSoundActive}
        onOpenLetter={() => setLetterOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenLogin={() => setLoginOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        
        {/* Welcome Banner / Greeting Pill */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-festive-forest/80 border border-festive-gold/30 text-festive-goldLight text-xs font-serif tracking-wider shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-festive-gold animate-pulse" />
            <span>{letter.temporada || 'Lista de Deseos 2026'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-slate-100 tracking-tight leading-tight">
            {letter.titulo || 'Mis Deseos de Reyes & Cumpleaños'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-light max-w-lg mx-auto">
            {currentUser 
              ? `¡Hola, ${currentUser.displayName}! Aquí tienes la lista preparada con todo el cariño.` 
              : 'Elige un regalo para marcarlo como reservado y evitar compras repetidas.'}
          </p>
        </div>

        {/* Filter Controls Bar */}
        <FiltersBar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalCount={gifts.length}
          filteredCount={filteredGifts.length}
        />

        {/* Dynamic Wishlist View (Deck Tinder vs Boutique Grid) */}
        {viewMode === 'deck' ? (
          <GiftDeck
            gifts={filteredGifts}
            onReserveClick={handleOpenReserve}
            onUnreserveClick={handleOpenUnreserve}
          />
        ) : (
          <GiftGrid
            gifts={filteredGifts}
            onReserveClick={handleOpenReserve}
            onUnreserveClick={handleOpenUnreserve}
          />
        )}
      </main>

      {/* Festive Footer */}
      <footer className="w-full border-t border-festive-pine/60 bg-festive-dark/90 py-8 px-4 text-center text-xs text-slate-400 space-y-2">
        <p className="flex items-center justify-center gap-1.5 text-slate-300">
          <span>Hecho con</span>
          <Heart className="w-3.5 h-3.5 text-festive-ruby fill-festive-ruby" />
          <span>por Rafael para toda la familia y amigos</span>
        </p>
        <p className="text-[11px] text-slate-500">
          Alojado en GitHub Pages • Sincronizado en tiempo real con Firebase
        </p>
      </footer>

      {/* Interactive Envelope & Greeting Letter Modal */}
      <IntroLetterModal
        isOpen={letterOpen}
        onClose={() => setLetterOpen(false)}
        letter={letter}
        userDisplayName={currentUser?.displayName}
      />

      {/* Reservation Confirmation Modal */}
      <ReserveModal
        isOpen={Boolean(reserveModalState)}
        gift={reserveModalState?.gift || null}
        mode={reserveModalState?.mode || 'reserve'}
        onClose={() => setReserveModalState(null)}
        onConfirm={handleConfirmReservation}
      />

      {/* Authentication Modal */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
      />

      {/* Admin Control Panel */}
      <AdminModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        gifts={gifts}
        letter={letter}
        onSaveLetter={handleSaveLetter}
      />
    </div>
  );
};
