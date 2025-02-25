import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated, Dimensions } from 'react-native';

interface RoutineToggleProps {
  selectedRoutine: 'morning' | 'evening';
  onToggle: (routine: 'morning' | 'evening') => void;
}

export default function RoutineToggle({ selectedRoutine, onToggle }: RoutineToggleProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const buttonWidth = (Dimensions.get('window').width - 48) / 2; // Account for margins and padding

  useEffect(() => {
    console.log('RoutineToggle - selectedRoutine changed to:', selectedRoutine);
    Animated.spring(slideAnim, {
      toValue: selectedRoutine === 'morning' ? 0 : buttonWidth,
      useNativeDriver: true,
      tension: 50, // Controls the spring stiffness
      friction: 7,  // Controls the spring bounce
    }).start();
  }, [selectedRoutine, buttonWidth]);

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.slider,
        { 
          width: buttonWidth,
          transform: [{ translateX: slideAnim }] 
        }
      ]} />
      <TouchableOpacity 
        style={[styles.toggleButton, { width: buttonWidth }]}
        onPress={() => {
          console.log('Morning button pressed');
          onToggle('morning');
        }}
      >
        <Text style={[
          styles.buttonText,
          selectedRoutine === 'morning' && styles.selectedText
        ]}>Morning</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.toggleButton, { width: buttonWidth }]}
        onPress={() => {
          console.log('Evening button pressed');
          onToggle('evening');
        }}
      >
        <Text style={[
          styles.buttonText,
          selectedRoutine === 'evening' && styles.selectedText
        ]}>Evening</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    padding: 4,
    marginHorizontal: 20,
    marginVertical: 10,
    height: 45,
    position: 'relative',
    overflow: 'hidden', // Important for the slider animation
  },
  toggleButton: {
    height: 37, // 45 - 8 for padding
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Keep buttons above slider
  },
  buttonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  selectedText: {
    color: '#FFF',
    fontWeight: '600',
  },
  slider: {
    position: 'absolute',
    top: 4,
    height: 37,
    backgroundColor: '#ED6672',
    borderRadius: 21,
  },
}); 