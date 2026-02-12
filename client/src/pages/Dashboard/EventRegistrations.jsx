import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEvent, useEventRegistrations } from '@/hooks/useEvents';
import { formatDate } from '@/lib/utils';
import ManualEntryModal from '@/components/dashboard/ManualEntryModal';
import useAuthStore from '@/store/authStore';

const EventRegistrationsSkeleton = () => (
  <div className='space-y-4'>
    <div className='relative'>
      <div className='h-10 w-full bg-gray-700/50 rounded-lg animate-pulse' />
    </div>
    <div className='rounded-xl border border-white/10 bg-background/50 backdrop-blur-sm overflow-hidden'>
      <div className='hidden md:block overflow-x-auto'>
        <table className='w-full text-left'>
          <thead className='bg-secondary/50 text-xs uppercase text-gray-400 font-semibold border-b border-white/10'>
            <tr>
              <th className='px-6 py-4'>Student Name</th>
              <th className='px-6 py-4'>Roll Number</th>
              <th className='px-6 py-4'>Email & Phone</th>
              <th className='px-6 py-4'>Registration Type</th>
              <th className='px-6 py-4 text-center'>Actions</th>
              <th className='px-6 py-4 text-right'>Date</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-white/5'>
            {[...Array(6)].map((_, idx) => (
              <tr key={idx}>
                <td className='px-6 py-4'>
                  <div className='h-4 bg-gray-700/50 rounded animate-pulse w-32' />
                </td>
                <td className='px-6 py-4'>
                  <div className='h-4 bg-gray-700/50 rounded animate-pulse w-20' />
                </td>
                <td className='px-6 py-4'>
                  <div className='space-y-1'>
                    <div className='h-4 bg-gray-700/50 rounded animate-pulse w-40' />
                    <div className='h-3 bg-gray-700/40 rounded animate-pulse w-24' />
                  </div>
                </td>
                <td className='px-6 py-4'>
                  <div className='h-5 w-16 bg-gray-700/50 rounded animate-pulse' />
                </td>
                <td className='px-6 py-4 text-center'>
                  <div className='h-8 w-8 bg-gray-700/50 rounded animate-pulse mx-auto' />
                </td>
                <td className='px-6 py-4 text-right'>
                  <div className='h-4 bg-gray-700/50 rounded animate-pulse w-24 ml-auto' />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='md:hidden divide-y divide-white/5 p-4'>
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className='p-4 space-y-3'>
            <div className='flex justify-between items-start'>
              <div className='space-y-2'>
                <div className='h-4 bg-gray-700/50 rounded animate-pulse w-28' />
                <div className='h-3 bg-gray-700/40 rounded animate-pulse w-40' />
              </div>
              <div className='h-5 w-14 bg-gray-700/50 rounded animate-pulse' />
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <div className='h-4 bg-gray-700/40 rounded animate-pulse w-20' />
              <div className='h-4 bg-gray-700/40 rounded animate-pulse w-16 ml-auto' />
            </div>
            <div className='h-8 w-full bg-gray-700/50 rounded animate-pulse' />
          </div>
        ))}
      </div>
      <div className='px-6 py-4 border-t border-white/10 bg-secondary/30'>
        <div className='h-4 w-32 bg-gray-700/40 rounded animate-pulse' />
      </div>
    </div>
  </div>
);

