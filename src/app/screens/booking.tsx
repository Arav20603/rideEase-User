// screens/Booking.tsx
import { StyleSheet, View } from "react-native";
import React from "react";
import RideOptions from "../(components)/rideOptions";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { setDestination } from "@/features/mapSlice/mapSlice";
import Map from "./map";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootState } from "@/features/store";
import MultiMode from "../multimode/multiMode";

const Booking = () => {
  const router = useRouter()
  const rideMode = useSelector((state: RootState) => state.mode)
  const dispatch = useDispatch()

  const handleBackPress = () => {
    router.push('/home')
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Map Section */}
      <Ionicons onPress={handleBackPress} name="arrow-back" size={30} color={'white'} style={styles.icon} />
      <View style={styles.mapContainer}>
        <Map />
      </View>

      {/* Ride Options */}
      <View style={styles.optionsContainer}>
        { rideMode.mode == 'normal' ? <RideOptions />
        : <MultiMode />}
        
      </View>
    </SafeAreaView>
  );
};

export default Booking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  mapContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    height: '50%'
  },
  optionsContainer: {
    flex: 1,
  },
  icon: {
    position: 'absolute',
    zIndex: 999,
    top: 30,
    left: 10,
    backgroundColor: 'black',
    paddingLeft: 10,
    paddingRight: 10,
    padding: 3,
    borderRadius: 30,
  }
});
