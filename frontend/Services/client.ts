import { client } from '../Generated/client.gen';
import { getSession, login, logout } from '../Generated/sdk.gen';
import type { LoginData, SessionView } from '../Generated/types.gen';
let csrf = '';
client.setConfig({ credentials: 'same-origin' });
client.interceptors.request.use((request) => {
  if (csrf) request.headers.set('x-csrf-token', csrf);
  return request;
});
export function errorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message);
  return 'Unable to save. Please try again';
}
export const sessionService = {
  async read() {
    const { data } = await getSession({ throwOnError: true });
    csrf = data.csrf_token;
    return data;
  },
  async signIn(body: LoginData['body']) {
    const { data } = await login({ body, throwOnError: true });
    csrf = data.csrf_token;
    return data;
  },
  async signOut() {
    await logout({ throwOnError: true });
    csrf = '';
  },
};
export type SessionService = {
  read(): Promise<SessionView>;
  signIn(body: LoginData['body']): Promise<SessionView>;
  signOut(): Promise<void>;
};
