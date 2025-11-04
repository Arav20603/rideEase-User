import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Map from '../screens/map';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectDestination,
  selectOrigin,
  selectTravelTimeInformation,
  setOrigin,
  setTimeInformation,
} from '@/features/mapSlice/mapSlice';
import { RootState } from '@/features/store';
import { GOOGLE_MAPS_API_KEY } from '@/constants/apiUrl';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { socket } from '@/utils/socket';
import MultiModeMap from '../multimode/multimodeMap';

const RideStarted = () => {
  const dispatch = useDispatch();

  const ride = useSelector((state: RootState) => state.ride);
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const time = useSelector(selectTravelTimeInformation);
  const [loading, setLoading] = useState(true);
  const rideMode = useSelector((state:RootState) => state.mode)

  const vehicleIcons: Record<string, any> = {
    bike: require('../../assets/icons/bike.png'),
    auto: require('../../assets/icons/rickshaw.png'),
    car: require('../../assets/icons/car.png'),
    suv: require('../../assets/icons/suv.png'),
    luxury: require('../../assets/icons/luxury.png'),
  };

  const vehicleType = ride.rider?.vehicleType ?? 'car';
  const vehicleImage = vehicleIcons[vehicleType] || vehicleIcons.car;

  // User location
  useEffect(() => {
    console.log(origin)
    let subscriber: Location.LocationSubscription | null = null;

    const startLocationTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Location permission not granted');
          return;
        }

        // Start watching position live
        subscriber = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10, // every 10 meters
            timeInterval: 5000, // every 5 seconds minimum
          },
          async (location) => {
            const { latitude, longitude } = location.coords;

            // Optional reverse geocode (if you need address display)
            const [geo] = await Location.reverseGeocodeAsync(location.coords);
            const description = geo
              ? `${geo.name ?? ''}, ${geo.city ?? ''}`.trim()
              : 'Current Location';

            dispatch(
              setOrigin({
                location: { lat: latitude, lng: longitude },
                description,
              })
            );

            setLoading(false)
            console.log('📍User updated location:', latitude, longitude);
          }
        );
      } catch (err) {
        console.error('Error watching user location:', err);
      }
    };

    startLocationTracking();

    return () => {
      if (subscriber) subscriber.remove();
    };
  }, [dispatch]);

  // Distance and time
  useEffect(() => {
    if (!origin?.location || !destination?.location) return;

    const controller = new AbortController();
    const { signal } = controller;

    const getTravelTime = async () => {
      try {
        const originCoords = `${origin.location?.lat},${origin.location?.lng}`;
        const destinationCoords = `${destination.location?.lat},${destination.location?.lng}`;
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${originCoords}&destinations=${destinationCoords}&key=${GOOGLE_MAPS_API_KEY}`;

        const res = await fetch(url, { signal });
        const data = await res.json();

        if (data?.rows?.[0]?.elements?.[0]) {
          dispatch(setTimeInformation(data.rows[0].elements[0]));
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') console.error('Error fetching distance:', err);
      }
    };

    getTravelTime();

    return () => controller.abort();
  }, [origin, destination, dispatch]);

  useEffect(() => {
    socket.on('ride_completed', (msg) => {
      if (msg) router.push('/screens/rideComplete')
    })
  }, [])

  const estimatedPrice = ride?.fare ?? '₹220'; // static fallback
  const travelDuration = time?.duration?.text ?? '--';
  const travelDistance = time?.distance?.text ?? '--';

  if (loading) return <View style={styles.loadingContainer}>
    <ActivityIndicator
      size="large"
      color="lightgreen" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>

  const handleCancel = () => {
    Alert.alert("Cancel the ride", "Are you sure you want to cancel?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes", style: 'destructive',
        onPress: () => {
          socket.emit('user_cancelled_ride', { msg: 'user cancelled' })
          router.push('/home')
        }
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Map */}
      <View style={styles.mapContainer}>
        {rideMode.mode === 'single' ? <Map /> :  <MultiModeMap />}
        {/* <Map /> */}
      </View>

      {/* Bottom Drawer */}
      <ScrollView style={styles.bottomSheet}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Getting location...</Text>
          </View>
        ) : (
          <>
            {/* Header */}
            <Text style={styles.headerText}>Ride Started</Text>
            <Text style={styles.subText}>Your ride is in progress 🚗</Text>

            {/* Route Details */}
            <View style={styles.routeCard}>
              <View style={styles.routeLine}>
                <View style={styles.dotOrigin} />
                <View style={styles.line} />
                <View style={styles.dotDest} />
              </View>

              <View style={styles.routeDetails}>
                <Text style={styles.routeText}>{origin?.description || 'Pickup'}</Text>
                <Text style={styles.routeText}>{destination?.description || 'Destination'}</Text>
              </View>

              <View style={styles.routeStats}>
                <Text style={styles.statText}>⏱ {travelDuration}</Text>
                <Text style={styles.statText}>📍 {travelDistance}</Text>
              </View>
            </View>

            {/* Rider Details */}
            <View style={styles.riderCard}>
              <Image source={vehicleImage} style={styles.vehicleImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.riderName}>{ride.rider?.name || 'Rider Name'}</Text>
                <Text style={styles.vehicleText}>
                  {ride.rider?.vehicleType || 'Car'} - {ride.rider?.plateNo || 'AB 12 CD 3456'}
                </Text>
                <Text style={styles.priceText}>₹{estimatedPrice}</Text>
              </View>
              <TouchableOpacity style={styles.callBtn}>
                <Ionicons name="call" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* OTP Row */}
            {/* <View style={styles.otpRow}>
              <MaterialCommunityIcons name="badge-account" size={22} color="#333" />
              <Text style={styles.otpText}>OTP: {ride.otp || '4321'}</Text>
            </View> */}

            {/* Action Buttons */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.endRideButton} onPress={handleCancel}>
                <Text style={styles.endRideText}>Cancel Ride</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RideStarted;

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  mapContainer: {
    height: '55%',
  },
  icon: {
    position: 'absolute',
    zIndex: 99,
    top: 40,
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 50,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 20,
    elevation: 15,

  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#003366',
  },
  subText: {
    color: '#666',
    fontSize: 15,
    marginBottom: 15,
  },
  routeCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    marginBottom: 20,
    elevation: 3,
  },
  routeLine: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  dotOrigin: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#007bff',
  },
  line: {
    width: 2,
    height: 40,
    backgroundColor: '#007bff',
  },
  dotDest: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#28a745',
  },
  routeDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  routeText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  routeStats: {
    justifyContent: 'space-between',
  },
  statText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'right',
  },
  riderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2f7',
    borderRadius: 15,
    padding: 15,
    elevation: 4,
  },
  vehicleImage: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
    marginRight: 15,
  },
  riderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  vehicleText: {
    color: '#555',
    fontSize: 15,
  },
  priceText: {
    fontSize: 18,
    color: '#007bff',
    fontWeight: '700',
    marginTop: 5,
  },
  callBtn: {
    backgroundColor: '#28a745',
    borderRadius: 50,
    padding: 10,
  },
  otpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    justifyContent: 'center',
  },
  otpText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  actionsRow: {
    marginTop: 20,
    alignItems: 'center',
  },
  endRideButton: {
    backgroundColor: 'black',
    borderRadius: 10,
    width: '90%',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 30
  },
  endRideText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
  },
});
