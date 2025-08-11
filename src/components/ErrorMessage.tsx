import React from 'react';
import { AlertCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  type?: 'error' | 'warning' | 'info';
  className?: string;
  showIcon?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = 'error',
  className = '',
  showIcon = true,
}) => {
  if (!message) return null;

  const baseClasses = 'flex items-start space-x-2 text-sm animate-in slide-in-from-top-1 duration-200';
  
  const typeClasses = {
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  };

  const icons = {
    error: XCircle,
    warning: AlertTriangle,
    info: AlertCircle,
  };

  const Icon = icons[type];

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      {showIcon && <Icon size={16} className="mt-0.5 flex-shrink-0" />}
      <span className="flex-1">{message}</span>
    </div>
  );
};

interface FieldErrorProps {
  errors?: any[];
  className?: string;
}

export const FieldError: React.FC<FieldErrorProps> = ({ errors, className = '' }) => {
  if (!errors || errors.length === 0) return null;

  // Remove duplicates
  const uniqueErrors = Array.from(new Set(errors.map(String)));

  return (
    <div className={`mt-1 space-y-1 ${className}`}>
      {uniqueErrors.map((error, index) => (
        <ErrorMessage key={`${error}-${index}`} message={error} type="error" />
      ))}
    </div>
  );
};

interface FormErrorSummaryProps {
  errors: Record<string, string[]>;
  className?: string;
  title?: string;
}

export const FormErrorSummary: React.FC<FormErrorSummaryProps> = ({
  errors,
  className = '',
  title = 'Please fix the following errors:',
}) => {
  const errorEntries = Object.entries(errors).filter(([, errs]) => errs.length > 0);
  
  if (errorEntries.length === 0) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <XCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 mb-2">{title}</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
            {errorEntries.map(([field, fieldErrors]) =>
              fieldErrors.map((error, index) => (
                <li key={`${field}-${index}`}>
                  <span className="font-medium capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}:</span> {error}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

interface SuccessMessageProps {
  message?: string;
  className?: string;
  showIcon?: boolean;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  className = '',
  showIcon = true,
}) => {
  if (!message) return null;

  return (
    <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        {showIcon && (
          <svg className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
        <p className="text-sm text-green-700">{message}</p>
      </div>
    </div>
  );
};
