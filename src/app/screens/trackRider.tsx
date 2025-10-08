import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/features/store'

const TrackRider = () => {
  const ride = useSelector((state: RootState) => state.ride)
  return (
    <View>
      <Text>TrackRider</Text>
    </View>
  )
}

export default TrackRider

const styles = StyleSheet.create({})