import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { markRideComplete } from "@/features/multimodeSlice/multimodeSlice";
import { RootState } from "@/features/store";

// Mock QR image
const MOCK_QR =
  "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MetroTicket";

const MetroTicket = () => {
  const { origin, destination, fare, id } = useLocalSearchParams();
  const [paid, setPaid] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [navigateTo, setNavigateTo] = useState<null | "/home" | "/multimode/multiModeOptions">(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const rides = useSelector((state: RootState) => state.mode.rides);

  const handleFakePayment = () => {
    Alert.alert("✅ Payment Successful", "Your metro ticket has been booked!");
    setPaid(true);
  };

  const handleReachedStop = async () => {
    await AsyncStorage.removeItem("currentRideId");

    const rideId = Array.isArray(id) ? id[0] : id ?? "";
    dispatch(markRideComplete({ id: rideId }));

    const remaining = rides.filter((r) => !r.completed);

    // Use router.replace instead of router.push + state flag
    if (remaining.length === 0) {
      Alert.alert("Journey Complete 🎉", "All segments finished!", [
        { text: "OK", onPress: () => router.replace("/home") },
      ]);
    } else {
      Alert.alert("Segment Complete ✅", "Next ride ready!", [
        { text: "OK", onPress: () => router.replace("/screens/booking") },
      ]);
    }
  };


  // Safe navigation effect
  useEffect(() => {
    if (navigateTo) {
      const msg =
        navigateTo === "/home"
          ? "Journey Complete 🎉 All segments finished!"
          : "Segment Complete ✅ Next ride ready!";
      Alert.alert(msg);
      router.push(navigateTo);
    }
  }, [navigateTo]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎟 Metro Ticket</Text>

      <View style={styles.ticketCard}>
        <View style={styles.ticketHeader}>
          <Ionicons name="train" size={50} color="#2563eb" />
          <Text style={styles.ticketTitle}>Bengaluru Metro</Text>
        </View>

        <View style={styles.routeSection}>
          <Text style={styles.station}>{origin}</Text>
          <Ionicons name="arrow-down" size={24} color="#555" />
          <Text style={styles.station}>{destination}</Text>
        </View>

        <Text style={styles.fareText}>Fare: ₹{fare}</Text>
      </View>

      {!paid ? (
        <TouchableOpacity style={styles.payBtn} onPress={handleFakePayment}>
          <Ionicons name="card" size={22} color="#fff" />
          <Text style={styles.payText}>Pay ₹{fare}</Text>
        </TouchableOpacity>
      ) : !showQR ? (
        <TouchableOpacity style={styles.qrBtn} onPress={() => setShowQR(true)}>
          <Ionicons name="qr-code-outline" size={22} color="#fff" />
          <Text style={styles.qrText}>Show QR for Entry</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.qrSection}>
          <Image source={{ uri: MOCK_QR }} style={styles.qrImage} />
          <Text style={styles.qrNote}>
            Scan this QR code at the metro gate for entry
          </Text>
          <TouchableOpacity
            style={styles.reachBtn}
            onPress={handleReachedStop}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.reachText}>Reached Stop</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MetroTicket;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e3a8a",
    marginVertical: 25,
  },
  ticketCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  ticketHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e40af",
    marginTop: 5,
  },
  routeSection: {
    alignItems: "center",
    marginVertical: 12,
  },
  station: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
    marginVertical: 4,
  },
  fareText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563eb",
    marginTop: 10,
  },
  payBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 14,
    marginTop: 30,
    elevation: 3,
  },
  payText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  qrBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 14,
    marginTop: 30,
  },
  qrText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  qrSection: {
    alignItems: "center",
    marginTop: 25,
  },
  qrImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  qrNote: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 20,
  },
  reachBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e40af",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    elevation: 2,
  },
  reachText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 6,
  },
});
