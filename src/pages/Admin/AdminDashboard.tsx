import { useEffect, useState } from "react";
import { toast } from "sonner";
import adminService, { AdminTeam, AdminUser, CreditHistoryEntry } from "../../services/adminService";
import OverviewTab from "./components/OverviewTab";
import AnalyticsTab from "./components/AnalyticsTab";
import SettingsPanel from "../../components/Dashboard/SettingsPanel";
import TeamMembersPanel from "./components/TeamMembersPanel";
import AppHeader from "../../components/Layout/AppHeader";
import { useNavigate } from "react-router-dom";
import { BarChart, Building2, PanelsTopLeft, Settings, Users } from "lucide-react";

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

  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [teamSearch, setTeamSearch] = useState("");
  const [teamPage, setTeamPage] = useState(1);
  const [teamTotalPages, setTeamTotalPages] = useState(1);
  const [selectedTeam, setSelectedTeam] = useState<AdminTeam | null>(null);
  const [teamCreditHistory, setTeamCreditHistory] = useState<CreditHistoryEntry[]>([]);
  const [teamAmountInput, setTeamAmountInput] = useState("");
  const [teamReasonInput, setTeamReasonInput] = useState("");

  // Active view state
  const [activeView, setActiveView] = useState<"overview" | "users" | "teams" | "analytics" | "settings">("overview");

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

  const fetchTeams = async () => {
    try {
      setTeamsLoading(true);
      const result = await adminService.getTeams(teamSearch, teamPage, DEFAULT_PAGE_SIZE);
      setTeams(result.teams || []);
      setTeamTotalPages(result.totalPages || 1);
    } catch (error: any) {
      toast.error(error.message || "Failed to load teams");
    } finally {
      setTeamsLoading(false);
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

  const fetchTeamDetail = async (teamId: string) => {
    try {
      const result = await adminService.getTeam(teamId);
      setSelectedTeam(result.team);
      setTeamCreditHistory(result.team.creditHistory || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load team");
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

  const handleAdjustTeamCredits = async (direction: "add" | "remove") => {
    if (!selectedTeam) {
      toast.error("Select a team first");
      return;
    }

    const parsedAmount = Number(teamAmountInput);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    const signedAmount = direction === "add" ? parsedAmount : -parsedAmount;

    try {
      const result = await adminService.adjustTeamCredits(selectedTeam._id, signedAmount, teamReasonInput || "Admin adjustment");
      toast.success(result.message || "Credits updated");
      setSelectedTeam(result.team);
      setTeamCreditHistory(result.team.creditHistory || []);
      setTeamAmountInput("");
      setTeamReasonInput("");
      fetchTeams();
    } catch (error: any) {
      toast.error(error.message || "Failed to update team credits");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  useEffect(() => {
    fetchTeams();
  }, [teamPage]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className='min-h-screen bg-slate-950 text-white'>
      <AppHeader isAdmin={true} onLogout={handleLogout} />
      <div className='flex min-h-[calc(100vh-4rem)]'>
        <aside className='hidden lg:flex lg:w-72 lg:flex-col border-r border-slate-800 bg-slate-950'>
          <nav className='flex-1 px-4 py-6 space-y-2'>
            <button
              onClick={() => setActiveView("overview")}
              className={`w-full flex gap-2 items-center text-left px-4 py-2 rounded-lg ${
                activeView === "overview" ? "bg-slate-900 text-white" : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              <PanelsTopLeft className='h-4 w-4' />
            <span>Overview</span> 
            </button>
            <button
              onClick={() => setActiveView("users")}
              className={`w-full flex gap-2 items-center text-left px-4 py-2 rounded-lg ${
                activeView === "users" ? "bg-slate-900 text-white" : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              <Users className='h-4 w-4' />
            <span>Users</span> 
            </button>
            <button
              onClick={() => setActiveView("teams")}
              className={`w-full flex gap-2 items-center text-left px-4 py-2 rounded-lg ${
                activeView === "teams" ? "bg-slate-900 text-white" : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              <Building2 className='h-4 w-4' />
            <span>Teams</span> 
            </button>
            <button
              onClick={() => setActiveView("analytics")}
              className={`w-full flex gap-2 items-center text-left px-4 py-2 rounded-lg ${
                activeView === "analytics" ? "bg-slate-900 text-white" : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              <BarChart className='h-4 w-4' />
            <span>Analytics</span> 
            </button>
            <button
              onClick={() => setActiveView("settings")}
              className={`w-full flex gap-2 items-center text-left px-4 py-2 rounded-lg ${
                activeView === "settings" ? "bg-slate-900 text-white" : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              <Settings className='h-4 w-4' />
            <span>Settings</span> 
            </button>
          </nav>
        </aside>

        <main className='flex-1 overflow-y-auto'>
          <header className='px-6 py-6 border-b border-slate-800 bg-slate-950'>
            <div>
              <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
              <p className='mt-1 text-slate-400'>
                {activeView === 'overview' && 'Platform overview and statistics'}
                {activeView === 'users' && 'Manage users and adjust credits'}
                {activeView === 'teams' && 'Manage teams and adjust credits'}
                {activeView === 'analytics' && 'Platform analytics and insights'}
                {activeView === 'settings' && 'System configuration and settings'}
              </p>
            </div>
          </header>

          <div className='px-6 py-6 space-y-6'>
            {/* Render view based on activeView state */}
            {activeView === "overview" && <OverviewTab />}
            {activeView === "analytics" && <AnalyticsTab />}
            {activeView === "settings" && <SettingsPanel />}
            
            {/* Users View */}
            {activeView === "users" && (
              <>
                <section className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                  <div className='rounded-xl border border-slate-800 bg-slate-900 p-4'>
                    <p className='text-sm text-slate-400'>Total Users</p>
                    <p className='text-2xl font-semibold'>{users.length}</p>
                  </div>
                  <div className='rounded-xl border border-slate-800 bg-slate-900 p-4'>
                    <p className='text-sm text-slate-400'>Selected User</p>
                    <p className='text-lg font-semibold'>{selectedUser?.email || "None"}</p>
                  </div>
                  <div className='rounded-xl border border-slate-800 bg-slate-900 p-4'>
                    <p className='text-sm text-slate-400'>User Credits</p>
                    <p className='text-2xl font-semibold'>{selectedUser?.credits || 0}</p>
                  </div>
                  <div className='rounded-xl border border-slate-800 bg-slate-900 p-4'>
                    <div className='flex gap-3'>
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='Search users'
                        className='flex-1 px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-white text-sm'
                      />
                      <button
                        onClick={() => {
                          setPage(1);
                          fetchUsers();
                        }}
                        className='px-3 py-2 rounded-md bg-cyan-600 text-white text-sm'
                      >
                        Search
                      </button>
                    </div>
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
                    <td className='py-3'>
                      {user.teamId ? "Team wallet" : user.credits ?? 0}
                    </td>
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
                      <p className='text-sm text-gray-400'>
                        Current Credits: {selectedUser.teamId ? "Team wallet" : selectedUser.credits ?? 0}
                      </p>
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
              </>
            )}

            {/* Teams View */}
            {activeView === "teams" && (
              <>
                <section className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                  <div className='rounded-xl border border-slate-800 bg-slate-900 p-4'>
                    <p className='text-sm text-slate-400'>Total Teams</p>
                    <p className='text-2xl font-semibold'>{teams.length}</p>
                  </div>
                  <div className='rounded-xl border border-slate-800 bg-slate-900 p-4'>
                    <p className='text-sm text-slate-400'>Selected Team</p>
                    <p className='text-lg font-semibold'>{selectedTeam?.name || "None"}</p>
                  </div>
                  <div className='rounded-xl border border-slate-800 bg-slate-900 p-4'>
                    <p className='text-sm text-slate-400'>Team Credits</p>
                    <p className='text-2xl font-semibold'>{selectedTeam?.credits || 0}</p>
                  </div>
                  <div className='rounded-xl border border-slate-800 bg-slate-900 p-4'>
                    <div className='flex gap-3'>
                      <input
                        value={teamSearch}
                        onChange={(e) => setTeamSearch(e.target.value)}
                        placeholder='Search teams'
                        className='flex-1 px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-white text-sm'
                      />
                      <button
                        onClick={() => {
                          setTeamPage(1);
                          fetchTeams();
                        }}
                        className='px-3 py-2 rounded-md bg-cyan-600 text-white text-sm'
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </section>

            <div id='teams' className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <div className='lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-xl font-semibold'>Teams</h2>
                  {teamsLoading && <span className='text-sm text-gray-400'>Loading...</span>}
                </div>
                <div className='flex flex-wrap items-center gap-3 mb-4'>
                  <input
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                    placeholder='Search by team name'
                    className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-white'
                  />
                  <button
                    onClick={() => {
                      setTeamPage(1);
                      fetchTeams();
                    }}
                    className='px-4 py-2 rounded-md bg-cyan-600 text-white'
                  >
                    Search
                  </button>
                </div>
                <div className='overflow-x-auto'>
                  <table className='w-full text-left'>
                    <thead className='text-gray-400 border-b border-gray-800'>
                      <tr>
                        <th className='py-2'>Team</th>
                        <th className='py-2'>Owner</th>
                        <th className='py-2'>Credits</th>
                        <th className='py-2'>Created</th>
                        <th className='py-2'></th>
                      </tr>
                    </thead>
                    <tbody>
                      {teams.length === 0 && !teamsLoading && (
                        <tr>
                          <td className='py-4 text-gray-400' colSpan={5}>
                            No teams found.
                          </td>
                        </tr>
                      )}
                      {teams.map((team) => {
                        const owner = typeof team.ownerId === "string" ? null : team.ownerId;
                        return (
                          <tr key={team._id} className='border-b border-gray-800 hover:bg-gray-800/30'>
                            <td className='py-3'>{team.name}</td>
                            <td className='py-3'>{owner?.email || "Unknown"}</td>
                            <td className='py-3'>{team.credits ?? 0}</td>
                            <td className='py-3'>{new Date(team.createdAt).toLocaleDateString()}</td>
                            <td className='py-3'>
                              <button
                                onClick={() => fetchTeamDetail(team._id)}
                                className='px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600'
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className='flex items-center justify-between mt-4'>
                  <button
                    disabled={teamPage <= 1}
                    onClick={() => setTeamPage((prev) => Math.max(prev - 1, 1))}
                    className='px-3 py-1 rounded-md bg-slate-700 disabled:opacity-50'
                  >
                    Previous
                  </button>
                  <span className='text-sm text-gray-400'>
                    Page {teamPage} of {teamTotalPages}
                  </span>
                  <button
                    disabled={teamPage >= teamTotalPages}
                    onClick={() => setTeamPage((prev) => Math.min(prev + 1, teamTotalPages))}
                    className='px-3 py-1 rounded-md bg-slate-700 disabled:opacity-50'
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className='bg-slate-900 border border-slate-800 rounded-xl p-4'>
                <h2 className='text-xl font-semibold mb-4'>Manage Team Credits</h2>
                {!selectedTeam ? (
                  <p className='text-gray-400'>Select a team to manage credits.</p>
                ) : (
                  <>
                    <div className='mb-4'>
                      <p className='text-sm text-gray-400'>Selected Team</p>
                      <p className='font-semibold'>{selectedTeam.name}</p>
                      <p className='text-sm text-gray-400'>Current Credits: {selectedTeam.credits ?? 0}</p>
                    </div>

                    <div className='space-y-3'>
                      <input
                        type='number'
                        value={teamAmountInput}
                        onChange={(e) => setTeamAmountInput(e.target.value)}
                        placeholder='Amount'
                        className='w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-white'
                      />
                      <input
                        value={teamReasonInput}
                        onChange={(e) => setTeamReasonInput(e.target.value)}
                        placeholder='Reason'
                        className='w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-white'
                      />
                      <div className='flex gap-2'>
                        <button
                          onClick={() => handleAdjustTeamCredits("add")}
                          className='flex-1 px-4 py-2 rounded-md bg-green-600 text-white'
                        >
                          Add
                        </button>
                        <button
                          onClick={() => handleAdjustTeamCredits("remove")}
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

            <TeamMembersPanel selectedTeam={selectedTeam} />

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

            <section id='team-history' className='bg-slate-900 border border-slate-800 rounded-xl p-4'>
              <h3 className='text-lg font-semibold mb-4'>Team Credit History</h3>
              <div className='space-y-2 max-h-72 overflow-y-auto pr-1'>
                {teamCreditHistory.length === 0 && <p className='text-gray-400'>No team credit history yet.</p>}
                {teamCreditHistory.map((entry, index) => (
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
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
