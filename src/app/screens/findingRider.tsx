import { StyleSheet, Text, TouchableOpacity, View, Alert, Button } from "react-native";
import React, { useEffect } from "react";
import Map from "./map";
import HorizontalProgressBar from "../(components)/horizontalProgressBar";
import { useRouter } from "expo-router";
import { socket } from "@/utils/socket";
import { useSelector } from "react-redux";
import { selectDestination, selectOrigin, selectTravelTimeInformation } from "@/features/mapSlice/mapSlice";
import { selectUser } from "@/features/userSlice/userSlice";

const FindingRider = () => {
  const router = useRouter();
  const user = useSelector(selectUser);
  const destination = useSelector(selectDestination);
  const origin = useSelector(selectOrigin);
  const travelTime = useSelector(selectTravelTimeInformation);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("User ride request", (data) => {
      console.log("📩 Ride request broadcasted:", data);
    });

    return () => {
      socket.off("User ride request");
      socket.disconnect();
    };
  }, []);

  const handleSendSocketMsg = () => {
    const rideRequest = {
      user,
      origin,
      destination,
      vehicle: "Bike", // <-- add from selection
      price: travelTime?.fare ?? null,
      time: travelTime?.duration?.text ?? null,
    };

    socket.emit("User ride request", rideRequest);
    console.log("🚀 Sent ride request:", rideRequest);
  };

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
          <HorizontalProgressBar progress={60} />
        </View>

        <Button title="Send Ride Request" color="blue" onPress={handleSendSocketMsg} />

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
