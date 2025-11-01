import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useSelector } from "react-redux";
import { GOOGLE_MAPS_API_KEY } from "@/constants/apiUrl";
import { RootState } from "@/features/store";

const MultiModeMap = () => {
  const rides = useSelector((state: RootState) => state.mode.rides);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (!rides?.length) return;

    const markers = rides.flatMap((r) => [r.origin, r.destination].filter(Boolean));

    if (markers.length === 0) return;

    setTimeout(() => {
      mapRef.current?.fitToCoordinates(
        markers.map((m: any) => ({
          latitude: m.location.lat,
          longitude: m.location.lng,
        })),
        { edgePadding: { top: 100, right: 60, bottom: 100, left: 60 }, animated: true }
      );
    }, 500);
  }, [rides]);

  if (!rides?.length)
    return <Text style={styles.empty}>Add routes to display on map.</Text>;

  const firstRide = rides[0];
  const initialLat = firstRide?.origin?.location?.lat || 12.9716;
  const initialLng = firstRide?.origin?.location?.lng || 77.5946;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: initialLat,
          longitude: initialLng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {rides.map((ride, index) => {
          if (!ride.origin || !ride.destination) return null;

          return (
            <React.Fragment key={ride.id}>
              <Marker
                coordinate={{
                  latitude: ride.origin.location?.lat || 0,
                  longitude: ride.origin.location?.lng || 0,
                }}
                title={`Start (${ride.vehicle})`}
                pinColor="#2563eb"
              />
              <Marker
                coordinate={{
                  latitude: ride.destination.location?.lat || 0,
                  longitude: ride.destination.location?.lng || 0,
                }}
                title={`End (${ride.vehicle})`}
                pinColor="#10b981"
              />
              <MapViewDirections
                origin={{
                  latitude: ride.origin.location?.lat || 0,
                  longitude: ride.origin.location?.lng || 0,
                }}
                destination={{
                  latitude: ride.destination.location?.lat || 0,
                  longitude: ride.destination.location?.lng || 0,
                }}
                apikey={GOOGLE_MAPS_API_KEY}
                strokeWidth={index === 0 ? 5 : 3}
                strokeColor={index === 0 ? "#2563eb" : "#9ca3af"}
              />
            </React.Fragment>
          );
        })}
      </MapView>
    </View>
  );
};

export default MultiModeMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
  },
  map: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  empty: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 40,
    fontSize: 16,
  },
});
