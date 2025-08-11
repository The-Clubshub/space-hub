import { zodValidator } from '@tanstack/zod-form-adapter';
import type { FieldApi } from '@tanstack/react-form';
import type { ZodSchema } from 'zod';

// Create a reusable validator function for TanStack Form
export const createZodValidator = <T>(schema: ZodSchema<T>) => {
  return zodValidator(schema);
};

// Helper to extract field errors
export const getFieldErrors = (field: FieldApi<any, any, any, any>): string[] => {
  return field.state.meta.errors;
};

// Helper to check if field has errors
export const hasFieldErrors = (field: FieldApi<any, any, any, any>): boolean => {
  return field.state.meta.errors.length > 0;
};

// Helper to get all form errors
export const getAllFormErrors = (form: any): Record<string, string[]> => {
  const errors: Record<string, string[]> = {};
  
  // This would need to be implemented based on TanStack Form's API
  // for now, we'll return an empty object
  return errors;
};

// Format field name for display
export const formatFieldName = (fieldName: string): string => {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

// Debounce validation
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
