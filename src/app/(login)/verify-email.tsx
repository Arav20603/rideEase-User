import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Pressable,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Toast } from "toastify-react-native";
import { backendURL } from "@/constants/url";

const { width } = Dimensions.get("window");

const VerifyEmail = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else setResendDisabled(false);
  }, [timer]);

  const handleVerify = async () => {
    try {
      const res = await axios.post(`${backendURL}/verify-otp`, { email, otp });
      if (res.data.success) {
        Toast.show({
          type: "success",
          text1: res.data.message,
          position: "top",
          visibilityTime: 2000,
          autoHide: true,
        });
        router.push("/login");
      } else {
        Toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleResend = async () => {
    try {
      const res = await axios.post(`${backendURL}/resend-otp`, { email });
      if (res.data.success) {
        Toast.show({
          type: "success",
          text1: res.data.message,
          position: "top",
          visibilityTime: 2000,
          autoHide: true,
        });
        setTimer(120);
        setResendDisabled(true);
      } else Toast.error(res.data.message);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateEmail = () =>
    router.push({ pathname: "/update-email", params: { oldEmail: email } });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={styles.card}>
          {/* Logo at top */}
          <Image
            source={require("@/assets/images/carIcon2.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>We sent an OTP to {email}</Text>

          {/* OTP Input */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              style={styles.input}
              keyboardType="number-pad"
              placeholderTextColor="#888"
            />
          </View>

          {/* Verify Button */}
          <TouchableOpacity style={styles.button} onPress={handleVerify}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>

          {/* Timer */}
          <Text style={styles.timer}>Resend OTP in: {timer}s</Text>

          {/* Resend OTP */}
          <TouchableOpacity disabled={resendDisabled} onPress={handleResend}>
            <Text
              style={[
                styles.link,
                { opacity: resendDisabled ? 0.5 : 1, marginBottom: 12 },
              ]}
            >
              Resend OTP
            </Text>
          </TouchableOpacity>

          {/* Update Email */}
          <Pressable onPress={handleUpdateEmail}>
            <Text style={styles.updateText}>Wrong Email? Update Email</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default VerifyEmail;

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
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
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
  input: {
    height: 50,
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
  timer: {
    marginTop: 12,
    fontSize: 14,
    color: "#444",
    textAlign: "center",
  },
  link: {
    color: "#4a90e2",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  updateText: {
    color: "darkblue",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
