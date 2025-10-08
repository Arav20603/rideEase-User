import { StyleSheet, Text, TouchableOpacity, View, Alert, Button } from "react-native";
import React, { useEffect } from "react";
import Map from "./map";
import HorizontalProgressBar from "../(components)/horizontalProgressBar";
import { useRouter } from "expo-router";
import { socket } from "@/utils/socket";
import { useDispatch, useSelector } from "react-redux";
import { selectDestination, selectOrigin, selectTravelTimeInformation } from "@/features/mapSlice/mapSlice";
import { selectUser } from "@/features/userSlice/userSlice";
import { setRiderDetails } from "@/features/rideSlice/rideSlice";

const FindingRider = () => {
  const router = useRouter();
  const dispatch = useDispatch()

  useEffect(() => {
    socket.on("ride_accept", (data) => {
      console.log("📩 Rider details:", data);
      const {rider, riderLocation} = data.riderDetails
      dispatch(setRiderDetails({
        rider,
        riderLocation
      }))
      router.push('/screens/bookingConfirmed')
    });

    return () => {
      socket.off("ride_accept");
    };
  }, []);

  const handleCancel = () => {
    Alert.alert("Cancel the ride", "Are you sure you want to cancel?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <Map />
      </View>

      <View style={styles.rideContainer}>
        <Text style={styles.text}>Finding you the best ride…</Text>
        <Text style={styles.text}>Please wait</Text>

        <View style={{ marginTop: 30, width: "80%" }}>
          <HorizontalProgressBar progress={80} />
        </View>

        <TouchableOpacity onPress={handleCancel} style={styles.btnContainer}>
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FindingRider;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  mapContainer: { borderBottomWidth: 1, borderBottomColor: "#e5e7eb", height: "50%" },
  rideContainer: { flex: 1, alignItems: "center", backgroundColor: "#F0F8FF", paddingTop: 70 },
  text: { fontSize: 20, fontWeight: "600" },
  btnContainer: { marginTop: 140, backgroundColor: "#A9A9A9", padding: 14, width: 250, borderRadius: 20 },
  btnText: { textAlign: "center", fontSize: 18, color: "white", fontWeight: "500" },
});
