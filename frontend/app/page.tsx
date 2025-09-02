'use client';

import Link from 'next/link';
import { Container } from 'react-bootstrap';

export default function HomePage() {
  return (
    <section
      style={{
        backgroundImage: "url('/image.jpg')",       // file is in /public
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        // fill the viewport minus header+footer heights
        minHeight: 'calc(100vh - 56px - 48px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',  // full width now that layout doesn’t constrain it
      }}
    >
      {/* dark overlay for text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
        }}
      />

      {/* center content; Container is fine inside the full-bleed hero */}
      <Container className="text-center" style={{ position: 'relative', zIndex: 1 }}>
        <h1 className="fw-bold display-4 text-white mb-3">Welcome to Dental Inventory</h1>
        <p className="lead text-white mb-4">
          Manage your dental supplies with ease and efficiency.
        </p>
        <p className="lead text-white">
          If you are already registered, please{' '}
          <Link href="/login" className="text-warning fw-bold">login</Link>.
        </p>
        <p className="lead text-white">
          If you don’t have an account yet, please register{' '}
          <Link href="/register" className="text-warning fw-bold">here</Link>.
        </p>
      </Container>
    </section>
  );
}
