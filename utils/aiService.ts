import { getData, getObject } from './storageHelper';
import { supabase } from './supabase';

export type AIServiceError = {
  message: string;
  originalError?: unknown;
};

type RoutineStep = {
  step: string;
  product: string;
}

export type AIRoutineResponse = {
  morning_routine: RoutineStep[];
  evening_routine: RoutineStep[];
}

export async function generateSkincareRoutine(): Promise<AIRoutineResponse> {
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

    // Parse the JSON string from the message
    try {
      console.log('Raw message from edge function:', data.message);
      
      // Clean up markdown code blocks from the response
      const cleanJson = data.message
        .replace(/^```json\s*/, '')  // Remove ```json from start
        .replace(/\s*```$/, '');     // Remove ``` from end
      
      const routineData: AIRoutineResponse = JSON.parse(cleanJson);
      console.log('Parsed routine data:', routineData);

      // Validate the response has the expected structure
      if (!routineData.morning_routine || !routineData.evening_routine) {
        console.log('Parsed data missing required fields:', routineData);
        throw new Error('Invalid routine format received');
      }

      return routineData;
    } catch (parseError) {
      console.log('Parse error details:', parseError);
      throw new Error('Failed to parse AI response as valid routine data');
    }

  } catch (error) {
    const serviceError: AIServiceError = {
      message: error instanceof Error ? error.message : 'Failed to generate skincare routine',
      originalError: error
    };
    throw serviceError;
  }
} 