import { FC } from 'react';
import { AdminTeam } from '../../../services/adminService';

interface TeamMembersPanelProps {
  selectedTeam: AdminTeam | null;
}

const TeamMembersPanel: FC<TeamMembersPanelProps> = ({ selectedTeam }) => {
  if (!selectedTeam) {
    return (
      <div className='bg-slate-900 border border-slate-800 rounded-xl p-6'>
        <h2 className='text-xl font-semibold mb-4'>Team Members</h2>
        <p className='text-gray-400'>Select a team to view members.</p>
      </div>
    );
  }

  const members = selectedTeam.members || [];
  const memberCount = members.length;

  return (
    <div className='bg-slate-900 border border-slate-800 rounded-xl p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-semibold'>Team Members</h2>
        <span className='px-3 py-1 rounded-full bg-cyan-600/20 text-cyan-400 text-sm font-medium'>
          {memberCount} {memberCount === 1 ? 'Member' : 'Members'}
        </span>
      </div>

      {members.length === 0 ? (
        <p className='text-gray-400'>No members found in this team.</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full text-left'>
            <thead className='text-gray-400 border-b border-gray-800'>
              <tr>
                <th className='py-3 px-2'>Email</th>
                <th className='py-3 px-2'>Username</th>
                <th className='py-3 px-2'>Team Role</th>
                <th className='py-3 px-2'>Credits</th>
                <th className='py-3 px-2'>Recent Usage</th>
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
                  <tr key={user._id || index} className='border-b border-gray-800 hover:bg-gray-800/30'>
                    <td className='py-3 px-2 text-cyan-400'>{user.email}</td>
                    <td className='py-3 px-2'>{user.username || '-'}</td>
                    <td className='py-3 px-2'>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${
                          member.role === 'owner'
                            ? 'bg-purple-600/20 text-purple-400'
                            : member.role === 'admin'
                            ? 'bg-blue-600/20 text-blue-400'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className='py-3 px-2'>
                      {selectedTeam.credits !== undefined ? (
                        <span className='text-gray-400'>Team wallet</span>
                      ) : (
                        <span className='text-white font-medium'>{user.credits || 0}</span>
                      )}
                    </td>
                    <td className='py-3 px-2'>
                      <span className='text-gray-400'>{recentUsage > 0 ? `-${recentUsage}` : '0'}</span>
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
