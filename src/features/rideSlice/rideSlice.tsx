import { createSlice } from '@reduxjs/toolkit'

type LocationState = {
  location: {
    lat: number,
    lng: number
  } | null,
  description: string | null
}

type RiderState = {
  email: string | null,
  name: string | null,
  phone: string | null,
  vehicle: {
    type: string,
    plateNumber: string
  }
}

type RideState = {
  id: string,
  title: string,
  baseFare: string,
  pricePerKm: string,
  image: number,
  badge: 'Fastest'
}

export interface RideProps {
  origin:LocationState | null
  fare: number | 0,
  destination: LocationState | null
  rider: RiderState | null,
  riderLocation: LocationState | null,
  rideDetails: RideState | null
}

const initialState: RideProps = {
  origin: null,
  fare: 0,
  destination: null,
  rider: null,
  riderLocation: null,
  rideDetails: null
}

export const riderSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setRideDetails: (state, action) => {
      state.origin = action.payload.origin
      state.destination = action.payload.destination
      state.fare = action.payload.fare
      state.rideDetails = action.payload.ride
    },
    setRiderDetails: (state, action) => {
      state.rider = action.payload.rider
      state.riderLocation = action.payload.riderLocation
    }
  }
})

export const { setRideDetails, setRiderDetails } = riderSlice.actions

export default riderSlice.reducer