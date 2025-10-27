import { StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { selectTravelTimeInformation } from "@/features/mapSlice/mapSlice";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ModeCard from "../(components)/modeCard";

const modesData = [
  { id: "bike", title: "Bike", icon: "bicycle", color: ["#0ea5e9", "#22d3ee"] },
  { id: "auto", title: "Auto", icon: "car-outline", color: ["#facc15", "#f97316"] },
  { id: "car", title: "Car", icon: "car-sport-outline", color: ["#3b82f6", "#6366f1"] },
];

const MultiMode = () => {
  const router = useRouter();
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const travelInfo = useSelector(selectTravelTimeInformation);
  const distanceValue = travelInfo?.distance?.value / 1000 || 0;
  const maxModes = distanceValue >= 20 ? 3 : 2;

  const handleSelect = (mode: string) => {
    if (selectedModes.includes(mode)) {
      setSelectedModes(selectedModes.filter((m) => m !== mode));
    } else if (selectedModes.length < maxModes) {
      setSelectedModes([...selectedModes, mode]);
    }
  };

  const handleContinue = () => {
    if (selectedModes.length > 0) {
      router.push({
        pathname: "/multimode/multiModeBook",
        params: { modes: JSON.stringify(selectedModes) },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={["#0284c7", "#06b6d4"]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Your Ride</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {/* TITLE */}
      <View style={styles.textSection}>
        <Text style={styles.title}>Select Ride Combination</Text>
        <Text style={styles.subText}>
          {distanceValue >= 20
            ? "Up to 3 rides allowed (long trip 🚗)"
            : "Up to 2 rides allowed"}
        </Text>
      </View>

      {/* RIDE OPTIONS */}
      <FlatList
        data={modesData}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <ModeCard
            title={item.title}
            icon={item.icon}
            colors={item.color}
            selected={selectedModes.includes(item.id)}
            onPress={() => handleSelect(item.id)}
          />
        )}
      />

      {/* CONTINUE BUTTON */}
      {selectedModes.length > 0 && (
        <TouchableOpacity onPress={handleContinue} activeOpacity={0.9}>
          <LinearGradient
            colors={["#2563eb", "#60a5fa"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.continueBtn}
          >
            <Text style={styles.continueText}>Continue →</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default MultiMode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 5,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  textSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  subText: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  continueBtn: {
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginBottom: 10,
  },
  continueText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
