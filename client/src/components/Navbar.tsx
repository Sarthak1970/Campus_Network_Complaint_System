'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogIn } from 'lucide-react';
import { useTheme } from 'next-themes';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Make a Complaint', href: '/complaint' },
  { label: 'Admin', href: '/admindash' },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="w-full px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex h-16 items-center justify-between">

          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-2xl shadow-sm">
              N
            </div>
            <div>
              <span className="font-semibold text-xl tracking-tight text-gray-900 dark:text-white">
                Network Complaints
              </span>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-1">WiFi • Internet • Connectivity</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                             (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-1000 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Toggle dark mode"
              suppressHydrationWarning
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <button
              type="button"
              className="hidden sm:flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
            >
              <LogIn size={18} />
              Sign in
            </button>

            <button
              onClick={toggleMenu}
              className="md:hidden p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="px-5 py-6 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                             (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`block px-5 py-4 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-6 mt-4 border-t border-gray-200 dark:border-gray-800">
              <button className="w-full flex items-center justify-center gap-3 px-6 py-3.5 text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors">
                <LogIn size={22} />
                Sign in
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}