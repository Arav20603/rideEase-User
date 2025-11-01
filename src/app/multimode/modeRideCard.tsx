import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RideSegment } from "@/features/multimodeSlice/multimodeSlice";

interface Props {
  ride: RideSegment;
  onRemove: (id: string) => void;
}

const shortenText = (text?: string | null) => {
  if (!text) return "Unknown";
  const parts = text.split(",");
  if (parts.length >= 3) return `${parts[0].trim()}, ${parts[1].trim()}`;
  return text.trim();
};

const renderVehicleIcon = (vehicle: RideSegment["vehicle"]) => {
  switch (vehicle) {
    case "car":
      return <MaterialCommunityIcons name="car" size={20} color="#2563eb" />;
    case "bike":
      return <MaterialCommunityIcons name="bicycle" size={20} color="#2563eb" />;
    case "auto":
      return <MaterialCommunityIcons name="motorbike" size={20} color="#2563eb" />;
    case "metro":
      return <MaterialCommunityIcons name="subway" size={20} color="#2563eb" />;
    default:
      return <MaterialCommunityIcons name="map-marker" size={20} color="#2563eb" />;
  }
};

const ModeRideCard: React.FC<Props> = ({ ride, onRemove }) => {
  const isMetro = ride.vehicle === "metro";
  const vehicleLabel =
    typeof ride.vehicle === "string"
      ? ride.vehicle.charAt(0).toUpperCase() + ride.vehicle.slice(1)
      : "Unknown";

  const origin = ride.origin?.description ? shortenText(ride.origin.description) : "—";
  const destination = ride.destination?.description
    ? shortenText(ride.destination.description)
    : "—";

  const fromStation = shortenText(ride.metroDetails?.fromStation);
  const toStation = shortenText(ride.metroDetails?.toStation);

  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <View style={styles.iconBox}>{renderVehicleIcon(ride.vehicle)}</View>
        <View style={{ flex: 1 }}>
          <Text style={styles.vehicle}>
            {vehicleLabel} <Text style={styles.typeText}>({ride.type})</Text>
          </Text>
          {isMetro ? (
            <Text style={styles.route}>
              🚉 {fromStation} → {toStation}
            </Text>
          ) : (
            <Text style={styles.route}>
              📍 {origin} → {destination}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.trashBtn}
        onPress={() => onRemove(ride.id)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="delete-outline" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
};

export default ModeRideCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#ebf2ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  vehicle: {
    fontWeight: "700",
    color: "#111827",
    fontSize: 15,
  },
  typeText: {
    fontWeight: "500",
    color: "#6b7280",
    fontSize: 13,
  },
  route: {
    color: "#374151",
    fontSize: 13,
    marginTop: 3,
  },
  trashBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: "#fee2e2",
    marginLeft: 8,
  },
});
