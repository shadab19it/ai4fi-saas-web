import { FC, useState, useEffect } from 'react';
import { toast } from 'sonner';
import adminService from '../../services/adminService';

interface SystemSettings {
  teamMemberLimit: {
    value: number;
    description: string;
  };
}

const SettingsPanel: FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [teamMemberLimit, setTeamMemberLimit] = useState('5');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSettings();
      setSettings(response.settings as any);
      if (response.settings.teamMemberLimit) {
        setTeamMemberLimit(response.settings.teamMemberLimit.value.toString());
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSetting = async (key: string, value: any) => {
    try {
      setSaving(true);
      await adminService.updateSetting(key, value);
      toast.success('Setting updated successfully');
      await fetchSettings();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  const handleTeamMemberLimitSave = () => {
    const numValue = parseInt(teamMemberLimit, 10);
    if (isNaN(numValue) || numValue < 1) {
      toast.error('Team member limit must be at least 1');
      return;
    }
    handleSaveSetting('teamMemberLimit', numValue);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <div className='animate-pulse space-y-4'>
          <div className='h-6 w-1/4 rounded bg-slate-800'></div>
          <div className='h-10 w-full rounded bg-slate-800'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
      <h2 className='mb-6 text-xl font-semibold text-white'>System Settings</h2>

      <div className='space-y-6'>
        {/* Team Member Limit */}
        <div>
          <label className='mb-2 block text-sm font-medium text-slate-300'>
            Team Member Limit
          </label>
          <p className='mb-3 text-xs text-slate-400'>
            {settings?.teamMemberLimit?.description || 'Maximum team members allowed per team'}
          </p>
          <div className='flex gap-3'>
            <input
              type='number'
              min='1'
              value={teamMemberLimit}
              onChange={(e) => setTeamMemberLimit(e.target.value)}
              className='w-full max-w-xs rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20'
              placeholder='Enter member limit'
            />
            <button
              onClick={handleTeamMemberLimitSave}
              disabled={saving}
              className='rounded-lg bg-cyan-600 px-6 py-2 font-medium text-white transition-all hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
          <p className='mt-2 text-xs text-slate-500'>
            Current value: {settings?.teamMemberLimit?.value || 5} members
          </p>
        </div>

        {/* Add more settings here in the future */}
        <div className='rounded-lg border border-slate-800 bg-slate-950/50 p-4'>
          <p className='text-sm text-slate-400'>
            💡 More configuration options will be added here
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
