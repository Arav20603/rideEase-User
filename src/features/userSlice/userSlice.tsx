import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  email: string | null;
  name: string | null;
  phone: string | null;
  id: string | null;
}

const initialState: UserState = {
  email: null,
  name: null,
  phone: null,
  id: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.phone = action.payload.phone;
      state.id = action.payload.id;
    },
    clearUser: (state) => {
      state.email = null;
      state.name = null;
      state.phone = null;
      state.id = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const selectUser = (state: { user: UserState }) => state.user;
export default userSlice.reducer;
