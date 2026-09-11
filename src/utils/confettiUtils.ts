import confetti from 'canvas-confetti';

/**
 * Standard celebratory burst for actions like marking present or saving
 */
export function fireQuickConfetti() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.75 },
    colors: ['#2563EB', '#10B981', '#F59E0B', '#6366F1', '#EC4899'],
  });
}

/**
 * Dual cannon grand celebration for 100% attendance, major achievements, or excuse approvals
 */
export function fireGrandCelebration() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

/**
 * Star burst effect
 */
export function fireStarConfetti() {
  confetti({
    particleCount: 40,
    spread: 360,
    ticks: 60,
    origin: { y: 0.5 },
    shapes: ['star'],
    colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8']
  });
}
