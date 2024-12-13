import { forwardRef, InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { CURRENCIES } from '../../utils/constants';

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  currency: string;
  onCurrencyChange: (currency: string) => void;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, label, error, currency, onCurrencyChange, onChange, value, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^0-9]/g, '');
      
      if (onChange) {
        const event = {
          ...e,
          target: {
            ...e.target,
            value: rawValue,
          },
        };
        onChange(event as React.ChangeEvent<HTMLInputElement>);
      }
    };

    const displayValue = value 
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(Number(value))
      : '';

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 flex items-center">
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="h-full rounded-md border-transparent bg-transparent py-0 pl-3 pr-7 text-gray-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {CURRENCIES.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>
          <input
            ref={ref}
            type="text"
            value={displayValue}
            onChange={handleChange}
            className={clsx(
              'block w-full rounded-md border-gray-300 pl-24 focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
              error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';