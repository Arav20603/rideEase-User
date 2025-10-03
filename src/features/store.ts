// app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "./mapSlice/mapSlice";
import userReducer from './userSlice/userSlice'

export const store = configureStore({
  reducer: {
    map: mapReducer,
    user: userReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
