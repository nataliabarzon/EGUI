import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from './ui/button'

const featuredBooks = [
  {
    id: 1,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    coverImage: '/placeholder.svg?height=200&width=150',
    description: 'A classic of modern American literature.',
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    coverImage: '/placeholder.svg?height=200&width=150',
    description: 'A dystopian social science fiction novel.',
  },
  {
    id: 3,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    coverImage: '/placeholder.svg?height=200&width=150',
    description: 'A romantic novel of manners.',
  },
]

export function FeaturedBooks() {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Featured Books</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredBooks.map((book) => (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
              <CardDescription>{book.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                width={150}
                height={200}
                className="mx-auto mb-4"
              />
              <p className="text-sm text-muted-foreground">{book.description}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Borrow</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

