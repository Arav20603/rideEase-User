import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "./mapSlice/mapSlice";
import userReducer from './userSlice/userSlice'
import rideReducer from './rideSlice/rideSlice'
import modeReducer from './multimodeSlice/multimodeSlice'

export const store = configureStore({
  reducer: {
    map: mapReducer,
    user: userReducer,
    ride: rideReducer,
    mode: modeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
