import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setUser } from "../store/userReducer";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import teamService, { Team, TeamInvite } from "../services/teamService";
import authService from "../services/authService";
import AppHeader from "../components/Layout/AppHeader";
import StatsCard from "../components/Dashboard/StatsCard";
import ConfirmModal from "../components/ui/ConfirmModal";
import CreditHistoryList, { CreditHistoryEntry } from "../components/ui/CreditHistoryList";
import Pagination from "../components/ui/Pagination";
import { getRoleBadgeClasses } from "../constants/theme";
import {
  Coins,
  Users,
  Activity,
  Mail,
  Send,
  Trash2,
  Pencil,
  AlertTriangle,
  Loader2,
  Check,
  X,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Button from "../components/ui/Button";

const CreditsPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isLoadingTeam, setIsLoadingTeam] = useState(true);
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [resendingInviteId, setResendingInviteId] = useState<string | null>(null);
  const [cancellingInviteId, setCancellingInviteId] = useState<string | null>(null);
  const [membersPage, setMembersPage] = useState(1);

  // Profile edit state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Modal states
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; name: string; email: string } | null>(null);

  const loadTeam = async () => {
    if (!user) return;
    setIsLoadingTeam(true);
    try {
      const data = await teamService.getTeam();
      setTeam(data.team);
      setInvites(data.invites || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load team");
    } finally {
      setIsLoadingTeam(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, [user?.teamId]);

  const creditHistory: CreditHistoryEntry[] = (team?.creditHistory.slice().reverse() || user?.creditHistory?.slice().reverse() || []) as CreditHistoryEntry[];
  const creditsBalance = team?.credits ?? user?.credits ?? 0;
  const canManageTeam = user?.teamRole === "owner" || user?.teamRole === "admin";
  const isOwner = user?.teamRole === "owner";

  const handleInviteSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    setIsSendingInvite(true);
    try {
      await teamService.inviteMember(inviteEmail.trim());
      setInviteEmail("");
      toast.success("Invite sent");
      await loadTeam();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send invite");
    } finally {
      setIsSendingInvite(false);
    }
  };

  const handleRemoveMember = (memberId: string, memberName: string, memberEmail: string) => {
    setMemberToRemove({ id: memberId, name: memberName, email: memberEmail });
    setShowRemoveModal(true);
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;
    try {
      await teamService.removeMember(memberToRemove.id);
      toast.success(`${memberToRemove.name} has been removed`);
      setShowRemoveModal(false);
      setMemberToRemove(null);
      await loadTeam();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove member");
    }
  };

  const handleUpdateRole = async (memberId: string, role: "admin" | "member") => {
    try {
      await teamService.updateMemberRole(memberId, role);
      toast.success("Role updated");
      await loadTeam();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update role");
    }
  };

  const handleResendInvite = async (inviteId: string) => {
    setResendingInviteId(inviteId);
    try {
      await teamService.resendInvite(inviteId);
      toast.success("Invite resent");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to resend invite");
    } finally {
      setResendingInviteId(null);
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    setCancellingInviteId(inviteId);
    try {
      await teamService.cancelInvite(inviteId);
      await loadTeam();
      toast.success("Invite cancelled");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel invite");
    } finally {
      setCancellingInviteId(null);
    }
  };

  const handleLeaveTeam = () => {
    setShowLeaveModal(true);
  };

  const confirmLeaveTeam = async () => {
    try {
      await teamService.leaveTeam();
      toast.success("You have left the team");
      setShowLeaveModal(false);
      await loadTeam();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to leave team");
    }
  };

  const handleExport = () => {
    const csv = [
      "Type,Amount,Balance,Date,Reason",
      ...creditHistory.map((t) =>
        `${t.type},${t.amount},${t.balance},"${new Date(t.createdAt).toLocaleString()}","${t.reason || ''}"`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "credit-history.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export downloaded");
  };

  const displayName = user?.username || user?.email || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleStartEditName = () => {
    setEditName(user?.username || "");
    setIsEditingName(true);
  };

  const handleSaveProfile = async () => {
    const trimmed = editName.trim();
    if (!trimmed || trimmed.length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    setIsSavingProfile(true);
    try {
      const result = await authService.updateProfile(trimmed);
      dispatch(setUser(result.user));
      toast.success("Profile updated");
      setIsEditingName(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsChangingPassword(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success("Password updated successfully");
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className='h-screen flex flex-col bg-[#F5F3EF]'>
      <AppHeader title="My Credits" onLogout={handleLogout} />

      <main className='flex-1 overflow-y-auto p-7'>
          {isLoadingTeam ? (
            <div className='animate-pulse space-y-6'>
              <div className='flex items-start justify-between'>
                <div className='space-y-2'>
                  <div className='h-3 w-24 bg-[#E5E2DA] rounded' />
                  <div className='h-7 w-48 bg-[#E5E2DA] rounded' />
                  <div className='h-4 w-72 bg-[#E5E2DA] rounded' />
                </div>
                <div className='h-9 w-32 bg-[#E5E2DA] rounded-lg' />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-4 gap-3.5'>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className='h-28 bg-white rounded-2xl border border-[#E5E2DA]' />
                ))}
              </div>
              <div className='grid grid-cols-1 lg:grid-cols-[1fr_330px] gap-5'>
                <div className='h-64 bg-white rounded-2xl border border-[#E5E2DA]' />
                <div className='space-y-4'>
                  <div className='h-48 bg-white rounded-2xl border border-[#E5E2DA]' />
                  <div className='h-40 bg-white rounded-2xl border border-[#E5E2DA]' />
                </div>
              </div>
            </div>
          ) : (
          <>
          {/* Page Header */}
          <div className='flex items-start justify-between mb-7'>
            <div>
              <p className='text-[11px] font-bold tracking-[1.2px] uppercase text-[#2563EB] mb-1'>Credits & Team</p>
              <h1 className='text-[26px] font-bold text-stone-900 tracking-tight leading-tight'>My Credits</h1>
              <p className='text-[13.5px] text-[#6B6560] mt-1'>Manage your team, view balance, and track credit usage.</p>
            </div>
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200'>
                <Coins className='h-3.5 w-3.5 text-[#2563EB]' />
                <span className='text-[13px] font-bold text-[#2563EB] font-mono'>{creditsBalance}</span>
                <span className='text-[11px] text-[#6B6560]'>credits</span>
              </div>
            </div>
          </div>

          {/* ─── Stats Grid (using reusable StatsCard) ──── */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-3.5 mb-6'>
            <StatsCard
              title='Team Credits'
              value={creditsBalance}
              icon={Coins}
              description='Current balance'
              featured
            />
            <StatsCard
              title='Members'
              value={team?.members?.length ?? 0}
              icon={Users}
              description='Active in team'
              iconBgClass='bg-emerald-50'
              iconColorClass='text-emerald-600'
            />
            <StatsCard
              title='Transactions'
              value={creditHistory.length}
              icon={Activity}
              description='Credit history entries'
              iconBgClass='bg-amber-50'
              iconColorClass='text-amber-600'
            />
            <StatsCard
              title='Pending Invites'
              value={invites.length}
              icon={Mail}
              description={invites.length === 0 ? "No invites pending" : `${invites.length} awaiting`}
              iconBgClass='bg-violet-50'
              iconColorClass='text-violet-600'
            />
          </div>

          {/* ─── Two Column: Members Table + Side Panel ──── */}
          <div className='grid grid-cols-1 lg:grid-cols-[1fr_330px] gap-5 mb-5 '>
            {/* Members Table */}
            <div className='rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(26,23,20,0.06)] overflow-hidden'>
              {/* Header */}
              <div className='px-5 py-[18px] border-b border-[#E5E2DA] flex items-center justify-between'>
                <div>
                  <h3 className='text-sm font-bold text-stone-900'>Team Members</h3>
                  <p className='text-xs text-[#9E9893] mt-0.5'>
                    {team ? `${team.name} · ${team.members.length} active members` : "No team yet"}
                  </p>
                </div>
                {user?.teamRole !== "owner" && team && (
                  <button
                    onClick={handleLeaveTeam}
                    className='text-xs font-semibold text-red-600 border border-red-200 bg-red-50 rounded-md px-2.5 py-1 hover:bg-red-100 transition-all'
                  >
                    Leave team
                  </button>
                )}
              </div>

              {!team ? (
                <div className='p-6 text-center text-[13px] text-[#9E9893]'>No team members yet.</div>
              ) : (
                <>
                <div className='overflow-x-auto'>
                  <table className='w-full border-collapse'>
                    <thead>
                      <tr className='bg-[#F9F8F5]'>
                        <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-[18px] py-2.5 border-b border-[#E5E2DA]'>Member</th>
                        <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-[18px] py-2.5 border-b border-[#E5E2DA]'>Role</th>
                        <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-[18px] py-2.5 border-b border-[#E5E2DA]'>Joined</th>
                        <th className='text-right text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-[18px] py-2.5 border-b border-[#E5E2DA]'>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {team.members.slice((membersPage - 1) * 5, membersPage * 5).map((member) => {
                        const memberUser = typeof member.userId === "string" ? null : member.userId;
                        const memberDisplayName = memberUser?.username || memberUser?.email || "Unknown member";
                        const memberKey = typeof member.userId === "string" ? member.userId : member.userId._id;
                        const memberInitials = memberDisplayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

                        return (
                          <tr key={`${memberKey}-${member.joinedAt}`} className='border-b border-[#E5E2DA] hover:bg-[#F9F8F5] transition-colors'>
                            <td className='px-[18px] py-3.5'>
                              <div className='flex items-center gap-2.5'>
                                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-[12px] font-bold text-white shrink-0'>
                                  {memberInitials}
                                </div>
                                <div>
                                  <div className='flex items-center gap-1.5'>
                                    <span className='text-[13.5px] font-semibold text-stone-900'>{memberDisplayName}</span>
                                    {memberUser?.email === user?.email && (
                                      <span className='text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded'>You</span>
                                    )}
                                  </div>
                                  <div className='text-[11.5px] text-[#9E9893] font-mono'>{memberUser?.email || ""}</div>
                                </div>
                              </div>
                            </td>
                            <td className='px-[18px] py-3.5'>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${getRoleBadgeClasses(member.role)}`}>
                                {member.role}
                              </span>
                            </td>
                            <td className='px-[18px] py-3.5 text-xs text-[#9E9893] font-mono'>
                              {new Date(member.joinedAt).toLocaleDateString()}
                            </td>
                            <td className='px-[18px] py-3.5 text-right'>
                              <div className='inline-flex items-center gap-1.5'>
                                {isOwner && member.role !== "owner" && (
                                  <button
                                    className='w-7 h-7 rounded-md border border-[#E5E2DA] bg-white flex items-center justify-center text-[#6B6560] hover:bg-[#F9F8F5] hover:text-stone-900 transition-all'
                                    title={member.role === "admin" ? "Make member" : "Make admin"}
                                    onClick={() =>
                                      handleUpdateRole(
                                        typeof member.userId === "string" ? member.userId : member.userId._id,
                                        member.role === "admin" ? "member" : "admin"
                                      )
                                    }
                                  >
                                    <Pencil className='h-3 w-3' />
                                  </button>
                                )}
                                {canManageTeam && member.role !== "owner" && (
                                  <button
                                    className='w-7 h-7 rounded-md border border-[#E5E2DA] bg-white flex items-center justify-center text-[#6B6560] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all'
                                    title='Remove member'
                                    onClick={() => {
                                      const mId = typeof member.userId === "string" ? member.userId : member.userId._id;
                                      const mName = memberDisplayName;
                                      const mEmail = memberUser?.email || "";
                                      handleRemoveMember(mId, mName, mEmail);
                                    }}
                                  >
                                    <Trash2 className='h-3 w-3' />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {team.members.length > 5 && (
                  <Pagination
                    page={membersPage}
                    totalPages={Math.ceil(team.members.length / 5)}
                    onPrev={() => setMembersPage((p) => Math.max(1, p - 1))}
                    onNext={() => setMembersPage((p) => Math.min(Math.ceil(team.members.length / 5), p + 1))}
                  />
                )}
                </>
              )}
            </div>

            {/* Side Panel */}
            <div className='flex flex-col gap-4'>
              {/* Account Card */}
              <div className='rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(26,23,20,0.06)] overflow-hidden'>
                <div className='px-5 py-4 border-b border-[#E5E2DA] flex items-center justify-between'>
                  <div>
                    <h3 className='text-sm font-bold text-stone-900'>Account Info</h3>
                    <p className='text-xs text-[#9E9893] mt-0.5'>Your profile details</p>
                  </div>
                </div>
                <div className='divide-y divide-[#E5E2DA]'>
                  {/* Display Name - Editable */}
                  <div className='flex items-center justify-between px-5 py-[11px]'>
                    <span className='text-[11.5px] font-semibold text-[#9E9893]'>Display Name</span>
                    {isEditingName ? (
                      <div className='flex items-center gap-1.5'>
                        <input
                          type='text'
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoFocus
                          className='w-32 h-7 px-2 rounded border border-[#2563EB] bg-white text-[13px] text-stone-900 outline-none focus:ring-2 focus:ring-[#2563EB]/10'
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveProfile();
                            if (e.key === "Escape") setIsEditingName(false);
                          }}
                        />
                        <button
                          onClick={handleSaveProfile}
                          disabled={isSavingProfile}
                          className='w-7 h-7 rounded-md bg-[#2563EB] text-white flex items-center justify-center hover:bg-[#1d4ed8] disabled:opacity-50 transition-all'
                          aria-label='Save name'
                        >
                          {isSavingProfile ? <Loader2 className='h-3 w-3 animate-spin' /> : <Check className='h-3 w-3' />}
                        </button>
                        <button
                          onClick={() => setIsEditingName(false)}
                          className='w-7 h-7 rounded-md border border-[#E5E2DA] bg-white text-[#6B6560] flex items-center justify-center hover:bg-[#F9F8F5] transition-all'
                          aria-label='Cancel editing'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </div>
                    ) : (
                      <div className='flex items-center gap-1.5'>
                        <span className='text-[13px] font-semibold text-stone-900'>{displayName}</span>
                        <button
                          onClick={handleStartEditName}
                          className='w-6 h-6 rounded-md border border-[#E5E2DA] bg-white flex items-center justify-center text-[#9E9893] hover:text-stone-900 hover:bg-[#F9F8F5] transition-all'
                          aria-label='Edit display name'
                          tabIndex={0}
                        >
                          <Pencil className='h-2.5 w-2.5' />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className='flex items-center justify-between px-5 py-[11px]'>
                    <span className='text-[11.5px] font-semibold text-[#9E9893]'>Email</span>
                    <span className='text-[12.5px] font-semibold text-stone-900 font-mono'>{user?.email || ""}</span>
                  </div>
                  <div className='flex items-center justify-between px-5 py-[11px]'>
                    <span className='text-[11.5px] font-semibold text-[#9E9893]'>Role</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${getRoleBadgeClasses(user?.teamRole || "member")}`}>
                      {user?.role || "member"}
                    </span>
                  </div>
                </div>
                {/* Credit bar */}
                <div className='px-5 py-3.5 border-t border-[#E5E2DA]'>
                  <div className='flex justify-between mb-2'>
                    <span className='text-[11.5px] text-[#9E9893]'>Credit usage</span>
                    <strong className='text-[11.5px] text-stone-900 font-mono'>{creditsBalance}</strong>
                  </div>
                  <div className='h-1.5 bg-[#E5E2DA] rounded-full overflow-hidden'>
                    <div
                      className='h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] transition-all duration-1000'
                      style={{ width: `${Math.min(100, (creditsBalance / Math.max(creditsBalance, 500)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Password Change Card */}
              <div className='rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(26,23,20,0.06)] overflow-hidden'>
                <div className='px-5 py-4 border-b border-[#E5E2DA] flex items-center justify-between'>
                  <div>
                    <h3 className='text-sm font-bold text-stone-900'>Security</h3>
                    <p className='text-xs text-[#9E9893] mt-0.5'>Manage your password</p>
                  </div>
                  {!showPasswordForm && (
                    <Button variant='soft' size='sm' onClick={() => setShowPasswordForm(true)}>
                      Change Password
                    </Button>
                  )}
                </div>
                {showPasswordForm ? (
                  <form onSubmit={handleChangePassword} className='p-4 space-y-3'>
                    <div>
                      <label className='text-[11px] font-semibold text-[#9E9893] mb-1 block'>Current Password</label>
                      <div className='relative'>
                        <Lock className='absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9E9893] pointer-events-none' />
                        <input
                          type={showCurrentPw ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                          className='w-full h-9 pl-8 pr-9 rounded-lg border border-[#E5E2DA] bg-[#F9F8F5] text-[13px] text-stone-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all'
                          placeholder='Enter current password'
                        />
                        <button
                          type='button'
                          onClick={() => setShowCurrentPw(!showCurrentPw)}
                          className='absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9E9893] hover:text-stone-900'
                          tabIndex={-1}
                          aria-label={showCurrentPw ? "Hide password" : "Show password"}
                        >
                          {showCurrentPw ? <EyeOff className='h-3.5 w-3.5' /> : <Eye className='h-3.5 w-3.5' />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className='text-[11px] font-semibold text-[#9E9893] mb-1 block'>New Password</label>
                      <div className='relative'>
                        <Lock className='absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9E9893] pointer-events-none' />
                        <input
                          type={showNewPw ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={6}
                          className='w-full h-9 pl-8 pr-9 rounded-lg border border-[#E5E2DA] bg-[#F9F8F5] text-[13px] text-stone-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all'
                          placeholder='Min 6 characters'
                        />
                        <button
                          type='button'
                          onClick={() => setShowNewPw(!showNewPw)}
                          className='absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9E9893] hover:text-stone-900'
                          tabIndex={-1}
                          aria-label={showNewPw ? "Hide password" : "Show password"}
                        >
                          {showNewPw ? <EyeOff className='h-3.5 w-3.5' /> : <Eye className='h-3.5 w-3.5' />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className='text-[11px] font-semibold text-[#9E9893] mb-1 block'>Confirm Password</label>
                      <div className='relative'>
                        <Lock className='absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9E9893] pointer-events-none' />
                        <input
                          type='password'
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={6}
                          className={`w-full h-9 pl-8 pr-3 rounded-lg border bg-[#F9F8F5] text-[13px] text-stone-900 outline-none focus:ring-2 transition-all ${
                            confirmPassword && confirmPassword !== newPassword
                              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                              : "border-[#E5E2DA] focus:border-[#2563EB] focus:ring-[#2563EB]/10"
                          }`}
                          placeholder='Re-enter new password'
                        />
                      </div>
                      {confirmPassword && confirmPassword !== newPassword && (
                        <p className='text-[11px] text-red-500 mt-1'>Passwords do not match</p>
                      )}
                    </div>
                    <div className='flex gap-2 pt-1'>
                      <Button
                        variant='primary'
                        size='md'
                        type='submit'
                        loading={isChangingPassword}
                        disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                        icon={!isChangingPassword ? <Lock className='h-3 w-3' /> : undefined}
                        className='flex-1 h-9'
                      >
                        {isChangingPassword ? "Updating..." : "Update Password"}
                      </Button>
                      <Button
                        variant='outline'
                        size='md'
                        type='button'
                        onClick={() => {
                          setShowPasswordForm(false);
                          setCurrentPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                        className='h-9 px-4'
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className='px-5 py-4 flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-lg bg-[#F9F8F5] flex items-center justify-center'>
                      <Lock className='h-4 w-4 text-[#9E9893]' />
                    </div>
                    <div>
                      <p className='text-[13px] font-medium text-stone-900'>Password</p>
                      <p className='text-[11px] text-[#9E9893]'>••••••••</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Invite Card */}
              <div className='rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(26,23,20,0.06)] overflow-hidden'>
                <div className='px-5 py-4 border-b border-[#E5E2DA]'>
                  <h3 className='text-sm font-bold text-stone-900'>Invite Members</h3>
                </div>
                {canManageTeam || !team ? (
                  <div className='p-[14px_18px]'>
                    <p className='text-[12.5px] text-[#6B6560] mb-3 leading-relaxed'>
                      Send an invitation to add a new member. {user?.subscription?.status !== "active" ? "You need to buy credits to invite members" : ""}
                    </p>
                    <form onSubmit={handleInviteSubmit} className='space-y-2'>
                      <div className='relative'>
                        <Mail className='absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9E9893] pointer-events-none' />
                        <input
                          type='email'
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder='colleague@company.com'
                          className='w-full h-9 pl-8 pr-3 rounded-lg border border-[#E5E2DA] bg-[#F9F8F5] text-[13px] text-stone-900 placeholder:text-[#9E9893] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all'
                        />
                      </div>
                      <Button
                        variant='primary'
                        size='md'
                        type='submit'
                        loading={isSendingInvite}
                        disabled={!inviteEmail.trim() || isSendingInvite || user?.subscription?.status !== "active"}
                        icon={!isSendingInvite ? <Send className='h-3 w-3' /> : undefined}
                        className='w-full h-9'
                      >
                        {isSendingInvite ? "Sending..." : "Send Invitation"}
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className='p-[14px_18px] text-[13px] text-[#9E9893]'>
                    Only owners or admins can invite new members.
                  </div>
                )}
              </div>

              {/* Pending Invites Card */}
              <div className='rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(26,23,20,0.06)] overflow-hidden'>
                <div className='px-5 py-4 border-b border-[#E5E2DA] flex items-center justify-between'>
                  <h3 className='text-sm font-bold text-stone-900'>Pending Invites</h3>
                  {invites.length > 0 && (
                    <span className='bg-amber-50 text-amber-700 text-[11px] font-bold px-2 py-0.5 rounded-full'>
                      {invites.length}
                    </span>
                  )}
                </div>
                {invites.length === 0 ? (
                  <div className='p-6 text-center'>
                    <div className='w-[38px] h-[38px] bg-[#F9F8F5] rounded-[10px] flex items-center justify-center mx-auto mb-2.5'>
                      <Mail className='h-[17px] w-[17px] text-[#9E9893]' />
                    </div>
                    <p className='text-[13px] text-[#9E9893]'>No pending invites</p>
                  </div>
                ) : (
                  <div className='divide-y divide-[#E5E2DA]'>
                    {invites.map((invite) => (
                      <div key={invite._id} className='flex items-start justify-between gap-2 px-5 py-[11px]'>
                        <div className='flex-1 min-w-0'>
                          <p className='text-[12.5px] font-semibold text-stone-900'>{invite.email}</p>
                          <p className='text-[11px] text-[#9E9893] font-mono'>
                            Expires: {new Date(invite.expiresAt).toLocaleString()}
                          </p>
                        </div>
                        {canManageTeam && (
                          <div className='flex items-center gap-1.5 shrink-0'>
                            <button
                              onClick={() => handleResendInvite(invite._id)}
                              disabled={resendingInviteId === invite._id}
                              className='text-[11px] font-semibold text-blue-600 border border-blue-200 bg-blue-50 rounded px-2 py-0.5 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1'
                            >
                              {resendingInviteId === invite._id && <Loader2 className='h-3 w-3 animate-spin' />}
                              Resend
                            </button>
                            <button
                              onClick={() => handleCancelInvite(invite._id)}
                              disabled={cancellingInviteId === invite._id}
                              className='text-[11px] font-semibold text-red-600 border border-red-200 bg-red-50 rounded px-2 py-0.5 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1'
                            >
                              {cancellingInviteId === invite._id && <Loader2 className='h-3 w-3 animate-spin' />}
                              Revoke
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── Credit History (reusable component) ────── */}
          <CreditHistoryList
            title={team ? "Team Credit History" : "Credit History"}
            subtitle={`${creditHistory.length} transactions total`}
            entries={creditHistory}
            onExport={handleExport}
            variant='detailed'
          />
          </>
          )}
      </main>

      {/* ─── Leave Team Confirmation Modal ──────────── */}
      <ConfirmModal
        open={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        title='Leave Team'
        confirmLabel='Leave Team'
        confirmVariant='danger'
        onConfirm={confirmLeaveTeam}
      >
        <div className='flex gap-3 items-start rounded-xl bg-red-50 border border-red-200 p-3.5'>
          <AlertTriangle className='h-[18px] w-[18px] text-red-600 shrink-0 mt-0.5' />
          <div>
            <p className='text-[13.5px] font-bold text-red-600 mb-1'>Are you sure you want to leave?</p>
            <p className='text-[12.5px] text-[#6B6560] leading-relaxed'>
              You'll lose access to shared team credits and all team resources. This action cannot be undone.
            </p>
          </div>
        </div>
      </ConfirmModal>

      {/* ─── Remove Member Confirmation Modal ────────── */}
      <ConfirmModal
        open={showRemoveModal}
        onClose={() => { setShowRemoveModal(false); setMemberToRemove(null); }}
        title='Remove Member'
        confirmLabel='Remove'
        confirmVariant='danger'
        onConfirm={confirmRemoveMember}
      >
        {memberToRemove && (
          <>
            <div className='flex items-center gap-3 p-3.5 rounded-xl bg-[#F9F8F5] border border-[#E5E2DA] mb-4'>
              <div className='w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-sm font-bold text-white shrink-0'>
                {memberToRemove.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div>
                <p className='text-sm font-bold text-stone-900'>{memberToRemove.name}</p>
                <p className='text-xs text-[#9E9893] font-mono'>{memberToRemove.email}</p>
              </div>
            </div>
            <p className='text-[13.5px] text-[#6B6560] leading-relaxed'>
              Removing <strong className='text-stone-900'>{memberToRemove.name}</strong> will revoke their access to the team and all shared credits. This action cannot be undone.
            </p>
          </>
        )}
      </ConfirmModal>
    </div>
  );
};

export default CreditsPage;
