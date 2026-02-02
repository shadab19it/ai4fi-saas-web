import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import adminService, { AdminUser, CreditHistoryEntry } from "../../services/adminService";

const DEFAULT_PAGE_SIZE = 20;

const AdminDashboard = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [creditHistory, setCreditHistory] = useState<CreditHistoryEntry[]>([]);
  const [amountInput, setAmountInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await adminService.getUsers(search, page, DEFAULT_PAGE_SIZE);
      setUsers(result.users || []);
      setTotalPages(result.totalPages || 1);
    } catch (error: any) {
      toast.error(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetail = async (userId: string) => {
    try {
      const result = await adminService.getUser(userId);
      setSelectedUser(result.user);
      setCreditHistory(result.user.creditHistory || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load user");
    }
  };

  const handleAdjustCredits = async (direction: "add" | "remove") => {
    if (!selectedUser) {
      toast.error("Select a user first");
      return;
    }

    const parsedAmount = Number(amountInput);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    const signedAmount = direction === "add" ? parsedAmount : -parsedAmount;

    try {
      const result = await adminService.adjustCredits(selectedUser._id, signedAmount, reasonInput || "Admin adjustment");
      toast.success(result.message || "Credits updated");
      setSelectedUser(result.user);
      setCreditHistory(result.user.creditHistory || []);
      setAmountInput("");
      setReasonInput("");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update credits");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  return (
    <div className='min-h-screen bg-slate-950 text-white'>
      <div className='flex min-h-screen'>
        <aside className='hidden lg:flex lg:w-72 lg:flex-col border-r border-slate-800 bg-slate-950'>
          <div className='px-6 py-6 border-b border-slate-800'>
            <h1 className='text-2xl font-semibold'>Admin Portal</h1>
            <p className='text-sm text-slate-400 mt-1'>Credits & users</p>
          </div>
          <nav className='flex-1 px-4 py-6 space-y-2'>
            <a href='#users' className='block px-4 py-2 rounded-lg bg-slate-900 text-white'>
              Users
            </a>
            <a href='#credits' className='block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-900'>
              Manage Credits
            </a>
            <a href='#history' className='block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-900'>
              Credit History
            </a>
          </nav>
          <div className='px-6 py-6 border-t border-slate-800 text-xs text-slate-500'>
            AI4FI Admin
          </div>
        </aside>

        <main className='flex-1 min-h-screen overflow-y-auto'>
          <header className='px-6 py-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
              <div>
                <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
                <p className='text-slate-400'>Manage user credits and view account details.</p>
              </div>
              <div className='flex flex-wrap items-center gap-3'>
                <div className='flex gap-2'>
                  <Link to='/' className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-white'>
                    Home
                  </Link>
                  <Link to='/dashboard' className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-white'>
                    Back
                  </Link>
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder='Search by email or username'
                  className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-white'
                />
                <button
                  onClick={() => {
                    setPage(1);
                    fetchUsers();
                  }}
                  className='px-4 py-2 rounded-md bg-cyan-600 text-white'
                >
                  Search
                </button>
              </div>
            </div>
          </header>

          <div className='px-6 py-6 space-y-6'>
            <section className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='rounded-xl border border-slate-800 bg-slate-900 p-4'>
                <p className='text-sm text-slate-400'>Total Users</p>
                <p className='text-2xl font-semibold'>{users.length}</p>
              </div>
              <div className='rounded-xl border border-slate-800 bg-slate-900 p-4'>
                <p className='text-sm text-slate-400'>Selected User</p>
                <p className='text-lg font-semibold'>{selectedUser?.email || "None"}</p>
              </div>
              <div className='rounded-xl border border-slate-800 bg-slate-900 p-4'>
                <p className='text-sm text-slate-400'>Current Credits</p>
                <p className='text-2xl font-semibold'>{selectedUser?.credits ?? 0}</p>
              </div>
            </section>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <div id='users' className='lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold'>Users</h2>
            {loading && <span className='text-sm text-gray-400'>Loading...</span>}
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead className='text-gray-400 border-b border-gray-800'>
                <tr>
                  <th className='py-2'>Email</th>
                  <th className='py-2'>Username</th>
                  <th className='py-2'>Role</th>
                  <th className='py-2'>Credits</th>
                  <th className='py-2'>Created</th>
                  <th className='py-2'></th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && !loading && (
                  <tr>
                    <td className='py-4 text-gray-400' colSpan={6}>
                      No users found.
                    </td>
                  </tr>
                )}
                {users.map((user) => (
                  <tr key={user._id} className='border-b border-gray-800 hover:bg-gray-800/30'>
                    <td className='py-3'>{user.email}</td>
                    <td className='py-3'>{user.username || "-"}</td>
                    <td className='py-3 capitalize'>{user.role || "user"}</td>
                    <td className='py-3'>{user.credits ?? 0}</td>
                    <td className='py-3'>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className='py-3'>
                      <button
                        onClick={() => fetchUserDetail(user._id)}
                        className='px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600'
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='flex items-center justify-between mt-4'>
            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className='px-3 py-1 rounded-md bg-slate-700 disabled:opacity-50'
            >
              Previous
            </button>
            <span className='text-sm text-gray-400'>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className='px-3 py-1 rounded-md bg-slate-700 disabled:opacity-50'
            >
              Next
            </button>
          </div>
        </div>

              <div id='credits' className='bg-slate-900 border border-slate-800 rounded-xl p-4'>
                <h2 className='text-xl font-semibold mb-4'>Manage Credits</h2>
                {!selectedUser ? (
                  <p className='text-gray-400'>Select a user to manage credits.</p>
                ) : (
                  <>
                    <div className='mb-4'>
                      <p className='text-sm text-gray-400'>Selected User</p>
                      <p className='font-semibold'>{selectedUser.email}</p>
                      <p className='text-sm text-gray-400'>Current Credits: {selectedUser.credits ?? 0}</p>
                    </div>

                    <div className='space-y-3'>
                      <input
                        type='number'
                        value={amountInput}
                        onChange={(e) => setAmountInput(e.target.value)}
                        placeholder='Amount'
                        className='w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-white'
                      />
                      <input
                        value={reasonInput}
                        onChange={(e) => setReasonInput(e.target.value)}
                        placeholder='Reason'
                        className='w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-white'
                      />
                      <div className='flex gap-2'>
                        <button
                          onClick={() => handleAdjustCredits("add")}
                          className='flex-1 px-4 py-2 rounded-md bg-green-600 text-white'
                        >
                          Add
                        </button>
                        <button
                          onClick={() => handleAdjustCredits("remove")}
                          className='flex-1 px-4 py-2 rounded-md bg-red-600 text-white'
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <section id='history' className='bg-slate-900 border border-slate-800 rounded-xl p-4'>
              <h3 className='text-lg font-semibold mb-4'>Credit History</h3>
              <div className='space-y-2 max-h-72 overflow-y-auto pr-1'>
                {creditHistory.length === 0 && <p className='text-gray-400'>No credit history yet.</p>}
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
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
