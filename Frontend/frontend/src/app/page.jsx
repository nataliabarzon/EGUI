import { Header } from '@/components/Header'
import { FeaturedBooks } from '@/components/FeaturedBooks'
import { SearchBar } from '@/components/SearchBar'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to Our Library</h1>
        <SearchBar />
        <FeaturedBooks />
      </main>
    </div>
  )
}

