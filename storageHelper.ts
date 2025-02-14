import AsyncStorage from '@react-native-async-storage/async-storage';

// storing data
export const storeData = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);      
    } catch (e) {
      console.log("Error storing data ", e);
      
    }
};

export const storeObject = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);  
  } catch (e) {
    console.log("Error storing data ", e);
    
  }
};



// reading data
export const getData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value
      }
    } catch (e) {
      console.log("Error getting data ", e);
    }
};

export const getObject = async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      console.log(jsonValue);
      
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log("Error getting data ", e);
    }
};

