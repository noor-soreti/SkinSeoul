export type StorageKey = 'IS_ONBOARDED' | 'skincareRoutine' | 'age' | 'goals';

export type StorageErrorType = {
  message: string;
  originalError?: string;
  key: string;
  operation: 'store' | 'retrieve' | 'remove';
};