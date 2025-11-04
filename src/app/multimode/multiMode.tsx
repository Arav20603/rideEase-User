import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  FlatList,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { addRide, removeRide } from "@/features/multimodeSlice/multimodeSlice";
import { RootState, store } from "@/features/store";
import { nanoid } from "@reduxjs/toolkit";
import LocationInput from "./locationInput";
import ModeRideCard from "./modeRideCard";
import { Toast } from "toastify-react-native";
import { router } from "expo-router";
import { selectOrigin } from "@/features/mapSlice/mapSlice";

const vehicles = ["bike", "car", "auto", "metro"] as const;

const MultiMode = () => {
  const dispatch = useDispatch();
  const rides = useSelector((state: RootState) => state.mode.rides);
  const originGet = useSelector(selectOrigin);

  const [vehicle, setVehicle] = useState<typeof vehicles[number] | null>(null);
  const [origin, setOrigin] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [clearTrigger, setClearTrigger] = useState(false);
  const [isOriginSet, setIsOriginSet] = useState(false);

  const handleAddRide = () => {
    if (!vehicle) return Toast.error("Select a vehicle type");
    if (!origin || !destination)
      return Alert.alert("Select both origin and destination");

    const ride = {
      id: nanoid(),
      type: vehicle === "metro" ? "public" : "private",
      vehicle,
      origin,
      destination,
      completed: false,
    };

    dispatch(addRide(ride));
    console.log("✅ Added Ride:", ride);

    setOrigin(null);
    setDestination(null);
    setVehicle(null);
    setClearTrigger((prev) => !prev);
    setIsOriginSet(false);

    console.log("All rides:", store.getState().mode.rides);
  };

  const handleSetOrigin = () => {
    setOrigin(originGet);
    setIsOriginSet((prev) => !prev);
  };

  const renderRideItem = ({ item }: any) => (
    <ModeRideCard ride={item} onRemove={(id) => dispatch(removeRide({ id }))} />
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            data={rides}
            keyExtractor={(item) => item.id}
            renderItem={renderRideItem}
            ListHeaderComponent={
              <View>
                <Text style={styles.title}>Multi-Mode Ride Builder</Text>

                {/* Metro-specific UI */}
                {vehicle === "metro" ? (
                  <>
                    <Text style={styles.label}>From Station</Text>
                    <LocationInput
                      key={`from-${clearTrigger}`}
                      placeholder="Enter from station"
                      onSelect={(data, details) =>
                        setOrigin({
                          location: {
                            lat: details?.geometry?.location.lat,
                            lng: details?.geometry?.location.lng,
                          },
                          description: data.description,
                        })
                      }
                      clearTrigger={clearTrigger}
                    />

                    <Text style={styles.label}>To Station</Text>
                    <LocationInput
                      key={`to-${clearTrigger}`}
                      placeholder="Enter to station"
                      onSelect={(data, details) =>
                        setDestination({
                          location: {
                            lat: details?.geometry?.location.lat,
                            lng: details?.geometry?.location.lng,
                          },
                          description: data.description,
                        })
                      }
                      clearTrigger={clearTrigger}
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.label}>Origin</Text>
                    {!isOriginSet ? (
                      <LocationInput
                        key={`origin-${clearTrigger}`}
                        placeholder="Enter pickup"
                        onSelect={(data, details) =>
                          setOrigin({
                            location: {
                              lat: details?.geometry?.location.lat,
                              lng: details?.geometry?.location.lng,
                            },
                            description: data.description,
                          })
                        }
                        clearTrigger={clearTrigger}
                      />
                    ) : (
                      <TextInput
                        value={origin?.description || ""}
                        style={styles.inputDisabled}
                        editable={false}
                      />
                    )}
                    <TouchableOpacity
                      style={styles.originBtn}
                      onPress={handleSetOrigin}
                    >
                      <Text style={{ textAlign: "center", color: "white" }}>
                        {isOriginSet ? "Clear" : "Set"} Origin
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.label}>Destination</Text>
                    <LocationInput
                      key={`dest-${clearTrigger}`}
                      placeholder="Enter drop"
                      onSelect={(data, details) =>
                        setDestination({
                          location: {
                            lat: details?.geometry?.location.lat,
                            lng: details?.geometry?.location.lng,
                          },
                          description: data.description,
                        })
                      }
                      clearTrigger={clearTrigger}
                    />
                  </>
                )}

                <Text style={[styles.label, { marginTop: 16 }]}>
                  Select Vehicle
                </Text>
                <View style={styles.vehicleContainer}>
                  {vehicles.map((v) => (
                    <TouchableOpacity
                      key={v}
                      style={[
                        styles.vehicleBtn,
                        vehicle === v && styles.vehicleSelected,
                      ]}
                      onPress={() => setVehicle(v)}
                    >
                      <Ionicons
                        name={
                          v === "bike"
                            ? "bicycle"
                            : v === "car"
                            ? "car"
                            : v === "auto"
                            ? "car-sport"
                            : "train"
                        }
                        size={20}
                        color={vehicle === v ? "#2563eb" : "#6b7280"}
                      />
                      <Text
                        style={[
                          styles.vehicleText,
                          vehicle === v && { color: "#2563eb" },
                        ]}
                      >
                        {v}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={handleAddRide}
                >
                  <Text style={styles.addBtnText}>+ Add Segment</Text>
                </TouchableOpacity>

                <Text style={styles.subHeader}>Your Segments</Text>
                {rides.length === 0 && (
                  <Text style={styles.empty}>No segments added yet</Text>
                )}
              </View>
            }
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.bookBtn, rides.length === 0 && styles.bookBtnDisabled]}
        disabled={rides.length === 0}
        onPress={() => router.push("/screens/booking")}
      >
        <Ionicons name="checkmark-circle" size={22} color="#fff" />
        <Text style={styles.bookBtnText}>
          {rides.length === 0 ? "Add a Segment First" : "Book Ride"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MultiMode;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 16, paddingBottom: 120 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 10 },
  subHeader: { fontSize: 18, fontWeight: "600", marginTop: 24 },
  label: { fontSize: 15, fontWeight: "500", marginTop: 12 },
  vehicleContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  vehicleBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  vehicleSelected: {
    backgroundColor: "#2563eb15",
    borderColor: "#2563eb",
    borderWidth: 2,
  },
  vehicleText: { marginLeft: 6, fontSize: 14, fontWeight: "500" },
  addBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  addBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  empty: { color: "#6b7280", marginTop: 10, textAlign: "center" },
  inputDisabled: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  originBtn: {
    backgroundColor: "#2563eb",
    width: "30%",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
  },
  bookBtn: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 40 : 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 18,
    shadowColor: "#2563eb",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    gap: 8,
  },
  bookBtnText: { color: "#fff", fontSize: 17, fontWeight: "700", letterSpacing: 0.5 },
  bookBtnDisabled: { backgroundColor: "#9ca3af", opacity: 0.9, shadowOpacity: 0 },
});
