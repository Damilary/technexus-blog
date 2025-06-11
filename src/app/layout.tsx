'use client';
import './globals.css';

import React from 'react';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-light dark:bg-darkMode-bg text-dark dark:text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
