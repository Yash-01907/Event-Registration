import { Cpu, Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

export default function Footer() {
  const user = useAuthStore((s) => s.user);

  return (
    <footer className='border-t border-gray-800 bg-black/50 pt-16 pb-8'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 mb-16'>
          {/* Brand Column */}
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600'>
                <Cpu className='h-5 w-5 text-white' />
              </div>
              <div>
                <span className='font-heading font-bold text-lg'>
                  <span className='text-white'>UDAAN</span>
                  <span className='text-purple-400 ml-1 text-sm font-mono'>
                    2026
                  </span>
                </span>
              </div>
            </div>
            <p className='text-gray-500 leading-relaxed max-w-sm text-sm'>
              The ultimate convergence of technology, sports, and culture. Join
              thousands of students in this electrifying event.
            </p>
            {/* Social Links */}
            <div className='flex items-center gap-4 pt-2'>
              <a
                href='#'
                className='text-gray-600 hover:text-cyan-400 transition-colors'
              >
                <Github className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='text-gray-600 hover:text-cyan-400 transition-colors'
              >
                <Twitter className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='text-gray-600 hover:text-cyan-400 transition-colors'
              >
                <Linkedin className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='text-gray-600 hover:text-fuchsia-400 transition-colors'
              >
                <Instagram className='h-5 w-5' />
              </a>
            </div>
          </div>

          {/* Quick Links Column - changes based on auth */}
          <div className='space-y-4'>
            <h3 className='font-heading text-lg font-bold text-white tracking-wide'>
              Quick Links
            </h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  to='/events'
                  className='text-gray-500 hover:text-cyan-400 transition-colors text-sm'
                >
                  Events
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link
                      to={
                        user.role === 'STUDENT' ? '/my-tickets' : '/dashboard'
                      }
                      className='text-gray-500 hover:text-cyan-400 transition-colors text-sm'
                    >
                      {user.role === 'STUDENT' ? 'My Tickets' : 'Dashboard'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/profile'
                      className='text-gray-500 hover:text-cyan-400 transition-colors text-sm'
                    >
                      Profile
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to='/login'
                      className='text-gray-500 hover:text-cyan-400 transition-colors text-sm'
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/register'
                      className='text-gray-500 hover:text-cyan-400 transition-colors text-sm'
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
              <li>
                <button
                  type='button'
                  className='text-gray-500 hover:text-cyan-400 transition-colors text-sm text-left'
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type='button'
                  className='text-gray-500 hover:text-cyan-400 transition-colors text-sm text-left'
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className='space-y-4'>
            <h3 className='font-heading text-lg font-bold text-white tracking-wide'>
              Contact
            </h3>
            <div className='space-y-3 text-gray-500 text-sm font-mono'>
              <p>
                <span className='text-gray-600'>Email:</span>{' '}
                <span className='text-cyan-400/80'>techfest@gdec.edu</span>
              </p>
              <p>
                <span className='text-gray-600'>Phone:</span> +91 98765 43210
              </p>
              <p>
                <span className='text-gray-600'>Location:</span> GDEC Campus
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm'>
          <p className='text-gray-600 font-mono'>
            © 2026 TechFest. All rights reserved.
          </p>
          <div className='flex items-center gap-6 text-gray-600'>
            <a href='#' className='hover:text-cyan-400 transition-colors'>
              Privacy Policy
            </a>
            <a href='#' className='hover:text-cyan-400 transition-colors'>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
