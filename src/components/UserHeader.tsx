import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import teamService from "../services/teamService";
import { Zap, Home, ArrowLeft } from "lucide-react";

interface UserHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  actions?: React.ReactNode;
}

const UserHeader = ({ title, subtitle, backTo = "/", actions }: UserHeaderProps) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [teamCredits, setTeamCredits] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadTeamCredits = async () => {
      if (!user?.teamId) {
        if (isMounted) setTeamCredits(null);
        return;
      }
      try {
        const data = await teamService.getTeam();
        if (isMounted) {
          setTeamCredits(data.team?.credits ?? null);
        }
      } catch (error) {
        if (isMounted) setTeamCredits(null);
      }
    };
    loadTeamCredits();
    return () => {
      isMounted = false;
    };
  }, [user?.teamId]);

  const creditLabel = user?.teamId ? "Team Credits" : "Credits";
  const creditsValue = user?.teamId ? (teamCredits ?? 0) : user?.credits ?? 0;

  const displayName = useMemo(() => {
    if (!user) return "Guest";
    return user.username || user.email || "User";
  }, [user]);

  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className='sticky top-0 z-50 border-b border-[#E5E2DA] bg-white shadow-[0_1px_0_#E5E2DA]'>
      <div className='flex h-[60px] items-center justify-between px-7'>
        {/* Logo */}
        <div className='flex items-center gap-5'>
          <Link to='/' className='flex items-center gap-2'>
            <div className='w-[28px] h-[28px] bg-[#2563EB] rounded-lg flex items-center justify-center'>
              <Zap className='h-3 w-3 text-white' />
            </div>
            <span className='text-base font-bold text-stone-900 tracking-tight'>Spark</span>
          </Link>
        </div>

        {/* Actions */}
        <div className='flex items-center gap-2'>
          {actions}
          {user?.role === "admin" && (
            <Link
              to='/admin'
              className='h-[34px] px-3.5 flex items-center rounded-lg border border-[#E5E2DA] bg-white text-[13px] font-medium text-[#6B6560] hover:bg-[#F9F8F5] hover:text-stone-900 transition-all'
            >
              Admin
            </Link>
          )}
          <Link
            to='/'
            className='h-[34px] px-3.5 flex items-center gap-1.5 rounded-lg border border-[#E5E2DA] bg-white text-[13px] font-medium text-[#6B6560] hover:bg-[#F9F8F5] hover:text-stone-900 transition-all'
          >
            Home
          </Link>
          {backTo && (
            <Link
              to={backTo}
              className='h-[34px] px-3.5 flex items-center gap-1.5 rounded-lg border border-[#E5E2DA] bg-white text-[13px] font-medium text-[#6B6560] hover:bg-[#F9F8F5] hover:text-stone-900 transition-all'
            >
              Back
            </Link>
          )}
          {user && (
            <div className='flex items-center gap-2 rounded-full border border-[#E5E2DA] pl-1 pr-3 py-1'>
              <div
                className='h-7 w-7 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-[11px] font-bold text-white shrink-0'
              >
                {initials}
              </div>
              <div className='text-left'>
                <div className='text-xs font-bold text-stone-900'>{displayName}</div>
                <div className='text-[10px] text-[#9E9893] font-mono'>
                  {creditsValue} credits · {user.role || "user"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
