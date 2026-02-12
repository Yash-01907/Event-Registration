import { memo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Calendar,
  MapPin,
  Users,
  Cpu,
  ChevronRight,
  Ticket,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';
import { toast } from 'sonner';
import EventRegistrationModal from '@/components/events/EventRegistrationModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

const formatDate = (dateString) => {
  if (!dateString) return 'Date TBA';
  return new Date(dateString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
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

const getDepartmentLabel = (department) => {
  const d = department ?? 'ALL';
  const labels = {
    ALL: 'All',
    COMPUTER: 'Computer',
    ELECTRICAL: 'Electrical',
    MECHANICAL: 'Mechanical',
    CIVIL: 'Civil',
    AUTO: 'Auto',
  };
  return labels[d] ?? 'All';
};

const EventCard = memo(function EventCard({
  event,
  index,
  isRegistered: isRegisteredFromApi = false,
  onRegistrationSuccess,
}) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [simpleConfirmOpen, setSimpleConfirmOpen] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);

  const isRegistered = isRegisteredFromApi || hasRegistered;

  const isFull =
    event.maxParticipants &&
    event._count?.registrations >= event.maxParticipants;
  const isClosed =
    event.registrationDeadline &&
    new Date() > new Date(event.registrationDeadline);
  const canRegister = !isFull && !isClosed;

  const needsModal =
    event.isTeamEvent || (event.formConfig && event.formConfig.length > 0);

  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (isRegistered || !canRegister) return;
    if (needsModal) {
      setRegistrationModalOpen(true);
    } else {
      setSimpleConfirmOpen(true);
    }
  };

  const handleSimpleRegisterConfirm = async () => {
    setRegistering(true);
    try {
      await api.post('/registrations', { eventId: event.id });
      setSimpleConfirmOpen(false);
      setHasRegistered(true);
      onRegistrationSuccess?.();
      toast.success('Successfully registered for the event!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div
      className='glass-card rounded-2xl overflow-hidden card-hover card-3d flex flex-col h-full group'
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className='h-48 relative overflow-hidden bg-gray-900'>
        {event.posterUrl ? (
          <img
            src={event.posterUrl}
            alt={event.name}
            loading='lazy'
            decoding='async'
            className='w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
            <Cpu className='h-16 w-16 text-gray-700' />
          </div>
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent' />
        <div className='absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity' />
        <div className='absolute top-4 right-4'>
          <span
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider border backdrop-blur-sm',
              getCategoryColor(event.category)
            )}
          >
            {event.category}
          </span>
        </div>
        <div className='absolute bottom-4 left-4 right-4'>
          <h3 className='text-xl font-bold text-white font-heading tracking-wide line-clamp-1 text-glow-white'>
            {event.name}
          </h3>
        </div>
      </div>
      <div className='p-5 flex flex-col grow'>
        <p className='text-gray-500 text-sm line-clamp-2 mb-4 grow'>
          {event.description ||
            'Join us for this amazing event! Register now to participate.'}
        </p>
        <div className='space-y-2 mb-5'>
          <div className='flex items-center text-sm text-gray-400 font-mono'>
            <Calendar className='h-4 w-4 mr-2 text-cyan-500' />
            {formatDate(event.date)}
          </div>
          <div className='flex items-center text-sm text-gray-400 font-mono'>
            <MapPin className='h-4 w-4 mr-2 text-purple-500' />
            {event.location || 'Venue TBA'}
          </div>
          <div className='flex items-center text-sm text-gray-400 font-mono'>
            <Building2 className='h-4 w-4 mr-2 text-amber-500' />
            Department: {getDepartmentLabel(event.department)}
          </div>
          <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-800'>
            <div className='flex items-center text-sm text-gray-500 font-mono'>
              <Users className='h-4 w-4 mr-2 text-emerald-500' />
              {event._count?.registrations || 0}
              {event.maxParticipants ? `/${event.maxParticipants}` : ''}
            </div>
            <span className='font-bold text-cyan-400 font-mono text-lg'>
              {event.fees > 0 ? `₹${event.fees}` : 'FREE'}
            </span>
          </div>
        </div>
        <div className='flex gap-2'>
          <Link to={`/events/${event.id}`} className='flex-1 min-w-0'>
            <Button
              variant='outline'
              className='w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-mono text-sm'
            >
              VIEW DETAILS
              <ChevronRight className='ml-1 h-4 w-4' />
            </Button>
          </Link>
          <Button
            onClick={handleRegisterClick}
            disabled={isFull || isClosed || isRegistered}
            className={cn(
              'flex-1 min-w-0 font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed',
              isRegistered
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'btn-neon bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30 hover:from-cyan-500 hover:to-purple-600 hover:text-white font-bold'
            )}
          >
            {isRegistered ? (
              <>
                <CheckCircle2 className='mr-1 h-4 w-4' />
                REGISTERED
              </>
            ) : isFull ? (
              'SOLD OUT'
            ) : isClosed ? (
              'CLOSED'
            ) : (
              <>
                <Ticket className='mr-1 h-4 w-4' />
                REGISTER
              </>
            )}
          </Button>
        </div>

        {event &&
          (registrationModalOpen || simpleConfirmOpen) &&
          createPortal(
            <>
              <EventRegistrationModal
                isOpen={registrationModalOpen}
                onClose={() => setRegistrationModalOpen(false)}
                event={event}
                onRegistrationSuccess={() => {
                  setRegistrationModalOpen(false);
                  setHasRegistered(true);
                  onRegistrationSuccess?.();
                  toast.success('Successfully registered!');
                }}
              />
              <ConfirmDialog
                open={simpleConfirmOpen}
                onOpenChange={setSimpleConfirmOpen}
                title='Confirm Registration'
                description={`Register for "${event.name}"?`}
                confirmLabel='Yes, Register'
                cancelLabel='Cancel'
                variant='default'
                loading={registering}
                onConfirm={handleSimpleRegisterConfirm}
              />
            </>,
            document.body
          )}
      </div>
    </div>
  );
});

export default EventCard;
