import { FC, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import AppHeader from '../../components/Layout/AppHeader';
import appConstant from '../../services/appConstant';

const SeedPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [seededUsers, setSeededUsers] = useState<any[]>([]);

  const handleSeedUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${appConstant.BACKEND_API_URL}/seed/users`);
      if (response.data.success) {
        toast.success(response.data.message);
        setSeededUsers(response.data.users);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to seed users');
    } finally {
      setLoading(false);
    }
  };

  const handleClearUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`${appConstant.BACKEND_API_URL}/seed/users`);
      if (response.data.success) {
        toast.success(response.data.message);
        setSeededUsers([]);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to clear users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-950'>
      <AppHeader isAdmin={false} />
      <div className='container mx-auto px-4 py-12'>
        <div className='mx-auto max-w-4xl'>
          <div className='mb-8'>
            <h1 className='text-4xl font-bold text-white'>Development Tools</h1>
            <p className='mt-2 text-slate-400'>Seed test users for development and testing</p>
          </div>

          <div className='rounded-xl border border-slate-800 bg-slate-900 p-8'>
            <h2 className='mb-4 text-2xl font-semibold text-white'>Seed Test Users</h2>
            <p className='mb-6 text-slate-400'>
              Create test users with different roles and team configurations. All test users will use password: <code className='rounded bg-slate-800 px-2 py-1 text-cyan-400'>Test123!</code>
            </p>

            <div className='flex gap-4'>
              <button
                onClick={handleSeedUsers}
                disabled={loading}
                className='rounded-lg bg-cyan-600 px-6 py-3 font-medium text-white transition-all hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {loading ? 'Processing...' : 'Seed Users'}
              </button>
              <button
                onClick={handleClearUsers}
                disabled={loading}
                className='rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50'
              >
                Clear Test Users
              </button>
            </div>

            {seededUsers.length > 0 && (
              <div className='mt-8'>
                <h3 className='mb-4 text-xl font-semibold text-white'>Test Users Created:</h3>
                <div className='overflow-hidden rounded-lg border border-slate-800'>
                  <table className='w-full'>
                    <thead className='border-b border-slate-800 bg-slate-950 text-left text-sm text-slate-400'>
                      <tr>
                        <th className='px-4 py-3'>  Email</th>
                        <th className='px-4 py-3'>Password</th>
                        <th className='px-4 py-3'>Role</th>
                        <th className='px-4 py-3'>Team Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seededUsers.map((user, index) => (
                        <tr key={index} className='border-b border-slate-800/50 text-sm text-white'>
                          <td className='px-4 py-3 font-mono text-cyan-400'>{user.email}</td>
                          <td className='px-4 py-3 font-mono text-green-400'>{user.password}</td>
                          <td className='px-4 py-3 capitalize'>
                            <span className='rounded bg-slate-800 px-2 py-1'>{user.role}</span>
                          </td>
                          <td className='px-4 py-3 capitalize'>
                            {user.teamRole ? (
                              <span className='rounded bg-blue-900/50 px-2 py-1 text-blue-300'>{user.teamRole}</span>
                            ) : (
                              <span className='text-slate-500'>-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className='mt-8 rounded-xl border border-slate-800 bg-slate-900 p-8'>
            <h2 className='mb-4 text-2xl font-semibold text-white'>User Types</h2>
            <div className='space-y-4 text-slate-300'>
              <div>
                <h3 className='font-semibold text-white'>🔑 Admin User</h3>
                <p className='text-sm text-slate-400'>Full access to admin dashboard, can manage all users and teams</p>
              </div>
              <div>
                <h3 className='font-semibold text-white'>👤 Regular User</h3>
                <p className='text-sm text-slate-400'>Solo user with individual credit balance</p>
              </div>
              <div>
                <h3 className='font-semibold text-white'>👑 Team Owner</h3>
                <p className='text-sm text-slate-400'>Creates and manages team, full team permissions</p>
              </div>
              <div>
                <h3 className='font-semibold text-white'>⭐ Team Admin</h3>
                <p className='text-sm text-slate-400'>Can invite members and manage team (cannot remove owner)</p>
              </div>
              <div>
                <h3 className='font-semibold text-white'>🧑‍💼 Team Member</h3>
                <p className='text-sm text-slate-400'>Basic team member with usage permissions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedPage;
