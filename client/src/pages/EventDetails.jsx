import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  IndianRupee,
  User,
  Ticket,
  Loader2,
  Share2,
  CheckCircle2,
  Cpu,
  Users,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/lib/api';
import useAuthStore from '@/store/authStore';

import EventRegistrationModal from '@/components/events/EventRegistrationModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [myRegistration, setMyRegistration] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registerConfirmOpen, setRegisterConfirmOpen] = useState(false);
  const [deregisterConfirmOpen, setDeregisterConfirmOpen] = useState(false);
  const [deregistering, setDeregistering] = useState(false);

  const isSoldOut =
    event?.maxParticipants &&
    event?._count?.registrations >= event.maxParticipants;
  const isClosed =
    event?.registrationDeadline &&
    new Date() > new Date(event.registrationDeadline);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to fetch event details'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Check if already registered
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (user) {
        try {
          const response = await api.get('/registrations/my');
          const myRegs = response.data;
          const found = myRegs.find((reg) => reg.eventId === id);
          if (found) {
            setIsRegistered(true);
            setMyRegistration(found);
          }
        } catch (err) {
          console.error('Failed to check registration status', err);
        }
      }
    };
    if (user && id) {
      checkRegistrationStatus();
    }
  }, [user, id]);

  const handleRegisterClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Team event or has custom form fields → open modal
    if (
      event.isTeamEvent ||
      (event.formConfig && event.formConfig.length > 0)
    ) {
      setIsModalOpen(true);
      return;
    }

    // Single user, no required fields → show confirmation dialog
    setRegisterConfirmOpen(true);
  };

  const handleConfirmRegister = async () => {
    setRegistering(true);
    try {
      const response = await api.post('/registrations', { eventId: id });
      setIsRegistered(true);
      setMyRegistration(response.data);
      setRegisterConfirmOpen(false);
      toast.success('Successfully registered for the event!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistrationClick = () => {
    setDeregisterConfirmOpen(true);
  };

  const handleShare = async () => {
    if (!event) return;
    const url = `${window.location.origin}/events/${event.id}`;
    const title = event.name;
    const text = event.description
      ? `${event.name} – ${event.description.slice(0, 120)}${
          event.description.length > 120 ? '...' : ''
        }`
      : `Check out ${event.name} at UDAAN 2026`;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url,
        });
        toast.success('Event shared!');
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
      } catch {
        toast.error('Could not share or copy link');
      }
    }
  };

  const handleConfirmDeregister = async () => {
    if (!myRegistration?.id) return;
    setDeregistering(true);
    try {
      await api.delete(`/registrations/${myRegistration.id}`);
      setIsRegistered(false);
      setMyRegistration(null);
      setDeregisterConfirmOpen(false);
      toast.success('Registration cancelled successfully');
      // Refetch event to update participant count
      const response = await api.get(`/events/${id}`);
      setEvent(response.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to cancel registration'
      );
    } finally {
      setDeregistering(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen gradient-mesh'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='h-10 w-10 animate-spin text-cyan-400' />
          <p className='text-gray-500 font-mono text-sm'>Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className='container mx-auto px-4 py-8 pt-24 text-center gradient-mesh min-h-screen'>
        <div className='glass-card rounded-xl p-6 inline-block border-red-500/30 text-red-400'>
          {error || 'Event not found'}
        </div>
      </div>
    );
  }
  return (
    <div className='min-h-screen pt-16 pb-12 gradient-mesh'>
      {/* Banner/Hero Section */}
      <div className='relative h-[300px] md:h-[400px] w-full overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/50 to-transparent z-10' />
        {event.posterUrl ? (
          <img
            src={event.posterUrl}
            alt={event.name}
            className='w-full h-full object-cover opacity-70'
          />
        ) : (
          <div className='w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center'>
            <Cpu className='h-24 w-24 text-gray-700' />
          </div>
        )}
        <div className='absolute bottom-0 left-0 right-0 z-20 container mx-auto px-4 pb-8'>
          <div className='max-w-4xl'>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider mb-4 border ${getCategoryColor(
                event.category
              )}`}
            >
              {event.category}
            </span>
            {isSoldOut && (
              <span className='inline-block ml-3 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider mb-4'>
                Sold Out
              </span>
            )}
            {isClosed && !isSoldOut && (
              <span className='inline-block ml-3 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-bold uppercase tracking-wider mb-4'>
                Closed
              </span>
            )}
            <h1 className='text-2xl md:text-5xl md:leading-tight font-bold font-heading text-white mb-2 tracking-wide'>
              {event.name}
            </h1>
            <div className='flex flex-wrap items-center gap-6 text-gray-300 mt-4 font-mono text-sm'>
              <div className='flex items-center gap-2'>
                <Calendar className='h-5 w-5 text-cyan-400' />
                <span>
                  {event.date
                    ? new Date(event.date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Date TBA'}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <MapPin className='h-5 w-5 text-purple-400' />
                <span>{event.location || 'Venue TBA'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-12'>
            <section>
              <h2 className='text-2xl font-bold text-white mb-4 flex items-center gap-2 font-heading tracking-wide'>
                About <span className='text-cyan-400'>Event</span>
              </h2>
              <div className='text-gray-400 leading-relaxed'>
                <p className='whitespace-pre-wrap'>
                  {event.description || 'No description provided.'}
                </p>
              </div>
            </section>

            {/* Coordinator Info */}
            <section className='glass-card rounded-xl p-6'>
              <h3 className='text-lg font-bold text-white mb-4 flex items-center gap-2 font-heading'>
                <User className='h-5 w-5 text-cyan-400' />
                Event Coordinator
              </h3>
              <div className='flex items-center gap-4'>
                <div className='h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg'>
                  {event.mainCoordinator?.name?.charAt(0) || 'F'}
                </div>
                <div>
                  <div className='font-medium text-white'>
                    {event.mainCoordinator?.name || 'Faculty Coordinator'}
                  </div>
                  <div className='text-sm text-gray-500 font-mono'>
                    {event.mainCoordinator?.email}
                  </div>
                </div>
              </div>
            </section>

            {/* Event Stats */}
            {event.maxParticipants && (
              <section className='glass-card rounded-xl p-6'>
                <h3 className='text-lg font-bold text-white mb-4 flex items-center gap-2 font-heading'>
                  <Users className='h-5 w-5 text-emerald-400' />
                  Registrations
                </h3>
                <div className='flex items-center gap-4'>
                  <div className='flex-1 bg-gray-800 rounded-full h-3 overflow-hidden'>
                    <div
                      className='h-full bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-500'
                      style={{
                        width: `${Math.min(
                          100,
                          ((event._count?.registrations || 0) /
                            event.maxParticipants) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className='text-gray-400 font-mono text-sm'>
                    {event._count?.registrations || 0}/{event.maxParticipants}
                  </span>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar / Register Action */}
          <div className='lg:col-span-1'>
            <div className='sticky top-24 space-y-6'>
              <div className='glass-card rounded-xl p-6 border-glow'>
                <div className='flex justify-between items-center mb-6'>
                  <span className='text-gray-500'>Registration Fee</span>
                  <div className='flex items-center text-2xl font-bold text-white font-heading'>
                    {event.fees > 0 ? (
                      <>
                        <IndianRupee className='h-6 w-6 text-cyan-400' />
                        <span className='text-cyan-400'>{event.fees}</span>
                      </>
                    ) : (
                      <span className='text-emerald-400'>Free</span>
                    )}
                  </div>
                </div>

                <Button
                  className={`w-full h-12 text-lg font-semibold rounded-xl ${
                    isRegistered
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isSoldOut || isClosed
                      ? 'bg-gray-800 text-gray-500'
                      : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white btn-glow'
                  }`}
                  size='lg'
                  onClick={handleRegisterClick}
                  disabled={
                    registering || isRegistered || isSoldOut || isClosed
                  }
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle2 className='mr-2 h-5 w-5' />
                      Registered
                    </>
                  ) : isSoldOut ? (
                    'Sold Out'
                  ) : isClosed ? (
                    'Registration Closed'
                  ) : registering ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Registering...
                    </>
                  ) : (
                    <>
                      <Ticket className='mr-2 h-5 w-5' />
                      Register Now
                    </>
                  )}
                </Button>

                {isRegistered && (
                  <Button
                    variant='outline'
                    className='w-full mt-3 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300'
                    size='sm'
                    onClick={handleCancelRegistrationClick}
                    disabled={deregistering}
                  >
                    {deregistering ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <XCircle className='mr-2 h-4 w-4' />
                    )}
                    Cancel Registration
                  </Button>
                )}

                <p className='text-xs text-center text-gray-600 mt-4 font-mono'>
                  {isRegistered
                    ? 'You are all set! Check your ticket in dashboard.'
                    : 'Limited seats available. Register soon!'}
                </p>
              </div>

              <div className='text-center'>
                <Button
                  variant='ghost'
                  className='text-gray-500 hover:text-cyan-400'
                  onClick={handleShare}
                >
                  <Share2 className='mr-2 h-4 w-4' />
                  Share Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {event && (
        <>
          <EventRegistrationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            event={event}
            onRegistrationSuccess={(reg) => {
              setIsRegistered(true);
              setMyRegistration(reg);
            }}
          />
          <ConfirmDialog
            open={registerConfirmOpen}
            onOpenChange={setRegisterConfirmOpen}
            title='Confirm Registration'
            description={`Are you sure you want to register for "${event.name}"?`}
            confirmLabel='Yes, Register'
            cancelLabel='Cancel'
            variant='default'
            loading={registering}
            onConfirm={handleConfirmRegister}
          />
          <ConfirmDialog
            open={deregisterConfirmOpen}
            onOpenChange={setDeregisterConfirmOpen}
            title='Cancel Registration'
            description={`Are you sure you want to cancel your registration for "${event.name}"? This cannot be undone.`}
            confirmLabel='Yes, Cancel Registration'
            cancelLabel='Keep Registration'
            variant='danger'
            loading={deregistering}
            onConfirm={handleConfirmDeregister}
          />
        </>
      )}
    </div>
  );
}
