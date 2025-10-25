import { store } from "@/features/store";
import { Stack } from "expo-router";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Provider } from "react-redux";


export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(components)" options={{ headerShown: false }} />
          <Stack.Screen name="(login)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="screens" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </Provider>
  )
}
