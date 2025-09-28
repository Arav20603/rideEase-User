import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Map from '@/app/screens/map';
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
import { selectDestination, selectOrigin, setDestination, setOrigin } from '@/features/mapSlice.tsx/mapSlice';
import { RootState } from '@/features/store';
import DestInput from '@/app/screens/destInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const Home = () => {
  const dispatch = useDispatch();
  const origin = useSelector((state: RootState) => selectOrigin(state));
  const [loading, setLoading] = useState<boolean>(true);

  const LOCATION_KEY = 'user_origin';
  const CACHE_EXPIRY = 10 * 60 * 1000; // 10 mins

  useEffect(() => {
    const loadCachedLocation = async () => {
      try {
        const cached = await AsyncStorage.getItem(LOCATION_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_EXPIRY) {
            dispatch(setOrigin(data));
            setLoading(false);
            return true;
          }
        }
      } catch (err) {
        console.error('Error loading cached location:', err);
      }
      return false;
    };

    const fetchLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        let [geo] = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        const description =
          geo?.name && geo?.city
            ? `${geo.name}, ${geo.city}`
            : 'Current Location';

        const locData = {
          location: {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          },
          description,
        };

        dispatch(setOrigin(locData));

        await AsyncStorage.setItem(
          LOCATION_KEY,
          JSON.stringify({ data: locData, timestamp: Date.now() })
        );
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setLoading(false);
      }
    };

    (async () => {
      const hasCache = await loadCachedLocation();
      if (!hasCache) {
        await fetchLocation();
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    dispatch(setDestination(null))
  }, [dispatch])

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Fetching current location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <Map />
        {/* Stylish floating text */}
        <View style={styles.overlayWrapper}>
          <LinearGradient
            colors={["#2563eb", "#50c9c3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <BlurView intensity={60} tint="light" style={styles.blurBox}>
              <Text style={styles.overlayText}>🚖 RideEase</Text>
            </BlurView>
          </LinearGradient>
        </View>
      </View>
      <DestInput />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    height: '50%',
  },
  overlayWrapper: {
    position: 'absolute',
    top: 28,
    left: 15,
    borderRadius: 20,
    shadowColor: '#2563eb',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 10,
  },
  gradientBorder: {
    borderRadius: 20,
    padding: 2,
  },
  blurBox: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 130,
  },
  overlayText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    letterSpacing: 1,
  },
});
