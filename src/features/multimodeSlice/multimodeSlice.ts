import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type RideMode = "normal" | "multi" | null;

interface Point {
  lat: number;
  lng: number;
}

interface Segment {
  start: Point;
  end: Point;
  mode?: string;
}

interface MultiModeState {
  mode: RideMode;
  segments: Segment[];
}

const initialState: MultiModeState = {
  mode: null,
  segments: [],
};

const multimodeSlice = createSlice({
  name: "mode",
  initialState,
  reducers: {
    setRideMode: (state, action: PayloadAction<RideMode>) => {
      state.mode = action.payload;
    },
    setSegments: (state, action: PayloadAction<Segment[]>) => {
      state.segments = action.payload;
    },
    clearSegments: (state) => {
      state.segments = [];
    },
  },
});

export const { setRideMode, setSegments, clearSegments } = multimodeSlice.actions;
export default multimodeSlice.reducer;
