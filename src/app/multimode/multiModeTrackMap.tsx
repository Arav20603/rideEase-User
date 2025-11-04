import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Image, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, LatLng } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store";
import { GOOGLE_MAPS_API_KEY } from "@/constants/apiUrl";
import { socket } from "@/utils/socket";
import { router } from "expo-router";

const MultiModeTrackMap = () => {
  const mapRef = useRef<MapView | null>(null);
  const { rides } = useSelector((state: RootState) => state.mode);
  const [riderCoords, setRiderCoords] = useState<LatLng | null>(null);
  const [vehicleType, setVehicleType] = useState<string>("car");

  // --- Find the active (incomplete) segment ---
  const activeRide = rides.find((r) => !r.completed) || rides[rides.length - 1];
  if (!activeRide) return null;

  // --- Extract coordinates ---
  const userCoords: LatLng | null = activeRide.origin?.location
    ? {
        latitude: activeRide.origin.location.lat,
        longitude: activeRide.origin.location.lng,
      }
    : null;

  const destCoords: LatLng | null = activeRide.destination?.location
    ? {
        latitude: activeRide.destination.location.lat,
        longitude: activeRide.destination.location.lng,
      }
    : null;

  // --- Vehicle icons ---
  const vehicleIcons: Record<string, any> = {
    bike: require("@/assets/icons/bike.png"),
    car: require("@/assets/icons/car.png"),
    auto: require("@/assets/icons/rickshaw.png"),
    suv: require("@/assets/icons/car.png"),
    // metro: require("@/assets/icons/train.png"),
  };
  const vehicleIcon = vehicleIcons[vehicleType] || vehicleIcons.car;

  // --- Listen for rider location updates ---
  useEffect(() => {
    const handleLocation = (data: any) => {
      const { lat, lng, vehicle } = data?.location || data?.riderLocation || {};
      if (lat && lng) {
        const newCoords = { latitude: lat, longitude: lng };
        setRiderCoords(newCoords);

        if (vehicle) setVehicleType(vehicle.toLowerCase());

        mapRef.current?.animateCamera(
          {
            center: newCoords,
            pitch: 0,
            heading: 0,
            zoom: 16,
          },
          { duration: 800 }
        );
      }
    };

    socket.on("rider_location", handleLocation);
    return () => {socket.off("rider_location", handleLocation);}
  }, []);

  // --- Fit map once when coords ready ---
  useEffect(() => {
    if (mapRef.current && userCoords && destCoords) {
      setTimeout(() => {
        mapRef.current?.fitToSuppliedMarkers(["user", "destination"], {
          edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
          animated: true,
        });
      }, 500);
    }
  }, [userCoords, destCoords]);

  // --- Handle cancellation ---
  useEffect(() => {
    socket.on("rider_cancelled_ride", (msg) => {
      if (msg) router.push("/screens/findingRider");
    });
    return () => {socket.off("rider_cancelled_ride");}
  }, []);

  // --- Render nothing until we have main coords ---
  if (!userCoords || !destCoords) return null;

  return (
    <MapView
      ref={mapRef}
      provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
      style={styles.map}
      initialRegion={{
        latitude: userCoords.latitude,
        longitude: userCoords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
    >
      {/* Rider Marker */}
      {riderCoords && (
        <Marker
          identifier="rider"
          coordinate={riderCoords}
          title="Rider"
          description="Rider's live location"
        >
          <Image source={vehicleIcon} style={styles.riderIcon} />
        </Marker>
      )}

      {/* User Marker */}
      <Marker
        identifier="user"
        coordinate={userCoords}
        title="Pickup"
        description={activeRide.origin?.description || "Pickup location"}
      />

      {/* Destination Marker */}
      <Marker
        identifier="destination"
        coordinate={destCoords}
        title="Destination"
        description={activeRide.destination?.description || "Destination"}
      >
        <Image
          source={require("@/assets/icons/destination.png")}
          style={styles.destIcon}
        />
      </Marker>

      {/* Route line */}
      {userCoords && destCoords && (
        <MapViewDirections
          origin={userCoords}
          destination={destCoords}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={5}
          strokeColor="#007AFF"
          onReady={() => {
            mapRef.current?.fitToSuppliedMarkers(["user", "destination"], {
              edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
              animated: true,
            });
          }}
        />
      )}
    </MapView>
  );
};

export default MultiModeTrackMap;

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  riderIcon: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },
  destIcon: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },
});
