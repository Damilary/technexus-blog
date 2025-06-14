// src/mocks/index.ts
async function initMocks() {
  if (typeof window === 'undefined') {
    // Server-side
    const { server } = await import('./server');
    server.listen({ onUnhandledRequest: 'bypass' });
    console.info('[MSW] Server started');
    return;
  }

  // Client-side
  if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
    const { worker } = await import('./browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
    console.info('[MSW] Browser worker started');
  }
}

// Initialize MSW
export default initMocks; 