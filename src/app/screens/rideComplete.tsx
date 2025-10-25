import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/features/store';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const RideComplete = () => {
  const ride = useSelector((state: RootState) => state.ride);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Ride Completed 🎉</Text>
      <Text style={styles.subHeader}>Thank you for riding with us!</Text>

      <View style={styles.rideCard}>
        <View style={styles.row}>
          <Ionicons name="location-sharp" size={22} color="#0284c7" />
          <Text style={styles.locationText}>{ride.origin?.description}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="flag-sharp" size={22} color="#f97316" />
          <Text style={styles.locationText}>{ride.destination?.description}</Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="currency-inr" size={22} color="#28a745" />
          <Text style={styles.fareText}>{ride.fare}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.payBtn} onPress={() => console.log('Pay to Rider')}>
        <Text style={styles.payBtnText}>Pay to Rider</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default RideComplete;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 5,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  rideCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
  },
  fareText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '700',
    color: '#28a745',
  },
  payBtn: {
    width: '100%',
    backgroundColor: '#0284c7',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 4,
  },
  payBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
