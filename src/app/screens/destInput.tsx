import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/features/store";
import { setRideMode } from "@/features/multimodeSlice/multimodeSlice";
import { Toast } from "toastify-react-native";

const DestInput = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const rideMode = useSelector((state: RootState) => state.mode);

  const handleSelectMode = (selectedMode: "normal" | "multi") => {
    dispatch(setRideMode(selectedMode));
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <LinearGradient
        colors={["#2563eb", "#60a5fa"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <BlurView intensity={60} tint="light" style={styles.blurBox}>
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => {
              if (rideMode.mode === null) {
                return
              }
              router.push("/screens/inputSrcDestPage")
            }}
          >
            <Ionicons name="search" size={22} color="#2563eb" style={{ marginRight: 10 }} />
            <Text style={styles.placeholder}>Where to?</Text>
            <MaterialIcons name="schedule" size={20} color="#6b7280" style={{ marginLeft: "auto" }} />
          </TouchableOpacity>
        </BlurView>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="car" size={20} color="#2563eb" />
          <Text style={styles.actionText}>Set Pickup</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="star" size={20} color="#f59e0b" />
          <Text style={styles.actionText}>Saved Places</Text>
        </TouchableOpacity>
      </View>

      {/* Ride Mode */}
      <Text style={styles.sectionTitle}>Select Ride Mode</Text>
      <View style={styles.modeContainer}>
        {/* Normal Ride */}
        <TouchableOpacity
          onPress={() => handleSelectMode("normal")}
          activeOpacity={0.9}
          style={[
            styles.modeCard,
            rideMode.mode === "normal" && styles.selectedCard,
          ]}
        >
          <Ionicons
            name="car-sport"
            size={40}
            color={rideMode.mode === "normal" ? "#2563eb" : "#6b7280"}
          />
          <Text
            style={[
              styles.modeText,
              rideMode.mode === "normal" && { color: "#2563eb" },
            ]}
          >
            Normal Ride
          </Text>
        </TouchableOpacity>

        {/* Multi Ride */}
        <TouchableOpacity
          onPress={() => handleSelectMode("multi")}
          activeOpacity={0.9}
          style={[
            styles.modeCard,
            rideMode.mode === "multi" && styles.selectedCard,
          ]}
        >
          <MaterialCommunityIcons
            name="transit-connection-variant"
            size={40}
            color={rideMode.mode === "multi" ? "#2563eb" : "#6b7280"}
          />
          <Text
            style={[
              styles.modeText,
              rideMode.mode === "multi" && { color: "#2563eb" },
            ]}
          >
            Multi Ride
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DestInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },

  gradientBorder: { borderRadius: 30, padding: 2 },
  blurBox: { borderRadius: 30, overflow: "hidden" },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 52,
  },

  placeholder: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },

  quickActions: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  actionText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },

  sectionTitle: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  modeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  modeCard: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,

    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  selectedCard: {
    backgroundColor: "#2563eb15",
    borderWidth: 2,
    borderColor: "#2563eb",
  },

  modeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginTop: 6,
  },
});

