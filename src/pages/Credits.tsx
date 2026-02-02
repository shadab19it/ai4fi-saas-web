import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Link } from "react-router-dom";

const CreditsPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const creditHistory = user?.creditHistory || [];

  return (
    <div className='min-h-screen bg-slate-950 text-white'>
      <div className='px-6 py-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>My Credits</h1>
            <p className='text-slate-400'>View your credit balance and history.</p>
          </div>
          <div className='flex gap-2'>
            <Link to='/' className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-white'>
              Home
            </Link>
            <Link to='/dashboard' className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-white'>
              Back
            </Link>
          </div>
        </div>
      </div>

      <div className='px-6 py-6 space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='rounded-xl border border-slate-800 bg-slate-900 p-4'>
            <p className='text-sm text-slate-400'>Current Credits</p>
            <p className='text-2xl font-semibold'>{user?.credits ?? 0}</p>
          </div>
          <div className='rounded-xl border border-slate-800 bg-slate-900 p-4 md:col-span-2'>
            <p className='text-sm text-slate-400'>Account</p>
            <p className='text-lg font-semibold'>{user?.email || "Unknown"}</p>
          </div>
        </div>

        <div className='rounded-xl border border-slate-800 bg-slate-900 p-4'>
          <h2 className='text-xl font-semibold mb-4'>Credit History</h2>
          <div className='space-y-2 max-h-[420px] overflow-y-auto pr-1'>
            {creditHistory.length === 0 && <p className='text-slate-400'>No credit history yet.</p>}
            {creditHistory.map((entry, index) => (
              <div key={`${entry.createdAt}-${index}`} className='text-sm border border-slate-800 rounded-md p-3 bg-slate-950/40'>
                <div className='flex items-center justify-between'>
                  <span className='capitalize'>{entry.type}</span>
                  <span className={entry.amount >= 0 ? "text-green-400" : "text-red-400"}>
                    {entry.amount >= 0 ? "+" : ""}
                    {entry.amount}
                  </span>
                </div>
                <div className='text-slate-400'>
                  Balance: {entry.balance} · {new Date(entry.createdAt).toLocaleString()}
                </div>
                {entry.reason && <div className='text-slate-300 mt-1'>{entry.reason}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditsPage;
