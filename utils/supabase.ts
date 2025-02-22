import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import firebase from '@react-native-firebase/app';
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  // This function should return the Firebase Auth JWT of the current user (or null if no such user) is found.
  accessToken: async () => {
    return await firebase.auth().currentUser?.getIdToken(/* forceRefresh */ false) ?? null
  },
});
