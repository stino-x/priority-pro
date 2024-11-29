import React from 'react';
import { FormControl, FormField, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Control, FieldPath } from 'react-hook-form';
import { AuthFormSchema } from '@/lib/utils';

interface CustomInputProps<Type extends AuthFormSchema> {
  control: Control<Type>;
  name: FieldPath<Type>;
  label: string;
  placeholder?: string;
  type?: string;
  isDropdown?: boolean;
  isUploadFile?: boolean;
  options?: { label: string; value: string }[];
}

const CustomInput = <Type extends AuthFormSchema>({
  control,
  name,
  label,
  placeholder = '',
  type = 'text',
  isDropdown = false,
  isUploadFile = false,
  options = [],
}: CustomInputProps<Type>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel htmlFor={name} className="form-label">
            {label}
          </FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              {isUploadFile ? (
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    id={name}
                    type="file"
                    className="border-slate-600 bg-transparent border-2 rounded file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-600 file:text-white hover:file:bg-slate-700"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </div>
              ) : !isDropdown ? (
                <Input
                  id={name}
                  placeholder={placeholder}
                  className="border-slate-600 bg-transparent border-2 rounded"
                  type={type}
                  {...field}
                />
              ) : (
                <select
                  id={name}
                  className="border-slate-600 bg-transparent border-2 rounded p-2"
                  {...field}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
