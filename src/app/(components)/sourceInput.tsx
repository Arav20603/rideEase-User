import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setOrigin, selectOrigin } from "@/features/mapSlice/mapSlice";
import { RootState } from "@/features/store";
import { GOOGLE_MAPS_API_KEY } from "@/constants/apiUrl";

const SourceInput = () => {
  const dispatch = useDispatch();
  const origin = useSelector((state: RootState) => selectOrigin(state));
  const [initialOrigin, setInitialOrigin] = useState("");
  const placesRef = useRef(null);

  useEffect(() => {
    if (origin?.description) {
      setInitialOrigin(origin.description);
    }
  }, [origin]);

  return (
    <View>
      <Ionicons name="locate-outline" size={22} color="#3b82f6" />
      <GooglePlacesAutocomplete
        ref={placesRef}
        placeholder="Enter pickup location"
        fetchDetails
        predefinedPlaces={[]}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: "en",
        }}
        textInputProps={{
          autoFocus: false,
          value: initialOrigin,
          onChangeText: setInitialOrigin,
          placeholderTextColor: "#9ca3af",
        }}
        debounce={400}
        timeout={1000}
        minLength={2}
        nearbyPlacesAPI="GooglePlacesSearch"
        onPress={(data, details = null) => {
          if (!details) return;
          dispatch(
            setOrigin({
              location: {
                lat: details.geometry.location.lat,
                lng: details.geometry.location.lng,
              },
              description: data.description,
            })
          );
        }}
        styles={autoCompleteStyles}
        enablePoweredByContainer={false}
      />
    </View>
  );
};

export default SourceInput;

const styles = StyleSheet.create({});

const autoCompleteStyles = {
  container: {
    flex: 0,
    // backgroundColor: 'white',
    margin: 10,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    fontSize: 18,
  },
  textInputContainer: {
    paddingTop: 20,
    paddingBottom: 0,
  }
}
