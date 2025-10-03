import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Toast } from "toastify-react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { backendURL } from "@/constants/url";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setUser } from "@/features/userSlice/userSlice";

const { width } = Dimensions.get("window");

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const dispatch = useDispatch()

  const togglePasswordVisibility = () => setSecureTextEntry(!secureTextEntry);

  const handleSignIn = async () => {
    try {
      const res = await axios.post(`${backendURL}/login`, { email, password });
      if (res.data.success) {
        Toast.show({ type: "success", text1: res.data.message });
        await AsyncStorage.setItem("user", email);
        // dispatch(setUser())
        router.push("/home");
      } else Toast.error(res.data.message);
      setPassword("");
    } catch (err: any) {
      Toast.error(`Error logging in: ${err.message}`);
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
            source={require("@/assets/images/user.jpg")} // replace with your path or use { uri: "https://..." }
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>Login to continue</Text>

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
          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.footerText}>
              Don’t have an account? <Text style={styles.link}>Sign Up</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

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
