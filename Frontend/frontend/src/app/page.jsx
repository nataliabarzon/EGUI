import { Header } from '@/components/Header'
import { FeaturedBooks } from '@/components/FeaturedBooks'
import { SearchBar } from '@/components/SearchBar'
import ProtectedRoute from './protected-route.jsx'

export default function Home() {
  return (
  <ProtectedRoute >
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <FeaturedBooks />
      </main>
    </div>
 </ProtectedRoute>
  )
}

