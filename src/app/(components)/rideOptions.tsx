import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectDestination, selectOrigin, selectTravelTimeInformation } from "@/features/mapSlice/mapSlice";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { socket } from "@/utils/socket";
import { selectUser } from "@/features/userSlice/userSlice";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { backendURL } from "@/constants/url";


const RideOptions = () => {
  const [selected, setSelected] = useState<any>(null);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const [user, setUser] = useState(null)
  

  useEffect(() => {
    async function fetchUser() {
      try {
        const email = await AsyncStorage.getItem('user')
        if (email) {
          const res = await axios.post(`${backendURL}/get-user`, {email})
          if (res.data.success) {
            setUser(res.data.user)
          }
        }
      } catch (error) {
        console.log('Error in fetching user')
      }
    }
    fetchUser()
  }, [])

  const rides = [
    { id: "bike", title: "Bike", baseFare: 30, pricePerKm: 10, image: require("../../assets/icons/bike.png"), badge: "Fastest" },
    { id: "auto", title: "Auto Rickshaw", baseFare: 50, pricePerKm: 15, image: require("../../assets/icons/rickshaw.png"), badge: "Affordable" },
    { id: "taxi", title: "Taxi", baseFare: 80, pricePerKm: 20, image: require("../../assets/icons/taxi.png"), badge: "Standard" },
    { id: "suv", title: "SUV", baseFare: 120, pricePerKm: 25, image: require("../../assets/icons/suv.png"), badge: "Family" },
    { id: "luxury", title: "Luxury", baseFare: 200, pricePerKm: 40, image: require("../../assets/icons/luxury.png"), badge: "Premium" },
  ];

  const getFare = (ride: any) => {
    if (!travelTimeInformation) return "--";
    const distanceKm = travelTimeInformation.distance.value / 1000;
    let fare = ride.baseFare + distanceKm * ride.pricePerKm;
    fare = Math.ceil(fare / 5) * 5;
    return `₹${fare}`;
  };

  const handleSelectRide = () => {
    if (!selected || !origin || !destination) {
      console.warn("Missing ride selection or locations");
      return;
    }

    const distanceKm = travelTimeInformation.distance.value / 1000;
    let computedFare = selected.baseFare + distanceKm * selected.pricePerKm;
    computedFare = Math.ceil(computedFare / 5) * 5;

    // Send data to backend
    socket.emit("user_request", {
      user: user,
      ride: selected,
      origin,
      fare: computedFare,
      destination,
      timestamp: new Date(),
    })
    router.push("/screens/findingRider");
  };


  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={["#0284c7", "#06b6d4"]} style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#fff" onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Choose Your Ride</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {/* RIDE LIST */}
      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 150, paddingTop: 10 }}
        renderItem={({ item }) => {
          const isSelected = selected?.id === item.id;

          return (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setSelected(item);
                Animated.sequence([
                  Animated.spring(scaleAnim, { toValue: 1.05, useNativeDriver: true }),
                  Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
                ]).start();
              }}
            >
              <Animated.View style={[styles.option, isSelected && styles.selected, { transform: [{ scale: isSelected ? scaleAnim : 1 }] }]}>
                <Image source={item.image} style={styles.image} />
                <View style={styles.textContainer}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={[styles.optionTitle, isSelected && styles.selectedText]}>{item.title}</Text>
                    {item.badge && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.subText}>
                    {travelTimeInformation ? `${travelTimeInformation.distance.text}` : "--"}
                  </Text>
                </View>
                <Text style={styles.fare}>{getFare(item)}</Text>
              </Animated.View>
            </TouchableOpacity>
          );
        }}
      />

      {/* FOOTER */}
      {selected && (
        <View style={styles.footer}>
          <Text style={styles.footerNote}>Driver will arrive in ~5 mins</Text>
          <LinearGradient colors={["#0284c7", "#06b6d4"]} style={styles.confirmBtn}>
            <TouchableOpacity onPress={handleSelectRide} activeOpacity={0.9} style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Text style={styles.confirmText}>Book {selected.title}</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

export default RideOptions;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 15, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

  option: { flexDirection: "row", alignItems: "center", marginHorizontal: 20, marginVertical: 8, padding: 14, borderRadius: 16, backgroundColor: "#fff", elevation: 3, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 4 },
  selected: { borderWidth: 2, borderColor: "#0284c7", backgroundColor: "#f0faff" },
  image: { width: 55, height: 55, marginRight: 15, resizeMode: "contain" },
  textContainer: { flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  selectedText: { color: "#0284c7" },
  subText: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  fare: { fontSize: 15, fontWeight: "600", color: "#111827" },

  badge: { backgroundColor: "#e0f2fe", marginLeft: 8, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeText: { fontSize: 11, color: "#0284c7", fontWeight: "600" },

  footer: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#e5e7eb" },
  footerNote: { textAlign: "center", fontSize: 13, color: "#6b7280", marginBottom: 8 },
  confirmBtn: { borderRadius: 14, height: 52, justifyContent: "center", shadowColor: "#0284c7", shadowOpacity: 0.25, shadowRadius: 6, elevation: 5 },
  confirmText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
