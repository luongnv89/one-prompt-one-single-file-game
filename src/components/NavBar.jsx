import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function NavBar() {
  const navItems = [
    { label: 'Gallery', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Contribute', to: '/contribute' },
    { label: 'Contributors', to: '/contributors' },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3 text-gray-900">
          <img
            src="/logo-mark.svg"
            alt="AI One-File Arcade logo"
            className="h-12 w-12"
            loading="lazy"
            decoding="async"
          />
          <div className="leading-tight">
            <p className="text-sm uppercase tracking-wide text-gray-500">AI One-File</p>
            <p className="text-lg font-semibold">Arcade</p>
          </div>
        </Link>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `transition-colors hover:text-gray-900 ${isActive ? 'text-gray-900' : 'text-gray-600'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <Link
            to="/contributors"
            className="hidden sm:inline-flex rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:border-primary-dark hover:text-primary-dark"
          >
            Contributors
          </Link>
          <a
            href="https://github.com/luongnv89/ai-one-file-arcade"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
