// Please note that this gist follows the repo available at: https://github.com/delasign/react-redux-tutorial
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../services/authService";

interface InitialState {
  user: IUser | null;
  userRefresh: boolean;
}

const initialState: InitialState = {
  user: null,
  userRefresh: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = { ...action.payload };
    },
    setUserRefresh: (state) => {
      state.userRefresh = !state.userRefresh;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setUserRefresh } = userSlice.actions;
// You must export the reducer as follows for it to be able to be read by the store.
export default userSlice.reducer;
