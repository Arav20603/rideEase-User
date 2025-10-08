// app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "./mapSlice/mapSlice";
import userReducer from './userSlice/userSlice'
import rideReducer from './rideSlice/rideSlice'

export const store = configureStore({
  reducer: {
    map: mapReducer,
    user: userReducer,
    ride: rideReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
