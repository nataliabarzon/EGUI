"use client";

import { Header } from '@/components/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react'
import ProtectedRoute from '../protected-route';

export default function EventsPage() {
  const events = [
    { 
      id: 1, 
      title: 'Book Club Meeting', 
      date: '2023-06-15', 
      time: '7:00 PM',
      location: 'Main Reading Room',
      description: 'Join us for a discussion on this month\'s book.' 
    },
    { 
      id: 2, 
      title: 'Author Talk', 
      date: '2023-06-22', 
      time: '6:30 PM',
      location: 'Auditorium',
      description: 'Meet the author of our bestselling novel.' 
    },
    { 
      id: 3, 
      title: 'Children\'s Story Time', 
      date: '2023-06-29', 
      time: '10:00 AM',
      location: 'Children\'s Section',
      description: 'Bring your kids for an hour of enchanting stories.' 
    },
  ]

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Upcoming Events</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardHeader className="bg-primary text-primary-foreground">
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  <Badge variant="secondary" className="mr-2">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Badge>
                  {event.time}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">{event.description}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="mr-4">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <ClockIcon className="mr-2 h-4 w-4" />
                  <span className="mr-4">{event.time}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <MapPinIcon className="mr-2 h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
    </ProtectedRoute>
  )
}