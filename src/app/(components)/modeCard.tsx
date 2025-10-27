import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type ModeCardProps = {
  title: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
  colors?: any;
};

const ModeCard = ({ title, icon, selected, onPress, colors }: ModeCardProps) => {
  const defaultColors: string[] = ["#e5e7eb", "#f3f4f6"];
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.wrapper, selected && styles.selected]}
    >
      <LinearGradient
        colors={colors ?? defaultColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, selected && styles.cardSelected]}
      >
        <Ionicons
          name={icon as any}
          size={28}
          color={selected ? "#fff" : "#1e293b"}
          style={{ marginBottom: 8 }}
        />
        <Text style={[styles.title, selected && { color: "#fff" }]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default ModeCard;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
  },
  card: {
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    elevation: 4,
    backgroundColor: "#fff",
  },
  cardSelected: {
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  selected: {
    transform: [{ scale: 1.03 }],
  },
});
