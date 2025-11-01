import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GOOGLE_MAPS_API_KEY } from "@/constants/apiUrl";

interface Props {
  placeholder: string;
  onSelect: (data: any, details: any) => void;
  icon?: string;
  clearTrigger?: boolean;
}

const LocationInput = ({ placeholder, onSelect, icon = "map-marker", clearTrigger }: Props) => {
  const ref = useRef<any>(null);

  React.useEffect(() => {
    if (clearTrigger && ref.current) {
      ref.current.setAddressText("");
    }
  }, [clearTrigger]);

  return (
    <View style={styles.container}>
      {/* <MaterialCommunityIcons name={icon} size={22} color="#2563eb" style={styles.icon} /> */}
      <GooglePlacesAutocomplete
        ref={ref}
        placeholder={placeholder}
        fetchDetails
        predefinedPlaces={[]}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: "en",
          components: "country:in",
          location: "12.9716,77.5946",
          radius: 40000,
        }}
        textInputProps={{
          autoFocus: false,
          placeholderTextColor: "#9ca3af",
        }}
        debounce={400}
        timeout={1000}
        minLength={2}
        nearbyPlacesAPI="GooglePlacesSearch"
        onPress={onSelect}
        styles={autoCompleteStyles}
        enablePoweredByContainer={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default LocationInput;

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  icon: { position: "absolute", left: 16, top: 12, zIndex: 1 },
});

const autoCompleteStyles = {
  container: {
    flex: 0,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  textInput: {
    backgroundColor: "transparent",
    borderRadius: 8,
    fontSize: 16,
    height: 45,
    paddingLeft: 32,
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
};
