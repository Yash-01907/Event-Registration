import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Calendar,
  MapPin,
  Loader2,
  Users,
  Settings,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react';

const TableRowSkeleton = () => (
  <tr>
    <td className='px-6 py-4'>
      <div className='h-4 bg-gray-700/50 rounded animate-pulse w-40 mb-2' />
      <div className='h-3 bg-gray-700/40 rounded animate-pulse w-56' />
    </td>
    <td className='px-6 py-4'>
      <div className='h-6 bg-gray-700/50 rounded-lg animate-pulse w-16' />
    </td>
    <td className='px-6 py-4'>
      <div className='h-4 bg-gray-700/50 rounded animate-pulse w-20' />
    </td>
    <td className='px-6 py-4'>
      <div className='h-4 bg-gray-700/50 rounded animate-pulse w-24' />
    </td>
    <td className='px-6 py-4'>
      <div className='h-4 bg-gray-700/50 rounded animate-pulse w-12' />
    </td>
    <td className='px-6 py-4 text-right'>
      <div className='flex justify-end gap-2'>
        <div className='h-8 w-8 bg-gray-700/50 rounded-lg animate-pulse' />
        <div className='h-8 w-8 bg-gray-700/50 rounded-lg animate-pulse' />
        <div className='h-8 bg-gray-700/50 rounded-lg animate-pulse w-20' />
      </div>
    </td>
  </tr>
);
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  useMyEvents,
  useDeleteEvent,
  useTogglePublishEvent,
} from '@/hooks/useEvents';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import CreateEventModal from '@/components/events/CreateEventModal';
import { cn } from '@/lib/utils';

const getCategoryColor = (category) => {
  switch (category) {
    case 'TECH':
      return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    case 'CULTURAL':
      return 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10';
    case 'SPORTS':
      return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    default:
      return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
  }
};

const formatEventDate = (date) =>
  date ? new Date(date).toLocaleDateString() : 'TBA';

