import React from "react";
import { View, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setDestination } from "@/features/mapSlice/mapSlice";
import { useRouter } from "expo-router";
import { GOOGLE_MAPS_API_KEY } from "@/constants/apiUrl";

const DestinationInput = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="flag-checkered" size={22} color="#f97316" style={styles.icon} />
      <GooglePlacesAutocomplete
        placeholder="Enter drop location"
        fetchDetails
        predefinedPlaces={[]}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: "en",
          components: 'country:in',
          location: "12.9716,77.5946",
          radius: 40000,
        }}
        textInputProps={{
          autoFocus: true,
          placeholderTextColor: "#9ca3af",
        }}
        debounce={400}
        timeout={1000}
        minLength={2}
        nearbyPlacesAPI="GooglePlacesSearch"
        onPress={(data, details = null) => {
          if (!details) return;

          const address = data.description.toLowerCase();

          if (!address.includes("bengaluru") && !address.includes("bangalore")) {
            alert("Please select a location within Bangalore 🚫");
            return;
          }

          dispatch(
            setDestination({
              location: {
                lat: details.geometry.location.lat,
                lng: details.geometry.location.lng,
              },
              description: data.description,
            })
          );
          router.push("../screens/booking");
        }}
        styles={autoCompleteStyles}
        enablePoweredByContainer={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default DestinationInput;

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
