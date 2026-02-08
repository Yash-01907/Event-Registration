import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Loader2, AlertCircle, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'sonner';

const resetSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    const token = tokenFromUrl;
    if (!token) {
      toast.error('Invalid or missing reset link.');
      return;
    }
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword: data.newPassword,
      });
      toast.success('Password reset successfully. You can now sign in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password.';
      toast.error(msg);
    }
  };

  if (!tokenFromUrl) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4 gradient-mesh relative overflow-hidden'>
        <div className='absolute inset-0 grid-pattern opacity-30' />
        <div className='w-full max-w-md rounded-2xl glass-card p-8 relative z-10 border-glow text-center space-y-4'>
          <div className='rounded-xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20 flex items-center justify-center gap-2'>
            <AlertCircle className='h-4 w-4 shrink-0' />
            Invalid or expired reset link. Please request a new one.
          </div>
          <Link to='/forgot-password'>
            <Button
              variant='outline'
              className='border-gray-700 hover:bg-white/5'
            >
              Request new link
            </Button>
          </Link>
          <p className='text-sm text-gray-500'>
            <Link to='/login' className='text-cyan-400 hover:text-cyan-300'>
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    );
  }

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
            Reset Password
          </h2>
          <p className='mt-2 text-sm text-gray-500 font-mono'>
            Enter your new password
          </p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor='newPassword' className='sr-only'>
              New Password
            </label>
            <div className='relative'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4'>
                <Lock
                  className={cn(
                    'h-5 w-5',
                    errors.newPassword ? 'text-red-400' : 'text-gray-600'
                  )}
                />
              </div>
              <input
                id='newPassword'
                type='password'
                autoComplete='new-password'
                className={cn(
                  'block w-full rounded-xl border bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 font-mono text-sm transition-all',
                  errors.newPassword
                    ? 'border-red-500/50 focus:ring-red-500/30'
                    : 'border-gray-800 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                )}
                placeholder='New password'
                {...register('newPassword')}
              />
            </div>
            {errors.newPassword && (
              <p className='mt-2 text-xs text-red-400 flex items-center gap-1 font-mono'>
                <AlertCircle className='h-3 w-3' />
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor='confirmPassword' className='sr-only'>
              Confirm Password
            </label>
            <div className='relative'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4'>
                <Lock
                  className={cn(
                    'h-5 w-5',
                    errors.confirmPassword ? 'text-red-400' : 'text-gray-600'
                  )}
                />
              </div>
              <input
                id='confirmPassword'
                type='password'
                autoComplete='new-password'
                className={cn(
                  'block w-full rounded-xl border bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 font-mono text-sm transition-all',
                  errors.confirmPassword
                    ? 'border-red-500/50 focus:ring-red-500/30'
                    : 'border-gray-800 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                )}
                placeholder='Confirm new password'
                {...register('confirmPassword')}
              />
            </div>
            {errors.confirmPassword && (
              <p className='mt-2 text-xs text-red-400 flex items-center gap-1 font-mono'>
                <AlertCircle className='h-3 w-3' />
                {errors.confirmPassword.message}
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
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>

        <p className='text-center text-sm text-gray-500'>
          <Link
            to='/login'
            className='font-semibold text-cyan-400 hover:text-cyan-300 transition-colors'
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
