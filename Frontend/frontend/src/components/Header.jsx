<<<<<<< HEAD
"use client";

import Link from 'next/link'
import { Button } from '@/components/ui/button'
=======
import Link from 'next/link';
import { Button } from '@/components/ui/button';
>>>>>>> 47ce4c2454243706d1e690d6a0558600e132a417

export function Header() {
  const handleLogout = () => {
    // Add logout logic here
    console.log('Logout clicked')
  }

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-3xl font-bold mb-4 md:mb-0 hover:text-primary-foreground/80 transition-colors">
          Library Name
        </Link>
        <nav>
          <ul className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <li><Link href="/" className="hover:text-primary-foreground/80 transition-colors">Books</Link></li>
            <li><Link href="/events" className="hover:text-primary-foreground/80 transition-colors">Events</Link></li>
            <li><Link href="/about" className="hover:text-primary-foreground/80 transition-colors">About</Link></li>
            <li>
              <Link href="/auth/login">
                <Button variant="secondary" className="w-full md:w-auto mt-2 md:mt-0 hover:bg-secondary/90 transition-colors">
                  Login
                </Button>
              </Link>
            </li>
            <li>
              <Button variant="outline" onClick={handleLogout} className="w-full md:w-auto mt-2 md:mt-0 hover:bg-primary-foreground/10 transition-colors">
                Logout
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
<<<<<<< HEAD
  )
}
=======
  );
}
>>>>>>> 47ce4c2454243706d1e690d6a0558600e132a417
