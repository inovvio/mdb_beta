import { forwardRef, useState } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

interface MultiSelectProps {
  label?: string;
  error?: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  ({ label, error, options, value, onChange, placeholder }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option: string) => {
      const newValue = value.includes(option)
        ? value.filter(v => v !== option)
        : [...value, option];
      onChange(newValue);
    };

    return (
      <div ref={ref} className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          <div
            className={clsx(
              'min-h-[38px] cursor-pointer rounded-md border border-gray-300 bg-white p-2',
              'focus:border-blue-500 focus:ring-blue-500',
              error && 'border-red-300 focus:border-red-500 focus:ring-red-500'
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            {value.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {value.map((v) => (
                  <span
                    key={v}
                    className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800"
                  >
                    {v}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(v);
                      }}
                      className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-500">{placeholder || 'Select options...'}</span>
            )}
          </div>
          
          {isOpen && (
            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
              {options.map((option) => (
                <div
                  key={option}
                  className={clsx(
                    'cursor-pointer px-4 py-2 text-sm',
                    value.includes(option)
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-900 hover:bg-gray-100'
                  )}
                  onClick={() => {
                    handleSelect(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);