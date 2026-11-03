import { useId, type ComponentProps, type ReactNode } from 'react';

type InputProps = ComponentProps<'input'> & {
  label: string;
  //Icono al inicio del input (ej. account, lock)
  startAdornment?: ReactNode;
  //Elemento al final del input (ej. boton para mostrar contraseña)
  endAdornment?: ReactNode;
  hint?: string;
  error?: string;
};

const Input = ({ label, startAdornment, endAdornment, hint, error, id, className, disabled, ...props }: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const fieldClassName = ['field', error && 'field--invalid', disabled && 'field--disabled', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={fieldClassName}>
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>

      <div className="field__control">
        {startAdornment && (
          <span className="field__adornment" aria-hidden="true">
            {startAdornment}
          </span>
        )}

        <input
          id={inputId}
          className="field__input"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...props}
        />

        {endAdornment}
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

export default Input;
