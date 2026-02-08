import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Cpu, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState(!token ? 'error' : 'loading'); // loading | success | error

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        await api.post('/auth/verify-email', { token });
        setStatus('success');
        toast.success('Email verified successfully!');
      } catch (err) {
        setStatus('error');
        toast.error(
          err.response?.data?.message ||
            'Verification failed. The link may have expired.'
        );
      }
    };

    verify();
  }, [token]);

  return (
    <div className='flex min-h-screen items-center justify-center p-4 gradient-mesh relative overflow-hidden'>
      <div className='absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px]' />
      <div className='absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]' />
      <div className='absolute inset-0 grid-pattern opacity-30' />

      <div className='w-full max-w-md rounded-2xl glass-card p-8 relative z-10 border-glow text-center space-y-6'>
        <Link to='/' className='inline-flex items-center gap-3 mb-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 glow-cyan'>
            <Cpu className='h-6 w-6 text-white' />
          </div>
          <span className='font-heading font-bold text-xl'>
            <span className='text-cyan-400'>TECH</span>
            <span className='text-white'>FEST</span>
          </span>
        </Link>

        {status === 'loading' && (
          <>
            <Loader2 className='h-12 w-12 animate-spin text-cyan-400 mx-auto' />
            <p className='text-gray-400'>Verifying your email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className='rounded-full bg-green-500/20 p-4 w-fit mx-auto'>
              <CheckCircle className='h-12 w-12 text-green-400' />
            </div>
            <h2 className='text-xl font-bold text-white'>Email verified!</h2>
            <p className='text-gray-400 text-sm'>
              You can now sign in to your account.
            </p>
            <Link to='/login'>
              <Button className='w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 rounded-xl'>
                Sign in
              </Button>
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className='rounded-full bg-red-500/20 p-4 w-fit mx-auto'>
              <AlertCircle className='h-12 w-12 text-red-400' />
            </div>
            <h2 className='text-xl font-bold text-white'>
              Verification failed
            </h2>
            <p className='text-gray-400 text-sm'>
              {token
                ? 'The link may be invalid or expired. Please register again or contact support.'
                : 'No verification token found. Please use the link from your email.'}
            </p>
            <div className='flex flex-col gap-2'>
              <Link to='/register'>
                <Button variant='outline' className='w-full border-gray-700'>
                  Register again
                </Button>
              </Link>
              <Link to='/login'>
                <Button variant='ghost' className='w-full text-cyan-400'>
                  Back to Login
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
