import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/features/userSlice/userSlice";

const BookingConfirmed = () => {
  const user = useSelector(selectUser)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Booking Confirmed!</Text>
      <Text style={styles.sub}>Your rider is on the way 🚖</Text>
    </View>
  );
};

export default BookingConfirmed;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc" },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 12 },
  sub: { fontSize: 18, color: "#555" },
});
