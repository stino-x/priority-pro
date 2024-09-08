import React from 'react';
import { FormControl, FormField, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Control, FieldPath } from 'react-hook-form';
import { z } from 'zod';
import { taskFormSchema } from '@/lib/utils';

const formSchema = taskFormSchema();

interface CustomInputProps {
  control: Control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder?: string;
  type?: string; // Specify input types (e.g., text, number)
  isDropdown?: boolean; // New prop to indicate dropdown
  options?: { label: string; value: string }[]; // Dropdown options if it's a select input
}

const CustomInput = ({ control, name, label, placeholder, type = 'text', isDropdown = false, options = [] }: CustomInputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              {/* Conditionally render input or select based on isDropdown */}
              {!isDropdown ? (
                <Input
                  placeholder={placeholder}
                  className="border-slate-600 bg-[transparent] border-2 rounded"
                  type={type} // Dynamically set input type
                  {...field}
                />
              ) : (
                <select
                  className="border-slate-600 bg-[transparent] border-2 rounded p-2"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                >
                  <option value="" disabled>Select an option</option>
                  {options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select> // to be changed to a better ui later
              )}
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;
