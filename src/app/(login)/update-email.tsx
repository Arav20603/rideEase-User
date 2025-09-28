import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Toast } from "toastify-react-native";
import { backendURL } from "@/constants/url";

const { width } = Dimensions.get("window");

const UpdateEmail = () => {
  const router = useRouter();
  const { oldEmail } = useLocalSearchParams();
  const [newEmail, setNewEmail] = useState("");

  const handleUpdate = async () => {
    try {
      const res = await axios.post(`${backendURL}/update-email`, {
        oldEmail,
        newEmail,
      });
      if (res.data.success) {
        Toast.show({
          type: "success",
          text1: res.data.message,
          position: "bottom",
          visibilityTime: 4000,
          autoHide: true,
        });
        router.push({ pathname: "/verify-email", params: { email: newEmail } });
      } else Toast.error(res.data.message);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={styles.card}>
          {/* Logo */}
          <Image
            source={require("@/assets/images/carIcon2.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Update Email</Text>
          <Text style={styles.subtitle}>Change your account email</Text>

          {/* Old Email (readonly) */}
          <View style={styles.inputContainer}>
            <Text style={styles.readonlyInput}>{oldEmail}</Text>
          </View>

          {/* New Email */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter new email"
              value={newEmail}
              onChangeText={setNewEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#888"
            />
          </View>

          {/* Button */}
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default UpdateEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
    alignItems: "center",
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  readonlyInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#555",
    backgroundColor: "#eaeaea",
    textAlignVertical: "center",
    textAlign: "center",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#11242A",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
