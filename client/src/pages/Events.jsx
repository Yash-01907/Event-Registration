import { useState, useMemo } from 'react';
import { Search, Cpu, X } from 'lucide-react';
import { useEvents, useMyRegistrations } from '@/hooks/useEvents';
import { useDebounce } from '@/hooks/useDebounce';
import EventCard from '@/components/events/EventCard';

export default function Events() {
  const {
    data: events,
    isLoading,
    error,
    refetch: refetchEvents,
  } = useEvents();
  const { data: myRegistrations = [], refetch: refetchMyRegistrations } =
    useMyRegistrations();
  const handleRegistrationSuccess = () => {
    refetchMyRegistrations();
    refetchEvents();
  };
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const registeredEventIds = useMemo(
    () => new Set((myRegistrations || []).map((r) => r.eventId)),
    [myRegistrations]
  );

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    const term = debouncedSearch.toLowerCase().trim();
    if (!term) return events;
    return events.filter((event) => {
      const name = (event.name || '').toLowerCase();
      const desc = (event.description || '').toLowerCase();
      const category = (event.category || '').toLowerCase();
      return (
        name.includes(term) || desc.includes(term) || category.includes(term)
      );
    });
  }, [events, debouncedSearch]);

  return (
    <div className='min-h-screen gradient-mesh pt-20 pb-12'>
      <div className='absolute inset-0 grid-pattern opacity-30 pointer-events-none' />

      <div className='container mx-auto px-4 relative z-10'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-2xl md:text-5xl font-bold font-heading text-white mb-4 tracking-wide'>
            <span className='text-cyan-400'>&lt;</span>
            DISCOVER
            <span className='text-purple-400'>/</span>
            EVENTS
            <span className='text-cyan-400'>&gt;</span>
          </h1>
          <div className='w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full mb-4' />
          <p className='text-gray-500 max-w-2xl mx-auto font-mono text-sm'>
            // Explore tech events at UDAAN 2026
          </p>
        </div>

        {/* Search - left aligned */}
        <div className='flex flex-wrap items-center justify-between gap-4 mb-8'>
          <div className='relative w-full sm:w-auto sm:min-w-[280px]'>
            <div className='absolute -inset-px rounded-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 blur-sm' />
            <div className='relative glass-card rounded-xl p-4 border border-white/5'>
              <div className='relative group flex items-center gap-2'>
                <Search className='h-4 w-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none shrink-0' />
                <input
                  type='text'
                  placeholder='Search by name or description...'
                  className='w-full min-w-0 py-2.5 pr-9 pl-3 rounded-lg bg-white/5 border border-gray-800 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all text-white placeholder:text-gray-500 font-mono text-sm'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label='Search events'
                />
                {searchTerm && (
                  <button
                    type='button'
                    onClick={() => setSearchTerm('')}
                    className='absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded text-gray-500 hover:text-white hover:bg-white/10 transition-colors'
                    aria-label='Clear search'
                  >
                    <X className='h-3.5 w-3.5' />
                  </button>
                )}
              </div>
            </div>
          </div>
          <p className='font-mono text-xs text-gray-500'>
            {!events ? (
              '—'
            ) : (
              <>
                <span className='text-cyan-400 font-semibold'>
                  {filteredEvents.length}
                </span>
                {' event' + (filteredEvents.length !== 1 ? 's' : '')}
              </>
            )}
          </p>
        </div>

        {/* Events Grid */}
        <div>
          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className='glass-card rounded-2xl overflow-hidden flex flex-col h-full'
                >
                  <div className='h-48 bg-gray-800/80 animate-pulse' />
                  <div className='p-5 flex flex-col grow space-y-4'>
                    <div className='h-4 bg-gray-700/60 rounded animate-pulse w-3/4' />
                    <div className='space-y-2'>
                      <div className='h-3 bg-gray-700/50 rounded animate-pulse w-full' />
                      <div className='h-3 bg-gray-700/50 rounded animate-pulse w-5/6' />
                    </div>
                    <div className='space-y-2'>
                      <div className='h-3 bg-gray-700/50 rounded animate-pulse w-2/3' />
                      <div className='h-3 bg-gray-700/50 rounded animate-pulse w-1/2' />
                    </div>
                    <div className='flex items-center justify-between pt-3 border-t border-gray-800'>
                      <div className='h-3 bg-gray-700/50 rounded animate-pulse w-16' />
                      <div className='h-4 bg-gray-700/50 rounded animate-pulse w-12' />
                    </div>
                    <div className='flex gap-2 pt-2'>
                      <div className='flex-1 h-9 bg-gray-700/50 rounded-xl animate-pulse' />
                      <div className='flex-1 h-9 bg-gray-700/50 rounded-xl animate-pulse' />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className='text-center py-12 glass-card rounded-xl border-red-500/20 text-red-400 font-mono'>
              ERROR: {error.message || 'Failed to fetch events'}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className='text-center py-20 glass-card rounded-xl border-gray-800 border-dashed'>
              <Cpu className='h-16 w-16 mx-auto text-gray-700 mb-4' />
              <h3 className='text-xl font-bold text-white mb-2 font-heading'>
                NO EVENTS FOUND
              </h3>
              <p className='text-gray-500 font-mono text-sm'>
                {searchTerm
                  ? '// try adjusting your search'
                  : '// check back later for new events'}
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredEvents.map((event, idx) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={idx}
                  isRegistered={registeredEventIds.has(event.id)}
                  onRegistrationSuccess={handleRegistrationSuccess}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
