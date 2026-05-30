let unlocked = false;
let unlockInstalled = false;
let currentBgm: HTMLAudioElement | null = null;
let currentBgmSrc: string | null = null;
let pendingBgm: { src: string; volume: number } | null = null;
let audioEnabled = true;

const AUDIO_UNLOCK_KEY = 'short-drama-audio-unlocked';

function canUseAudio() {
  return typeof window !== 'undefined' && typeof Audio !== 'undefined';
}

function markUnlocked() {
  unlocked = true;
  try {
    window.sessionStorage.setItem(AUDIO_UNLOCK_KEY, '1');
  } catch {
    // Session storage may be unavailable in private browsing.
  }
}

function flushPendingBgm() {
  if (!pendingBgm) return;
  const next = pendingBgm;
  pendingBgm = null;
  playBgm(next.src, next.volume);
}

function fadeOut(audio: HTMLAudioElement) {
  const step = audio.volume / 8;
  const timer = window.setInterval(() => {
    audio.volume = Math.max(0, audio.volume - step);
    if (audio.volume <= 0.01) {
      window.clearInterval(timer);
      audio.pause();
      audio.src = '';
    }
  }, 45);
}

export function installAudioUnlock() {
  if (!canUseAudio() || unlockInstalled) return;
  try {
    if (window.sessionStorage.getItem(AUDIO_UNLOCK_KEY) === '1') {
      markUnlocked();
      flushPendingBgm();
      return;
    }
  } catch {
    // Ignore storage failures and fall back to pointer unlock.
  }

  unlockInstalled = true;

  const unlock = () => {
    markUnlocked();
    flushPendingBgm();
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
  };

  window.addEventListener('pointerdown', unlock, { once: true });
  window.addEventListener('keydown', unlock, { once: true });
}

export function playBgm(src: string, volume = 0.28) {
  if (!canUseAudio()) return;
  if (!audioEnabled) {
    pendingBgm = null;
    return;
  }
  if (!unlocked) {
    pendingBgm = { src, volume };
    return;
  }
  if (currentBgmSrc === src && currentBgm) return;

  if (currentBgm) fadeOut(currentBgm);

  const audio = new Audio(src);
  audio.loop = true;
  audio.volume = volume;
  currentBgm = audio;
  currentBgmSrc = src;
  void audio.play().catch(() => {
    pendingBgm = { src, volume };
  });
}

export function stopBgm() {
  if (!currentBgm || !canUseAudio()) return;
  fadeOut(currentBgm);
  currentBgm = null;
  currentBgmSrc = null;
}

export function setAudioEnabled(enabled: boolean) {
  audioEnabled = enabled;
  if (!enabled) {
    pendingBgm = null;
    stopBgm();
  }
}

export function isAudioEnabled() {
  return audioEnabled;
}

export function unlockAudioFromGesture() {
  if (!canUseAudio()) return;
  markUnlocked();
  flushPendingBgm();
}

export function playOneShot(src: string, volume = 0.55) {
  if (!canUseAudio() || !unlocked || !audioEnabled) return;
  const audio = new Audio(src);
  audio.volume = volume;
  void audio.play().catch(() => undefined);
}
