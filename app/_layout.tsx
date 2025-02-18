import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import * as SplashScreen from 'expo-splash-screen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useCameraPermissions } from 'expo-camera';

// Prevent the splash screen from auto-hiding
// SplashScreen.preventAutoHideAsync();

// Add near the top, before RootLayout component
GoogleSignin.configure({
  iosClientId: '294543918032-oljer5medbughcn7mrvaql1qglve6o9u.apps.googleusercontent.com', // This should match your CLIENT_ID from GoogleService-Info.plist
});

const RootLayout = () => {
  const [ initializing, setInitializing ] = useState(true); // used to track whether Firebase Authentication is finished determining user's auth status
  const [ user, setUser ] = useState<FirebaseAuthTypes.User | null>();
  const router = useRouter();
  const segment = useSegments();
  const [permission, requestPermission] = useCameraPermissions();
  useFonts({
    NobileRegular: require('../assets/fonts/Nobile-Regular.ttf'),
    NobileMedium: require('../assets/fonts/Nobile-Medium.ttf'),
    NobileBold: require('../assets/fonts/Nobile-Bold.ttf'),
    SCoreDreamRegular: require('../assets/fonts/S_Core_Dream/OTF/SCDream4.otf'),
    SCoreDreamBold: require('../assets/fonts/S_Core_Dream/OTF/SCDream5.otf'),
    NunitoSans: require('../assets/fonts/Nunito_Sans/static/NunitoSans_7pt-Regular.ttf'),
    FreesentaionRegular: require('../assets/fonts/Freesentation/Freesentation-4Regular.ttf'),
  });

  // useEffect(() => {
  //   if (fontsLoaded && !initializing) {
  //     // Hide splash screen once fonts are loaded and Firebase is initialized
  //     SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded, initializing]);

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    // console.log("onAuthStateChanged", user);
    setUser(user)
    if (initializing) setInitializing(false)
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [])

  useEffect(() => {
    if (initializing) return
    // checks if user is trying to access a page in the auth group (i.e. in protected group)
    const inAuthGroup = segment[0] == '(tabs)'

    if (user && !inAuthGroup) { // user is signed in but not within authentication group dir, route to '/home'
      router.replace("/(tabs)")
    } else if (!user && inAuthGroup) { // user is not signed in and trying to access page in authentication group, route to '/'
      router.replace('/')
    }  

  }, [user])

  useEffect(() => {
    // Request camera permission on app start
    requestPermission();
  }, []);

  return (
    <Stack initialRouteName="index" screenOptions={{headerShown: false }} >
      <Stack.Screen name='index'/>
      <Stack.Screen name='(public)'/>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  </Stack>
  )
}

export default RootLayout