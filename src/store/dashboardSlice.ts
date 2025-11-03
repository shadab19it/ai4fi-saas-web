import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TimeFilter } from '../types/dashboard';

interface DashboardState {
  timeFilter: TimeFilter;
  isSidebarCollapsed: boolean;
}

const initialState: DashboardState = {
  timeFilter: '30d',
  isSidebarCollapsed: false,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setTimeFilter: (state, action: PayloadAction<TimeFilter>) => {
      state.timeFilter = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
  },
});

export const { setTimeFilter, toggleSidebar } = dashboardSlice.actions;
export default dashboardSlice.reducer;