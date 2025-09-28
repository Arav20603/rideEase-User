import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { Toast } from "toastify-react-native";
import { backendURL } from "@/constants/url";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const Register = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const togglePasswordVisibility = () => setSecureTextEntry(!secureTextEntry);

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${backendURL}/register`, {
        name, email, phone,
        password,
      });
      if (res.data.success) {
        Toast.show({
          type: "success",
          text1: res.data.message,
          position: "top",
          visibilityTime: 2000,
          autoHide: true,
        });
        router.push({ pathname: "/verify-email", params: { email } });
      } else {
        Toast.error(`Signup Failed: ${res.data.message}`);
      }
      setPassword("");
    } catch (err: any) {
      console.log(err);
      Toast.error(`Error in registration: ${err.message}`);
      setPassword("");
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
          {/* Logo at top */}
          <Image
            source={require("@/assets/images/user2.jpg")} // replace with your path or use { uri: "https://..." }
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Welcome! 👋</Text>
          <Text style={styles.subtitle}>Create an account</Text>

          {/* Name */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              autoCapitalize="none"
              placeholderTextColor="#888"
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#888"
            />
          </View>

          {/* Phone */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter phone"
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              keyboardType="phone-pad"
              autoCapitalize="none"
              placeholderTextColor="#888"
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry={secureTextEntry}
              placeholderTextColor="#888"
            />
            <Pressable
              onPress={togglePasswordVisibility}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={secureTextEntry ? "eye-off" : "eye"}
                size={22}
                color="gray"
              />
            </Pressable>
          </View>

          {/* Button */}
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.footerText}>
              Already have an account? <Text style={styles.link}>Sign In</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Register;

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
    alignItems: "center", // center logo & texts
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
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
    position: "relative",
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
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 14,
  },
  button: {
    backgroundColor: "#4a90e2",
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
  footerText: {
    marginTop: 20,
    fontSize: 14,
    textAlign: "center",
    color: "#444",
  },
  link: {
    color: "#4a90e2",
    fontWeight: "600",
  },
});
