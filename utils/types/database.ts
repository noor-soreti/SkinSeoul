export type ProductType = 
  | 'Double Cleanse'
  | 'Cleanser' 
  | 'Toner' 
  | 'Essence' 
  | 'Moisturizer' 
  | 'Sunscreen';

export type RoutineStep = {
  id: number;
  product_name: string;
  product_type: ProductType;
  step_number: number;
  image_path: string;
  routine_type: 'morning' | 'evening';
}

export type CompletionStatus = 'completed' | 'skipped';

export type StepCompletion = {
  id?: number;
  date: string;  // Format: YYYY-MM-DD
  step_id: number;
  status: CompletionStatus;
  note?: string;  // Optional note about why step was skipped/incomplete
}

export type DatabaseErrorType = {
  message: string;
  originalError?: string;
  operation: 'init' | 'create' | 'read' | 'update' | 'delete';
  table?: string;
};

export type LoadingState = {
    isLoading: boolean;
    error: string | null;
    lastUpdated: Date | null;
}; 