import { useId, type ComponentProps } from 'react';

export type SelectOption = {
  value: string | number;
  label: string;
};

type SelectProps = Omit<ComponentProps<'select'>, 'children'> & {
  label: string;
  options: SelectOption[];
  //Opcion vacia inicial (ej. "Selecciona un campus"); sin ella no hay opcion vacia
  placeholder?: string;
  hint?: string;
  error?: string;
};

const Select = ({ label, options, placeholder, hint, error, id, className, disabled, ...props }: SelectProps) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const hintId = hint ? `${selectId}-hint` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const fieldClassName = ['field', error && 'field--invalid', disabled && 'field--disabled', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={fieldClassName}>
      <label className="field__label" htmlFor={selectId}>
        {label}
      </label>

      <div className="field__control field__control--select">
        <select
          id={selectId}
          className="field__input field__select"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {hint && !error && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
