import { FC } from 'react';
import { AdminTeam } from '../../../services/adminService';
import { getRoleBadgeClasses } from '../../../constants/theme';

interface TeamMembersPanelProps {
  selectedTeam: AdminTeam | null;
}

const TeamMembersPanel: FC<TeamMembersPanelProps> = ({ selectedTeam }) => {
  if (!selectedTeam) {
    return (
      <div className='rounded-2xl border border-[#E5E2DA] bg-white p-6 shadow-[0_1px_3px_rgba(28,25,23,0.06)]'>
        <h2 className='text-sm font-bold text-stone-900 mb-4'>Team Members</h2>
        <p className='text-[13px] text-[#9E9893]'>Select a team to view members.</p>
      </div>
    );
  }

  const members = selectedTeam.members || [];
  const memberCount = members.length;

  return (
    <div className='rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] overflow-hidden'>
      <div className='px-5 py-4 border-b border-[#E5E2DA] flex items-center justify-between'>
        <span className='text-sm font-bold text-stone-900'>Team Members</span>
        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-blue-50 text-blue-600 border-blue-200'>
          {memberCount} {memberCount === 1 ? 'Member' : 'Members'}
        </span>
      </div>

      {members.length === 0 ? (
        <div className='p-6 text-center text-[13px] text-[#9E9893]'>No members found in this team.</div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='bg-[#F9F8F5]'>
                <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA]'>Email</th>
                <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA]'>Username</th>
                <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA]'>Team Role</th>
                <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA]'>Credits</th>
                <th className='text-right text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA]'>Recent Usage</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => {
                const user = member.userId;
                const recentUsage = user.creditHistory
                  ?.filter((entry) => entry.type === 'usage')
                  .slice(0, 3)
                  .reduce((sum, entry) => sum + Math.abs(entry.amount), 0) || 0;

                return (
                  <tr key={user._id || index} className='border-b border-[#E5E2DA] hover:bg-[#F9F8F5] transition-colors'>
                    <td className='px-4 py-3.5 text-[13px] text-[#0F62FE] font-mono font-medium'>{user.email}</td>
                    <td className='px-4 py-3.5 text-[13.5px] text-stone-900'>{user.username || '-'}</td>
                    <td className='px-4 py-3.5'>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${getRoleBadgeClasses(member.role)}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className='px-4 py-3.5'>
                      {selectedTeam.credits !== undefined ? (
                        <span className='text-[#9E9893] text-xs'>Team wallet</span>
                      ) : (
                        <span className='text-stone-900 font-mono font-semibold'>{user.credits || 0}</span>
                      )}
                    </td>
                    <td className='px-4 py-3.5 text-right text-[13.5px] text-[#9E9893] font-mono'>
                      {recentUsage > 0 ? `-${recentUsage}` : '0'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeamMembersPanel;
