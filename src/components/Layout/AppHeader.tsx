import { FC, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, LogOut, ChevronDown, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface AppHeaderProps {
  isAdmin?: boolean;
  onLogout?: () => void;
}

const AppHeader: FC<AppHeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('token');
      navigate('/login');
    }
    setIsDropdownOpen(false);
  };

  // Get user display name
  const displayName = user?.username || user?.email || 'User';
  const userInitials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className='sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/80'>
      <div className=' mx-auto flex h-16 items-center justify-between px-4'>
        {/* Logo */}
        <Link to='/' className='flex items-center gap-2'>
          <img src='./dark-logo.png' className='w-20 h-10' />
        </Link>

        {/* User Dropdown */}
        <nav className='flex items-center gap-2'>
          <div className='relative' ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className='flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white'
            >
              <div className='h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-semibold text-white'>
                {user?.profileUrl ? (
                  <img
                    src={user.profileUrl}
                    alt={displayName}
                    className='h-8 w-8 rounded-full object-cover'
                  />
                ) : (
                  userInitials || <User className='h-4 w-4' />
                )}
              </div>
              <span className='hidden sm:inline max-w-[120px] truncate'>{displayName}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className='absolute right-0 mt-2 w-48 rounded-lg bg-slate-900 border border-slate-800 shadow-lg overflow-hidden'>
                <div className='py-1'>
                  <Link
                    to='/'
                    onClick={() => setIsDropdownOpen(false)}
                    className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white'
                  >
                    <Home className='h-4 w-4' />
                    <span>Home</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className='w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-red-400'
                  >
                    <LogOut className='h-4 w-4' />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
