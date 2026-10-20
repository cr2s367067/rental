import { spawn } from 'bun';
import Redis from 'ioredis';
import { fixtures, testDatabaseURL, password } from './fixtures';
export const origin = 'http://localhost:5173';
export async function httpServer() {
  const port = 3300 + Math.floor(Math.random() * 1000),
    base = `http://127.0.0.1:${port}/api`;
  const child = spawn(['bun', 'backend/dist/Src/main.js'], {
    env: {
      ...process.env,
      PORT: String(port),
      DATABASE_URL: testDatabaseURL,
      DEMO_MODE: 'true',
      NODE_ENV: 'test',
      DEMO_ISOLATED: 'true',
      DEMO_DATABASE: 'rental_demo_test',
      APP_ORIGIN: origin,
    },
    stdout: 'pipe',
    stderr: 'pipe',
  });
  let started = false;
  for (let n = 0; n < 100; n++) {
    try {
      if ((await fetch(base + '/health')).ok) {
        started = true;
        break;
      }
    } catch {}
    await Bun.sleep(30);
  }
  if (!started) {
    child.kill();
    throw new Error('Test API startup failed: ' + (await new Response(child.stderr).text()));
  }
  const redis = new Redis(process.env.REDIS_URL!);
  async function reset() {
    await fixtures();
    const keys = await redis.keys('rental:/rental_demo_test:*');
    if (keys.length) await redis.del(...keys);
  }
  async function login(email = 'owner@example.test') {
    const res = await fetch(base + '/session', {
      method: 'POST',
      headers: { origin, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Test sign-in failed ' + res.status);
    const session = (await res.json()) as { csrf_token: string };
    const cookie = res.headers.get('set-cookie')!.split(';')[0];
    return {
      cookie,
      'x-csrf-token': session.csrf_token,
      origin,
      'Content-Type': 'application/json',
    };
  }
  async function request(
    path: string,
    headers: Record<string, string>,
    method = 'GET',
    body?: unknown,
  ) {
    const res = await fetch(base + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: res.status, body: (await res.json()) as any, headers: res.headers };
  }
  return {
    base,
    reset,
    login,
    request,
    async close() {
      child.kill();
      await child.exited;
      await redis.quit();
    },
    async logs() {
      return (await new Response(child.stdout).text()) + (await new Response(child.stderr).text());
    },
  };
}
