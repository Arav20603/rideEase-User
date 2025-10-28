import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type ModeCardProps = {
  title: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
  colors?: string[];
};

const ModeCard = ({ title, icon, selected, onPress, colors }: ModeCardProps) => {
  const defaultColors = ["#f9fafb", "#f3f4f6"];
  const selectedColors = colors ?? ["#3b82f6", "#06b6d4"];

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.container, selected && { transform: [{ scale: 1.04 }] }]}
    >
      <LinearGradient
        colors={selected ? selectedColors : defaultColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, selected && styles.cardSelected]}
      >
        <View
          style={[
            styles.iconWrapper,
            selected ? styles.iconSelected : styles.iconDefault,
          ]}
        >
          <Ionicons
            name={icon as any}
            size={22}
            color={selected ? "#fff" : "#2563eb"}
          />
        </View>

        <Text style={[styles.title, selected && styles.titleSelected]}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default ModeCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 6,
    marginVertical: 8,
    borderRadius: 14,
  },
  card: {
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: "#fff",
  },
  cardSelected: {
    elevation: 6,
    shadowColor: "#3b82f6",
    shadowOpacity: 0.25,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  iconDefault: {
    backgroundColor: "#eff6ff",
  },
  iconSelected: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
  },
  titleSelected: {
    color: "#fff",
  },
});
