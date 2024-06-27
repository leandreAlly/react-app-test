import '@testing-library/jest-dom/vitest';
import { PropsWithChildren, ReactNode } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

vi.mock('@auth0/auth0-react', () => {
  return {
    useAuth0: vi.fn().mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: undefined,
    }),
    Auth0Provider: ({ children }: PropsWithChildren) => children,
    withAuthenticationRequired: (component: ReactNode) => component,
  };
});

global.ResizeObserver = ResizeObserver;

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: unknown) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
