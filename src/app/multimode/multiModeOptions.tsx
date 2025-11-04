import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { socket } from "@/utils/socket";
import { RootState } from "@/features/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { backendURL } from "@/constants/url";
import {
  selectTravelTimeInformation,
  setDestination,
  setOrigin,
} from "@/features/mapSlice/mapSlice";
import { rideTypes } from "@/constants/ridesConfig";
import { setRideDetails } from "@/features/rideSlice/rideSlice";

const MultiModeOptions = () => {
  const rides = useSelector((state: RootState) => state.mode.rides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const currentRide = rides[currentIndex];
  const router = useRouter();
  const [user, setUserDetails] = useState<any>(null);
  const dispatch = useDispatch();
  const travelTimeInformation = useSelector(selectTravelTimeInformation);

  // ✅ Updated: realistic Bangalore Metro fare logic
  const getFare = (vehicle: keyof typeof rideTypes, ride?: any) => {
    // 🚇 Metro fare calculation (Namma Metro style)
    if (vehicle === "metro") {
      let distanceKm = 0;

      if (travelTimeInformation?.distance?.value) {
        distanceKm = travelTimeInformation.distance.value / 1000;
      } else if (ride?.origin?.location && ride?.destination?.location) {
        const { lat: lat1, lng: lng1 } = ride.origin.location;
        const { lat: lat2, lng: lng2 } = ride.destination.location;
        const R = 6371; // km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLng = ((lng2 - lng1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        distanceKm = R * c;
      }

      if (!distanceKm || isNaN(distanceKm)) distanceKm = 3;

      // Approx metro fare (based on BMRC slab)
      let fare = 0;
      if (distanceKm <= 2) fare = 10;
      else if (distanceKm <= 5) fare = 20;
      else if (distanceKm <= 10) fare = 30;
      else if (distanceKm <= 15) fare = 40;
      else if (distanceKm <= 25) fare = 50;
      else fare = 60;

      return `₹${fare}`;
    }

    // 🚗 Normal vehicle fare
    const pricing = rideTypes[vehicle];
    if (!pricing) return "₹--";

    let distanceKm = 0;
    if (travelTimeInformation?.distance?.value) {
      distanceKm = travelTimeInformation.distance.value / 1000;
    } else if (ride?.origin?.location && ride?.destination?.location) {
      const { lat: lat1, lng: lng1 } = ride.origin.location;
      const { lat: lat2, lng: lng2 } = ride.destination.location;
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      distanceKm = R * c;
    }

    if (!distanceKm || isNaN(distanceKm)) distanceKm = 5;

    let fare = pricing.baseFare + distanceKm * pricing.pricePerKm;
    fare = Math.ceil(fare / 5) * 5;

    return `₹${fare}`;
  };

  // --- Fetch user details ---
  useEffect(() => {
    async function fetchUser() {
      try {
        const email = await AsyncStorage.getItem("user");
        if (email) {
          const res = await axios.post(`${backendURL}/get-user`, { email });
          if (res.data.success) setUserDetails(res.data.user);
        }
      } catch (error) {
        console.log("Error in fetching user:", error);
      }
    }
    fetchUser();
  }, []);

  // --- Find the first incomplete ride ---
  useEffect(() => {
    const incompleteIndex = rides.findIndex((r) => !r.completed);
    if (incompleteIndex !== -1) setCurrentIndex(incompleteIndex);
    else router.push("/home");
  }, [rides]);

  // --- Fade animation ---
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  const handleStartRide = async () => {
    if (!currentRide) return;

    dispatch(
      setOrigin({
        location: {
          lat: currentRide.origin?.location?.lat || 0,
          lng: currentRide.origin?.location?.lng || 0,
        },
        description: currentRide.origin?.description || "",
      })
    );
    dispatch(
      setDestination({
        location: {
          lat: currentRide.destination?.location?.lat || 0,
          lng: currentRide.destination?.location?.lng || 0,
        },
        description: currentRide.destination?.description || "",
      })
    );

    const computedFare = parseInt(
      getFare(currentRide.vehicle, currentRide).replace("₹", "")
    );

    const badgeMap: Record<string, string> = {
      bike: "Fastest",
      auto: "Affordable",
      car: "Standard",
      suv: "Family",
      metro: "Smart",
    };
    const badge = badgeMap[currentRide.vehicle] || "Standard";

    const rideRequest = {
      user,
      ride: {
        id: currentRide.vehicle,
        title: currentRide.vehicle,
        baseFare: rideTypes[currentRide.vehicle].baseFare,
        pricePerKm: rideTypes[currentRide.vehicle].pricePerKm,
        image: 1,
        badge,
      },
      origin: currentRide.origin,
      destination: currentRide.destination,
      fare: computedFare,
      timestamp: new Date().toISOString(),
    };

    if (currentRide.vehicle === "metro") {
      router.push({
        pathname: "/screens/metroTicket",
        params: {
          origin: currentRide.origin?.description,
          destination: currentRide.destination?.description,
          fare: computedFare,
          id: currentRide.id,
        },
      });
      return;
    }

    dispatch(setRideDetails(rideRequest));
    await AsyncStorage.setItem("currentRideId", currentRide.id);
    socket.emit("user_request", rideRequest);
    router.push("/screens/findingRider");
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

        <Text style={styles.locationText}>
          📍 {currentRide.origin?.description?.split(",")[0]} →{" "}
          {currentRide.destination?.description?.split(",")[0]}
        </Text>

        <Text style={styles.fareText}>
          Estimated Fare: {getFare(currentRide.vehicle, currentRide)}
        </Text>

        <TouchableOpacity style={styles.startBtn} onPress={handleStartRide}>
          <Ionicons name="navigate-circle" size={22} color="#fff" />
          <Text style={styles.btnText}>
            {currentRide.vehicle === "metro"
              ? "Book Metro Ticket"
              : "Start Ride"}
          </Text>
        </TouchableOpacity>
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
  fareText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
    marginTop: 10,
  },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    justifyContent: "center",
    marginTop: 25,
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
