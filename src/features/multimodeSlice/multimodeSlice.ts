import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type RideMode = 'normal' | 'multi' | null

interface RideModeState {
  mode: RideMode
}

const initialState: RideModeState = {
  mode: null
};

const userSlice = createSlice({
  name: "rideMode",
  initialState,
  reducers: {
    setRideMode: (state, action: PayloadAction<RideMode>) => {
      state.mode = action.payload
    }
  },
});

export const { setRideMode } = userSlice.actions;
export default userSlice.reducer;
