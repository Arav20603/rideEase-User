import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const RootLayout = () => {
  return <Stack>
    <Stack.Screen name='login'
      options={{
        title: 'Login to your account'
      }}
    />
    <Stack.Screen name='signup'
      options={{
        title: 'Sign up'
      }}
    />
    <Stack.Screen name='verify-email'
      options={{
        headerShown: false
      }}
    />
    <Stack.Screen name='update-email'
      options={{
        headerShown: false
      }}
    />
  </Stack>
}

export default RootLayout

const styles = StyleSheet.create({})