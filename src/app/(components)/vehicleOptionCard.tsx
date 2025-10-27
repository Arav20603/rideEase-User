import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

interface VehicleOptionCardProps {
  title: string;
  price: string;
  selected: boolean;
  onPress: () => void;
}

const VehicleOptionCard: React.FC<VehicleOptionCardProps> = ({
  title,
  price,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.card, selected && styles.selected]}
    >
      <View>
        <Text style={[styles.title, selected && { color: "#2563eb" }]}>{title}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default VehicleOptionCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  selected: {
    backgroundColor: "#2563eb15",
    borderWidth: 2,
    borderColor: "#2563eb",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  price: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
});
