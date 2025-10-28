import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store";
import { GOOGLE_MAPS_API_KEY } from "@/constants/apiUrl";

const MultiMap = () => {
  const { segments } = useSelector((state: RootState) => state.mode);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (!segments?.length) return;

    const coords = segments.flatMap((s) => [
      { latitude: s.start.lat, longitude: s.start.lng },
      { latitude: s.end.lat, longitude: s.end.lng },
    ]);

    mapRef.current?.fitToCoordinates(coords, {
      edgePadding: { top: 100, bottom: 100, left: 80, right: 80 },
      animated: true,
    });
  }, [segments, mapRef]);

  if (!segments?.length) return null;

  return (
    <MapView ref={mapRef} style={styles.map}>
      {/* Draw each segment separately */}
      {segments.map((seg, i) => (
        <MapViewDirections
          key={`seg-${i}`}
          origin={{ latitude: seg.start.lat, longitude: seg.start.lng }}
          destination={{ latitude: seg.end.lat, longitude: seg.end.lng }}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={5}
          strokeColor={["#2563eb", "#10b981", "#f59e0b"][i % 3]}
        />
      ))}


      {/* Origin */}
      <Marker
        coordinate={{
          latitude: segments[0].start.lat,
          longitude: segments[0].start.lng,
        }}
        title="Origin"
        pinColor="green"
      />

      {/* Intermediate stops */}
      {segments.slice(0, -1).map((s, i) => (
        <Marker
          key={`mid-${i}`}
          coordinate={{
            latitude: s.end.lat,
            longitude: s.end.lng,
          }}
          title={`Stop ${i + 1} (${s.mode})`}
          pinColor={i === 0 ? "orange" : "purple"}
        />
      ))}

      {/* Destination */}
      <Marker
        coordinate={{
          latitude: segments[segments.length - 1].end.lat,
          longitude: segments[segments.length - 1].end.lng,
        }}
        title="Destination"
        pinColor="black"
      />
    </MapView>
  );
};

export default MultiMap;

const styles = StyleSheet.create({
  map: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
});
