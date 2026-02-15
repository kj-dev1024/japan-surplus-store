import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import CartModalWrapper from '@/components/CartModalWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: 'Japan Surplus Store | Quality Surplus Items',
  description: 'Your go-to Japan surplus store for unique and quality items.',
};

const themeScript = `
  (function() {
    const key = 'japan_surplus_theme';
    const stored = localStorage.getItem(key);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored === 'dark' || (stored !== 'light' && prefersDark);
    document.documentElement.classList.toggle('dark', isDark);
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            <CartModalWrapper />
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1e293b',
                  color: '#f1f5f9',
                  borderRadius: '12px',
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
