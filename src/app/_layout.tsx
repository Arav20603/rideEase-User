import { store } from "@/features/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";


export default function RootLayout() {
  return <Provider store={store}>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(components)" />
      <Stack.Screen name="(login)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="screens" />
    </Stack>
  </Provider>
}
