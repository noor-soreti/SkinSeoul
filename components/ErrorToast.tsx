import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';

interface ErrorToastProps {
  message: string;
  visible: boolean;
}

export default function ErrorToast({ message, visible }: ErrorToastProps) {
  return visible ? (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#ED6672',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  text: {
    color: 'white',
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
  },
}); 