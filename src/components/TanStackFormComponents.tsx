import React from 'react';
import { useField } from '@tanstack/react-form';
import type { FieldApi, FormApi } from '@tanstack/react-form';
import { FieldError } from './ErrorMessage';

interface FormFieldProps {
  label: string;
  required?: boolean;
  description?: string;
  className?: string;
  children: React.ReactNode;
  errors?: any[];
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  description,
  className = '',
  children,
  errors,
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      {children}
      <FieldError errors={errors} />
    </div>
  );
};

interface TextInputProps {
  field: FieldApi<any, any, any, any>;
  type?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  field,
  type = 'text',
  placeholder,
  className = '',
  disabled = false,
}) => {
  return (
    <input
      id={field.name}
      name={field.name}
      type={type}
      value={field.state.value || ''}
      placeholder={placeholder}
      disabled={disabled}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
        field.state.meta.errors.length > 0
          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300'
      } ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''} ${className}`}
    />
  );
};

interface TextareaProps {
  field: FieldApi<any, any, any, any>;
  placeholder?: string;
  rows?: number;
  className?: string;
  disabled?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  field,
  placeholder,
  rows = 4,
  className = '',
  disabled = false,
}) => {
  return (
    <textarea
      id={field.name}
      name={field.name}
      value={field.state.value || ''}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm resize-vertical ${
        field.state.meta.errors.length > 0
          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300'
      } ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''} ${className}`}
    />
  );
};

interface SelectProps {
  field: FieldApi<any, any, any, any>;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  field,
  options,
  placeholder,
  className = '',
  disabled = false,
}) => {
  return (
    <select
      id={field.name}
      name={field.name}
      value={field.state.value || ''}
      disabled={disabled}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
        field.state.meta.errors.length > 0
          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300'
      } ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''} ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

interface NumberInputProps {
  field: FieldApi<any, any, any, any>;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  field,
  min,
  max,
  step = 1,
  placeholder,
  className = '',
  disabled = false,
}) => {
  return (
    <input
      id={field.name}
      name={field.name}
      type="number"
      value={field.state.value || ''}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      disabled={disabled}
      onBlur={field.handleBlur}
      onChange={(e) => {
        const value = e.target.value;
        field.handleChange(value === '' ? undefined : Number(value));
      }}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
        field.state.meta.errors.length > 0
          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300'
      } ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''} ${className}`}
    />
  );
};

interface CheckboxProps {
  field: FieldApi<any, any, any, any>;
  label: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  field,
  label,
  description,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={`flex items-start space-x-2 ${className}`}>
      <input
        id={field.name}
        name={field.name}
        type="checkbox"
        checked={field.state.value || false}
        disabled={disabled}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.checked)}
        className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5 ${
          disabled ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      />
      <div className="flex-1">
        <label
          htmlFor={field.name}
          className={`text-sm font-medium text-gray-700 ${
            disabled ? 'text-gray-500 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

interface TimeInputProps {
  field: FieldApi<any, any, any, any>;
  className?: string;
  disabled?: boolean;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  field,
  className = '',
  disabled = false,
}) => {
  return (
    <input
      id={field.name}
      name={field.name}
      type="time"
      value={field.state.value || ''}
      disabled={disabled}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
        field.state.meta.errors.length > 0
          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300'
      } ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''} ${className}`}
    />
  );
};
