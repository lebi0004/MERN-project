'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="custom-header py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <Link href="/" className="navbar-brand text-white fw-bold">
          Dental Inventory
        </Link>
        <nav className="d-flex gap-3">
          <Link href="/login" className="text-white">Login</Link>
          <Link href="/register" className="text-white">Register</Link>
        </nav>
      </div>
    </header>
  );
}
