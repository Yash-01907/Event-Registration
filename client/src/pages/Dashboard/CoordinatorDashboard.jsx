import { Link } from 'react-router-dom';
import { Calendar, Users, Edit, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCoordinatedEvents } from '@/hooks/useEvents';
import { cn } from '@/lib/utils';

const CoordinatorDashboardSkeleton = () => (
  <div className='glass-card rounded-2xl overflow-hidden'>
    <div className='hidden md:block overflow-x-auto'>
      <table className='w-full text-left'>
        <thead className='border-b border-gray-800'>
          <tr className='text-xs uppercase text-gray-500 font-mono tracking-wider'>
            <th className='px-6 py-4'>Event Name</th>
            <th className='px-6 py-4'>Category</th>
            <th className='px-6 py-4'>Date</th>
            <th className='px-6 py-4'>Main Coordinator</th>
            <th className='px-6 py-4 text-right'>Actions</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-800'>
          {[...Array(5)].map((_, idx) => (
            <tr key={idx}>
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
                <div className='flex items-center gap-2'>
                  <div className='h-8 w-8 rounded-lg bg-gray-700/50 animate-pulse shrink-0' />
                  <div className='h-4 w-24 bg-gray-700/50 rounded animate-pulse' />
                </div>
              </td>
              <td className='px-6 py-4 text-right'>
                <div className='flex justify-end gap-2'>
                  <div className='h-8 bg-gray-700/50 rounded animate-pulse w-16' />
                  <div className='h-8 bg-gray-700/50 rounded animate-pulse w-24' />
                </div>
              </td>
            </tr>
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
              <div className='h-4 bg-gray-700/50 rounded animate-pulse w-12' />
              <div className='h-4 bg-gray-700/50 rounded animate-pulse w-20' />
            </div>
            <div className='flex justify-between'>
              <div className='h-4 bg-gray-700/50 rounded animate-pulse w-28' />
              <div className='h-4 bg-gray-700/50 rounded animate-pulse w-24' />
            </div>
          </div>
          <div className='flex gap-2 pt-2 border-t border-white/5'>
            <div className='flex-1 h-9 bg-gray-700/50 rounded-lg animate-pulse' />
            <div className='flex-1 h-9 bg-gray-700/50 rounded-lg animate-pulse' />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function CoordinatorDashboard() {
  const { data: events = [], isLoading, error } = useCoordinatedEvents();

  const errorMessage = error
    ? error?.response?.data?.message || 'Failed to fetch events'
    : null;

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

  return (
    <div className='min-h-screen gradient-mesh pt-20 pb-12'>
      <div className='absolute inset-0 grid-pattern opacity-30 pointer-events-none' />

      <div className='container mx-auto px-4 relative z-10'>
        {/* Header */}
        <div className='mb-10'>
          <h1 className='text-3xl md:text-4xl font-bold font-heading text-white tracking-wide flex flex-wrap items-center gap-3'>
            <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center'>
              <ClipboardList className='h-6 w-6 text-white' />
            </div>
            <span className='text-cyan-400'>COORDINATOR</span>
            <span className='text-white'>DASHBOARD</span>
          </h1>
          <p className='text-gray-500 mt-2 font-mono text-sm'>
            // Events assigned to you
          </p>
        </div>

        {isLoading ? (
          <CoordinatorDashboardSkeleton />
        ) : errorMessage ? (
          <div className='glass-card rounded-xl p-6 border-red-500/30 text-red-400 font-mono text-center'>
            ERROR: {errorMessage}
          </div>
        ) : events.length === 0 ? (
          <div className='text-center py-20 glass-card rounded-2xl border-gray-800 border-dashed'>
            <Calendar className='h-16 w-16 mx-auto text-gray-700 mb-4' />
            <h3 className='text-xl font-bold text-white mb-2 font-heading'>
              NO ASSIGNED EVENTS
            </h3>
            <p className='text-gray-500 font-mono text-sm'>
              // You haven't been assigned to any events yet
            </p>
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
                    <th className='px-6 py-4'>Main Coordinator</th>
                    <th className='px-6 py-4 text-right'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-800'>
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className='hover:bg-white/5 transition-colors group'
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
                        {event.date
                          ? new Date(event.date).toLocaleDateString()
                          : 'TBA'}
                      </td>
                      <td className='px-6 py-4 text-sm'>
                        <div className='flex items-center gap-2'>
                          <div className='h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold'>
                            {event.mainCoordinator?.name?.charAt(0) || 'F'}
                          </div>
                          <span className='text-gray-300'>
                            {event.mainCoordinator?.name}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <div className='flex justify-end gap-2'>
                          <Link to={`/dashboard/event/${event.id}`}>
                            <Button
                              variant='outline'
                              size='sm'
                              className='bg-transparent border-gray-700 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 font-mono text-xs'
                            >
                              <Edit className='h-3 w-3 mr-1' />
                              Edit
                            </Button>
                          </Link>
                          <Link
                            to={`/dashboard/event/${event.id}/registrations`}
                          >
                            <Button
                              variant='outline'
                              size='sm'
                              className='bg-transparent border-gray-700 text-gray-400 hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/10 font-mono text-xs'
                            >
                              <Users className='h-3 w-3 mr-1' />
                              Registrations
                            </Button>
                          </Link>
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

                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between text-gray-400'>
                      <span>Date:</span>
                      <span className='text-gray-300 font-mono'>
                        {event.date
                          ? new Date(event.date).toLocaleDateString()
                          : 'TBA'}
                      </span>
                    </div>
                    <div className='flex justify-between text-gray-400'>
                      <span>Main Coordinator:</span>
                      <span className='text-gray-300'>
                        {event.mainCoordinator?.name}
                      </span>
                    </div>
                  </div>

                  <div className='flex gap-2 pt-2 border-t border-white/5'>
                    <Link
                      to={`/dashboard/event/${event.id}`}
                      className='flex-1'
                    >
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full bg-transparent border-gray-700 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 font-mono text-xs'
                      >
                        <Edit className='h-3 w-3 mr-1' />
                        Edit
                      </Button>
                    </Link>
                    <Link
                      to={`/dashboard/event/${event.id}/registrations`}
                      className='flex-1'
                    >
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full bg-transparent border-gray-700 text-gray-400 hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/10 font-mono text-xs'
                      >
                        <Users className='h-3 w-3 mr-1' />
                        Registrations
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
