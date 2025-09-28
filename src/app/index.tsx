import 'react-native-get-random-values'; 
import { Text, StyleSheet, Dimensions, ImageBackground, View, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect } from "react"
import { useRouter } from "expo-router";
import ToastManager from 'toastify-react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";

const Main = () => {
  const router = useRouter()
  const {width, height} = Dimensions.get('window')

  useEffect(() => {
    const func = async () => {
      const store = await AsyncStorage.getItem('user')
      if (store) {
        console.log(store)
        router.push('/home')
      }
    }
    func()
  }, [])

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        <ImageBackground 
          source={require('@/assets/images/landing.png')}
          style={{ width, height: '100%' }}
        />
      </View>

      <View style={[{height: height / 3}, styles.buttonContainer]}>
        <TouchableOpacity style={styles.button}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}
          onPress={() => router.push('/signup')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

      </View>
      <ToastManager />
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  button: {
    backgroundColor: 'rgba(17, 36, 42, .5)',
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 35,
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'white'
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 0.5
  },
  buttonContainer: {
    justifyContent: 'center',
  }
});
