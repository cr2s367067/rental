import { test, expect } from 'bun:test';
import { ThemeStore } from '../VMs/theme.vm';
import type { ThemePort, Theme } from '../Models/theme';
function port(value: string | null = null) {
  let saved = value,
    system: Theme = 'dark';
  const listeners = new Set<() => void>();
  return {
    read: () => saved,
    write: (v: string) => {
      saved = v;
    },
    system: () => system,
    subscribe: (l: () => void) => {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
    change: (v: Theme) => {
      system = v;
      listeners.forEach((l) => l());
    },
  };
}
test('system follows media changes, manual persists and return visit restores', () => {
  const p = port();
  const t = new ThemeStore(p);
  expect(t.getSnapshot().theme).toBe('dark');
  t.select('light');
  p.change('dark');
  expect(t.getSnapshot()).toEqual({ preference: 'light', theme: 'light' });
  expect(new ThemeStore(p).getSnapshot().theme).toBe('light');
  t.select('system');
  p.change('light');
  expect(t.getSnapshot().theme).toBe('light');
  p.change('dark');
  expect(t.getSnapshot().theme).toBe('dark');
  t.dispose();
});
test('invalid or unavailable storage falls back safely and permits manual choice', () => {
  const p = port('invalid');
  expect(new ThemeStore(p).getSnapshot().preference).toBe('system');
  const blocked: ThemePort = {
    ...p,
    read() {
      throw Error('blocked');
    },
    write() {
      throw Error('blocked');
    },
  };
  const t = new ThemeStore(blocked);
  expect(t.getSnapshot().theme).toBe('dark');
  expect(() => t.select('light')).not.toThrow();
  expect(t.getSnapshot().theme).toBe('light');
});
