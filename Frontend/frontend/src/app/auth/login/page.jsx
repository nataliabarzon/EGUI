'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { motion, AnimatePresence } from 'framer-motion'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data))
        if(data.user.role === 'librarian') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, surname }),
      })

      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.token))
        localStorage.setItem('userInfo', JSON.stringify(data.user))
        router.push('/')
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleView = () => {
    setIsLogin(!isLogin)
    setError('')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <motion.div
        layout
        initial={false}
        animate={{
          borderColor: isLogin ? ["hsl(var(--primary-foreground))", "hsl(var(--primary))", "hsl(var(--primary-foreground))"] : ["hsl(var(--primary-foreground))", "hsl(var(--primary))", "hsl(var(--primary-foreground))"],
        }}
        transition={{ duration: 0.5 }}
        className="w-[350px] border-2 rounded-lg overflow-hidden"
      >
        <Card className="border-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  {isLogin ? 'Login' : 'Register'}
                </CardTitle>
                <CardDescription className="text-center">
                  {isLogin ? 'Enter your credentials to access your account' : 'Create a new account'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={isLogin ? handleLogin : handleRegister}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        type="email"
                        id="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    {!isLogin && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            type="text"
                            id="name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="surname">Surname</Label>
                          <Input
                            type="text"
                            id="surname"
                            placeholder="Enter your surname"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            required
                          />
                        </div>
                      </>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                    {isLoading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Login' : 'Register')}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <Button variant="link" className="p-0" onClick={toggleView}>
                    {isLogin ? 'Sign up' : 'Log in'}
                  </Button>
                </p>
              </CardFooter>
            </motion.div>
          </AnimatePresence>
        </Card>
      </motion.div>
      {error && (
        <Alert variant="destructive" className="mt-4 absolute bottom-4 left-4 right-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}