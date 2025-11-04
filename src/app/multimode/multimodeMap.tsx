// components/multimode/MultiModeMap.tsx
import React, { useEffect, useRef } from "react";
import { StyleSheet, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useSelector } from "react-redux";
import { GOOGLE_MAPS_API_KEY } from "@/constants/apiUrl";
import { RootState } from "@/features/store";

const MultiModeMap = () => {
  const rides = useSelector((state: RootState) => state.mode.rides);
  const mapRef = useRef<MapView | null>(null);

  // Auto fit map to include all origin and destination markers
  useEffect(() => {
    if (!rides?.length) return;

    const markers = rides.flatMap((r) => [r.origin, r.destination].filter(Boolean));
    if (markers.length === 0) return;

    const timeout = setTimeout(() => {
      mapRef.current?.fitToCoordinates(
        markers.map((m: any) => ({
          latitude: m.location.lat,
          longitude: m.location.lng,
        })),
        {
          edgePadding: { top: 70, right: 70, bottom: 70, left: 70 },
          animated: true,
        }
      );
    }, 500);

    return () => clearTimeout(timeout);
  }, [rides]);

  if (!rides?.length)
    return <Text style={styles.empty}>Add routes to display on map.</Text>;

  const firstRide = rides[0];
  const initialLat = firstRide?.origin?.location?.lat || 12.9716;
  const initialLng = firstRide?.origin?.location?.lng || 77.5946;

  return (
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

        const { origin, destination, vehicle } = ride;
        const originCoords = origin.location;
        const destinationCoords = destination.location;

        return (
          <React.Fragment key={ride.id}>
            {/* Origin Marker */}
            <Marker
              coordinate={{
                latitude: originCoords?.lat || 0,
                longitude: originCoords?.lng || 0,
              }}
              title={`Pickup (${vehicle})`}
              description={origin.description || ""}
              identifier={`origin-${ride.id}`}
            />

            {/* Destination Marker */}
            <Marker
              coordinate={{
                latitude: destinationCoords?.lat || 0,
                longitude: destinationCoords?.lng || 0,
              }}
              title={`Drop (${vehicle})`}
              description={destination.description || ""}
              identifier={`destination-${ride.id}`}
              pinColor="blue"
            />

            {/* Route Direction */}
            <MapViewDirections
              origin={{
                latitude: originCoords?.lat || 0,
                longitude: originCoords?.lng || 0,
              }}
              destination={{
                latitude: destinationCoords?.lat || 0,
                longitude: destinationCoords?.lng || 0,
              }}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={4}
              strokeColor="black"
            />
          </React.Fragment>
        );
      })}
    </MapView>
  );
};

export default MultiModeMap;

const styles = StyleSheet.create({
  map: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  empty: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 40,
    fontSize: 16,
  },
});
