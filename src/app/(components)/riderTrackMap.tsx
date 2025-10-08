import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Image, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, LatLng } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store";
import { GOOGLE_MAPS_API_KEY } from "@/constants/apiUrl";
import { socket } from "@/utils/socket";

const RiderTrackMap = () => {
  const mapRef = useRef<MapView | null>(null);
  const ride = useSelector((state: RootState) => state.ride);

  const [riderCoords, setRiderCoords] = useState<LatLng>({
    latitude: ride.riderLocation?.location?.lat || 0,
    longitude: ride.riderLocation?.location?.lng || 0,
  });

  const userCoords: LatLng = {
    latitude: ride.origin?.location?.lat || 0,
    longitude: ride.origin?.location?.lng || 0,
  };

  const destCoords: LatLng = {
    latitude: ride.destination?.location?.lat || 0,
    longitude: ride.destination?.location?.lng || 0,
  };

  const vehicleIcons: Record<string, any> = {
    bike: require("@/assets/icons/bike.png"),
    taxi: require("@/assets/icons/taxi.png"),
    rickshaw: require("@/assets/icons/rickshaw.png"),
  };

  const vehicleIcon = vehicleIcons[ride.rideDetails?.id || "bike"];

  // 🛰️ Listen for live rider location updates via socket
  useEffect(() => {
    socket.on("rider_location_update", (data) => {
      // data = { lat, lng }
      setRiderCoords({
        latitude: data.lat,
        longitude: data.lng,
      });
    });

    return () => {
      socket.off("rider_location_update");
    };
  }, []);

  // 📍 Fit map to both markers
  useEffect(() => {
    setTimeout(() => {
      mapRef.current?.fitToSuppliedMarkers(["rider", "user"], {
        edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
        animated: true,
      });
    }, 800);
  }, [riderCoords]);

  return (
    <MapView
      ref={mapRef}
      provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
      style={styles.map}
      initialRegion={{
        latitude: riderCoords.latitude || 12.97,
        longitude: riderCoords.longitude || 77.59,
        latitudeDelta: 0.01,
        longitudeDelta: 0.0,
      }}
    >
      {/* Rider Marker */}
      <Marker
        identifier="rider"
        coordinate={riderCoords}
        title={ride.rider?.name || "Rider"}
        description="Rider’s live location"
      >
        <Image source={vehicleIcon} style={styles.riderIcon} />
      </Marker>

      {/* User Marker */}
      <Marker
        identifier="user"
        coordinate={userCoords}
        title="You"
        description={ride.origin?.description || "Pickup location"}
      >
        {/* <Image
          source={require("@/assets/icons/destination.png")}
          style={styles.userIcon}
        /> */}
      </Marker>

      {/* Destination Marker */}
      <Marker
        identifier="user"
        coordinate={destCoords}
        title="You"
        description={ride.origin?.description || "Pickup location"}
      >
        <Image
          source={require("@/assets/icons/destination.png")}
          style={styles.userIcon}
        />
      </Marker>

      {/* Path between rider and user */}
      <MapViewDirections
        origin={riderCoords}
        destination={userCoords}
        apikey={GOOGLE_MAPS_API_KEY}
        strokeWidth={5}
        strokeColor="#00008B"
      />
    </MapView>
  );
};

export default RiderTrackMap;

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  riderIcon: {
    width: 35,
    height: 35,
  },
  userIcon: {
    width: 35,
    height: 35,
  },
});
