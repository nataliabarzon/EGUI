
// import { useRouter } from 'next/navigation';
// import { useAuth } from '../app/context/AuthContext';
// import Link from 'next/link';
// import { Button } from '../components/ui/button';
// import { 
//   DropdownMenu, 
//   DropdownMenuContent, 
//   DropdownMenuItem, 
//   DropdownMenuTrigger 
// } from '../components/ui/dropdown-menu';

// export default function Layout({ children }) {
//   const router = useRouter();
//   const { user, setUser } = useAuth();

//   const handleLogout = async () => {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`, {
//         method: 'POST',
//         credentials: 'include',
//       });

//       if (res.ok) {
//         setUser(null);
//         router.push('/auth/login');
//       } else {
//         console.error('Logout failed.');
//       }
//     } catch (err) {
//       console.error('Logout Error:', err);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-background text-foreground">
//       <nav className="bg-primary text-primary-foreground bg-black shadow-md">
//         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//           <Link href="/" className="text-2xl font-bold hover:text-primary-foreground/80 transition-colors">
//             Library Management
//           </Link>
//           <div className="flex items-center space-x-4">
//             {user ? (
//               <DropdownMenu>
           
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem>
//                     <span className="font-medium">Welcome, {user.name}</span>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={handleLogout}>
//                     Logout
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             ) : (
//               <>
//                 <Button variant="ghost" asChild>
//                   <Link href="/auth/login">Login</Link>
//                 </Button>
//                 <Button variant="secondary" asChild>
//                   <Link href="/auth/register">Register</Link>
//                 </Button>
//               </>
//             )}
//           </div>
//         </div>
//       </nav>
//       <main className="flex-grow container mx-auto px-4 py-8">
//         {children}
//       </main>
//       <footer className="bg-muted text-muted-foreground py-4">
//         <div className="container mx-auto px-4 text-center">
//           © {new Date().getFullYear()} EGUI by Natalia Barzon. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// }

