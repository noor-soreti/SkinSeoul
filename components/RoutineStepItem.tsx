import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { CompletionStatus, RoutineStep } from '@/utils/types/database';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const routineImages = {
  'double cleanse.png': require('@/assets/images/routineIcons/oil-cleanser.png'),
  'toner.png': require('@/assets/images/routineIcons/toner.png'),
  'essence.png': require('@/assets/images/routineIcons/essence.png'),
  'moisturizer.png': require('@/assets/images/routineIcons/moisturizer.png'),
  'sunscreen.png': require('@/assets/images/routineIcons/sunscreen.png'),
  'cleanser.png': require('@/assets/images/routineIcons/cleanser.png'),
} as const;

type ImagePath = keyof typeof routineImages;

interface RoutineStepItemProps {
  step: RoutineStep & { status: CompletionStatus | null };
  onPress: () => void;
  onSkip: () => void;
}

export default function RoutineStepItem({ step, onPress, onSkip }: RoutineStepItemProps) {
  const swipeableRef = useRef<Swipeable>(null);
  
  console.log(step);
  

  const renderRightActions = () => (
    <TouchableOpacity 
      style={styles.skipButton}
      onPress={() => {
        onSkip();
        swipeableRef.current?.close();
      }}
    >
      <Text style={styles.skipButtonText}>
        {step.status === 'skipped' ? 'Undo Skip' : 'Skip'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}
      >
        <TouchableOpacity style={styles.container} onPress={onPress}>
          <View style={styles.leftSection}>
            <Image
              source={routineImages[step.image_path as ImagePath]}
              style={styles.productImage}
              contentFit="contain"
            />
          </View>
          
          <View style={styles.middleSection}>
            <Text style={styles.productName}>{step.product_name}</Text>
            <View style={styles.stepContainer}>
              <Text style={styles.stepText}>Step {step.step_number}</Text>
            </View>
          </View>

          <View style={[
            styles.statusIndicator,
            step.status === 'completed' && styles.statusCompleted,
            step.status === 'skipped' && styles.statusSkipped,
          ]} />
        </TouchableOpacity>
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  leftSection: {
    marginRight: 15,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  middleSection: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  stepContainer: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  stepText: {
    color: '#758599',
    fontSize: 14,
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  statusCompleted: {
    backgroundColor: '#4DDA41',
    borderColor: '#4DDA41',
  },
  statusSkipped: {
    backgroundColor: '#E0E0E0',
    borderColor: '#E0E0E0',
  },
  skipButton: {
    backgroundColor: '#BDBDBE',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
  },
  skipButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
}); 