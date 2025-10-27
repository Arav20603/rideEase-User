import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Alert } from "react-native";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store";
import RiderTrackMap from "../(components)/riderTrackMap";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { socket } from "@/utils/socket";
import { Toast } from "toastify-react-native";

const { height, width } = Dimensions.get("window");

const BookingConfirmed = () => {
  const ride = useSelector((state: RootState) => state.ride);

  // Vehicle icons mapping
  const vehicleIcons: any = {
    bike: require("../../assets/icons/bike.png"),
    auto: require("../../assets/icons/rickshaw.png"),
    car: require("../../assets/icons/car.png"),
    suv: require("../../assets/icons/suv.png"),
    luxury: require("../../assets/icons/luxury.png"),
  };

  const vehicleType: keyof typeof vehicleIcons | undefined =
    ride.rider?.vehicleType as keyof typeof vehicleIcons | undefined;
  const vehicleImage = vehicleType ? vehicleIcons[vehicleType] : vehicleIcons.car;

  const handleCancel = () => {
    Alert.alert('Ride cancel', 'Do you want to cancel the ride?', [
      {
        text: 'No',
        style: 'cancel'
      },
      {
        text: 'Cancel',
        style: 'destructive',
        onPress: () => {
          socket.emit('user_cancelled_ride', { msg: 'user cancelled' })
          router.push('/home')
        }
      }
    ])
  }

  useEffect(() => {
    socket.on('ride_start', (msg) => {
      if (msg)
      router.push('/rideStarted')
    })
  }, [])

  useEffect(() => {
    socket.on('rider_cancelled_ride', (msg) => {
      if (msg) {
        Toast.show({ text1: 'Rider cancelled ride', type: 'error', visibilityTime: 2000 })
        router.push('/screens/findingRider')
      }
    })
  }, [])

  return (
    <View style={styles.container}>
      {/* Map */}
      <View style={styles.mapContainer}>
        <RiderTrackMap />
      </View>

      {/* Bottom Panel */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>🎉 Booking Confirmed!</Text>
        <Text style={styles.sub}>Your rider is on the way 🚖</Text>

        {/* Rider Card */}
        <View style={styles.riderCard}>
          <Image source={vehicleImage} style={styles.vehicleImage} />
          <View style={styles.riderInfo}>
            <Text style={styles.riderName}>{ride.rider?.name || "Rider Name"}</Text>

            <View style={styles.detailRow}>
              <Ionicons name="call" size={18} color="#007bff" />
              <Text style={styles.riderDetailText}>{ride.rider?.phone || "+91 ————"}</Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="badge-account" size={18} color="#555" />
              <Text style={styles.riderDetailText}>OTP: {ride.otp || "1234"}</Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="car" size={18} color="#555" />
              <Text style={styles.riderDetailText}>
                {ride.rider?.vehicleType || "Vehicle"} - {ride.rider?.plateNo || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Contact & Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="call" size={22} color="#fff" />
            <Text style={styles.contactText}>Contact Rider</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.reachedButton}>
            <Text style={styles.reachedText}>Reached Pickup</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleCancel}
          style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingConfirmed;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  mapContainer: { height: height * 0.5, borderBottomWidth: 1, borderBottomColor: "#ddd" },

  infoContainer: {
    flex: 1,
    padding: 25,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: -5 },
  },

  title: { fontSize: 26, fontWeight: "700", color: "#003366", marginBottom: 5 },
  sub: { fontSize: 16, color: "#555", marginBottom: 20 },

  riderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f3f6",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 25,
  },
  vehicleImage: { width: 90, height: 90, resizeMode: "contain", marginRight: 20 },
  riderInfo: { flex: 1 },

  riderName: { fontSize: 20, fontWeight: "700", marginBottom: 8, color: "#222" },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  riderDetailText: { marginLeft: 8, fontSize: 15, color: "#555" },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  contactButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  contactText: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 },

  reachedButton: {
    flex: 1,
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  reachedText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  cancelBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    backgroundColor: 'black',
    padding: 10,
    width: '90%',
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 10
  }
});
