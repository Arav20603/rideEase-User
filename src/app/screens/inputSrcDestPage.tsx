import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard } from "react-native";
import SourceInput from "../(components)/sourceInput";
import DestinationInput from "../(components)/destinationInput";
import { SafeAreaView } from "react-native-safe-area-context";

const InputSrcDestPage = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Set Your Ride</Text>

            <View style={styles.inputWrapper}>
              <View style={styles.inputCard}>
                <SourceInput />
              </View>

              <View style={styles.inputCard}>
                <DestinationInput />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default InputSrcDestPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E0F7FA",
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#0077B6", // deep blue
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  inputWrapper: {
    gap: 18,
  },
  inputCard: {
    backgroundColor: "#F0FFFF",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
  },
});
