import React, { useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { socket } from "@/utils/socket";
import { backendURL } from "@/constants/url";
import {
  selectOrigin,
  selectDestination,
  selectTravelTimeInformation,
} from "@/features/mapSlice/mapSlice";
import VehicleOptionCard from "../(components)/vehicleOptionCard";
import { LinearGradient } from "expo-linear-gradient";

type Segment = {
  index: number;
  mode: string;
  distanceKm: number;
  durationSec: number;
  option: string;
  fare: number;
};

const PRICING: Record<string, { baseFare: number; perKm: number }> = {
  bike: { baseFare: 30, perKm: 10 },
  auto: { baseFare: 50, perKm: 15 },
  car: { baseFare: 80, perKm: 20 },
  luxury: { baseFare: 200, perKm: 40 },
};

const MultiModeBook = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [modes, setModes] = useState<string[]>([]);
  const [options, setOptions] = useState<{ [index: number]: string }>({});
  const [user, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const travelInfo = useSelector(selectTravelTimeInformation);

  useEffect(() => {
    if (params.modes) {
      try {
        const parsed = JSON.parse(params.modes as string);
        if (Array.isArray(parsed)) setModes(parsed);
      } catch (err) {
        console.warn("Invalid modes param:", err);
      }
    }
  }, [params.modes]);

  useEffect(() => {
    (async () => {
      try {
        const email = await AsyncStorage.getItem("user");
        if (!email) return;
        const res = await axios.post(`${backendURL}/get-user`, { email });
        if (res.data?.success) setUserDetails(res.data.user);
      } catch (err) {
        console.warn("⚠️ Failed to fetch user details:", err);
      }
    })();
  }, []);

  const handleSelectOption = (modeIndex: number, option: string) => {
    setOptions((prev) => ({ ...prev, [modeIndex]: option }));
  };

  const computeSegments = useMemo<Segment[]>(() => {
    if (!travelInfo || !modes.length) return [];

    const totalDistanceKm = (travelInfo.distance?.value ?? 0) / 1000;
    const totalDurationSec = travelInfo.duration?.value ?? 0;
    const segmentCount = modes.length;

    const distancePerSeg = totalDistanceKm / segmentCount;
    const durationPerSeg = Math.max(10, Math.floor(totalDurationSec / segmentCount));

    return modes.map((mode, idx) => {
      const option = options[idx] ?? "normal";
      const fareType = mode === "car" && option === "luxury" ? "luxury" : mode;
      const pricing = PRICING[fareType] ?? PRICING.car;

      const fare = Math.ceil((pricing.baseFare + distancePerSeg * pricing.perKm) / 5) * 5;

      return {
        index: idx,
        mode,
        distanceKm: Number(distancePerSeg.toFixed(2)),
        durationSec: durationPerSeg,
        option,
        fare,
      };
    });
  }, [modes, options, travelInfo]);

  const handleBook = async () => {
    if (!origin || !destination || !travelInfo) {
      Alert.alert("Missing Data", "Please ensure origin, destination and route info are available.");
      return;
    }

    if (!user) {
      Alert.alert("User Not Found", "Please login again to continue.");
      return;
    }

    if (!computeSegments.length) {
      Alert.alert("No Segments", "Please select at least one mode to continue.");
      return;
    }

    setLoading(true);

    const bookingId = `MM_${Date.now()}`;
    try {
      for (const seg of computeSegments) {
        const payload = {
          bookingId,
          user,
          origin,
          destination,
          ride: { id: seg.mode },
          fare: seg.fare,
          segment: {
            index: seg.index,
            option: seg.option,
            distanceKm: seg.distanceKm,
            durationSec: seg.durationSec,
          },
          totalSegments: computeSegments.length,
          segmentIndex: seg.index,
          createdAt: new Date().toISOString(),
        };

        console.log("🚀 Sending ride segment:", payload);
        socket.emit("user_request", payload);

        await new Promise((r) => setTimeout(r, 300));
      }

      setLoading(false);
      router.push({
        pathname: "/screens/findingRider",
        params: { bookingId },
      });
    } catch (err) {
      console.error("❌ Booking error:", err);
      Alert.alert("Booking Failed", "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Confirm Your Multi-Mode Setup</Text>

        {modes.map((mode, idx) => (
          <View key={idx} style={styles.segment}>
            <Text style={styles.segmentTitle}>
              Segment {idx + 1}: {mode.toUpperCase()}
            </Text>

            {mode === "car" ? (
              <>
                <VehicleOptionCard
                  title="Normal Car"
                  price="₹20/km"
                  selected={options[idx] === "normal"}
                  onPress={() => handleSelectOption(idx, "normal")}
                />
                <VehicleOptionCard
                  title="Luxury Car"
                  price="₹40/km"
                  selected={options[idx] === "luxury"}
                  onPress={() => handleSelectOption(idx, "luxury")}
                />
              </>
            ) : (
              <VehicleOptionCard
                title={`Normal ${mode}`}
                price={
                  mode === "bike"
                    ? "₹10/km"
                    : mode === "auto"
                    ? "₹15/km"
                    : "₹20/km"
                }
                selected={options[idx] === "normal" || !options[idx]}
                onPress={() => handleSelectOption(idx, "normal")}
              />
            )}
          </View>
        ))}

        {computeSegments.length > 0 && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Estimated Fares:</Text>
            {computeSegments.map((seg) => (
              <Text key={seg.index} style={styles.summaryItem}>
                {seg.mode.toUpperCase()} • ₹{seg.fare}
              </Text>
            ))}
          </View>
        )}

        {modes.length > 0 && (
          <TouchableOpacity
            disabled={loading}
            onPress={handleBook}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#2563eb", "#60a5fa"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.bookBtn, loading && { opacity: 0.7 }]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.bookText}>Book Multi-Mode Ride</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MultiModeBook;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 20,
  },
  segment: {
    marginBottom: 20,
    backgroundColor: "#f9fafb",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: 10,
  },
  summaryContainer: {
    marginVertical: 20,
    backgroundColor: "#f1f5f9",
    padding: 15,
    borderRadius: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 5,
  },
  summaryItem: {
    fontSize: 15,
    color: "#475569",
    marginBottom: 2,
  },
  bookBtn: {
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  bookText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
  },
});
