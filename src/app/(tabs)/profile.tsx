import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { backendURL } from "@/constants/url";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "@/features/userSlice/userSlice";

const { width } = Dimensions.get("window");

const Profile = () => {
  const router = useRouter();
  const dispatch = useDispatch()
  const [user, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const email = await AsyncStorage.getItem("user");
        if (!email) return router.push("/");

        const res = await axios.post(`${backendURL}/get-user`, { email });
        if (res.data.success) {
          dispatch(setUser(res.data.user));
          setUserData(res.data.user)
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
    // router.push('/login')
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${backendURL}/logout`);
      if (res.data.success) {
        Toast.show({ type: "success", text1: res.data.message });
        await AsyncStorage.clear()
        dispatch(clearUser())
        router.replace("/login");
      } else Toast.error(res.data.message);
    } catch (err: any) {
      Toast.error(`Error logging in: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "#555" }}>User not found</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#4a90e2", "#50c9c3"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header with logout */}
        <View style={styles.topBar}>
          <Text style={styles.topTitle}>Profile</Text>
          <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Profile Header */}
          <View style={styles.header}>
            <Image
              source={{
                uri:
                  user.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
              }}
              style={styles.avatar}
            />
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>

          {/* Info Card */}
          {/* Info Card */}
          <View style={styles.infoCard}>
            {/* Phone Row */}
            <View style={styles.row}>
              <Ionicons name="call-outline" size={22} color="#007AFF" />
              <Text style={styles.infoText}>{user.phone || "No phone number"}</Text>
            </View>

            {/* Verified Badge */}
            {user.isVerified && (
              <View style={styles.row}>
                <MaterialIcons name="verified" size={22} color="#34C759" />
                <Text style={[styles.infoText, { color: '#34C759', fontWeight: '600' }]}>
                  Verified Account
                </Text>
              </View>
            )}
          </View>


          {/* Options */}
          <View style={styles.options}>
            <TouchableOpacity style={styles.option}>
              <FontAwesome5 name="car" size={20} color="#4a90e2" />
              <Text style={styles.optionText}>My Rides</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
              <Ionicons name="location" size={20} color="#4a90e2" />
              <Text style={styles.optionText}>Saved Places</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
              <Ionicons name="settings" size={20} color="#4a90e2" />
              <Text style={styles.optionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { alignItems: "center", paddingBottom: 40 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Top bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
  },
  topTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },
  logoutIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 12,
  },

  // Header
  header: { alignItems: "center", marginBottom: 24 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  name: { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 4 },
  email: { fontSize: 14, color: "#f1f1f1" },

  // Info Card
  infoCard: {
    backgroundColor: "#fff",
    width: width * 0.9,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  infoText: { marginLeft: 10, fontSize: 16, color: "#333" },

  // Options
  options: {
    backgroundColor: "#fff",
    width: width * 0.9,
    borderRadius: 16,
    paddingVertical: 12,
    marginBottom: 20,
    overflow: "hidden",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  optionText: { marginLeft: 10, fontSize: 16, color: "#333" },
});
