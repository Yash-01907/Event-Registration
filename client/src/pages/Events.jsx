import { useState, useMemo } from 'react';
import { Search, Cpu, Loader2 } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useDebounce } from '@/hooks/useDebounce';
import EventCard from '@/components/events/EventCard';

export default function Events() {
  const { data: events, isLoading, error } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    const term = debouncedSearch.toLowerCase();
    return events.filter((event) => event.name.toLowerCase().includes(term));
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

        {/* Filters */}
        <div className='glass-card rounded-2xl p-5 mb-10 border-glow'>
          <div className='flex flex-col lg:flex-row gap-4 justify-between items-center'>
            {/* Search Bar */}
            <div className='relative w-full lg:w-80'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500' />
              <input
                type='text'
                placeholder='Search events...'
                className='w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-gray-800 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-white placeholder:text-gray-600 font-mono text-sm'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div>
          {isLoading ? (
            <div className='flex justify-center items-center h-64'>
              <div className='flex flex-col items-center gap-4'>
                <Loader2 className='h-10 w-10 animate-spin text-cyan-400' />
                <p className='text-gray-500 font-mono text-sm'>
                  Loading events...
                </p>
              </div>
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
                <EventCard key={event.id} event={event} index={idx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
