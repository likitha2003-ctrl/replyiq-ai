import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { ToastProvider } from '../components/shared/ToastProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'ReplyIQ AI — Unified AI Inbox',
  description: 'AI-powered customer communication platform',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'ReplyIQ AI — Unified AI Inbox',
    description: 'AI-powered customer communication platform',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
