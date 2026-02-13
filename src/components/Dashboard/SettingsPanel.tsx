import { FC, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Settings, Info } from 'lucide-react';
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
      <div className='rounded-2xl border border-[#E5E2DA] bg-white p-6 shadow-[0_1px_3px_rgba(28,25,23,0.06)]'>
        <div className='animate-pulse space-y-4'>
          <div className='h-6 w-1/4 rounded bg-stone-100'></div>
          <div className='h-10 w-full rounded bg-stone-100'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] overflow-hidden'>
        {/* Header */}
        <div className='px-6 py-[18px] border-b border-[#E5E2DA] flex items-center gap-3'>
          <div className='w-9 h-9 rounded-[10px] bg-[#EEF3FF] flex items-center justify-center'>
            <Settings className='h-[18px] w-[18px] text-[#0F62FE]' />
          </div>
          <div>
            <h2 className='text-[15px] font-bold text-stone-900'>System Settings</h2>
            <p className='text-xs text-[#9E9893] mt-0.5'>Configure platform-wide parameters</p>
          </div>
        </div>

        {/* Team Member Limit */}
        <div className='px-6 py-5 border-b border-[#E5E2DA]'>
          <h3 className='text-[13.5px] font-bold text-stone-900 mb-1'>Team Member Limit</h3>
          <p className='text-[12.5px] text-[#6B6560] mb-3'>
            {settings?.teamMemberLimit?.description || 'Maximum team members allowed per team (including owner)'}
          </p>
          <div className='flex items-center gap-2.5 max-w-[360px]'>
            <input
              type='number'
              min='1'
              value={teamMemberLimit}
              onChange={(e) => setTeamMemberLimit(e.target.value)}
              className='w-[120px] h-9 px-3 rounded-lg border border-[#E5E2DA] bg-[#F9F8F5] text-[13px] text-stone-900 outline-none focus:border-[#0F62FE] focus:ring-2 focus:ring-[#0F62FE]/10 transition-all'
              placeholder='Enter member limit'
            />
            <button
              onClick={handleTeamMemberLimitSave}
              disabled={saving}
              className='h-9 px-4 rounded-lg bg-[#0F62FE] text-white text-[13px] font-semibold hover:bg-[#0047B3] shadow-[0_1px_3px_rgba(15,98,254,0.28)] disabled:opacity-50 disabled:cursor-not-allowed transition-all'
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
          <p className='mt-2 text-xs text-[#9E9893]'>
            Current value: <strong className='text-stone-900'>{settings?.teamMemberLimit?.value || 5} members</strong>
          </p>
        </div>

        {/* Add more settings here in the future */}
        <div className='px-6 py-5'>
          <p className='text-sm text-[#9E9893]'>
            More configuration options will be added here as the platform evolves.
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div className='flex items-center gap-2.5 px-[18px] py-3 bg-[#EEF3FF] border border-[#C7D7FF] rounded-xl'>
        <Info className='h-4 w-4 text-[#0F62FE] shrink-0' />
        <span className='text-[13px] text-[#0F62FE] font-medium'>
          More configuration options will be added here as the platform evolves.
        </span>
      </div>
    </div>
  );
};

export default SettingsPanel;
