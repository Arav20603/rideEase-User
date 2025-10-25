import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
    <View style={styles.container}>
      {/* <Ionicons name="locate-outline" size={22} color="#3b82f6" style={styles.icon} /> */}
      <MaterialIcons name="my-location" size={22} color="#3b82f6" style={styles.icon} />
      <GooglePlacesAutocomplete
        ref={placesRef}
        placeholder="Enter pickup location"
        fetchDetails
        predefinedPlaces={[]}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: "en",
          components: 'country:in',
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
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default SourceInput;

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  icon: {
    position: 'absolute',
    left: 16,
    top: 12,
    zIndex: 1,
  },
});

const autoCompleteStyles = {
  container: {
    flex: 0,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  textInput: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    fontSize: 18,
    height: 45,
    paddingLeft: 32, // space for icon
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
};
