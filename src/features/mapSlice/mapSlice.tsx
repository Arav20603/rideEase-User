import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LocationState {
  location: {
    lat: number;
    lng: number;
  } | null;
  description: string | null;
}

export interface MapState {
  origin: LocationState | null;
  destination: LocationState | null;
  travelTimeInformation: any | null;
}

const initialState: MapState = {
  origin: null,
  destination: null,
  travelTimeInformation: null,
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setOrigin: (state, action: PayloadAction<LocationState | null>) => {
      state.origin = action.payload;
    },
    setDestination: (state, action: PayloadAction<LocationState | null>) => {
      state.destination = action.payload;
    },
    setTimeInformation: (state, action: PayloadAction<any | null>) => {
      state.travelTimeInformation = action.payload;
    },
  },
});

export const { setOrigin, setDestination, setTimeInformation } = mapSlice.actions;

export const selectOrigin = (state: { map: MapState }) => state.map.origin;
export const selectDestination = (state: { map: MapState }) => state.map.destination;
export const selectTravelTimeInformation = (state: { map: MapState }) =>
  state.map.travelTimeInformation;

export default mapSlice.reducer;
