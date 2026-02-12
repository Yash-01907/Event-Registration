import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useEvent,
  useUpdateEvent,
  useDeleteEvent,
  useTogglePublishEvent,
  useAddCoordinator,
  useUploadPoster,
} from '@/hooks/useEvents';
import { useForm } from 'react-hook-form';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  IndianRupee,
  Users,
  Mail,
  Plus,
  Loader2,
  Trash,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { cn } from '@/lib/utils';
import useAuthStore from '@/store/authStore';

const ManageEventSkeleton = () => (
  <div className='min-h-screen gradient-mesh pt-20 pb-12'>
    <div className='absolute inset-0 grid-pattern opacity-30 pointer-events-none' />
    <div className='container mx-auto px-4 relative z-10'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
        <div className='h-10 w-36 bg-gray-700/50 rounded-lg animate-pulse' />
        <div className='flex gap-2'>
          <div className='h-10 w-44 bg-gray-700/50 rounded-lg animate-pulse' />
          <div className='h-10 w-28 bg-gray-700/50 rounded-lg animate-pulse' />
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column: Event Details Skeleton */}
        <div className='lg:col-span-2 space-y-6'>
          <div className='rounded-xl border border-white/10 bg-background/50 backdrop-blur-sm p-6'>
            <div className='flex justify-between items-center mb-6'>
              <div className='h-6 w-40 bg-gray-700/50 rounded animate-pulse' />
              <div className='h-9 w-24 bg-gray-700/50 rounded-lg animate-pulse' />
            </div>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <div className='h-4 w-24 bg-gray-700/40 rounded animate-pulse mb-2' />
                  <div className='h-10 w-full bg-gray-700/50 rounded-md animate-pulse' />
                </div>
                <div>
                  <div className='h-4 w-20 bg-gray-700/40 rounded animate-pulse mb-2' />
                  <div className='h-10 w-full bg-gray-700/50 rounded-md animate-pulse' />
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <div className='h-4 w-28 bg-gray-700/40 rounded animate-pulse mb-2' />
                  <div className='h-10 w-full bg-gray-700/50 rounded-md animate-pulse' />
                </div>
                <div>
                  <div className='h-4 w-16 bg-gray-700/40 rounded animate-pulse mb-2' />
                  <div className='h-10 w-full bg-gray-700/50 rounded-md animate-pulse' />
                </div>
              </div>
              <div>
                <div className='h-4 w-16 bg-gray-700/40 rounded animate-pulse mb-2' />
                <div className='h-10 w-full bg-gray-700/50 rounded-md animate-pulse' />
              </div>
              <div>
                <div className='h-4 w-28 bg-gray-700/40 rounded animate-pulse mb-2' />
                <div className='flex gap-4 mt-2'>
                  <div className='h-20 w-20 bg-gray-700/50 rounded-lg animate-pulse shrink-0' />
                  <div className='flex-1 space-y-2'>
                    <div className='h-10 w-full bg-gray-700/50 rounded-md animate-pulse' />
                    <div className='h-3 w-48 bg-gray-700/40 rounded animate-pulse' />
                  </div>
                </div>
              </div>
              <div>
                <div className='h-4 w-24 bg-gray-700/40 rounded animate-pulse mb-2' />
                <div className='h-24 w-full bg-gray-700/50 rounded-md animate-pulse' />
              </div>
              <div className='p-4 rounded-lg bg-card border border-border space-y-4'>
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 bg-gray-700/50 rounded animate-pulse' />
                  <div className='h-4 w-24 bg-gray-700/50 rounded animate-pulse' />
                </div>
              </div>
              <div className='p-4 rounded-lg bg-card border border-border space-y-4'>
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 bg-gray-700/50 rounded animate-pulse' />
                  <div className='h-4 w-40 bg-gray-700/50 rounded animate-pulse' />
                </div>
              </div>
              <div className='p-4 rounded-lg bg-card border border-border space-y-4'>
                <div className='flex justify-between items-center'>
                  <div className='h-4 w-40 bg-gray-700/50 rounded animate-pulse' />
                  <div className='h-8 w-28 bg-gray-700/50 rounded animate-pulse' />
                </div>
                <div className='space-y-3'>
                  <div className='h-14 w-full bg-gray-700/40 rounded-md animate-pulse' />
                  <div className='h-14 w-full bg-gray-700/40 rounded-md animate-pulse' />
                </div>
              </div>
              <div className='flex justify-end pt-4'>
                <div className='h-10 w-32 bg-gray-700/50 rounded-lg animate-pulse' />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Coordinators Skeleton */}
        <div className='space-y-6'>
          <div className='rounded-xl border border-white/10 bg-background/50 backdrop-blur-sm p-6'>
            <div className='flex items-center gap-2 mb-6'>
              <div className='h-5 w-5 bg-gray-700/50 rounded animate-pulse' />
              <div className='h-5 w-28 bg-gray-700/50 rounded animate-pulse' />
            </div>
            <div className='mb-6'>
              <div className='h-3 w-40 bg-gray-700/40 rounded animate-pulse mb-2' />
              <div className='flex gap-2'>
                <div className='h-10 flex-1 bg-gray-700/50 rounded-md animate-pulse' />
                <div className='h-10 w-10 bg-gray-700/50 rounded-md animate-pulse' />
              </div>
            </div>
            <div className='space-y-3'>
              <div className='h-3 w-24 bg-gray-700/40 rounded animate-pulse' />
              <div className='flex items-center gap-3 p-3 rounded-lg bg-card border border-border'>
                <div className='h-8 w-8 rounded-full bg-gray-700/50 animate-pulse shrink-0' />
                <div className='flex-1 space-y-2'>
                  <div className='h-4 w-32 bg-gray-700/50 rounded animate-pulse' />
                  <div className='h-3 w-24 bg-gray-700/40 rounded animate-pulse' />
                </div>
              </div>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className='flex items-center gap-3 p-3 rounded-lg bg-card border border-border'
                >
                  <div className='h-8 w-8 rounded-full bg-gray-700/50 animate-pulse shrink-0' />
                  <div className='flex-1 space-y-2'>
                    <div className='h-4 w-28 bg-gray-700/50 rounded animate-pulse' />
                    <div className='h-3 w-40 bg-gray-700/40 rounded animate-pulse' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function ManageEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: event, isLoading: loading, error } = useEvent(id);
  const updateEventMutation = useUpdateEvent(id);
  const deleteEventMutation = useDeleteEvent();
  const togglePublishMutation = useTogglePublishEvent();
  const addCoordinatorMutation = useAddCoordinator(id);
  const uploadPosterMutation = useUploadPoster();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [coordEmail, setCoordEmail] = useState('');
  const [questions, setQuestions] = useState([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const saving =
    updateEventMutation.isPending || togglePublishMutation.isPending;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const isTeamEvent = watch('isTeamEvent');
  const semControlEnabled = watch('semControlEnabled');

  useEffect(() => {
    if (!event) return;
    setValue('name', event.name);
    setValue('category', event.category);
    if (event.posterUrl) {
      setPreviewUrl(event.posterUrl);
      setValue('posterUrl', event.posterUrl);
    }
    if (event.date) {
      setValue('date', new Date(event.date).toISOString().slice(0, 16));
    }
    setValue('fees', event.fees);
    setValue('location', event.location);
    setValue('description', event.description);
    setValue('isTeamEvent', event.isTeamEvent);
    setValue('minTeamSize', event.minTeamSize);
    setValue('maxTeamSize', event.maxTeamSize);
    setValue('semControlEnabled', event.semControlEnabled ?? false);
    setValue('maxSem', event.maxSem ?? '');
    setValue('department', event.department ?? 'ALL');
    if (event.formConfig) setQuestions(event.formConfig);
  }, [event, setValue]);

  useEffect(() => {
    if (error) toast.error('Failed to load event details');
  }, [error]);

  const onUpdateEvent = useCallback(
    (formData) => {
      const payload = {
        ...formData,
        formConfig: questions,
        maxSem:
          formData.semControlEnabled && formData.maxSem != null
            ? parseInt(formData.maxSem)
            : null,
      };
      updateEventMutation.mutate(payload, {
        onSuccess: () => toast.success('Event updated successfully'),
        onError: (err) =>
          toast.error(err.response?.data?.message || 'Failed to update event'),
      });
    },
    [questions, updateEventMutation]
  );

  const isMainCoordinator = user?.id === event?.mainCoordinatorId;
  const isAdmin = user?.role === 'ADMIN';
  const canAddCoordinator = isMainCoordinator || isAdmin;

  const onDeleteEvent = useCallback(async () => {
    try {
      await deleteEventMutation.mutateAsync(id);
      toast.success('Event deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
      throw error;
    }
  }, [id, navigate, deleteEventMutation]);

  const onTogglePublish = useCallback(() => {
    togglePublishMutation.mutate(id, {
      onSuccess: (data) => {
        toast.success(
          `${data?.isPublished ? 'Published' : 'Unpublished'} successfully`
        );
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update status');
      },
    });
  }, [togglePublishMutation]);

  const onAddCoordinator = useCallback(
    (e) => {
      e.preventDefault();
      if (!coordEmail) return;

      if (user && coordEmail === user.email) {
        toast.error('You cannot add yourself as a coordinator');
        return;
      }

      addCoordinatorMutation.mutate(coordEmail, {
        onSuccess: () => {
          setCoordEmail('');
          toast.success('Coordinator added successfully');
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || 'Failed to add coordinator'
          );
        },
      });
    },
    [coordEmail, user, addCoordinatorMutation]
  );

  const handlePosterUpload = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      uploadPosterMutation.mutate(formData, {
        onSuccess: (data) => {
          if (data?.url) {
            setValue('posterUrl', data.url);
            setPreviewUrl(data.url);
          }
        },
        onError: () => {
          toast.error('Failed to upload image');
        },
      });
    },
    [setValue, uploadPosterMutation]
  );

  const addQuestion = useCallback(() => {
    setQuestions((prev) => [
      ...prev,
      { label: '', type: 'text', required: false },
    ]);
  }, []);

  const updateQuestion = useCallback((index, field, value) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const removeQuestion = useCallback((index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  if (loading) return <ManageEventSkeleton />;
  if (!event) return <div className='text-center pt-20'>Event not found</div>;

  return (
    <div className='min-h-screen gradient-mesh pt-20 pb-12'>
      <div className='absolute inset-0 grid-pattern opacity-30 pointer-events-none' />

      <div className='container mx-auto px-4 relative z-10'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
          <Button
            variant='ghost'
            onClick={() =>
              navigate(
                user?.role === 'FACULTY' || user?.role === 'ADMIN'
                  ? '/dashboard'
                  : '/coordinator-dashboard'
              )
            }
            className='gap-2 text-muted-foreground hover:text-foreground'
          >
            <ArrowLeft className='h-4 w-4' /> Back to Dashboard
          </Button>

          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={() => navigate(`/dashboard/event/${id}/registrations`)}
              className='gap-2'
            >
              <Users className='h-4 w-4' /> View Registrations
            </Button>
            {(isMainCoordinator || isAdmin) && (
              <Button
                variant='outline'
                onClick={() => setDeleteConfirmOpen(true)}
                disabled={deleteEventMutation.isPending}
                className='gap-2 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500'
              >
                {deleteEventMutation.isPending ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Trash className='h-4 w-4' />
                )}
                Delete Event
              </Button>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column: Event Details */}
          <div className='lg:col-span-2 space-y-6'>
            <div className='rounded-xl border border-white/10 bg-background/50 backdrop-blur-sm p-6'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-bold font-heading text-foreground'>
                  Edit Event Details
                </h2>
                <Button
                  onClick={onTogglePublish}
                  variant='outline'
                  size='sm'
                  disabled={saving || uploadPosterMutation.isPending}
                  className={cn(
                    'border-opacity-50',
                    event.isPublished
                      ? 'bg-green-500/10 text-green-400 border-green-500 hover:bg-green-500/20 hover:text-green-300'
                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-300'
                  )}
                >
                  {saving && <Loader2 className='mr-2 h-3 w-3 animate-spin' />}
                  {event.isPublished ? 'Published' : 'Draft'}
                </Button>
              </div>

              <form
                onSubmit={handleSubmit(onUpdateEvent)}
                className='space-y-4'
              >
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Event Name
                    </label>
                    <input
                      className='mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                      {...register('name', { required: 'Required' })}
                    />
                    {errors.name && (
                      <p className='mt-1 text-xs text-destructive'>
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Category
                    </label>
                    <select
                      className='mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                      {...register('category')}
                    >
                      <option value='TECH' className='bg-background'>
                        Technical
                      </option>
                      <option value='CULTURAL' className='bg-background'>
                        Cultural
                      </option>
                      <option value='SPORTS' className='bg-background'>
                        Sports
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Department
                    </label>
                    <select
                      className='mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                      {...register('department')}
                    >
                      <option value='ALL' className='bg-background'>
                        All
                      </option>
                      <option value='COMPUTER' className='bg-background'>
                        Computer
                      </option>
                      <option value='ELECTRICAL' className='bg-background'>
                        Electrical
                      </option>
                      <option value='MECHANICAL' className='bg-background'>
                        Mechanical
                      </option>
                      <option value='CIVIL' className='bg-background'>
                        Civil
                      </option>
                      <option value='AUTO' className='bg-background'>
                        Auto
                      </option>
                    </select>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Date & Time
                    </label>
                    <div className='relative mt-1'>
                      <Calendar className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                      <input
                        type='datetime-local'
                        min={new Date().toISOString().slice(0, 16)}
                        className='block w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                        {...register('date', {
                          validate: (value) => {
                            if (!value) return true;
                            const chosen = new Date(value);
                            const now = new Date();
                            if (chosen < now)
                              return 'Event date must be in the future';
                            return true;
                          },
                        })}
                      />
                      {errors.date && (
                        <p className='mt-1 text-xs text-destructive'>
                          {errors.date.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Fees (₹)
                    </label>
                    <div className='relative mt-1'>
                      <IndianRupee className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                      <input
                        type='number'
                        min='0'
                        className='block w-full hover:cursor-pointer rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                        {...register('fees', {
                          min: { value: 0, message: 'Fees cannot be negative' },
                        })}
                      />
                      {errors.fees && (
                        <p className='mt-1 text-xs text-destructive'>
                          {errors.fees.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Venue
                  </label>
                  <div className='relative mt-1'>
                    <MapPin className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                    <input
                      className='block w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                      {...register('location')}
                    />
                  </div>
                </div>

                <div>
                  <label className='text-sm font-medium text-muted-foreground block mb-2'>
                    Event Poster
                  </label>

                  <div className='flex items-start gap-4'>
                    {previewUrl ? (
                      <div className='relative h-20 w-20 rounded-lg overflow-hidden border border-gray-700 group'>
                        <img
                          src={previewUrl}
                          alt='Preview'
                          className='h-full w-full object-cover'
                        />
                        <div className='absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                          <button
                            type='button'
                            onClick={() => {
                              setPreviewUrl(null);
                              setValue('posterUrl', '');
                            }}
                            className='text-white hover:text-red-400'
                          >
                            <X className='h-6 w-6' />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className='h-20 w-20 rounded-lg border border-dashed border-gray-700 bg-gray-900 flex items-center justify-center text-gray-600'>
                        <span className='text-xs'>No Image</span>
                      </div>
                    )}

                    <div className='flex-1'>
                      <input
                        type='file'
                        accept='image/*'
                        disabled={uploadPosterMutation.isPending}
                        className='block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-black hover:file:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed'
                        onChange={handlePosterUpload}
                      />
                      <p className='text-xs text-muted-foreground mt-1'>
                        {uploadPosterMutation.isPending
                          ? 'Uploading...'
                          : 'Upload a poster image (JPG, PNG)'}
                      </p>
                      {/* Hidden input to store URL */}
                      <input type='hidden' {...register('posterUrl')} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Description
                  </label>
                  <textarea
                    rows='4'
                    className='mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                    {...register('description')}
                  />
                </div>

                {/* Sem-control */}
                <div className='p-4 rounded-lg bg-card border border-border space-y-4'>
                  <div className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      id='edit-semControlEnabled'
                      className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
                      {...register('semControlEnabled')}
                    />
                    <label
                      htmlFor='edit-semControlEnabled'
                      className='text-sm font-medium text-foreground'
                    >
                      Sem-control
                    </label>
                  </div>
                  {semControlEnabled && (
                    <div className='animate-in fade-in slide-in-from-top-2'>
                      <label className='text-sm font-medium text-muted-foreground'>
                        Max Semester (event visible to students with sem ≤ this)
                      </label>
                      <select
                        className='mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                        {...register('maxSem', {
                          required: semControlEnabled
                            ? 'Max sem is required when sem-control is enabled'
                            : false,
                        })}
                      >
                        <option value='' className='bg-background'>
                          Select semester
                        </option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <option
                            key={sem}
                            value={sem}
                            className='bg-background'
                          >
                            {sem}
                          </option>
                        ))}
                      </select>
                      {errors.maxSem && (
                        <p className='mt-1 text-xs text-destructive'>
                          {errors.maxSem.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Team Event Settings */}
                <div className='p-4 rounded-lg bg-card border border-border space-y-4'>
                  <div className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      id='edit-isTeamEvent'
                      className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
                      {...register('isTeamEvent')}
                    />
                    <label
                      htmlFor='edit-isTeamEvent'
                      className='text-sm font-medium text-foreground'
                    >
                      This is a Team Event
                    </label>
                  </div>

                  {isTeamEvent && (
                    <div className='grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2'>
                      <div>
                        <label className='text-sm font-medium text-muted-foreground'>
                          Min Team Size
                        </label>
                        <input
                          type='number'
                          min='1'
                          className='mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                          {...register('minTeamSize', {
                            required: isTeamEvent
                              ? 'Min team size is required'
                              : false,
                            min: {
                              value: 1,
                              message: 'Min size must be at least 1',
                            },
                            validate: (value) => {
                              if (!isTeamEvent) return true;
                              const max = watch('maxTeamSize');
                              if (
                                max != null &&
                                value != null &&
                                Number(value) > Number(max)
                              )
                                return 'Min cannot be greater than max';
                              return true;
                            },
                          })}
                        />
                        {errors.minTeamSize && (
                          <p className='mt-1 text-xs text-destructive'>
                            {errors.minTeamSize.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className='text-sm font-medium text-muted-foreground'>
                          Max Team Size
                        </label>
                        <input
                          type='number'
                          min='1'
                          className='mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                          {...register('maxTeamSize', {
                            required: isTeamEvent
                              ? 'Max team size is required'
                              : false,
                            min: {
                              value: 1,
                              message: 'Max size must be at least 1',
                            },
                            validate: (value) => {
                              if (!isTeamEvent) return true;
                              const min = watch('minTeamSize');
                              if (
                                min != null &&
                                value != null &&
                                Number(value) < Number(min)
                              )
                                return 'Max cannot be less than min';
                              return true;
                            },
                          })}
                        />
                        {errors.maxTeamSize && (
                          <p className='mt-1 text-xs text-destructive'>
                            {errors.maxTeamSize.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Custom Questions Builder */}
                <div className='p-4 rounded-lg bg-card border border-border space-y-4'>
                  <div className='flex justify-between items-center'>
                    <h3 className='text-sm font-medium text-foreground'>
                      Registration Questions
                    </h3>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={addQuestion}
                      className='text-xs h-8'
                    >
                      <Plus className='h-3 w-3 mr-1' /> Add Question
                    </Button>
                  </div>

                  {questions.length === 0 ? (
                    <p className='text-xs text-muted-foreground italic'>
                      No custom questions added.
                    </p>
                  ) : (
                    <div className='space-y-3'>
                      {questions.map((q, index) => (
                        <div
                          key={index}
                          className='flex gap-2 items-start p-3 bg-background/50 rounded-md border border-border'
                        >
                          <div className='flex-1 space-y-2'>
                            <input
                              placeholder='Question (e.g., GitHub Handle)'
                              value={q.label}
                              onChange={(e) =>
                                updateQuestion(index, 'label', e.target.value)
                              }
                              className='block w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                            />
                            <div className='flex items-center gap-4'>
                              <label className='flex items-center gap-2 text-xs text-muted-foreground'>
                                <input
                                  type='checkbox'
                                  checked={q.required}
                                  onChange={(e) => {
                                    const newQuestions = [...questions];
                                    newQuestions[index].required =
                                      e.target.checked;
                                    setQuestions(newQuestions);
                                  }}
                                  className='h-3.5 w-3.5 rounded border-gray-300'
                                />
                                Required
                              </label>
                              {/* Can add type selection later if needed */}
                            </div>
                          </div>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            onClick={() => removeQuestion(index)}
                            className='h-8 w-8 text-muted-foreground hover:text-destructive'
                          >
                            <Trash className='h-4 w-4' />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className='flex justify-end pt-4'>
                  <Button
                    type='submit'
                    disabled={saving || uploadPosterMutation.isPending}
                  >
                    {saving && (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Coordinators */}
          <div className='space-y-6'>
            <div className='rounded-xl border border-white/10 bg-background/50 backdrop-blur-sm p-6'>
              <div className='flex items-center gap-2 mb-6'>
                <Users className='h-5 w-5 text-primary' />
                <h2 className='text-lg font-bold font-heading text-foreground'>
                  Coordinators
                </h2>
              </div>

              {canAddCoordinator && (
                <form onSubmit={onAddCoordinator} className='mb-6'>
                  <label className='text-xs font-medium text-muted-foreground mb-1.5 block'>
                    Add Student Coordinator
                  </label>
                  <div className='flex gap-2'>
                    <div className='relative flex-1'>
                      <Mail className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                      <input
                        type='email'
                        placeholder='student@example.com'
                        value={coordEmail}
                        onChange={(e) => setCoordEmail(e.target.value)}
                        className='block w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                      />
                    </div>
                    <Button
                      type='submit'
                      size='sm'
                      disabled={addCoordinatorMutation.isPending || !coordEmail}
                    >
                      {addCoordinatorMutation.isPending ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        <Plus className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </form>
              )}

              <div className='space-y-3'>
                <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                  Current Team
                </h3>

                {/* Main Coordinator */}
                <div className='flex items-center gap-3 p-3 rounded-lg bg-card border border-border'>
                  <div className='h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold'>
                    {event.mainCoordinator?.name?.charAt(0) || 'F'}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-foreground truncate'>
                      {event.mainCoordinator?.name}
                    </p>
                    <p className='text-xs text-muted-foreground truncate'>
                      Faculty (Owner)
                    </p>
                  </div>
                </div>

                {/* Student Coordinators */}
                {event.coordinators?.map((coord) => (
                  <div
                    key={coord.id}
                    className='flex items-center gap-3 p-3 rounded-lg bg-card border border-border'
                  >
                    <div className='h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-xs font-bold'>
                      {coord.name?.charAt(0)}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-foreground truncate'>
                        {coord.name}
                      </p>
                      <p className='text-xs text-muted-foreground truncate'>
                        {coord.email}
                      </p>
                    </div>
                  </div>
                ))}

                {(!event.coordinators || event.coordinators.length === 0) && (
                  <p className='text-sm text-muted-foreground italic text-center py-4'>
                    No student coordinators assigned yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title='Delete Event'
        description={`Are you sure you want to delete "${event?.name}"? This will remove all registrations and cannot be undone.`}
        confirmLabel='Delete'
        cancelLabel='Cancel'
        variant='danger'
        loading={deleteEventMutation.isPending}
        onConfirm={onDeleteEvent}
      />
    </div>
  );
}
