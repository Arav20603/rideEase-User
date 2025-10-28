import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Image, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, LatLng } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store";
import { GOOGLE_MAPS_API_KEY } from "@/constants/apiUrl";
import { socket } from "@/utils/socket";
import { router } from "expo-router";

const RiderTrackMap = () => {
  const mapRef = useRef<MapView | null>(null);
  const ride = useSelector((state: RootState) => state.ride);

  const [riderCoords, setRiderCoords] = useState<LatLng | null>(
    ride.riderLocation?.location
      ? { latitude: ride.riderLocation.location.lat, longitude: ride.riderLocation.location.lng }
      : null
  );

  const userCoords: LatLng | null = ride.origin?.location
    ? { latitude: ride.origin.location.lat, longitude: ride.origin.location.lng }
    : null;

  const destCoords: LatLng | null = ride.destination?.location
    ? { latitude: ride.destination.location.lat, longitude: ride.destination.location.lng }
    : null;

  const vehicleIcons: Record<string, any> = {
    bike: require("@/assets/icons/bike.png"),
    car: require("@/assets/icons/car.png"),
    rickshaw: require("@/assets/icons/rickshaw.png"),
  };
  const vehicleIcon = vehicleIcons[ride.rideDetails?.id || "bike"];

  useEffect(() => {
    const handleLocation = (data: any) => {
      console.log('rider_location received', data)
      const { lat, lng } = data?.location || data?.riderLocation || {};
      if (lat != null && lng != null) {
        setRiderCoords({ latitude: lat, longitude: lng });
      }
    }

    socket.on('rider_location', handleLocation);
    return () => { socket.off('rider_location', handleLocation) }
  }, [ride

  ]);


  useEffect(() => {
    if (riderCoords && userCoords) {
      setTimeout(() => {
        mapRef.current?.fitToSuppliedMarkers(
          ["rider", "user", "destination"],
          { edgePadding: { top: 80, right: 80, bottom: 80, left: 80 }, animated: true }
        );
      }, 500);
    }
  }, [riderCoords, userCoords, destCoords]);

  useEffect(() => {
    socket.on('rider_cancelled_ride', (msg) => {
      if (msg) router.push('/screens/findingRider')
    })
  }, [])

  // Render nothing if coords not ready
  if (!riderCoords || !userCoords || !destCoords) return null;

  return (
    <MapView
      ref={mapRef}
      provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
      style={styles.map}
      initialRegion={{
        latitude: riderCoords.latitude,
        longitude: riderCoords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
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
        title="Pickup"
        description={ride.origin?.description || "Pickup location"}
      >
        {/* <Image source={require("@/assets/icons/destination.png")} style={styles.userIcon} /> */}
      </Marker>

      {/* Destination Marker */}
      <Marker
        identifier="destination"
        coordinate={destCoords}
        title="Destination"
        description={ride.destination?.description || "Destination"}
      >
        <Image source={require("@/assets/icons/destination.png")} style={styles.userIcon} />
      </Marker>

      {/* Path from rider to user */}
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
  map: { width: "100%", height: "100%" },
  riderIcon: { width: 35, height: 35 },
  userIcon: { width: 35, height: 35 },
});
