import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { useAddManualRegistration } from '@/hooks/useEvents';

const manualEntrySchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  rollNumber: z.string().min(1, { message: 'Roll Number is required' }),
  phone: z.string().min(10, { message: 'Phone number required' }),
});

export default function ManualEntryModal({ eventId, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState(null);

  const addManualRegistration = useAddManualRegistration(eventId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(manualEntrySchema),
  });

  const onSubmit = (data) => {
    setServerError(null);
    addManualRegistration.mutate(data, {
      onSuccess: () => {
        reset();
        setOpen(false);
        onSuccess?.();
      },
      onError: (error) => {
        setServerError(
          error.response?.data?.message || 'Failed to add manual entry'
        );
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Add Manual Entry
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] bg-background border-white/10'>
        <DialogHeader>
          <DialogTitle>Manual Registration</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <p className='text-sm text-gray-400'>
            Enter the student details manually. If the student doesn't exist, an
            account will be created for them.
          </p>

          {serverError && (
            <div className='p-2 bg-destructive/10 text-destructive text-sm rounded border border-destructive/20'>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Name</label>
              <input
                className='w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                {...register('name')}
              />
              {errors.name && (
                <span className='text-xs text-destructive'>
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Email</label>
              <input
                className='w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                {...register('email')}
              />
              {errors.email && (
                <span className='text-xs text-destructive'>
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Roll Number</label>
              <input
                className='w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                {...register('rollNumber')}
              />
              {errors.rollNumber && (
                <span className='text-xs text-destructive'>
                  {errors.rollNumber.message}
                </span>
              )}
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Phone</label>
              <input
                className='w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                {...register('phone')}
              />
              {errors.phone && (
                <span className='text-xs text-destructive'>
                  {errors.phone.message}
                </span>
              )}
            </div>

            <Button
              type='submit'
              className='w-full'
              disabled={addManualRegistration.isPending}
            >
              {addManualRegistration.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Adding...
                </>
              ) : (
                'Add Entry'
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
