import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Team } from "../services/teamService";

interface TeamState {
  team: Team | null;
}

const initialState: TeamState = {
  team: null,
};

export const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeam: (state, action: PayloadAction<Team | null>) => {
      state.team = action.payload;
    },
  },
});

export const { setTeam } = teamSlice.actions;
export default teamSlice.reducer;
