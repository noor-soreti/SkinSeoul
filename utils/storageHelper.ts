import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKey, StorageErrorType } from './types/storage';

// storing data
export const storeData = async (key: StorageKey, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);      
    } catch (e) {
      const error: StorageErrorType = {
        message: `Failed to store data for key: ${key}`,
        originalError: e instanceof Error ? e.message : String(e),
        key,
        operation: 'store'
      };
      console.error(error);
      throw error;
    }
};

export const storeObject = async (key: StorageKey, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);  
  } catch (e) {
    const error: StorageErrorType = {
      message: `Failed to store object for key: ${key}`,
      originalError: e instanceof Error ? e.message : String(e),
      key,
      operation: 'store'
    };
    console.error(error);
    throw error;
  }
};

// reading data
export const getData = async (key: StorageKey) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      }
      return null;
    } catch (e) {
      const error: StorageErrorType = {
        message: `Failed to retrieve data for key: ${key}`,
        originalError: e instanceof Error ? e.message : String(e),
        key,
        operation: 'retrieve'
      };
      console.error(error);
      throw error;
    }
};

export const getObject = async (key: StorageKey) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      const error: StorageErrorType = {
        message: `Failed to retrieve object for key: ${key}`,
        originalError: e instanceof Error ? e.message : String(e),
        key,
        operation: 'retrieve'
      };
      console.error(error);
      throw error;
    }
};