const PUBLISH_BTN_CLASSES = {
  published:
    'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20',
  draft:
    'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20',
};

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const { data: events = [], isLoading, error, refetch } = useMyEvents();
  const deleteEventMutation = useDeleteEvent();
  const togglePublishMutation = useTogglePublishEvent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    eventId: null,
    eventName: '',
  });

  const handleDeleteClick = useCallback((e, eventId, eventName) => {
    e.stopPropagation();
    setDeleteConfirm({ open: true, eventId, eventName });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    const { eventId } = deleteConfirm;
    if (!eventId) return;
    try {
      await deleteEventMutation.mutateAsync(eventId);
      toast.success('Event deleted successfully');
      setDeleteConfirm({ open: false, eventId: null, eventName: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete event');
      throw err; // Re-throw so ConfirmDialog stays open
    }
  }, [deleteConfirm, deleteEventMutation]);

  const handleTogglePublish = useCallback(
    (e, eventId) => {
      e.stopPropagation();
      togglePublishMutation.mutate(eventId, {
        onSuccess: (data) => {
          toast.success(
            data?.isPublished ? 'Event published' : 'Event unpublished'
          );
        },
        onError: (err) => {
          toast.error(
            err.response?.data?.message || 'Failed to update publish status'
          );
        },
      });
    },
    [togglePublishMutation]
  );

  const errorMessage = error
    ? error?.response?.data?.message ||
      error?.message ||
      'Failed to fetch events'
    : null;

  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const handleDeleteDialogChange = useCallback((open) => {
    setDeleteConfirm((prev) => ({ ...prev, open }));
  }, []);

  return (
    <div className='min-h-screen gradient-mesh pt-20 pb-12'>
      <div className='absolute inset-0 grid-pattern opacity-30 pointer-events-none' />

      <div className='container mx-auto px-4 relative z-10'>
        {/* Header */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4'>
          <div>
            <h1 className='text-3xl md:text-4xl font-bold font-heading text-white tracking-wide flex flex-wrap items-center gap-3'>
              <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center'>
                <Settings className='h-6 w-6 text-white' />
              </div>
              <span className='text-purple-400'>FACULTY</span>
              <span className='text-white'>DASHBOARD</span>
            </h1>
            <p className='text-gray-500 mt-2 font-mono text-sm'>
              // Manage your events and coordinators
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className='btn-neon bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2'
          >
            <Plus className='h-4 w-4' />
            CREATE EVENT
          </Button>
        </div>

        {isLoading ? (
          <div className='glass-card rounded-2xl overflow-hidden'>
            <div className='hidden md:block overflow-x-auto'>
              <table className='w-full text-left'>
                <thead className='border-b border-gray-800'>
                  <tr className='text-xs uppercase text-gray-500 font-mono tracking-wider'>
                    <th className='px-6 py-4'>Event Name</th>
                    <th className='px-6 py-4'>Category</th>
                    <th className='px-6 py-4'>Date</th>
                    <th className='px-6 py-4'>Location</th>
                    <th className='px-6 py-4'>Fees</th>
                    <th className='px-6 py-4 text-right'>Status</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-800'>
                  {[...Array(5)].map((_, idx) => (
                    <TableRowSkeleton key={idx} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className='md:hidden grid gap-4 p-4'>
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className='bg-white/5 border border-white/10 rounded-xl p-4 space-y-4'
                >
                  <div className='flex justify-between items-start'>
                    <div className='space-y-2 flex-1'>
                      <div className='h-5 bg-gray-700/50 rounded animate-pulse w-3/4' />
                      <div className='h-3 bg-gray-700/40 rounded animate-pulse w-full' />
                      <div className='h-3 bg-gray-700/40 rounded animate-pulse w-2/3' />
                    </div>
                    <div className='h-6 bg-gray-700/50 rounded-md animate-pulse w-14 shrink-0' />
                  </div>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <div className='h-4 bg-gray-700/50 rounded animate-pulse w-20' />
                      <div className='h-4 bg-gray-700/50 rounded animate-pulse w-12' />
                    </div>
                    <div className='h-4 bg-gray-700/50 rounded animate-pulse w-28' />
                  </div>
                  <div className='flex gap-2 pt-2 border-t border-white/5'>
                    <div className='flex-1 h-9 bg-gray-700/50 rounded-lg animate-pulse' />
                    <div className='h-9 w-9 bg-gray-700/50 rounded-lg animate-pulse' />
                    <div className='flex-1 h-9 bg-gray-700/50 rounded-lg animate-pulse' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : errorMessage ? (
          <div className='glass-card rounded-xl p-6 border-red-500/30 text-red-400 font-mono text-center'>
            ERROR: {errorMessage}
          </div>
        ) : events.length === 0 ? (
          <div className='text-center py-20 glass-card rounded-2xl border-gray-800 border-dashed'>
            <Calendar className='h-16 w-16 mx-auto text-gray-700 mb-4' />
            <h3 className='text-xl font-bold text-white mb-2 font-heading'>
              NO EVENTS FOUND
            </h3>
            <p className='text-gray-500 mb-6 font-mono text-sm'>
              // You haven't created any events yet
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className='btn-neon bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30 font-bold px-6 py-3 rounded-xl'
            >
              Create Your First Event
            </Button>
          </div>
        ) : (
          <div className='glass-card rounded-2xl overflow-hidden'>
            {/* Desktop Table View */}
            <div className='hidden md:block overflow-x-auto'>
              <table className='w-full text-left'>
                <thead className='border-b border-gray-800'>
                  <tr className='text-xs uppercase text-gray-500 font-mono tracking-wider'>
                    <th className='px-6 py-4'>Event Name</th>
                    <th className='px-6 py-4'>Category</th>
                    <th className='px-6 py-4'>Date</th>
                    <th className='px-6 py-4'>Location</th>
                    <th className='px-6 py-4'>Fees</th>
                    <th className='px-6 py-4 text-right'>Status</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-800'>
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className='hover:bg-white/5 transition-colors cursor-pointer group'
                      onClick={() => navigate(`/dashboard/event/${event.id}`)}
                    >
                      <td className='px-6 py-4'>
                        <div className='font-medium text-white group-hover:text-cyan-400 transition-colors'>
                          {event.name}
                        </div>
                        <div className='text-xs text-gray-600 truncate max-w-[200px] font-mono'>
                          {event.description}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={cn(
                            'px-3 py-1 rounded-lg text-xs font-bold font-mono uppercase border',
                            getCategoryColor(event.category)
                          )}
                        >
                          {event.category}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-400 font-mono'>
                        {formatEventDate(event.date)}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-400 font-mono'>
                        <div className='flex items-center gap-1.5'>
                          <MapPin className='h-3.5 w-3.5 text-purple-400' />
                          {event.location || 'TBA'}
                        </div>
                      </td>
                      <td className='px-6 py-4 text-sm text-cyan-400 font-mono font-bold'>
                        {event.fees > 0 ? `₹${event.fees}` : 'Free'}
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/dashboard/event/${event.id}/registrations`
                              );
                            }}
                            className='p-2 rounded-lg text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors'
                            title='View Registrations'
                          >
                            <Users className='h-4 w-4' />
                          </button>
                          <button
                            onClick={(e) =>
                              handleDeleteClick(e, event.id, event.name)
                            }
                            className='p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors'
                            title='Delete Event'
                          >
                            <Trash2 className='h-4 w-4' />
                          </button>
                          <button
                            onClick={(e) => handleTogglePublish(e, event.id)}
                            disabled={
                              togglePublishMutation.isPending &&
                              togglePublishMutation.variables === event.id
                            }
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold font-mono uppercase transition-all disabled:opacity-70 disabled:cursor-wait',
                              event.isPublished
                                ? PUBLISH_BTN_CLASSES.published
                                : PUBLISH_BTN_CLASSES.draft
                            )}
                            title='Click to toggle status'
                          >
                            {togglePublishMutation.isPending &&
                            togglePublishMutation.variables === event.id ? (
                              <Loader2 className='h-3 w-3 animate-spin' />
                            ) : event.isPublished ? (
                              <Eye className='h-3 w-3' />
                            ) : (
                              <EyeOff className='h-3 w-3' />
                            )}
                            {togglePublishMutation.isPending &&
                            togglePublishMutation.variables === event.id
                              ? 'Updating...'
                              : event.isPublished
                              ? 'Published'
                              : 'Draft'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className='md:hidden grid gap-4 p-4'>
              {events.map((event) => (
                <div
                  key={event.id}
                  className='bg-white/5 border border-white/10 rounded-xl p-4 space-y-4'
                  onClick={() => navigate(`/dashboard/event/${event.id}`)}
                >
                  <div className='flex justify-between items-start'>
                    <div>
                      <h3 className='font-bold text-white text-lg'>
                        {event.name}
                      </h3>
                      <p className='text-xs text-gray-500 font-mono mt-1 line-clamp-2'>
                        {event.description}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'px-2 py-1 rounded-md text-[10px] font-bold font-mono uppercase border',
                        getCategoryColor(event.category)
                      )}
                    >
                      {event.category}
                    </span>
                  </div>

                  <div className='space-y-2 text-sm text-gray-400'>
                    <div className='flex justify-between'>
                      <span className='flex items-center gap-2'>
                        <Calendar className='h-3.5 w-3.5 text-cyan-400' />
                        {formatEventDate(event.date)}
                      </span>
                      <span className='font-mono'>
                        {event.fees > 0 ? `₹${event.fees}` : 'Free'}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <MapPin className='h-3.5 w-3.5 text-purple-400' />
                      {event.location || 'TBA'}
                    </div>
                  </div>

                  <div className='flex gap-2 pt-2 border-t border-white/5'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/event/${event.id}/registrations`);
                      }}
                      className='flex-1 inline-flex justify-center items-center gap-2 p-2 rounded-lg text-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors'
                    >
                      <Users className='h-4 w-4' />
                      Registrations
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(e, event.id, event.name);
                      }}
                      className='p-2 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-white/10 transition-colors'
                      title='Delete Event'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                    <button
                      onClick={(e) => handleTogglePublish(e, event.id)}
                      disabled={
                        togglePublishMutation.isPending &&
                        togglePublishMutation.variables === event.id
                      }
                      className={cn(
                        'flex-1 inline-flex justify-center items-center gap-2 p-2 rounded-lg text-sm border transition-colors disabled:opacity-70 disabled:cursor-wait',
                        event.isPublished
                          ? PUBLISH_BTN_CLASSES.published
                          : PUBLISH_BTN_CLASSES.draft
                      )}
                    >
                      {togglePublishMutation.isPending &&
                      togglePublishMutation.variables === event.id ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : event.isPublished ? (
                        <Eye className='h-4 w-4' />
                      ) : (
                        <EyeOff className='h-4 w-4' />
                      )}
                      {togglePublishMutation.isPending &&
                      togglePublishMutation.variables === event.id
                        ? 'Updating...'
                        : event.isPublished
                        ? 'Published'
                        : 'Draft'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <CreateEventModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onEventCreated={refetch}
        />

        <ConfirmDialog
          open={deleteConfirm.open}
          onOpenChange={handleDeleteDialogChange}
          title='Delete Event'
          description={`Are you sure you want to delete "${deleteConfirm.eventName}"? This will remove all registrations and cannot be undone.`}
          confirmLabel='Delete'
          cancelLabel='Cancel'
          variant='danger'
          loading={deleteEventMutation.isPending}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
}
