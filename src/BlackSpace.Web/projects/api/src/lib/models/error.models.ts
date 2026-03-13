export interface ValidationErrorResponse {
  error: 'validation_failed';
  message: string;
  errors: Record<string, string[]>;
}

export interface ConflictErrorResponse {
  error: 'already_registered';
  message: string;
}
