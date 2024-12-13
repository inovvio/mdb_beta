import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface BaseInputProps {
  label?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
}

type InputProps = BaseInputProps & (
  | (InputHTMLAttributes<HTMLInputElement> & { multiline?: false })
  | (TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true })
);

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ className, label, error, multiline = false, rows = 3, ...props }, ref) => {
    const inputClasses = clsx(
      'block w-full rounded-md shadow-sm sm:text-sm',
      'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
      error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
      className
    );

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        {multiline ? (
          <textarea
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            rows={rows}
            className={inputClasses}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.ForwardedRef<HTMLInputElement>}
            className={inputClasses}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';