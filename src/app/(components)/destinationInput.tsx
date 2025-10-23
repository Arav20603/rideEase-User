import React from "react";
import { View, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setDestination } from "@/features/mapSlice/mapSlice";
import { useRouter } from "expo-router";
import { GOOGLE_MAPS_API_KEY } from "@/constants/apiUrl";

const DestinationInput = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <View>
      <Ionicons name="flag-outline" size={22} color="#f97316" style={styles.icon} />
      <GooglePlacesAutocomplete
        placeholder="Enter drop location"
        fetchDetails
        predefinedPlaces={[]}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: "en",
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
  icon: {
    
  }
});

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
