import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const DestInput = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Glassy Search Bar */}
      <LinearGradient
        colors={["#2563eb", "#60a5fa"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <BlurView intensity={60} tint="light" style={styles.blurBox}>
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => router.push("/screens/inputSrcDestPage")}
          >
            <Ionicons
              name="search"
              size={22}
              color="#2563eb"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.placeholder}>Where to?</Text>
            <MaterialIcons
              name="schedule"
              size={20}
              color="#6b7280"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
        </BlurView>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="locate" size={20} color="#2563eb" />
          <Text style={styles.actionText}>Set Pickup</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="star" size={20} color="#f59e0b" />
          <Text style={styles.actionText}>Saved Places</Text>
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
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
  },
  gradientBorder: {
    borderRadius: 30,
    padding: 2,
  },
  blurBox: {
    borderRadius: 30,
    overflow: "hidden",
  },
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
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },
});
