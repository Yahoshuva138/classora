import React, { useState } from 'react';
import { BookOpen, Sparkles, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

interface LibraryBookIntroProps {
  onComplete: () => void;
}

export const LibraryBookIntro: React.FC<LibraryBookIntroProps> = ({ onComplete }) => {
  // Stages: 'idle' (closed book) -> 'opening' (cover swinging) -> 'flipping' (pages turning) -> 'unfolding' (transitioning into login)
  const [stage, setStage] = useState<'idle' | 'opening' | 'flipping' | 'unfolding'>('idle');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const startBookSequence = () => {
    if (stage !== 'idle') return;
    if (soundEnabled) soundFx.playPop();
    setStage('opening');

    // Sequence timeline
    setTimeout(() => {
      if (soundEnabled) soundFx.playPop();
      setStage('flipping');
    }, 1200);

    setTimeout(() => {
      setStage('unfolding');
    }, 2800);

    setTimeout(() => {
      onComplete();
    }, 3800);
  };

  const handleSkip = () => {
    if (soundEnabled) soundFx.playPop();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0c0a14] overflow-hidden flex flex-col items-center justify-center select-none font-serif">
      {/* ========================================================= */}
      {/* 1. ATMOSPHERIC LIBRARY ENVIRONMENT & CANDLELIGHT GLOW     */}
      {/* ========================================================= */}
      {/* Library Bookshelf Wall Ambient Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2a1b3d]/60 via-[#130d22] to-[#08050e] pointer-events-none" />

      {/* Floating Golden Literary Dust Motes / Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-300/30 blur-[1px] animate-pulse"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 4 + 3}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Warm Golden Overhead Study Spotlight */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[550px] bg-gradient-to-b from-amber-500/15 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Utility Bar: Skip & Sound Toggle */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 font-sans">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-md">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-amber-300/80 font-bold block">
              Scaler School of Technology
            </span>
            <span className="text-[11px] text-white/50 tracking-wider">
              Department of English & Communication Skills
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition text-xs flex items-center gap-1.5 cursor-pointer"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-white/40" />}
          </button>
          <button
            onClick={handleSkip}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 transition text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-sm cursor-pointer"
          >
            <span>Skip to Portal</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. THE 3D MASTERPIECE TOME / BOOK CONTAINER               */}
      {/* ========================================================= */}
      <div
        className="relative z-10 flex flex-col items-center justify-center transition-all duration-1000"
        style={{
          perspective: '2200px',
          transform: stage === 'unfolding' ? 'scale(1.4) translateY(-20px)' : 'scale(1)',
          opacity: stage === 'unfolding' ? 0 : 1
        }}
      >
        {/* Book shadow on mahogany surface */}
        <div
          className={`w-[340px] sm:w-[460px] h-[35px] bg-black/70 rounded-full blur-xl transition-all duration-1000 ${
            stage !== 'idle' ? 'scale-110 opacity-40' : 'scale-95 opacity-80'
          }`}
        />

        {/* 3D BOOK STRUCTURE */}
        <div
          onClick={startBookSequence}
          className={`relative w-[320px] sm:w-[420px] h-[450px] sm:h-[540px] cursor-pointer transition-all duration-700 select-none ${
            stage === 'idle' ? 'hover:-translate-y-2' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: stage === 'idle' ? 'rotateX(14deg) rotateY(-8deg)' : 'rotateX(8deg) rotateY(0deg)',
            transition: 'transform 1s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
        >
          {/* BOOK SPINE (Left Bound Edge) */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[42px] -translate-x-[21px] rounded-l-md bg-gradient-to-r from-[#160c1d] via-[#2f1b3b] to-[#160c1d] border-y border-l border-amber-600/30 flex flex-col items-center justify-between py-8 shadow-2xl"
            style={{
              transform: 'rotateY(-90deg) translateX(-21px)',
              transformOrigin: 'right center'
            }}
          >
            <div className="w-4 h-0.5 bg-amber-400/50" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-300/80 -rotate-90 whitespace-nowrap">
              ENGLISH & RHETORIC • 2026
            </span>
            <div className="w-4 h-0.5 bg-amber-400/50" />
          </div>

          {/* RIGHT PAGE DECKLE EDGES (Stacked paper edges on right) */}
          <div
            className="absolute right-0 top-2 bottom-2 w-[34px] rounded-r-sm bg-gradient-to-l from-[#e6d8ba] via-[#d4c19c] to-[#b39e78] border-y border-r border-[#8d7955]/40 shadow-inner"
            style={{
              transform: 'translateX(28px) rotateY(90deg)',
              transformOrigin: 'left center'
            }}
          >
            {/* Paper page lines texture */}
            <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(to_bottom,#8d7955_0px,#8d7955_1px,transparent_1px,transparent_3px)]" />
          </div>

          {/* BACK COVER */}
          <div
            className="absolute inset-0 rounded-r-2xl rounded-l-md bg-gradient-to-br from-[#1c1124] via-[#291738] to-[#120917] border border-amber-600/30 shadow-[0_25px_50px_rgba(0,0,0,0.8)]"
            style={{
              transform: 'translateZ(-28px)'
            }}
          />

          {/* =================================================== */}
          {/* INSIDE PARCHMENT PAGES (Revealed when cover opens)  */}
          {/* =================================================== */}
          <div
            className="absolute inset-1 rounded-r-xl rounded-l-sm bg-[#f7f1e1] text-[#2c1f10] p-6 sm:p-8 flex flex-col justify-between shadow-2xl border-l border-[#d3c29f]"
            style={{
              transform: 'translateZ(0px)',
              backgroundImage: 'radial-gradient(#e8ddc4 15%, transparent 16%)',
              backgroundSize: '16px 16px'
            }}
          >
            {/* Top Ornamental Header */}
            <div className="border-b border-amber-800/20 pb-3 text-center">
              <div className="flex items-center justify-center gap-2 text-amber-800/60 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-bold">
                  SST Official Curriculum
                </span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-amber-950 tracking-tight italic">
                The Eloquent Communicator
              </h2>
            </div>

            {/* Page Body: Poetic Inscription */}
            <div className="space-y-4 my-auto text-center font-serif text-[#3e2c18]">
              <p className="text-sm sm:text-base italic leading-relaxed text-[#4a341d]">
                &ldquo;Words are, of course, the most powerful drug used by mankind. Speak clearly, articulate boldly, and lead with conviction.&rdquo;
              </p>
              <div className="w-16 h-0.5 bg-amber-700/30 mx-auto" />
              <div className="space-y-1.5 font-sans">
                <p className="text-xs font-semibold text-amber-900 uppercase tracking-widest">
                  Active Modules:
                </p>
                <p className="text-[11px] text-amber-800/80">
                  Tenses &bull; Impromptu Speeches &bull; Debate &bull; Everyday Dialogue &bull; Group Discussions
                </p>
              </div>
            </div>

            {/* Bottom Page Footer */}
            <div className="border-t border-amber-800/20 pt-3 flex items-center justify-between text-[11px] font-sans text-amber-900/60">
              <span>Section: Subject - 2</span>
              <span>Classora Academic OS</span>
              <span>Page I</span>
            </div>
          </div>

          {/* FLIPPING PAGE (Flipping in 3D during stage === 'flipping') */}
          <div
            className="absolute inset-1 rounded-r-xl rounded-l-sm bg-[#f2ebd5] text-[#2c1f10] p-6 sm:p-8 flex flex-col justify-between shadow-2xl border-l border-[#d3c29f] transition-all"
            style={{
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
              transition: 'transform 1.3s cubic-bezier(0.25, 1, 0.5, 1)',
              transform: stage === 'flipping' || stage === 'unfolding' ? 'rotateY(-175deg)' : 'rotateY(0deg)',
              backfaceVisibility: 'hidden',
              zIndex: 15
            }}
          >
            <div className="text-center my-auto space-y-3 font-serif">
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-amber-800/60 block">
                Official Roster Authorization
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-amber-950">
                Authorized 44-Student Cohort
              </h3>
              <p className="text-xs text-[#523d24] italic max-w-[260px] mx-auto">
                &ldquo;A craftsman of thought is first an architect of words.&rdquo;
              </p>
              <div className="p-2.5 rounded-lg bg-amber-900/10 text-[11px] font-sans font-medium text-amber-900">
                Opening Classora Command Center...
              </div>
            </div>
          </div>

          {/* =================================================== */}
          {/* FRONT HARDCOVER (Swings open like a genuine book)   */}
          {/* =================================================== */}
          <div
            className="absolute inset-0 rounded-r-2xl rounded-l-md bg-gradient-to-br from-[#1e1026] via-[#2d183a] to-[#170a1f] p-6 sm:p-8 flex flex-col justify-between border-2 border-amber-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.9)] transition-all"
            style={{
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
              transition: 'transform 1.2s cubic-bezier(0.3, 0, 0.2, 1)',
              transform: stage !== 'idle' ? 'rotateY(-180deg)' : 'rotateY(0deg)',
              backfaceVisibility: 'hidden',
              zIndex: 20
            }}
          >
            {/* Ornate Gold Filigree Corner Accents */}
            <div className="absolute top-3 left-3 w-7 h-7 border-t-2 border-l-2 border-amber-400/60 rounded-tl-sm pointer-events-none" />
            <div className="absolute top-3 right-3 w-7 h-7 border-t-2 border-r-2 border-amber-400/60 rounded-tr-sm pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-7 h-7 border-b-2 border-l-2 border-amber-400/60 rounded-bl-sm pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-7 h-7 border-b-2 border-r-2 border-amber-400/60 rounded-br-sm pointer-events-none" />

            {/* Embossed Inner Border Ring */}
            <div className="absolute inset-4 rounded-xl border border-amber-400/20 pointer-events-none" />

            {/* Top Emblem / Crest */}
            <div className="text-center relative z-10 space-y-1 mt-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-b from-amber-400/20 to-amber-600/10 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-md">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-black text-amber-300/80 block mt-2">
                Scaler School of Technology
              </span>
            </div>

            {/* Center Book Title & Typography (Golden Foil Embossed) */}
            <div className="text-center my-auto relative z-10 space-y-3">
              <div className="inline-block px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-sans tracking-widest uppercase font-semibold">
                Subject - 2 &bull; 4 Weeks
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 tracking-tight leading-snug drop-shadow-md">
                English Language &amp; Communication Skills
              </h1>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
              <p className="text-xs text-amber-200/70 font-sans tracking-wide">
                The Official Cohort Command Center
              </p>
            </div>

            {/* Bottom Book Inscription */}
            <div className="text-center relative z-10 font-sans">
              <span className="text-[11px] text-amber-300/70 font-semibold block">
                Class Representative: Yahoshuva Kesaboyina
              </span>
              <span className="text-[10px] text-white/40 tracking-wider">
                Volume I &bull; Academic Year 2026
              </span>
            </div>
          </div>
        </div>

        {/* Action Button Below Tome */}
        {stage === 'idle' && (
          <div className="mt-8 flex flex-col items-center gap-3 font-sans animate-bounce">
            <button
              onClick={startBookSequence}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-extrabold text-sm tracking-wide shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Open Book to Enter</span>
              <Sparkles className="w-4 h-4" />
            </button>
            <span className="text-xs text-amber-300/50">
              Click book or button to unlock the Classora portal
            </span>
          </div>
        )}

        {stage !== 'idle' && (
          <div className="mt-8 font-sans text-xs text-amber-300/70 animate-pulse tracking-widest uppercase font-bold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unfolding Academic Tome...</span>
          </div>
        )}
      </div>

      {/* Warm Ambient Desktop Shadow */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
    </div>
  );
};
