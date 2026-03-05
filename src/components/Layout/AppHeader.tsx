import { FC, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, LogOut, ChevronDown, User, ShieldCheck, Coins, Database, ArrowLeft } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setUser } from '../../store/userReducer';
import authService from '../../services/authService';
import logo from '../../../public/dark-logo2.png';
import Button from '../ui/Button';
import { DRESS_IMAGE_PERSIST_KEY, FABRIC_STUDIO_PERSIST_KEY, PRODUCT_LISTING_PERSIST_KEY, TRIAL_ROOM_HANDOFF_KEY } from '../../constants/modelFace';

interface AppHeaderProps {
  isAdmin?: boolean;
  title?: string;
  description?: string;
  onLogout?: () => void;
}

const AppHeader: FC<AppHeaderProps> = ({ title, description = null }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const { team } = useSelector((state: RootState) => state.team);
  const effectiveCredits = user?.teamId ? (team?.credits ?? 0) : (user?.credits ?? 0);
  const isTeamUser = !!user?.teamId;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
      authService.logout();
      dispatch(setUser(null));
      navigate('/login');
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

   const clearLocalStorage = () => {
    localStorage.removeItem(TRIAL_ROOM_HANDOFF_KEY)
    localStorage.removeItem(DRESS_IMAGE_PERSIST_KEY)
    localStorage.removeItem(TRIAL_ROOM_HANDOFF_KEY)
    localStorage.removeItem(FABRIC_STUDIO_PERSIST_KEY)
    localStorage.removeItem(PRODUCT_LISTING_PERSIST_KEY)
    if(window.location.pathname === "/features"){
      navigate('/')
    }else{
      navigate("/features")
    }
  }

  return (
    <header className='sticky top-0 z-50  border-[#E5E2DA] bg-white shadow-[0_1px_0_#E5E2DA]'>
      <div className='mx-auto flex h-[60px] items-center justify-between px-7'>
        {/* Logo */}
        <div className='flex items-center gap-5'>
          <Link to='/' className='flex items-center gap-2'>
           <img src={logo} alt="AI4FI" className='w-18 h-12 object-contain' />
          </Link>
          {title && (
            <>
              <div className='w-px h-6 bg-[#E5E2DA]' />
              <div>
                <div className='text-base font-bold text-stone-900 tracking-tight'>{title}</div>
                {description && <p className="text-[11.5px] text-[#9E9893] font-medium">{description}</p>}
              </div>
            </>
          )}
        </div>

        {/* Credits & User Dropdown */}
        <nav className='flex items-center gap-3'>
          {/* Credits Display */}

          <Button variant="outline" onClick={clearLocalStorage} size="md" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
              Back
          </Button>
          <div className='flex items-center gap-1.5 rounded-lg border border-[#E5E2DA] px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-green-50'>
            <Coins className='h-4 w-4 text-emerald-600' />
            <span className='text-sm font-bold text-emerald-700 font-mono'>
              {effectiveCredits}
            </span>
            <span className='text-[10px] text-emerald-600/70 hidden sm:inline'>
              {isTeamUser ? "team credits" : "credits"}
            </span>
          </div>

          <div className='relative' ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className='flex items-center gap-2 rounded-xl border border-[#E5E2DA] pl-1 pr-3 py-1 text-sm font-medium text-[#6B6560] transition-colors hover:border-[#D0CBBF] hover:text-stone-900 bg-white'
            >
              <div className='h-7 w-7 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-[11px] font-bold text-white'>
                {user?.profileUrl ? (
                  <img
                    src={user.profileUrl}
                    alt={displayName}
                    className='h-7 w-7 rounded-full object-cover'
                  />
                ) : (
                  userInitials || <User className='h-3.5 w-3.5' />
                )}
              </div>
              <div className='text-left hidden sm:block'>
                <div className='text-xs font-bold text-stone-900'>{displayName}</div>
                <div className='text-[10px] text-[#9E9893] font-mono'>{user?.role || 'user'}</div>
              </div>
              <ChevronDown className={`h-3 w-3 text-[#9E9893] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className='absolute right-0 mt-2 w-48 rounded-md bg-white border border-[#E5E2DA] shadow-[0_4px_16px_rgba(28,25,23,0.09)] overflow-hidden'>
                <div className='py-1'>
                  <Link
                    to='/'
                    onClick={() => setIsDropdownOpen(false)}
                    className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#6B6560] transition-colors hover:bg-[#F9F8F5] hover:text-stone-900'
                  >
                    <Home className='h-4 w-4' />
                    <span>Home</span>
                  </Link>
                  <Link to="/generated-model" onClick={() => setIsDropdownOpen(false)} className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#6B6560] transition-colors hover:bg-[#F9F8F5] hover:text-stone-900'>
                    <Database className='h-4 w-4' />
                    <span>Generated Models</span>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to='/admin'
                      onClick={() => setIsDropdownOpen(false)}
                      className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#6B6560] transition-colors hover:bg-[#F9F8F5] hover:text-stone-900'
                    >
                      <ShieldCheck className='h-4 w-4' />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className='w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#6B6560] transition-colors hover:bg-red-50 hover:text-red-600'
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
