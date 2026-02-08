import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Mail, Loader2, AlertCircle, Cpu, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'sonner';

const forgotSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    setError(null);
    try {
      const res = await api.post('/auth/forgot-password', {
        email: data.email,
      });
      setSubmitted(true);
      toast.success(
        res.data?.message || 'Check your email for the reset link.'
      );
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong.';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center p-4 gradient-mesh relative overflow-hidden'>
      <div className='absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px]' />
      <div className='absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]' />
      <div className='absolute inset-0 grid-pattern opacity-30' />

      <div className='w-full max-w-md space-y-8 rounded-2xl glass-card p-8 relative z-10 border-glow'>
        <div className='text-center'>
          <Link to='/' className='inline-flex items-center gap-3 mb-6'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 glow-cyan'>
              <Cpu className='h-6 w-6 text-white' />
            </div>
            <span className='font-heading font-bold text-xl'>
              <span className='text-cyan-400'>TECH</span>
              <span className='text-white'>FEST</span>
            </span>
          </Link>
          <h2 className='text-2xl font-bold tracking-wide text-white font-heading'>
            Forgot Password
          </h2>
          <p className='mt-2 text-sm text-gray-500 font-mono'>
            Enter your email to receive a password reset link
          </p>
        </div>

        {submitted && !error ? (
          <div className='space-y-4'>
            <div className='rounded-xl bg-green-500/10 p-4 text-sm text-green-400 border border-green-500/20 flex items-center gap-2'>
              <CheckCircle className='h-4 w-4 shrink-0' />
              If an account exists with that email, you will receive a password
              reset link. Check your inbox.
            </div>
            <Link to='/login'>
              <Button
                variant='outline'
                className='w-full border-gray-700 hover:bg-white/5'
              >
                Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className='rounded-xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20 flex items-center gap-2'>
                <AlertCircle className='h-4 w-4' />
                {error}
              </div>
            )}

            <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor='email' className='sr-only'>
                  Email address
                </label>
                <div className='relative'>
                  <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4'>
                    <Mail
                      className={cn(
                        'h-5 w-5',
                        errors.email ? 'text-red-400' : 'text-gray-600'
                      )}
                    />
                  </div>
                  <input
                    id='email'
                    type='email'
                    autoComplete='email'
                    className={cn(
                      'block w-full rounded-xl border bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 font-mono text-sm transition-all',
                      errors.email
                        ? 'border-red-500/50 focus:ring-red-500/30'
                        : 'border-gray-800 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                    )}
                    placeholder='Email address'
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className='mt-2 text-xs text-red-400 flex items-center gap-1 font-mono'>
                    <AlertCircle className='h-3 w-3' />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type='submit'
                disabled={isSubmitting}
                className='w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 rounded-xl btn-glow hover:from-cyan-400 hover:to-purple-500'
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          </>
        )}

        <p className='text-center text-sm text-gray-500'>
          Remember your password?{' '}
          <Link
            to='/login'
            className='font-semibold text-cyan-400 hover:text-cyan-300 transition-colors'
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
