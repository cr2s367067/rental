import { useSyncExternalStore } from 'react';
import type { ThemePort, ThemePreference, Theme } from '../Models/theme';
export class ThemeStore {
  private snapshot: { preference: ThemePreference; theme: Theme };
  private listeners = new Set<() => void>();
  private stop: () => void;
  constructor(private port: ThemePort) {
    let value: string | null = null;
    try {
      value = port.read();
    } catch {}
    const preference: ThemePreference = value === 'light' || value === 'dark' ? value : 'system';
    this.snapshot = { preference, theme: preference === 'system' ? port.system() : preference };
    this.stop = port.subscribe(() => this.update(this.snapshot.preference));
  }
  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  select(value: ThemePreference) {
    try {
      this.port.write(value);
    } catch {}
    this.update(value);
  }
  private update(preference: ThemePreference) {
    const theme = preference === 'system' ? this.port.system() : preference;
    if (preference === this.snapshot.preference && theme === this.snapshot.theme) return;
    this.snapshot = { preference, theme };
    this.listeners.forEach((l) => l());
  }
  dispose() {
    this.stop();
    this.listeners.clear();
  }
}
const browserPort: ThemePort = {
  read: () => localStorage.getItem('rental-theme'),
  write: (v) => localStorage.setItem('rental-theme', v),
  system: () =>
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
  subscribe: (l) => {
    if (typeof matchMedia === 'undefined') return () => {};
    const media = matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', l);
    return () => media.removeEventListener('change', l);
  },
};
export const themeStore = new ThemeStore(browserPort);
export function useTheme(store = themeStore) {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  return { ...state, select: (value: ThemePreference) => store.select(value) };
}
