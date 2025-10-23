import React from "react";
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import SourceInput from "../(components)/sourceInput";
import DestinationInput from "../(components)/destinationInput";
import { SafeAreaView } from "react-native-safe-area-context";

const InputSrcDestPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Set Your Ride</Text>
      {/* <View style={styles.inputsWrapper}> */}
      <SourceInput />
      <DestinationInput />
      {/* </View> */}
    </SafeAreaView>
  );
};

export default InputSrcDestPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF5E6",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputsWrapper: {
    gap: 12,
  },
});
