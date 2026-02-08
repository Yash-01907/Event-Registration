import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  User,
  Lock,
  Mail,
  Phone,
  Hash,
  BookOpen,
  Shield,
  Cpu,
} from 'lucide-react';

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuthStore();

  // Profile Update Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    setValue: setProfileValue,
    watch: watchProfile,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      rollNumber: user?.rollNumber || '',
      branch: user?.branch || '',
      semester: user?.semester != null ? String(user.semester) : '',
    },
  });

  const [activeTab, setActiveTab] = useState('profile');

  // Password Change Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm();

  // Watch values for Select components
  const watchedBranch = watchProfile('branch');
  const watchedSemester = watchProfile('semester');

  // Initialize profile form with user data
  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        rollNumber: user.rollNumber || '',
        branch: user.branch || '',
        semester: user.semester || '',
      });
    }
  }, [user, resetProfile]);

  const onProfileSubmit = async (data) => {
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
      resetPassword();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className='min-h-screen gradient-mesh pt-20 pb-12'>
      <div className='absolute inset-0 grid-pattern opacity-30 pointer-events-none' />

      <div className='container mx-auto px-4 max-w-4xl relative z-10'>
        {/* Header */}
        <div className='mb-10'>
          <h1 className='text-3xl md:text-4xl font-bold font-heading text-white tracking-wide flex flex-wrap items-center gap-3'>
            <div className='h-12 w-12 rounded-xl bg-linear-to-br from-cyan-500 to-purple-600 flex items-center justify-center'>
              <Cpu className='h-6 w-6 text-white' />
            </div>
            <span className='text-cyan-400'>ACCOUNT</span>
            <span className='text-white'>SETTINGS</span>
          </h1>
          <p className='text-gray-500 mt-2 font-mono text-sm'>
            // Manage your profile and security
          </p>
        </div>

        <div className='flex flex-col md:flex-row gap-8'>
          {/* Sidebar */}
          <div className='flex md:flex-col gap-2 shrink-0'>
            <Button
              variant='outline'
              onClick={() => setActiveTab('profile')}
              className={cn(
                'justify-start w-full md:w-48',
                activeTab === 'profile'
                  ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
                  : 'border-gray-800 text-gray-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <User className='h-4 w-4 mr-2' />
              Profile
            </Button>
            <Button
              variant='outline'
              onClick={() => setActiveTab('security')}
              className={cn(
                'justify-start w-full md:w-48',
                activeTab === 'security'
                  ? 'border-purple-500/50 bg-purple-500/10 text-purple-400'
                  : 'border-gray-800 text-gray-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <Shield className='h-4 w-4 mr-2' />
              Security
            </Button>
          </div>

          {/* Content */}
          <div className='flex-1 min-w-0'>
            {activeTab === 'profile' && (
              <div className='glass-card rounded-2xl overflow-hidden'>
                <div className='p-6 border-b border-gray-800'>
                  <h2 className='text-lg font-bold text-white font-heading flex items-center gap-2'>
                    <User className='h-5 w-5 text-cyan-400' />
                    Profile Information
                  </h2>
                  <p className='text-gray-500 text-sm mt-1'>
                    Update your personal details
                  </p>
                </div>

                <form onSubmit={handleSubmitProfile(onProfileSubmit)}>
                  <div className='p-6 space-y-5'>
                    <div className='space-y-2'>
                      <Label htmlFor='name' className='text-gray-400 text-sm'>
                        Full Name
                      </Label>
                      <div className='relative'>
                        <User className='absolute left-4 top-3 h-4 w-4 text-gray-600' />
                        <Input
                          id='name'
                          placeholder='John Doe'
                          className='pl-11 bg-white/5 border-gray-800 text-white placeholder:text-gray-600 focus:border-cyan-500/50 rounded-xl'
                          {...registerProfile('name', {
                            required: 'Name is required',
                          })}
                        />
                      </div>
                      {profileErrors.name && (
                        <p className='text-xs text-red-400 font-mono'>
                          {profileErrors.name.message}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='email' className='text-gray-400 text-sm'>
                        Email Address
                      </Label>
                      <div className='relative'>
                        <Mail className='absolute left-4 top-3 h-4 w-4 text-gray-600' />
                        <Input
                          id='email'
                          type='email'
                          placeholder='john@example.com'
                          className='pl-11 bg-white/5 border-gray-800 text-white placeholder:text-gray-600 focus:border-cyan-500/50 rounded-xl'
                          {...registerProfile('email', {
                            required: 'Email is required',
                          })}
                        />
                      </div>
                      {profileErrors.email && (
                        <p className='text-xs text-red-400 font-mono'>
                          {profileErrors.email.message}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='phone' className='text-gray-400 text-sm'>
                        Phone Number
                      </Label>
                      <div className='relative'>
                        <Phone className='absolute left-4 top-3 h-4 w-4 text-gray-600' />
                        <Input
                          id='phone'
                          placeholder='+91 98765 43210'
                          className='pl-11 bg-white/5 border-gray-800 text-white placeholder:text-gray-600 focus:border-cyan-500/50 rounded-xl'
                          {...registerProfile('phone')}
                        />
                      </div>
                    </div>
                    {user?.role === 'STUDENT' && (
                      <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label
                            htmlFor='rollNumber'
                            className='text-gray-400 text-sm'
                          >
                            Roll Number
                          </Label>
                          <div className='relative'>
                            <Hash className='absolute left-4 top-3 h-4 w-4 text-gray-600' />
                            <Input
                              id='rollNumber'
                              placeholder='CS2024001'
                              className='pl-11 bg-white/5 border-gray-800 text-white placeholder:text-gray-600 focus:border-cyan-500/50 rounded-xl'
                              {...registerProfile('rollNumber')}
                            />
                          </div>
                        </div>

                        <div className='space-y-2'>
                          <Label
                            htmlFor='branch'
                            className='text-gray-400 text-sm'
                          >
                            Branch
                          </Label>
                          <div className='relative'>
                            <Select
                              value={watchedBranch}
                              onValueChange={(value) =>
                                setProfileValue('branch', value)
                              }
                            >
                              <SelectTrigger className='pl-4 bg-white/5 border-gray-800 text-white focus:border-cyan-500/50 rounded-xl h-10 w-full'>
                                <div className='flex items-center gap-3'>
                                  <BookOpen className='h-4 w-4 text-gray-600' />
                                  <SelectValue placeholder='Select Branch' />
                                </div>
                              </SelectTrigger>
                              <SelectContent className='bg-gray-900 border-gray-800'>
                                <SelectItem
                                  value='Automobile'
                                  className='text-white'
                                >
                                  Automobile
                                </SelectItem>
                                <SelectItem
                                  value='Computer'
                                  className='text-white'
                                >
                                  Computer
                                </SelectItem>
                                <SelectItem
                                  value='Mechanical'
                                  className='text-white'
                                >
                                  Mechanical
                                </SelectItem>
                                <SelectItem
                                  value='Electrical'
                                  className='text-white'
                                >
                                  Electrical
                                </SelectItem>
                                <SelectItem
                                  value='Civil'
                                  className='text-white'
                                >
                                  Civil
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className='space-y-2'>
                          <Label
                            htmlFor='semester'
                            className='text-gray-400 text-sm'
                          >
                            Semester
                          </Label>
                          <div className='relative'>
                            <Select
                              value={watchedSemester?.toString()}
                              onValueChange={(value) =>
                                setProfileValue('semester', value)
                              }
                            >
                              <SelectTrigger className='pl-4 bg-white/5 border-gray-800 text-white focus:border-cyan-500/50 rounded-xl h-10 w-full'>
                                <div className='flex items-center gap-3'>
                                  <BookOpen className='h-4 w-4 text-gray-600' />
                                  <SelectValue placeholder='Select Semester' />
                                </div>
                              </SelectTrigger>
                              <SelectContent className='bg-gray-900 border-gray-800'>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                  <SelectItem
                                    key={sem}
                                    value={sem.toString()}
                                    className='text-white'
                                  >
                                    {sem}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='p-6 pt-0'>
                    <Button
                      type='submit'
                      disabled={isProfileSubmitting}
                      className='w-full bg-linear-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 rounded-xl btn-glow'
                    >
                      {isProfileSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className='glass-card rounded-2xl overflow-hidden'>
                <div className='p-6 border-b border-gray-800'>
                  <h2 className='text-lg font-bold text-white font-heading flex items-center gap-2'>
                    <Shield className='h-5 w-5 text-purple-400' />
                    Security
                  </h2>
                  <p className='text-gray-500 text-sm mt-1'>
                    Change your password to keep your account secure.
                  </p>
                </div>

                <form onSubmit={handleSubmitPassword(onPasswordSubmit)}>
                  <div className='p-6 space-y-5'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='currentPassword'
                        className='text-gray-400 text-sm'
                      >
                        Current Password
                      </Label>
                      <div className='relative'>
                        <Lock className='absolute left-4 top-3 h-4 w-4 text-gray-600' />
                        <Input
                          id='currentPassword'
                          type='password'
                          placeholder='••••••••'
                          className='pl-11 bg-white/5 border-gray-800 text-white placeholder:text-gray-600 focus:border-cyan-500/50 rounded-xl'
                          {...registerPassword('currentPassword', {
                            required: 'Current password is required',
                          })}
                        />
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className='text-xs text-red-400 font-mono'>
                          {passwordErrors.currentPassword.message}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='newPassword'
                        className='text-gray-400 text-sm'
                      >
                        New Password
                      </Label>
                      <div className='relative'>
                        <Lock className='absolute left-4 top-3 h-4 w-4 text-gray-600' />
                        <Input
                          id='newPassword'
                          type='password'
                          placeholder='••••••••'
                          className='pl-11 bg-white/5 border-gray-800 text-white placeholder:text-gray-600 focus:border-cyan-500/50 rounded-xl'
                          {...registerPassword('newPassword', {
                            required: 'New password is required',
                            minLength: {
                              value: 6,
                              message: 'Min 6 characters',
                            },
                          })}
                        />
                      </div>
                      {passwordErrors.newPassword && (
                        <p className='text-xs text-red-400 font-mono'>
                          {passwordErrors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='confirmPassword'
                        className='text-gray-400 text-sm'
                      >
                        Confirm New Password
                      </Label>
                      <div className='relative'>
                        <Lock className='absolute left-4 top-3 h-4 w-4 text-gray-600' />
                        <Input
                          id='confirmPassword'
                          type='password'
                          placeholder='••••••••'
                          className='pl-11 bg-white/5 border-gray-800 text-white placeholder:text-gray-600 focus:border-cyan-500/50 rounded-xl'
                          {...registerPassword('confirmPassword', {
                            required: 'Please confirm your password',
                          })}
                        />
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className='text-xs text-red-400 font-mono'>
                          {passwordErrors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='p-6 pt-0'>
                    <Button
                      type='submit'
                      disabled={isPasswordSubmitting}
                      className='w-full bg-linear-to-r from-purple-500 to-fuchsia-600 text-white font-bold py-3 rounded-xl btn-glow'
                    >
                      {isPasswordSubmitting ? 'Changing...' : 'Change Password'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
