import { useSyncExternalStore } from 'react';
function subscribe(listener: () => void) {
  window.addEventListener('hashchange', listener);
  return () => window.removeEventListener('hashchange', listener);
}
export function useRoute() {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash);
  const url = new URL(hash.replace(/^#/, '') || '/', 'http://rental.local');
  return { path: url.pathname, query: Object.fromEntries(url.searchParams), search: url.search };
}
export function link(path: string, query: Record<string, string | undefined> = {}) {
  const values = new URLSearchParams(
    Object.entries(query).filter((e): e is [string, string] => e[1] !== undefined),
  );
  return '#' + path + (values.size ? '?' + values : '');
}
