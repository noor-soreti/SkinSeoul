import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useState } from "react";

const RootLayout = () => {
  const [ initializing, setInitializing ] = useState(true) // used to track whether Firebase Authentication is finished determining user's auth status
  const [loaded] = useFonts({
    NobileRegular: require('../assets/fonts/Nobile-Regular.ttf'),
    NobileMedium: require('../assets/fonts/Nobile-Medium.ttf'),
    NobileBold: require('../assets/fonts/Nobile-Bold.ttf')
  })

  return (
    <Stack screenOptions={{headerShown: false}} >
      <Stack.Screen name='index'/>
      <Stack.Screen name='(public)'/>
      <Stack.Screen name="(tabs)" />
  </Stack>
  )
}

export default RootLayout