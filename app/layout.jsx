import './globals.css';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'Spread Smiles Foundation | Empowering Lives with Hope & Dignity',
  description:
    'Dedicated to serving humanity through education, healthcare, and essential community support for underprivileged families in Delhi and beyond.',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased selection:bg-[#2081e2] selection:text-white">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
