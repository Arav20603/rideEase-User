import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from "react-native";
import { useSelector } from "react-redux";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { socket } from "@/utils/socket";
import { RootState } from "@/features/store";

const MultiModeOptions = () => {
  const rides = useSelector((state: RootState) => state.mode.rides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const currentRide = rides[currentIndex];
  const router = useRouter();

  // Handle animation on ride change
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  // Listen for backend signal when ride is completed by driver
  useEffect(() => {
    const handler = (data: any) => {
      console.log("Ride completed event:", data);

      if (currentIndex < rides.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
        Alert.alert("Next Segment", "Your next ride segment is ready to book!");
      } else {
        Alert.alert("Journey Completed 🎉", "You’ve completed all ride segments!");
      }
    };

    socket.on("ride_completed", handler);

    return () => {
      socket.off("ride_completed", handler);
    };
  }, [currentIndex, rides]);

  // Handle starting ride or metro booking
  const handleStartRide = () => {
    if (!currentRide) return;

    if (currentRide.vehicle === "metro") {
      // return router.push("/metroTicket"); // redirect to metro ticket screen
    }

    const rideRequest = {
      user: { email: "user@email.com", name: "John Doe", phone: "9999999999" },
      ride: {
        id: currentRide.vehicle,
        title: currentRide.vehicle,
        baseFare: 30,
        pricePerKm: 10,
        image: 1,
        badge: "Fastest",
      },
      origin: currentRide.origin,
      destination: currentRide.destination,
      fare: 100,
      timestamp: new Date(),
    };

    socket.emit("user_request", rideRequest);
    Alert.alert("Ride Requested", `Request sent for ${currentRide.vehicle}`);
  };

  if (!currentRide) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="car-outline" size={48} color="#9ca3af" />
        <Text style={styles.empty}>No rides found</Text>
      </View>
    );
  }

  const iconMap: Record<string, any> = {
    bike: "bicycle",
    car: "car-outline",
    auto: "car-sport-outline",
    metro: "train",
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Segment {currentIndex + 1} / {rides.length}
      </Text>

      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <View style={styles.headerRow}>
          <MaterialCommunityIcons
            name={iconMap[currentRide.vehicle]}
            size={30}
            color="#2563eb"
          />
          <Text style={styles.vehicleText}>
            {currentRide.vehicle.toUpperCase()}
          </Text>
        </View>

        {currentRide.vehicle === "metro" ? (
          <Text style={styles.locationText}>
            🚇 {currentRide.metroDetails?.fromStation} →{" "}
            {currentRide.metroDetails?.toStation}
          </Text>
        ) : (
          <Text style={styles.locationText}>
            📍 {currentRide.origin?.description?.split(",")[0]} →{" "}
            {currentRide.destination?.description?.split(",")[0]}
          </Text>
        )}

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.startBtn} onPress={handleStartRide}>
            <Ionicons name="navigate-circle" size={22} color="#fff" />
            <Text style={styles.btnText}>
              {currentRide.vehicle === "metro"
                ? "Book Metro Ticket"
                : "Start Ride"}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default MultiModeOptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  vehicleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563eb",
    marginLeft: 10,
    textTransform: "capitalize",
  },
  locationText: {
    fontSize: 15,
    color: "#374151",
    marginVertical: 6,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    justifyContent: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 16,
    marginTop: 10,
  },
});
