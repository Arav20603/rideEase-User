import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";

export type LocationState = {
  location: {
    lat: number;
    lng: number;
  } | null;
  description: string | null;
};

export type VehicleType = "bike" | "car" | "auto" | "metro";

export interface RideSegment {
  id: string;
  type: "private" | "public";
  vehicle: VehicleType;
  origin?: LocationState | null;
  destination?: LocationState | null;
  metroDetails?: {
    fromStation: string;
    toStation: string;
  };
  completed: boolean;
}

export interface MultiModeState {
  mode: "single" | "multi" | null;
  rides: RideSegment[];
}

const initialState: MultiModeState = {
  mode: null,
  rides: [],
};

const multiModeSlice = createSlice({
  name: "multiMode",
  initialState,
  reducers: {
    // sets ride mode (single or multi)
    setRideMode: (state, action: PayloadAction<"single" | "multi" | null>) => {
      state.mode = action.payload;
    },

    // adds a new ride segment
    addRide: (
      state,
      action: PayloadAction<
        Partial<Omit<RideSegment, "id" | "completed">> & { id?: string }
      >
    ) => {
      const newRide: RideSegment = {
        id: action.payload.id ?? nanoid(),
        type: action.payload.type ?? "private",
        vehicle: action.payload.vehicle ?? "car",
        origin: action.payload.origin ?? null,
        destination: action.payload.destination ?? null,
        metroDetails: action.payload.metroDetails,
        completed: false,
      };
      state.rides.push(newRide);
    },

    // removes a ride segment
    removeRide: (state, action: PayloadAction<{ id: string }>) => {
      state.rides = state.rides.filter((ride) => ride.id !== action.payload.id);
    },

    // marks ride segment as completed
    markRideComplete: (state, action: PayloadAction<{ id: string }>) => {
      const ride = state.rides.find((r) => r.id === action.payload.id);
      if (ride) ride.completed = true;
    },

    // updates a ride (for origin/destination/vehicle/mode change)
    updateRide: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<RideSegment> }>
    ) => {
      const ride = state.rides.find((r) => r.id === action.payload.id);
      if (ride) Object.assign(ride, action.payload.changes);
    },

    // clears everything
    resetAllRides: (state) => {
      state.rides = [];
      state.mode = null;
    },
  },
});

export const {
  setRideMode,
  addRide,
  removeRide,
  markRideComplete,
  updateRide,
  resetAllRides,
} = multiModeSlice.actions;

export default multiModeSlice.reducer;