export default function EventRegistrations() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { data: event } = useEvent(id);
  const {
    data: registrations = [],
    isLoading,
    error,
    refetch,
  } = useEventRegistrations(id);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.student.rollNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reg.student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadCSV = () => {
    if (!filteredRegistrations.length) return;

    const headers = [
      'Student Name',
      'Roll Number',
      'Branch',
      'Semester',
      'Email',
      'Phone',
      'Registration Type',
      'Team Name',
      'Team Members',
      'Custom Data',
      'Date',
    ];
    const csvContent = [
      headers.join(','),
      ...filteredRegistrations.map((reg) =>
        [
          `"${reg.student.name}"`,
          `"\t${reg.student.rollNumber || ''}"`,
          `"${reg.student.branch || ''}"`,
          `"${reg.student.semester || ''}"`,
          `"${reg.student.email}"`,
          `"${reg.student.phone || ''}"`,
          `"${reg.type}"`,
          `"${reg.teamName || ''}"`,
          `"${(reg.teamMembers || []).join('; ')}"`,
          `"${reg.formData ? JSON.stringify(reg.formData).replace(/"/g, "'") : ''
          }"`,
          `"${formatDate(reg.createdAt)}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `${event?.name || 'Event'}_Registrations.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  console.log(registrations);

  return (
    <div className='min-h-screen gradient-mesh pt-20 pb-12'>
      <div className='absolute inset-0 grid-pattern opacity-30 pointer-events-none' />

      <div className='container mx-auto px-4 relative z-10'>
        <div className='mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div>
            <Link
              to={user?.role === 'FACULTY' || user?.role === 'ADMIN'
                ? '/dashboard'
                : '/coordinator-dashboard'
              }
              className='flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-2'
            >
              <ArrowLeft className='h-4 w-4 mr-1' />
              Back to Dashboard
            </Link>
            <h1 className='text-3xl font-bold font-heading text-white'>
              Registrations
            </h1>
            {event && (
              <p className='text-gray-400 mt-1'>
                Managing entries for{' '}
                <span className='text-primary'>{event.name}</span>
              </p>
            )}
          </div>
          <div className='flex items-center gap-3'>
            <Button variant='outline' onClick={downloadCSV}>
              <Download className='mr-2 h-4 w-4' />
              Export CSV
            </Button>
            <ManualEntryModal eventId={id} onSuccess={refetch} />
          </div>
        </div>

        {isLoading ? (
          <EventRegistrationsSkeleton />
        ) : error ? (
          <div className='text-center py-12 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive'>
            {error?.response?.data?.message ||
              error?.message ||
              'Failed to fetch registration data. Ensure you are authorized.'}
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
              <input
                type='text'
                placeholder='Search by name, roll number, or email...'
                className='w-full pl-10 pr-4 py-2 rounded-lg bg-background/50 border border-white/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className='rounded-xl border border-white/10 bg-background/50 backdrop-blur-sm overflow-hidden'>
              {/* Desktop Table View */}
              <div className='hidden md:block overflow-x-auto'>
                <table className='w-full text-left'>
                  <thead className='bg-secondary/50 text-xs uppercase text-gray-400 font-semibold border-b border-white/10'>
                    <tr>
                      <th className='px-6 py-4'>Student Name</th>
                      <th className='px-6 py-4'>Roll Number</th>
                      <th className='px-6 py-4'>Dept & Sem</th>
                      <th className='px-6 py-4'>Email & Phone</th>
                      <th className='px-6 py-4'>Registration Type</th>
                      <th className='px-6 py-4 text-center'>Actions</th>
                      <th className='px-6 py-4 text-right'>Date</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-white/5'>
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td
                          colSpan='6'
                          className='px-6 py-8 text-center text-gray-500'
                        >
                          No registrations found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr
                          key={reg.id}
                          className='hover:bg-white/5 transition-colors'
                        >
                          <td className='px-6 py-4'>
                            <div className='font-medium text-white'>
                              {reg.student.name}
                            </div>
                          </td>
                          <td className='px-6 py-4 text-gray-300 font-mono text-sm'>
                            {reg.student.rollNumber || 'N/A'}
                          </td>
                          <td className='px-6 py-4 text-sm text-gray-300'>
                            <div>{reg.student.branch || 'N/A'}</div>
                            <div className='text-xs text-gray-500'>
                              Sem: {reg.student.semester || 'N/A'}
                            </div>
                          </td>
                          <td className='px-6 py-4 text-sm'>
                            <div className='text-white'>
                              {reg.student.email}
                            </div>
                            <div className='text-gray-500 text-xs'>
                              {reg.student.phone || 'N/A'}
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${reg.type === 'MANUAL'
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                }`}
                            >
                              {reg.type}
                            </span>
                          </td>
                          <td className='px-6 py-4 text-center'>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => setSelectedRegistration(reg)}
                              className='text-gray-400 hover:text-white'
                            >
                              <Eye className='h-4 w-4' />
                            </Button>
                          </td>
                          <td className='px-6 py-4 text-right text-sm text-gray-400'>
                            {formatDate(reg.createdAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className='md:hidden'>
                {filteredRegistrations.length === 0 ? (
                  <div className='px-6 py-8 text-center text-gray-500'>
                    No registrations found matching your search.
                  </div>
                ) : (
                  <div className='divide-y divide-white/5'>
                    {filteredRegistrations.map((reg) => (
                      <div
                        key={reg.id}
                        className='p-4 space-y-3 hover:bg-white/5 transition-colors'
                      >
                        <div className='flex justify-between items-start'>
                          <div>
                            <div className='font-medium text-white'>
                              {reg.student.name}
                            </div>
                            <div className='text-xs text-gray-400'>
                              {reg.student.email}
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${reg.type === 'MANUAL'
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              }`}
                          >
                            {reg.type}
                          </span>
                        </div>

                        <div className='grid grid-cols-2 gap-2 text-xs text-gray-500 font-mono'>
                          <div>
                            <span className='block text-gray-600'>
                              Roll No:
                            </span>
                            <span className='text-gray-400'>
                              {reg.student.rollNumber || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className='block text-gray-600'>Dept:</span>
                            <span className='text-gray-400'>
                              {reg.student.branch || 'N/A'} (
                              {reg.student.semester || '-'})
                            </span>
                          </div>
                          <div className='text-right'>
                            <span className='block text-gray-600'>Date:</span>
                            <span className='text-gray-400'>
                              {formatDate(reg.createdAt)}
                            </span>
                          </div>
                        </div>

                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setSelectedRegistration(reg)}
                          className='w-full bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10 h-8 text-xs'
                        >
                          <Eye className='h-3 w-3 mr-2' />
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className='px-6 py-4 border-t border-white/10 text-xs text-gray-500 bg-secondary/30'>
                Total Registrations: {filteredRegistrations.length}
              </div>
            </div>
          </div>
        )}

        {/* Details Dialog */}
        <Dialog
          open={!!selectedRegistration}
          onOpenChange={() => setSelectedRegistration(null)}
        >
          <DialogContent className='max-w-xl'>
            <DialogHeader>
              <DialogTitle>Registration Details</DialogTitle>
            </DialogHeader>
            {selectedRegistration && (
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div className='space-y-1'>
                    <span className='text-muted-foreground block text-xs'>
                      Student
                    </span>
                    <p className='font-medium'>
                      {selectedRegistration.student.name}
                    </p>
                    <p className='text-muted-foreground'>
                      {selectedRegistration.student.email}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-muted-foreground block text-xs'>
                      Roll No
                    </span>
                    <p className='font-medium'>
                      {selectedRegistration.student.rollNumber || 'N/A'}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-muted-foreground block text-xs'>
                      Department
                    </span>
                    <p className='font-medium'>
                      {selectedRegistration.student.branch || 'N/A'}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-muted-foreground block text-xs'>
                      Semester
                    </span>
                    <p className='font-medium'>
                      {selectedRegistration.student.semester || 'N/A'}
                    </p>
                  </div>
                </div>

                {selectedRegistration.teamName && (
                  <div className='bg-secondary/20 p-3 rounded-md border border-border'>
                    <h4 className='font-semibold text-sm mb-2 text-primary'>
                      Team Details
                    </h4>
                    <div className='grid grid-cols-2 gap-2 text-sm'>
                      <div>
                        <span className='text-muted-foreground text-xs block'>
                          Team Name
                        </span>
                        <p>{selectedRegistration.teamName}</p>
                      </div>
                      <div>
                        <span className='text-muted-foreground text-xs block'>
                          Members
                        </span>
                        <ul className='list-disc list-inside text-muted-foreground'>
                          {selectedRegistration.teamMembers?.map((m, i) => (
                            <li key={i}>{m}</li>
                          )) || <li>No other members listed</li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRegistration.formData &&
                  Object.keys(selectedRegistration.formData).length > 0 && (
                    <div className='bg-secondary/20 p-3 rounded-md border border-border'>
                      <h4 className='font-semibold text-sm mb-2 text-primary'>
                        Additional Details
                      </h4>
                      <div className='space-y-2 text-sm'>
                        {Object.entries(selectedRegistration.formData).map(
                          ([key, value]) => (
                            <div key={key}>
                              <span className='text-muted-foreground text-xs block'>
                                {key}
                              </span>
                              <p>{value}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div >
  );
}
