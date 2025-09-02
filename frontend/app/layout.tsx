import 'bootstrap/dist/css/bootstrap.min.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dental Inventory',
  description: 'Manage dental supplies',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Make the page a flex column so footer sticks to bottom without scrolling */}
      <body className={`${geistSans.variable} ${geistMono.variable} d-flex flex-column min-vh-100`}>
        <Header />
        {/* No .container and no margins here – pages decide their own layout */}
        <main className="flex-grow-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
