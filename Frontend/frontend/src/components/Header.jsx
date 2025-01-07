import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">Library Name</Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/books" className="hover:underline">Books</Link></li>
            <li><Link href="/events" className="hover:underline">Events</Link></li>
            <li><Link href="/about" className="hover:underline">About</Link></li>
            <li><Button variant="secondary">Login</Button></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

