import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
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
  const [options, setOptions] = useState<{ [modeIndex: string]: string }>({});
  const [user, setUserDetails] = useState<any>(null);

  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const travelInfo = useSelector(selectTravelTimeInformation);

  useEffect(() => {
    if (params.modes) {
      setModes(JSON.parse(params.modes as string));
    }
  }, [params.modes]);

  useEffect(() => {
    (async () => {
      try {
        const email = await AsyncStorage.getItem("user");
        if (email) {
          const res = await axios.post(`${backendURL}/get-user`, { email });
          if (res.data?.success) setUserDetails(res.data.user);
        }
      } catch (err) {
        console.warn("⚠️ Failed to load user", err);
      }
    })();
  }, []);

  const handleSelectOption = (modeIndex: number, option: string) => {
    setOptions((p) => ({ ...p, [modeIndex]: option }));
  };

  const computeSegments = (): Segment[] => {
    const totalDistanceMeters = travelInfo?.distance?.value ?? 0;
    const totalDurationSec = travelInfo?.duration?.value ?? 0;
    const totalDistanceKm = totalDistanceMeters / 1000 || 0;
    const num = modes.length || 1;

    const perDistanceKm = totalDistanceKm / num;
    const perDurationSec = Math.max(10, Math.floor(totalDurationSec / num));

    return modes.map((mode, idx) => {
      const option = options[idx] ?? "normal";
      const pricingKey =
        mode === "car" && option === "luxury" ? "luxury" : mode;
      const pr = PRICING[pricingKey] ?? PRICING.car;
      let fare = pr.baseFare + perDistanceKm * pr.perKm;
      fare = Math.ceil(fare / 5) * 5;

      return {
        index: idx,
        mode,
        distanceKm: Number(perDistanceKm.toFixed(2)),
        durationSec: perDurationSec,
        option,
        fare,
      };
    });
  };

  const handleBook = async () => {
    if (!origin || !destination || !travelInfo) {
      Alert.alert("Missing data", "Origin / destination / travel info missing.");
      return;
    }

    const segments = computeSegments();
    const bookingId = `mm_${Date.now()}`;

    // Emit one socket event per segment, same as single mode payload
    for (const segment of segments) {
      const ridePayload = {
        bookingId,
        user,
        origin,
        destination,
        ride: { id: segment.mode },
        fare: segment.fare,
        segment: {
          index: segment.index,
          option: segment.option,
          distanceKm: segment.distanceKm,
          durationSec: segment.durationSec,
        },
        totalSegments: segments.length,
        segmentIndex: segment.index,
        createdAt: new Date().toISOString(),
      };

      console.log("🚀 Emitting segment ride:", ridePayload);
      socket.emit("user_request", ridePayload);

      // slight delay to avoid socket overlap
      await new Promise((res) => setTimeout(res, 500));
    }

    router.push({
      pathname: "/screens/findingRider",
      params: { bookingId },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
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
                price="₹35/km"
                selected={options[idx] === "normal"}
                onPress={() => handleSelectOption(idx, "normal")}
              />
              <VehicleOptionCard
                title="Luxury Car"
                price="₹70/km"
                selected={options[idx] === "luxury"}
                onPress={() => handleSelectOption(idx, "luxury")}
              />
            </>
          ) : (
            <VehicleOptionCard
              title={`Normal ${mode}`}
              price="₹25/km"
              selected={options[idx] === "normal" || !options[idx]}
              onPress={() => handleSelectOption(idx, "normal")}
            />
          )}
        </View>
      ))}

      {modes.length > 0 && (
        <TouchableOpacity onPress={handleBook} activeOpacity={0.9}>
          <LinearGradient
            colors={["#2563eb", "#60a5fa"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bookBtn}
          >
            <Text style={styles.bookText}>Book Multi-Mode Ride</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default MultiModeBook;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 20, fontWeight: "700", color: "#111827", marginBottom: 20 },
  segment: { marginBottom: 18 },
  segmentTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2563eb",
    marginBottom: 10,
  },
  bookBtn: {
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  bookText: { fontSize: 16, color: "#fff", fontWeight: "600" },
});
