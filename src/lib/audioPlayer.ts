let unlocked = false;
let unlockInstalled = false;
let currentBgm: HTMLAudioElement | null = null;
let currentBgmSrc: string | null = null;
let pendingBgm: { src: string; volume: number } | null = null;
let audioEnabled = true;

function canUseAudio() {
  return typeof window !== 'undefined' && typeof Audio !== 'undefined';
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
  unlockInstalled = true;

  const unlock = () => {
    unlocked = true;
    if (pendingBgm) {
      const next = pendingBgm;
      pendingBgm = null;
      playBgm(next.src, next.volume);
    }
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

export function playOneShot(src: string, volume = 0.55) {
  if (!canUseAudio() || !unlocked || !audioEnabled) return;
  const audio = new Audio(src);
  audio.volume = volume;
  void audio.play().catch(() => undefined);
}
