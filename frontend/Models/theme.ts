export type ThemePreference = 'system' | 'light' | 'dark';
export type Theme = 'light' | 'dark';
export interface ThemePort {
  read(): string | null;
  write(value: string): void;
  system(): Theme;
  subscribe(listener: () => void): () => void;
}
