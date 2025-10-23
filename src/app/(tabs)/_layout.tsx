import React from "react";
import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const RootLayout = () => {
  const inset = useSafeAreaInsets()
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          left: 20,
          right: 20,
          bottom: inset.bottom,
          elevation: 0,
          borderRadius: 30,
          height: 70,
          overflow: "hidden",
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={["#eef2ff", "#e0f7fa"]} // soft gradient background
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "home" : "home-outline"}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "person" : "person-outline"}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default RootLayout;

/* Custom Tab Icon Component */
const TabIcon = ({ name, focused }: { name: any; focused: boolean }) => {
  return (
    <View style={styles.iconWrapper}>
      {focused ? (
        <LinearGradient
          colors={["#2563eb", "#50c9c3"]}
          style={styles.activeBackground}
        >
          <Ionicons name={name} size={28} color="#fff" />
        </LinearGradient>
      ) : (
        <Ionicons name={name} size={26} color="#64748b" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    top: 13,
  },
  activeBackground: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563eb",
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
