"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useWorldStore } from "@/store/useWorldStore";

export function VehicleAudio() {
  const audio = useRef<{
    context: AudioContext;
    oscillator: OscillatorNode;
    gain: GainNode;
    unlocked: boolean;
  } | null>(null);

  useEffect(() => {
    const unlock = () => {
      if (audio.current || typeof window === "undefined") {
        return;
      }

      const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) {
        return;
      }

      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sawtooth";
      oscillator.frequency.value = 70;
      gain.gain.value = 0;
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      audio.current = { context, oscillator, gain, unlocked: true };
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      audio.current?.oscillator.stop();
      audio.current?.context.close();
      audio.current = null;
    };
  }, []);

  useFrame(() => {
    const item = audio.current;
    if (!item) {
      return;
    }

    const state = useWorldStore.getState();
    const speed = Math.min(Math.abs(state.vehicleSpeed) / 7, 1);
    const targetVolume = state.soundEnabled && !state.isPanelOpen ? 0.018 + speed * 0.045 : 0;
    const targetFrequency = 62 + speed * 120 + (state.isBoosting ? 35 : 0);
    const now = item.context.currentTime;
    item.gain.gain.linearRampToValueAtTime(targetVolume, now + 0.08);
    item.oscillator.frequency.linearRampToValueAtTime(targetFrequency, now + 0.08);
  });

  return null;
}
