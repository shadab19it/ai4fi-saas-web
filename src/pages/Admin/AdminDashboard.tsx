import { useEffect, useState } from "react";
import { toast } from "sonner";
import adminService, { AdminTeam, AdminUser, CreditHistoryEntry } from "../../services/adminService";
import OverviewTab from "./components/OverviewTab";
import AnalyticsTab from "./components/AnalyticsTab";
import SettingsPanel from "../../components/Dashboard/SettingsPanel";
import TeamMembersPanel from "./components/TeamMembersPanel";
import AppHeader from "../../components/Layout/AppHeader";
import ManageCreditsPanel from "../../components/ui/ManageCreditsPanel";
import CreditHistoryList from "../../components/ui/CreditHistoryList";
import Pagination from "../../components/ui/Pagination";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  Building2,
  BarChart3,
  Settings,
  Search,
  Coins,
  UserCog,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  ShieldOff,
  UserCheck,
  UserX,
} from "lucide-react";
import Button from "../../components/ui/Button";

const DEFAULT_PAGE_SIZE = 20;

type NavPage = "overview" | "users" | "teams" | "analytics" | "settings";

const navItems: { id: NavPage; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutGrid className='h-4 w-4' /> },
  { id: "users", label: "Users", icon: <Users className='h-4 w-4' /> },
  { id: "teams", label: "Teams", icon: <Building2 className='h-4 w-4' /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 className='h-4 w-4' /> },
  { id: "settings", label: "Settings", icon: <Settings className='h-4 w-4' /> },
];

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
  const [teamLimitInput, setTeamLimitInput] = useState("");
  const [savingTeamLimit, setSavingTeamLimit] = useState(false);

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
  const [activeView, setActiveView] = useState<NavPage>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Action loading states
  const [togglingStatusId, setTogglingStatusId] = useState<string | null>(null);
  const [changingRoleId, setChangingRoleId] = useState<string | null>(null);

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
      setCreditHistory(result.user.effectiveCreditHistory || result.user.creditHistory || []);
      setTeamLimitInput(
        result.user.teamMemberLimit != null ? String(result.user.teamMemberLimit) : ""
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to load user");
    }
  };

  const handleSaveTeamMemberLimit = async (reset = false) => {
    if (!selectedUser) {
      toast.error("Select a user first");
      return;
    }
    if (selectedUser.teamRole !== "owner" || !selectedUser.teamId) {
      toast.error("Only team owners can have individual team limits");
      return;
    }

    if (!reset) {
      const parsed = Number(teamLimitInput);
      if (!Number.isFinite(parsed) || parsed < 1) {
        toast.error("Team member limit must be at least 1");
        return;
      }
    }

    setSavingTeamLimit(true);
    try {
      const payload = reset ? null : Number(teamLimitInput);
      const res = await adminService.updateUserTeamMemberLimit(selectedUser._id, payload);
      toast.success(res.message || "Team member limit updated");
      await fetchUserDetail(selectedUser._id);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update team member limit");
    } finally {
      setSavingTeamLimit(false);
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
      setCreditHistory(result.user.effectiveCreditHistory || result.user.creditHistory || []);
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

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    setTogglingStatusId(userId);
    try {
      const result = await adminService.toggleUserStatus(userId, !currentStatus);
      toast.success(result.message);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, isActive: !currentStatus } : u)));
      if (selectedUser?._id === userId) {
        setSelectedUser((prev) => prev ? { ...prev, isActive: !currentStatus } : prev);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setTogglingStatusId(null);
    }
  };

  const handleChangeUserRole = async (userId: string, newRole: "admin" | "user") => {
    setChangingRoleId(userId);
    try {
      const result = await adminService.updateUserRole(userId, newRole);
      toast.success(result.message);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      if (selectedUser?._id === userId) {
        setSelectedUser((prev) => prev ? { ...prev, role: newRole } : prev);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update role");
    } finally {
      setChangingRoleId(null);
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
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className='h-screen flex flex-col bg-[#F4F2EE]'>
      <AppHeader isAdmin={true} title="Admin Dashboard" onLogout={handleLogout} />

      <div className='flex flex-1 overflow-hidden'>
        {/* ─── Sidebar ──────────────────────────────────── */}
        <aside
          className={`hidden lg:flex lg:flex-col border-r border-[#E5E2DA] bg-white shrink-0 transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'w-[60px]' : 'w-[216px]'
          }`}
        >
          <nav className={`flex-1 py-[18px] space-y-0.5 ${sidebarCollapsed ? 'px-1.5' : 'px-3'}`}>
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center text-left rounded-[9px] text-[13.5px] transition-all ${
                    sidebarCollapsed ? 'justify-center px-0 py-[9px]' : 'gap-2.5 px-3 py-[9px]'
                  } ${
                    isActive
                      ? "bg-[#EEF3FF] text-[#0F62FE] font-bold"
                      : "text-[#6B6560] font-medium hover:bg-[#F9F8F5] hover:text-stone-900"
                  }`}
                >
                  <span className='shrink-0'>{item.icon}</span>
                  {!sidebarCollapsed && <span className='truncate'>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Collapse / Expand Toggle */}
          <div className={`border-t border-[#E5E2DA] ${sidebarCollapsed ? 'px-1.5' : 'px-3'} py-3`}>
            <Button
              variant='ghost'
              size='md'
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              icon={sidebarCollapsed ? <PanelLeftOpen className='h-4 w-4' /> : <PanelLeftClose className='h-4 w-4' />}
              className='w-full justify-center'
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {!sidebarCollapsed && 'Collapse'}
            </Button>
          </div>
        </aside>

        {/* ─── Main Content ─────────────────────────────── */}
        <main className='flex-1 overflow-y-auto p-[26px_32px]'>
          <div className='space-y-6'>
            {/* Render view based on activeView state */}
            {activeView === "overview" && <OverviewTab />}
            {activeView === "analytics" && <AnalyticsTab />}
            {activeView === "settings" && <SettingsPanel />}

            {/* ─── Users View ──────────────────────────── */}
            {activeView === "users" && (
              <>
                {/* Stats Row */}
                <div className='grid grid-cols-1 md:grid-cols-4 gap-3.5'>
                  {/* Total Users - Featured */}
                  <div className='relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-[#0F62FE] to-[#0047B3] shadow-[0_8px_24px_rgba(15,98,254,0.22)]'>
                    <div className='absolute -top-5 -right-5 w-[70px] h-[70px] rounded-full bg-white/[0.07] pointer-events-none' />
                    <div className='w-[34px] h-[34px] rounded-[9px] bg-white/20 flex items-center justify-center mb-3'>
                      <Users className='h-4 w-4 text-white' />
                    </div>
                    <p className='text-[10.5px] font-bold tracking-[0.9px] uppercase text-white/70 mb-1'>Total Users</p>
                    <p className='text-[30px] font-bold tracking-tight text-white leading-none mb-1'>{users.length}</p>
                    <p className='text-xs text-white/60'>Registered</p>
                  </div>

                  {/* Selected User */}
                  <div className='relative overflow-hidden rounded-2xl border border-[#E5E2DA] bg-white p-5 shadow-[0_1px_3px_rgba(28,25,23,0.06)]'>
                    <div className='absolute -top-5 -right-5 w-[70px] h-[70px] rounded-full bg-[#0F62FE]/[0.04] pointer-events-none' />
                    <div className='w-[34px] h-[34px] rounded-[9px] bg-[#EEF3FF] flex items-center justify-center mb-3'>
                      <UserCog className='h-4 w-4 text-[#0F62FE]' />
                    </div>
                    <p className='text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9E9893] mb-1'>Selected User</p>
                    <p className='text-lg font-bold text-stone-900 leading-tight truncate'>{selectedUser?.email?.split("@")[0] || "None"}</p>
                    <p className='text-xs text-[#9E9893] truncate'>{selectedUser?.email || "Select a user"}</p>
                  </div>

                  {/* User Credits */}
                  <div className='relative overflow-hidden rounded-2xl border border-[#E5E2DA] bg-white p-5 shadow-[0_1px_3px_rgba(28,25,23,0.06)]'>
                    <div className='absolute -top-5 -right-5 w-[70px] h-[70px] rounded-full bg-[#0F62FE]/[0.04] pointer-events-none' />
                    <div className='w-[34px] h-[34px] rounded-[9px] bg-emerald-50 flex items-center justify-center mb-3'>
                      <Coins className='h-4 w-4 text-emerald-600' />
                    </div>
                    <p className='text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9E9893] mb-1'>User Credits</p>
                    <p className='text-[30px] font-bold tracking-tight text-stone-900 leading-none mb-1'>
                      {selectedUser ? (selectedUser.effectiveCredits ?? selectedUser.credits ?? 0) : "—"}
                    </p>
                    <p className='text-xs text-[#9E9893]'>Current balance</p>
                  </div>

                  {/* Search */}
                  <div className='rounded-2xl border border-[#E5E2DA] bg-white p-4 shadow-[0_1px_3px_rgba(28,25,23,0.06)]'>
                    <p className='text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9E9893] mb-2'>Search Users</p>
                    <div className='flex gap-1.5'>
                      <div className='relative flex-1'>
                        <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9E9893] pointer-events-none' />
                        <input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); fetchUsers(); } }}
                          placeholder='Search...'
                          className='w-full h-9 pl-8 pr-3 rounded-lg border border-[#E5E2DA] bg-[#F9F8F5] text-[13px] text-stone-900 placeholder:text-[#9E9893] outline-none focus:border-[#0F62FE] focus:ring-2 focus:ring-[#0F62FE]/10 transition-all'
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main two-col */}
                <div className='grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-[18px]'>
                  {/* Users Table */}
                  <div className='rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] overflow-hidden'>
                    <div className='px-5 py-4 border-b border-[#E5E2DA] flex items-center justify-between'>
                      <span className='text-sm font-bold text-stone-900'>Users</span>
                      <span className='text-[11px] text-[#9E9893]'>
                        {loading ? "Loading..." : `${users.length} users`}
                      </span>
                    </div>
                    <div className='overflow-x-auto'>
                      <table className='w-full border-collapse'>
                        <thead>
                          <tr className='bg-[#F9F8F5]'>
                            <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA] whitespace-nowrap'>Email</th>
                            <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA] whitespace-nowrap'>Username</th>
                            <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA] whitespace-nowrap'>Role</th>
                            <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA] whitespace-nowrap'>Status</th>
                            <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA] whitespace-nowrap'>Credits</th>
                            <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA] whitespace-nowrap'>Team Limit</th>
                            <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA] whitespace-nowrap'>Created</th>
                            <th className='text-right text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA] whitespace-nowrap'>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.length === 0 && !loading && (
                            <tr>
                              <td className='px-4 py-6 text-[13px] text-[#9E9893]' colSpan={8}>
                                No users found.
                              </td>
                            </tr>
                          )}
                          {users.map((u) => (
                            <tr
                              key={u._id}
                              className={`border-b border-[#E5E2DA] cursor-pointer transition-colors ${
                                selectedUser?._id === u._id ? "bg-[#EEF3FF]" : "hover:bg-[#F9F8F5]"
                              }`}
                              onClick={() => fetchUserDetail(u._id)}
                            >
                              <td className='px-4 py-3.5 text-[13px] text-[#0F62FE] font-mono font-medium'>{u.email}</td>
                              <td className='px-4 py-3.5 text-[13.5px] text-stone-900'>{u.username || "-"}</td>
                              <td className='px-4 py-3.5'>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-[0.2px] border capitalize ${
                                  u.role === "admin"
                                    ? "bg-violet-50 text-violet-600 border-violet-200"
                                    : "bg-[#F9F8F5] text-[#6B6560] border-[#E5E2DA]"
                                }`}>
                                  {u.role || "user"}
                                </span>
                              </td>
                              <td className='px-4 py-3.5'>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                  u.isActive !== false
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                    : "bg-red-50 text-red-600 border-red-200"
                                }`}>
                                  {u.isActive !== false ? "Active" : "Disabled"}
                                </span>
                              </td>
                              <td className='px-4 py-3.5 text-[13.5px] font-mono font-semibold text-stone-900'>
                                {u.teamId ? (u.effectiveCredits ?? 0) : (u.credits ?? 0)}
                              </td>
                              <td className='px-4 py-3.5 text-[13px] text-stone-900 font-mono'>
                                {u.teamRole === "owner"
                                  ? (u.teamMemberLimit ?? "-")
                                  : <span className='text-[#9E9893] text-xs'>-</span>}
                              </td>
                              <td className='px-4 py-3.5 text-[13.5px] text-stone-900 font-mono'>{new Date(u.createdAt).toLocaleDateString()}</td>
                              <td className='px-4 py-3.5 text-right'>
                                <div className='inline-flex items-center gap-1.5'>
                                  <Button
                                    size='icon'
                                    loading={changingRoleId === u._id}
                                    onClick={(e) => { e.stopPropagation(); handleChangeUserRole(u._id, u.role === "admin" ? "user" : "admin"); }}
                                    title={u.role === "admin" ? "Demote to user" : "Promote to admin"}
                                    aria-label={u.role === "admin" ? "Demote to user" : "Promote to admin"}
                                    className={`w-[30px] h-[30px] ${
                                      u.role === "admin"
                                        ? "border-violet-200 bg-violet-50 text-violet-600 hover:bg-violet-100"
                                        : "border-[#E5E2DA] bg-white text-[#6B6560] hover:bg-[#F9F8F5] hover:text-stone-900"
                                    }`}
                                    icon={u.role === "admin" ? <ShieldOff className='h-3 w-3' /> : <ShieldCheck className='h-3 w-3' />}
                                  />
                                  <Button
                                    size='icon'
                                    loading={togglingStatusId === u._id}
                                    onClick={(e) => { e.stopPropagation(); handleToggleUserStatus(u._id, u.isActive !== false); }}
                                    title={u.isActive !== false ? "Disable user" : "Enable user"}
                                    aria-label={u.isActive !== false ? "Disable user" : "Enable user"}
                                    className={`w-[30px] h-[30px] ${
                                      u.isActive !== false
                                        ? "border-[#E5E2DA] bg-white text-[#6B6560] hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                        : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                    }`}
                                    icon={u.isActive !== false ? <UserX className='h-3 w-3' /> : <UserCheck className='h-3 w-3' />}
                                  />
                                  <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={(e) => { e.stopPropagation(); fetchUserDetail(u._id); }}
                                    className='h-[30px]'
                                  >
                                    Manage
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Pagination */}
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      onPrev={() => setPage((prev) => Math.max(prev - 1, 1))}
                      onNext={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    />
                  </div>

                  <div className='flex flex-col gap-[18px]'>
                    {/* User Actions Panel */}
                    {selectedUser && (
                      <div className='rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] overflow-hidden'>
                        <div className='px-5 py-4 border-b border-[#E5E2DA]'>
                          <h3 className='text-sm font-bold text-stone-900'>User Actions</h3>
                          <p className='text-[11px] text-[#9E9893] mt-0.5 font-mono truncate'>{selectedUser.email}</p>
                        </div>
                        <div className='p-4 space-y-3'>
                          {/* Status info */}
                          <div className='flex items-center justify-between'>
                            <span className='text-[11.5px] font-semibold text-[#9E9893]'>Status</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              selectedUser.isActive !== false
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                : "bg-red-50 text-red-600 border-red-200"
                            }`}>
                              {selectedUser.isActive !== false ? "Active" : "Disabled"}
                            </span>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-[11.5px] font-semibold text-[#9E9893]'>Role</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${
                              selectedUser.role === "admin"
                                ? "bg-violet-50 text-violet-600 border-violet-200"
                                : "bg-[#F9F8F5] text-[#6B6560] border-[#E5E2DA]"
                            }`}>
                              {selectedUser.role || "user"}
                            </span>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-[11.5px] font-semibold text-[#9E9893]'>Verified</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              selectedUser.isVerified
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                : "bg-amber-50 text-amber-600 border-amber-200"
                            }`}>
                              {selectedUser.isVerified ? "Yes" : "No"}
                            </span>
                          </div>
                          {selectedUser.teamRole === "owner" && selectedUser.teamId && (
                            <div className='border border-[#E5E2DA] rounded-xl p-3 bg-[#F9F8F5]'>
                              <p className='text-[11.5px] font-semibold text-stone-900 mb-1'>Team Member Limit</p>
                              <p className='text-[11px] text-[#9E9893] mb-2'>
                                Manage limit for this owner&apos;s team (individual override).
                              </p>
                              <div className='flex items-center gap-2'>
                                <input
                                  type='number'
                                  min={1}
                                  value={teamLimitInput}
                                  onChange={(e) => setTeamLimitInput(e.target.value)}
                                  className='w-[200px] h-8 px-2.5 rounded-lg border border-[#E5E2DA] bg-white text-[13px] text-stone-900 outline-none focus:border-[#0F62FE] transition-all'
                                />
                                <Button
                                  size='sm'
                                  loading={savingTeamLimit}
                                  onClick={() => handleSaveTeamMemberLimit(false)}
                                  className='h-8'
                                >
                                  Save
                                </Button>
                              </div>
                              <p className='text-[10px] text-[#9E9893] mt-2'>
                                Source: {selectedUser.teamMemberLimitSource || "plan/global fallback"}
                              </p>
                            </div>
                          )}
                          <div className='border-t border-[#E5E2DA] pt-3 flex flex-col gap-2'>
                            <Button
                              variant='outline'
                              size='md'
                              onClick={() => handleChangeUserRole(selectedUser._id, selectedUser.role === "admin" ? "user" : "admin")}
                              loading={changingRoleId === selectedUser._id}
                              icon={changingRoleId !== selectedUser._id ? (selectedUser.role === "admin" ? <ShieldOff className='h-3.5 w-3.5' /> : <ShieldCheck className='h-3.5 w-3.5' />) : undefined}
                              className='w-full h-9'
                            >
                              {selectedUser.role === "admin" ? "Demote to User" : "Promote to Admin"}
                            </Button>
                            <Button
                              size='md'
                              onClick={() => handleToggleUserStatus(selectedUser._id, selectedUser.isActive !== false)}
                              loading={togglingStatusId === selectedUser._id}
                              icon={togglingStatusId !== selectedUser._id ? (selectedUser.isActive !== false ? <UserX className='h-3.5 w-3.5' /> : <UserCheck className='h-3.5 w-3.5' />) : undefined}
                              className={`w-full h-9 ${
                                selectedUser.isActive !== false
                                  ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                                  : "border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                              }`}
                            >
                              {selectedUser.isActive !== false ? "Disable User" : "Enable User"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Manage Credits Panel */}
                    <ManageCreditsPanel
                      title='Manage Credits'
                      hasSelection={!!selectedUser}
                      entityLabel={selectedUser?.email || ''}
                      entitySubLabel='Selected User'
                      creditsDisplay={
                        selectedUser?.teamId ? (
                          <span className='text-stone-900 font-mono'>
                            {selectedUser?.effectiveCredits ?? 0} <em className='text-[#9E9893] text-xs'>team wallet</em>
                          </span>
                        ) : (
                          <strong className='text-stone-900 font-mono'>{selectedUser?.credits ?? 0}</strong>
                        )
                      }
                      amountInput={amountInput}
                      onAmountChange={setAmountInput}
                      reasonInput={reasonInput}
                      onReasonChange={setReasonInput}
                      onAdd={() => handleAdjustCredits("add")}
                      onRemove={() => handleAdjustCredits("remove")}
                      disabled={!!selectedUser?.teamId}
                      warning={selectedUser?.teamId ? "This user uses a team wallet — individual credits cannot be adjusted." : undefined}
                      emptyMessage='Select a user to manage credits.'
                    />
                    <CreditHistoryList
                      title={selectedUser?.teamId ? "Wallet Credit History (Team)" : "Credit History"}
                      entries={creditHistory}
                      variant='compact'
                    />
                  </div>
                </div>
              </>
            )}

            {/* ─── Teams View ──────────────────────────── */}
            {activeView === "teams" && (
              <>
                {/* Stats Row */}
                <div className='grid grid-cols-1 md:grid-cols-4 gap-3.5'>
                  {/* Total Teams - Featured */}
                  <div className='relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-[#0F62FE] to-[#0047B3] shadow-[0_8px_24px_rgba(15,98,254,0.22)]'>
                    <div className='absolute -top-5 -right-5 w-[70px] h-[70px] rounded-full bg-white/[0.07] pointer-events-none' />
                    <div className='w-[34px] h-[34px] rounded-[9px] bg-white/20 flex items-center justify-center mb-3'>
                      <Building2 className='h-4 w-4 text-white' />
                    </div>
                    <p className='text-[10.5px] font-bold tracking-[0.9px] uppercase text-white/70 mb-1'>Total Teams</p>
                    <p className='text-[30px] font-bold tracking-tight text-white leading-none mb-1'>{teams.length}</p>
                    <p className='text-xs text-white/60'>Active teams</p>
                  </div>

                  {/* Selected Team */}
                  <div className='relative overflow-hidden rounded-2xl border border-[#E5E2DA] bg-white p-5 shadow-[0_1px_3px_rgba(28,25,23,0.06)]'>
                    <div className='absolute -top-5 -right-5 w-[70px] h-[70px] rounded-full bg-[#0F62FE]/[0.04] pointer-events-none' />
                    <div className='w-[34px] h-[34px] rounded-[9px] bg-[#EEF3FF] flex items-center justify-center mb-3'>
                      <UserCog className='h-4 w-4 text-[#0F62FE]' />
                    </div>
                    <p className='text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9E9893] mb-1'>Selected Team</p>
                    <p className='text-lg font-bold text-stone-900 leading-tight truncate'>{selectedTeam?.name || "None"}</p>
                    <p className='text-xs text-[#9E9893]'>
                      {selectedTeam ? `Owner: ${typeof selectedTeam.ownerId === 'string' ? 'Unknown' : selectedTeam.ownerId?.email?.split('@')[0]}` : 'Select a team'}
                    </p>
                  </div>

                  {/* Team Credits */}
                  <div className='relative overflow-hidden rounded-2xl border border-[#E5E2DA] bg-white p-5 shadow-[0_1px_3px_rgba(28,25,23,0.06)]'>
                    <div className='absolute -top-5 -right-5 w-[70px] h-[70px] rounded-full bg-[#0F62FE]/[0.04] pointer-events-none' />
                    <div className='w-[34px] h-[34px] rounded-[9px] bg-emerald-50 flex items-center justify-center mb-3'>
                      <Coins className='h-4 w-4 text-emerald-600' />
                    </div>
                    <p className='text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9E9893] mb-1'>Team Credits</p>
                    <p className='text-[30px] font-bold tracking-tight text-stone-900 leading-none mb-1'>{selectedTeam?.credits || 0}</p>
                    <p className='text-xs text-[#9E9893]'>Current balance</p>
                  </div>

                  {/* Search */}
                  <div className='rounded-2xl border border-[#E5E2DA] bg-white p-4 shadow-[0_1px_3px_rgba(28,25,23,0.06)]'>
                    <p className='text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9E9893] mb-2'>Search Teams</p>
                    <div className='flex gap-1.5'>
                      <div className='relative flex-1'>
                        <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9E9893] pointer-events-none' />
                        <input
                          value={teamSearch}
                          onChange={(e) => setTeamSearch(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { setTeamPage(1); fetchTeams(); } }}
                          placeholder='Search teams...'
                          className='w-full h-9 pl-8 pr-3 rounded-lg border border-[#E5E2DA] bg-[#F9F8F5] text-[13px] text-stone-900 placeholder:text-[#9E9893] outline-none focus:border-[#0F62FE] focus:ring-2 focus:ring-[#0F62FE]/10 transition-all'
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-[18px]'>
                  {/* Left column */}
                  <div className='flex flex-col gap-[18px]'>
                    {/* Teams Table */}
                    <div className='rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] overflow-hidden'>
                      <div className='px-5 py-4 border-b border-[#E5E2DA] flex items-center justify-between'>
                        <span className='text-sm font-bold text-stone-900'>Teams</span>
                        <div className='flex items-center gap-1.5'>
                          <input
                            value={teamSearch}
                            onChange={(e) => setTeamSearch(e.target.value)}
                            placeholder='Search by team name...'
                            className='w-[200px] h-9 px-3 rounded-lg border border-[#E5E2DA] bg-[#F9F8F5] text-[13px] text-stone-900 placeholder:text-[#9E9893] outline-none focus:border-[#0F62FE] focus:ring-2 focus:ring-[#0F62FE]/10 transition-all'
                          />
                          <button
                            onClick={() => { setTeamPage(1); fetchTeams(); }}
                            className='h-[30px] px-3 rounded-lg bg-[#0F62FE] text-white text-xs font-semibold hover:bg-[#0047B3] shadow-[0_1px_3px_rgba(15,98,254,0.28)] transition-all'
                          >
                            Search
                          </button>
                        </div>
                      </div>
                      <div className='overflow-x-auto'>
                        <table className='w-full border-collapse'>
                          <thead>
                            <tr className='bg-[#F9F8F5]'>
                              <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA] whitespace-nowrap'>Team</th>
                              <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA] whitespace-nowrap'>Owner</th>
                              <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA] whitespace-nowrap'>Credits</th>
                              <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA] whitespace-nowrap'>Created</th>
                              <th className='text-right text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA] whitespace-nowrap'>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {teams.length === 0 && !teamsLoading && (
                              <tr>
                                <td className='px-4 py-6 text-[13px] text-[#9E9893]' colSpan={5}>No teams found.</td>
                              </tr>
                            )}
                            {teams.map((team) => {
                              const owner = typeof team.ownerId === "string" ? null : team.ownerId;
                              return (
                                <tr
                                  key={team._id}
                                  className={`border-b border-[#E5E2DA] cursor-pointer transition-colors ${
                                    selectedTeam?._id === team._id ? "bg-[#EEF3FF]" : "hover:bg-[#F9F8F5]"
                                  }`}
                                  onClick={() => fetchTeamDetail(team._id)}
                                >
                                  <td className='px-4 py-3.5 text-[13.5px] font-semibold text-stone-900'>{team.name}</td>
                                  <td className='px-4 py-3.5 text-[13.5px] text-stone-900 font-mono'>{owner?.email || "Unknown"}</td>
                                  <td className='px-4 py-3.5 text-[13.5px] font-mono font-bold text-stone-900'>{team.credits ?? 0}</td>
                                  <td className='px-4 py-3.5 text-[13.5px] text-stone-900 font-mono'>{new Date(team.createdAt).toLocaleDateString()}</td>
                                  <td className='px-4 py-3.5 text-right'>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); fetchTeamDetail(team._id); }}
                                      className='h-[30px] px-2.5 rounded-lg border border-[#E5E2DA] bg-white text-xs font-semibold text-[#6B6560] hover:bg-[#F9F8F5] hover:text-stone-900 transition-all'
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
                      {/* Pagination */}
                      <Pagination
                        page={teamPage}
                        totalPages={teamTotalPages}
                        onPrev={() => setTeamPage((prev) => Math.max(prev - 1, 1))}
                        onNext={() => setTeamPage((prev) => Math.min(prev + 1, teamTotalPages))}
                      />
                    </div>

                    {/* Team Members */}
                    <TeamMembersPanel selectedTeam={selectedTeam} />

                    {/* Credit History */}
                    <CreditHistoryList
                      title='Credit History'
                      entries={creditHistory}
                      variant='compact'
                    />

                    {/* Team Credit History */}
                    <CreditHistoryList
                      title='Team Credit History'
                      entries={teamCreditHistory}
                      variant='compact'
                    />
                  </div>

                  {/* Right: Manage Team Credits */}
                  <ManageCreditsPanel
                    title='Manage Team Credits'
                    hasSelection={!!selectedTeam}
                    entityLabel={selectedTeam?.name || ''}
                    entitySubLabel='Selected Team'
                    creditsDisplay={
                      <strong className='text-stone-900 font-mono'>{selectedTeam?.credits ?? 0}</strong>
                    }
                    amountInput={teamAmountInput}
                    onAmountChange={setTeamAmountInput}
                    reasonInput={teamReasonInput}
                    onReasonChange={setTeamReasonInput}
                    onAdd={() => handleAdjustTeamCredits("add")}
                    onRemove={() => handleAdjustTeamCredits("remove")}
                    emptyMessage='Select a team to manage credits.'
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
