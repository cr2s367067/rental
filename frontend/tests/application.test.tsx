import './setup';
import { test, expect, afterEach } from 'bun:test';
import { render, screen, cleanup } from '@testing-library/react';
import { App } from '../Views/App';
afterEach(cleanup);
test('application starts a session check before protected navigation', () => {
  const view = render(
    <App
      service={{
        read: () => new Promise(() => {}),
        signIn: () => new Promise(() => {}),
        signOut: async () => {},
      }}
    />,
  );
  expect(view.queryByText(/Loading session/)).not.toBeNull();
});
