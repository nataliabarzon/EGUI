'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function Header() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  };

  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <Link
          href={isAdmin ? '/admin' : '/'}
          className="text-3xl font-bold mb-4 md:mb-0 hover:text-primary-foreground/80 transition-colors"
        >
          {isAdmin ? 'Admin Panel' : 'Library Name'}
        </Link>
        <nav>
          <ul className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            {isAdmin ? (
              <>
                <li>
                  <Link href="/admin/books" className="hover:text-primary-foreground/80 transition-colors">
                    Books
                  </Link>
                </li>
                <li>
                  <Link href="/admin/users" className="hover:text-primary-foreground/80 transition-colors">
                    Users
                  </Link>
                </li>
                <li>
                  <Link href="/admin/reservations" className="hover:text-primary-foreground/80 transition-colors">
                    Reservations
                  </Link>
                </li>
              </>
            ) : (
              <>
                 <li>
                  <Link href="/my-reservations" className="hover:text-primary-foreground/80 transition-colors">
                    My Reservations
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-primary-foreground/80 transition-colors">
                    Books
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="hover:text-primary-foreground/80 transition-colors">
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary-foreground/80 transition-colors">
                    About
                  </Link>
                </li>
              </>
            )}
          
            <li>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full md:w-auto mt-2 md:mt-0 hover:bg-primary-foreground/10 transition-colors"
              >
                Logout
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
