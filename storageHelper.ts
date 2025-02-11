import AsyncStorage from '@react-native-async-storage/async-storage';

// storing data
const storeData = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);      
    } catch (e) {
      console.log("Error storing data ", e);
      
    }
};

// reading data
const getData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value
      }
    } catch (e) {
      console.log("Error getting data ", e);
    }
};