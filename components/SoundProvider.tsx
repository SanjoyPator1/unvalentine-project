"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private listeners: Set<() => void> = new Set();
  private _isMuted: boolean = false;
  private _isPlaying: boolean = false;
  private _volume: number = 0.5;
  private playAttemptTimeout: NodeJS.Timeout | null = null;

  initialize(source: string, initialVolume: number) {
    if (this.audio) return;

    this.audio = new Audio(source);
    this.audio.loop = true;
    this._volume = initialVolume;
    this.audio.volume = initialVolume;

    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === "string" &&
        (args[0].includes("play() failed") ||
          args[0].includes("The play() request was interrupted"))
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    this.attemptPlay();
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private attemptPlay() {
    if (!this.audio || this._isMuted) return;

    this.audio.play().catch(() => {
      if (this.playAttemptTimeout) {
        clearTimeout(this.playAttemptTimeout);
      }
      this.playAttemptTimeout = setTimeout(() => this.attemptPlay(), 1000);
    });
  }

  toggleMute() {
    this._isMuted = !this._isMuted;
    if (this.audio) {
      if (this._isMuted) {
        this.audio.pause();
        this._isPlaying = false;
      } else {
        this.attemptPlay();
        this._isPlaying = true;
      }
    }
    this.notifyListeners();
  }

  setVolume(value: number) {
    this._volume = Math.max(0, Math.min(1, value));
    if (this.audio) {
      this.audio.volume = this._volume;
    }
    this.notifyListeners();
  }

  get isMuted() {
    return this._isMuted;
  }
  get isPlaying() {
    return this._isPlaying;
  }
  get volume() {
    return this._volume;
  }

  cleanup() {
    if (this.playAttemptTimeout) {
      clearTimeout(this.playAttemptTimeout);
    }
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio.remove();
      this.audio = null;
    }
    this.listeners.clear();
  }
}

const audioManager = new AudioManager();

interface SoundContextType {
  isMuted: boolean;
  isPlaying: boolean;
  toggleMute: () => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const SoundContext = createContext<SoundContextType>({
  isMuted: false,
  isPlaying: false,
  toggleMute: () => {},
  volume: 1,
  setVolume: () => {},
});

export const useSoundContext = () => useContext(SoundContext);

interface SoundProviderProps {
  children: React.ReactNode;
  audioSource?: string;
  initialVolume?: number;
}

export function SoundProvider({
  children,
  audioSource = "/sounds/background-music.mp3",
  initialVolume = 0.5,
}: SoundProviderProps) {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    audioManager.initialize(audioSource, initialVolume);
    const unsubscribe = audioManager.subscribe(() => forceUpdate({}));

    const handleUserInteraction = () => {
      if (!audioManager.isMuted) {
        audioManager.toggleMute();
        audioManager.toggleMute();
      }
    };

    const events = ["click", "touchstart", "keydown", "scroll", "mousemove"];
    events.forEach((event) => {
      document.addEventListener(event, handleUserInteraction, { once: true });
    });

    return () => {
      unsubscribe();
      events.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction);
      });
      audioManager.cleanup();
    };
  }, [audioSource, initialVolume]);

  const value = {
    isMuted: audioManager.isMuted,
    isPlaying: audioManager.isPlaying,
    toggleMute: () => audioManager.toggleMute(),
    volume: audioManager.volume,
    setVolume: (v: number) => audioManager.setVolume(v),
  };

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export function useVolumeControl() {
  const { volume, setVolume } = useSoundContext();

  const increaseVolume = useCallback(() => {
    setVolume(Math.min(1, volume + 0.1));
  }, [volume, setVolume]);

  const decreaseVolume = useCallback(() => {
    setVolume(Math.max(0, volume - 0.1));
  }, [volume, setVolume]);

  return {
    volume,
    setVolume,
    increaseVolume,
    decreaseVolume,
  };
}
