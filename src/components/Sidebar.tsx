import React from 'react';
import { LayoutDashboard, BarChart3, PieChart, LineChart, Settings, Menu, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../store/dashboardSlice';
import { NavLink } from 'react-router-dom';
import { RootState } from '../store/store';
import clsx from 'clsx';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: PieChart, label: 'Demographics', path: '/demographics' },
  { icon: LineChart, label: 'Performance', path: '/performance' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const dispatch = useDispatch();
  const isCollapsed = useSelector((state: RootState) => state.dashboard.isSidebarCollapsed);

  return (
    <div
      className={clsx(
        'bg-gray-900 h-screen shadow-lg fixed left-0 top-0 transition-all duration-300 z-50',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className={clsx('p-4 flex items-center', isCollapsed ? 'justify-center' : 'justify-between')}>
        {!isCollapsed && <h1 className="text-2xl font-bold text-white">Analytics</h1>}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => clsx(
              'flex items-center py-3 text-gray-400 hover:bg-gray-800 transition-colors',
              isCollapsed ? 'px-0 justify-center' : 'px-6',
              isActive && 'bg-gray-800 text-blue-400'
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className={clsx('w-5 h-5', !isCollapsed && 'mr-3')} />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}