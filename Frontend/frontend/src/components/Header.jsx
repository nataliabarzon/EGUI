import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-3xl font-bold mb-4 md:mb-0 hover:text-primary-foreground/80 transition-colors">
          Library Name
        </Link>
        <nav>
          <ul className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <li><Link href="/books" className="hover:text-primary-foreground/80 transition-colors">Books</Link></li>
            <li><Link href="/events" className="hover:text-primary-foreground/80 transition-colors">Events</Link></li>
            <li><Link href="/about" className="hover:text-primary-foreground/80 transition-colors">About</Link></li>
            <li>
              <Link href="/auth/login">
                <Button variant="secondary" className="w-full md:w-auto mt-2 md:mt-0 hover:bg-secondary/90 transition-colors">
                  Login
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
