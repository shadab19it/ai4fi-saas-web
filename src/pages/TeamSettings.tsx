import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../store/store";
import teamService, { Team, TeamInvite } from "../services/teamService";
import UserHeader from "../components/UserHeader";

const TeamSettings = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [team, setTeam] = useState<Team | null>(null);
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);

  const loadTeam = async () => {
    if (!user) return;
    setIsLoadingTeam(true);
    try {
      const data = await teamService.getTeam();
      setTeam(data.team);
      setInvites(data.invites || []);
    } catch (error) {
      setInviteStatus({ type: "error", message: error instanceof Error ? error.message : "Failed to load team" });
    } finally {
      setIsLoadingTeam(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, [user?.teamId]);

  const canManageTeam = user?.teamRole === "owner" || user?.teamRole === "admin";
  const isOwner = user?.teamRole === "owner";

  const handleInviteSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!inviteEmail.trim()) {
      setInviteStatus({ type: "error", message: "Please enter an email address" });
      return;
    }
    try {
      setInviteStatus(null);
      await teamService.inviteMember(inviteEmail.trim());
      setInviteEmail("");
      setInviteStatus({ type: "success", message: "Invite sent" });
      await loadTeam();
    } catch (error) {
      setInviteStatus({ type: "error", message: error instanceof Error ? error.message : "Failed to send invite" });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await teamService.removeMember(memberId);
      await loadTeam();
    } catch (error) {
      setInviteStatus({ type: "error", message: error instanceof Error ? error.message : "Failed to remove member" });
    }
  };

  const handleUpdateRole = async (memberId: string, role: "admin" | "member") => {
    try {
      await teamService.updateMemberRole(memberId, role);
      await loadTeam();
    } catch (error) {
      setInviteStatus({ type: "error", message: error instanceof Error ? error.message : "Failed to update role" });
    }
  };

  const handleResendInvite = async (inviteId: string) => {
    try {
      await teamService.resendInvite(inviteId);
      setInviteStatus({ type: "success", message: "Invite resent" });
    } catch (error) {
      setInviteStatus({ type: "error", message: error instanceof Error ? error.message : "Failed to resend invite" });
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    try {
      await teamService.cancelInvite(inviteId);
      await loadTeam();
      setInviteStatus({ type: "success", message: "Invite cancelled" });
    } catch (error) {
      setInviteStatus({ type: "error", message: error instanceof Error ? error.message : "Failed to cancel invite" });
    }
  };

  const handleLeaveTeam = async () => {
    try {
      await teamService.leaveTeam();
      await loadTeam();
    } catch (error) {
      setInviteStatus({ type: "error", message: error instanceof Error ? error.message : "Failed to leave team" });
    }
  };

  return (
    <div className='min-h-screen bg-slate-950 text-white'>
      <UserHeader
        title='Team Settings'
        subtitle='Manage team members and invites.'
        actions={
          <>
            {isOwner && (
              <Link
                to='/contact'
                className='px-3 py-2 rounded-md bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500'
              >
                Buy Credits
              </Link>
            )}
            <Link to='/credits' className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-white'>
              Credits
            </Link>
          </>
        }
      />

      <div className='px-6 py-6 space-y-6'>
        <div className='rounded-xl border border-slate-800 bg-slate-900 p-5'>
          <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
            <div>
              <h2 className='text-xl font-semibold'>Team Overview</h2>
              <p className='text-sm text-slate-400'>
                {team ? team.name : "Invite a teammate to create your shared credits team."}
              </p>
            </div>
            {!team && <span className='text-xs text-slate-500'>A team is created when you send your first invite.</span>}
          </div>

          <div className='mt-4 grid gap-4 md:grid-cols-4'>
            <div className='rounded-lg border border-slate-800 bg-slate-950/40 p-4'>
              <p className='text-xs uppercase text-slate-400'>Team Credits</p>
              <p className='mt-2 text-2xl font-semibold'>{team?.credits ?? 0}</p>
            </div>
            <div className='rounded-lg border border-slate-800 bg-slate-950/40 p-4'>
              <p className='text-xs uppercase text-slate-400'>Members</p>
              <p className='mt-2 text-2xl font-semibold'>{team?.members?.length ?? 0}</p>
            </div>
            <div className='rounded-lg border border-slate-800 bg-slate-950/40 p-4'>
              <p className='text-xs uppercase text-slate-400'>Pending Invites</p>
              <p className='mt-2 text-2xl font-semibold'>{invites.length}</p>
            </div>
            <div className='rounded-lg border border-slate-800 bg-slate-950/40 p-4'>
              <p className='text-xs uppercase text-slate-400'>Your Role</p>
              <p className='mt-2 text-2xl font-semibold capitalize'>{user?.teamRole || "member"}</p>
            </div>
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-[2fr,1fr]'>
          <div className='rounded-xl border border-slate-800 bg-slate-900 p-5'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Team Members</h3>
              {user?.teamRole !== "owner" && team && (
                <button className='text-xs text-slate-300 underline' onClick={handleLeaveTeam}>
                  Leave team
                </button>
              )}
            </div>
            {!team ? (
              <p className='mt-4 text-sm text-slate-400'>No team members yet.</p>
            ) : (
              <div className='mt-4 overflow-x-auto'>
                <table className='w-full text-left text-sm'>
                  <thead className='text-xs uppercase text-slate-500 border-b border-slate-800'>
                    <tr>
                      <th className='py-3'>Member</th>
                      <th className='py-3'>Role</th>
                      <th className='py-3'>Joined</th>
                      <th className='py-3 text-right'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.members.map((member) => {
                      const memberUser = typeof member.userId === "string" ? null : member.userId;
                      const displayName = memberUser?.username || memberUser?.email || "Unknown member";
                      const memberKey = typeof member.userId === "string" ? member.userId : member.userId._id;
                      return (
                        <tr key={`${memberKey}-${member.joinedAt}`} className='border-b border-slate-800'>
                          <td className='py-3'>
                            <div className='font-medium'>{displayName}</div>
                            <div className='text-xs text-slate-400'>{memberUser?.email || ""}</div>
                          </td>
                          <td className='py-3'>
                            <span className='inline-flex items-center rounded-full bg-slate-800 px-2.5 py-1 text-xs capitalize text-slate-200'>
                              {member.role}
                            </span>
                          </td>
                          <td className='py-3 text-slate-400'>
                            {new Date(member.joinedAt).toLocaleDateString()}
                          </td>
                          <td className='py-3 text-right'>
                            <div className='inline-flex items-center gap-2'>
                              {isOwner && member.role !== "owner" && (
                                <button
                                  className='text-xs text-indigo-300 hover:text-indigo-200'
                                  onClick={() =>
                                    handleUpdateRole(
                                      typeof member.userId === "string" ? member.userId : member.userId._id,
                                      member.role === "admin" ? "member" : "admin"
                                    )
                                  }
                                >
                                  {member.role === "admin" ? "Make member" : "Make admin"}
                                </button>
                              )}
                              {canManageTeam && member.role !== "owner" && (
                                <button
                                  className='text-xs text-red-400 hover:text-red-300'
                                  onClick={() => handleRemoveMember(typeof member.userId === "string" ? member.userId : member.userId._id)}
                                >
                                  Remove
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
            )}
          </div>

          <div className='space-y-6'>
            <div className='rounded-xl border border-slate-800 bg-slate-900 p-5'>
              <h3 className='text-lg font-semibold'>Invite Members</h3>
              {canManageTeam || !team ? (
                <form className='mt-4 space-y-3' onSubmit={handleInviteSubmit}>
                  <input
                    type='email'
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                    placeholder='teammate@email.com'
                    className='w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none'
                  />
                  <button
                    type='submit'
                    className='w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500'
                    disabled={isLoadingTeam}
                  >
                    {isLoadingTeam ? "Sending..." : "Send Invite"}
                  </button>
                  {inviteStatus && (
                    <p className={inviteStatus.type === "success" ? "text-xs text-green-400" : "text-xs text-red-400"}>
                      {inviteStatus.message}
                    </p>
                  )}
                </form>
              ) : (
                <p className='mt-3 text-sm text-slate-400'>Only owners or admins can invite new members.</p>
              )}
            </div>

            <div className='rounded-xl border border-slate-800 bg-slate-900 p-5'>
              <h3 className='text-lg font-semibold'>Pending Invites</h3>
              {invites.length === 0 ? (
                <p className='mt-3 text-sm text-slate-400'>No pending invites.</p>
              ) : (
                <div className='mt-4 space-y-3'>
                  {invites.map((invite) => (
                    <div key={invite._id} className='rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-sm'>
                      <div className='font-medium'>{invite.email}</div>
                      <div className='mt-1 text-xs text-slate-400'>Expires: {new Date(invite.expiresAt).toLocaleString()}</div>
                      {canManageTeam && (
                        <div className='mt-3 flex items-center gap-3'>
                          <button className='text-xs text-indigo-300 hover:text-indigo-200' onClick={() => handleResendInvite(invite._id)}>
                            Resend
                          </button>
                          <button className='text-xs text-red-400 hover:text-red-300' onClick={() => handleCancelInvite(invite._id)}>
                            Cancel
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
      </div>
    </div>
  );
};

export default TeamSettings;
