import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import teamService from "../services/teamService";

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

  return (
    <header className='px-6 py-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>{title}</h1>
          {subtitle && <p className='text-slate-400'>{subtitle}</p>}
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          {actions}
          {user?.role === "admin" && (
            <Link to='/admin' className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-white'>
              Admin
            </Link>
          )}
          <Link to='/' className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-white'>
            Home
          </Link>
          {backTo && (
            <Link to={backTo} className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-white'>
              Back
            </Link>
          )}
          {user && (
            <div className='flex items-center gap-3 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2'>
              <div className='h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold uppercase'>
                {displayName.slice(0, 2)}
              </div>
              <div>
                <div className='text-sm font-semibold text-white'>{displayName}</div>
                <div className='text-xs text-slate-400'>
                  {creditLabel}: {creditsValue} · {user.role || "user"}
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
