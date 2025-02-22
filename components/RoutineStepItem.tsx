import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { CompletionStatus, RoutineStep } from '@/utils/database';

interface RoutineStepItemProps {
  step: RoutineStep & { status: CompletionStatus | null };
  onPress: () => void;
}

export default function RoutineStepItem({ step, onPress }: RoutineStepItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftSection}>
        <Image
          source={require('@/assets/images/routineIcons/cotton-pad.png')}
          style={styles.productImage}
          contentFit="contain"
        />
      </View>
      
      <View style={styles.middleSection}>
        <Text style={styles.productName}>{step.name}</Text>
        <View style={styles.stepContainer}>
          <Text style={styles.stepText}>Step {step.step_number}</Text>
        </View>
      </View>

      <View style={[
        styles.statusIndicator,
        step.status === 'completed' && styles.statusCompleted,
        step.status === 'out_of_product' && styles.statusOutOfProduct,
        step.status === 'skipped' && styles.statusSkipped,
      ]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  statusOutOfProduct: {
    backgroundColor: '#FFA726',
    borderColor: '#FFA726',
  },
  statusSkipped: {
    backgroundColor: '#E0E0E0',
    borderColor: '#E0E0E0',
  },
}); 