import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/features/userSlice/userSlice";
import { RootState } from "@/features/store";
import RiderTrackMap from "../(components)/riderTrackMap"; // adjust path if needed

const { height } = Dimensions.get("window");

const BookingConfirmed = () => {
  const user = useSelector(selectUser);
  const ride = useSelector((state: RootState) => state.ride);

  return (
    <View style={styles.container}>
      {/* Top Half - Live Map */}
      <View style={styles.mapContainer}>
        <RiderTrackMap />
      </View>

      {/* Bottom Half - Rider Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>🎉 Booking Confirmed!</Text>
        <Text style={styles.sub}>Your rider is on the way 🚖</Text>

        <Text style={styles.detail}>Rider: {ride.rider?.name}</Text>
        <Text style={styles.detail}>Phone: {ride.rider?.phone}</Text>
        <Text style={styles.detail}>
          Vehicle: {ride.rider?.vehicle?.type || "N/A"}
        </Text>
      </View>
    </View>
  );
};

export default BookingConfirmed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  mapContainer: {
    height: height * 0.5, // half screen
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 10 },
  sub: { fontSize: 18, color: "#555", marginBottom: 20 },
  detail: { fontSize: 16, color: "#333", marginVertical: 4 },
});
