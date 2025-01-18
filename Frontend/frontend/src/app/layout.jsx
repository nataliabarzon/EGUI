import { AuthProvider } from './context/AuthContext';
import './globals.css'
import { Inter } from 'next/font/google'
import AnimatedBackground from '@/components/AnimatedBackground';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Library Website',
  description: 'A modern library website built with Next.js and shadcn/ui',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
      <AnimatedBackground />

        <AuthProvider>
            {children}
        </AuthProvider>
      </body>
    </html>
  );
}
