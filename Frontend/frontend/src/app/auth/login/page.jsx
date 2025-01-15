
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';


export default async function LoginPage() {
  const cookieStore =  await cookies();
  const token =  cookieStore.get('jwt')?.value;
  console.log(token);
  if (token) {
    redirect('/dashboard');
  }

  const LoginForm = dynamic(() => import('@/components/LoginForm'), { ssr: true });

  return <LoginForm />;
}
