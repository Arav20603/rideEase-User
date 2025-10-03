// components/BookingMap.tsx
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions'
import { useDispatch, useSelector } from "react-redux";
import { selectOrigin, selectDestination, setTimeInformation } from "@/features/mapSlice/mapSlice";
import { useRef, useEffect } from "react";
import { GOOGLE_MAPS_API_KEY } from "@/constants/apiUrl";

const Map = () => {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const mapRef = useRef<MapView | null>(null);
  const dispatch = useDispatch()

  useEffect(() => {
    if (!origin || !destination) return;

    const timeout = setTimeout(() => {
      mapRef.current?.fitToSuppliedMarkers(['origin', 'destination'], {
        edgePadding: { top: 70, right: 70, bottom: 70, left: 70 },
        animated: true,
      });
    }, 500)

    return () => clearTimeout(timeout);
  }, [origin, destination]);

  useEffect(() => {
    if (!origin || !destination) return

    const getTravelTime = async () => {
      if (!origin?.location || !destination?.location) return;

      const originCoords = `${origin.location.lat},${origin.location.lng}`;
      const destinationCoords = `${destination.location.lat},${destination.location.lng}`;

      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${originCoords}&destinations=${destinationCoords}&key=${GOOGLE_MAPS_API_KEY}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.rows && data.rows[0].elements) {
          dispatch(setTimeInformation(data.rows[0].elements[0]));
        } else {
          console.warn("No distance data received", data);
        }
      } catch (err) {
        console.error("Error fetching distance matrix", err);
      }
    };


    getTravelTime()

  }, [origin, destination, GOOGLE_MAPS_API_KEY])

  if (!origin?.location) return null;

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={{
        latitude: origin.location.lat,
        longitude: origin.location.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      {origin?.location && (
        <Marker
          coordinate={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
          }}
          title="Pickup"
          description={origin.description || ""}
          identifier="origin"
        />
      )}

      {destination?.location && (
        <>
          <MapViewDirections
            origin={{
              latitude: origin.location.lat,
              longitude: origin.location.lng,
            }}
            destination={{
              latitude: destination.location.lat,
              longitude: destination.location.lng,
            }}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor="black"
          />
          <Marker
            coordinate={{
              latitude: destination.location.lat,
              longitude: destination.location.lng,
            }}
            title="Drop"
            description={destination.description || ""}
            identifier="destination"
            pinColor="blue"
          />
        </>
      )}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({
  map: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
});
