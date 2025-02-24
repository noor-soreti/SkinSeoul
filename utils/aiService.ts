import { getData, getObject } from './storageHelper';
import { supabase } from './supabase';

export type AIServiceError = {
  message: string;
  originalError?: unknown;
};

export async function generateSkincareRoutine(): Promise<string> {
  try {
    const age = await getData('age');
    const goals = await getObject('goals');
    const { data, error } = await supabase.functions.invoke('openai', {
      method: 'POST',
      body: { goals: goals, age: age }
      });

    if (error) throw error;
    
    if (!data?.message) {
      throw new Error('No response received from AI service');
    }

    return data.message;
  } catch (error) {
    const serviceError: AIServiceError = {
      message: error instanceof Error ? error.message : 'Failed to generate skincare routine',
      originalError: error
    };
    throw serviceError;
  }
} 