import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { selectOrigin, setDestination } from "@/features/mapSlice/mapSlice";
import { useRouter } from "expo-router";
import { GOOGLE_MAPS_API_KEY } from "@/constants/apiUrl";
import { RootState } from "@/features/store";

const DestinationInput = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const origin = useSelector(selectOrigin);
  const { mode } = useSelector((state: RootState) => state.mode);

  const handleDestinationSelect = async (data: any, details: any) => {
    if (!details) return;

    const destination = {
      location: {
        lat: details.geometry.location.lat,
        lng: details.geometry.location.lng,
      },
      description: data.description,
    };

    dispatch(setDestination(destination));

    router.push("../screens/booking");
  };

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
        onPress={handleDestinationSelect}
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
