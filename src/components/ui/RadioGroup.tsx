import { useId } from 'react';

export type RadioOption<T extends string | number> = {
  value: T;
  label: string;
};

type RadioGroupProps<T extends string | number> = {
  legend: string;
  name: string;
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
};

const RadioGroup = <T extends string | number>({
  legend,
  name,
  options,
  value,
  onChange,
  disabled,
  className,
}: RadioGroupProps<T>) => {
  const legendId = useId();

  return (
    <div className={['field', className].filter(Boolean).join(' ')} role="radiogroup" aria-labelledby={legendId}>
      <span id={legendId} className="field__label">
        {legend}
      </span>

      <div className="choice-group">
        {options.map((option) => {
          const checked = option.value === value;
          const choiceClassName = ['choice', checked && 'choice--checked', disabled && 'choice--disabled']
            .filter(Boolean)
            .join(' ');

          return (
            <label key={option.value} className={choiceClassName}>
              <input
                type="radio"
                className="choice__input"
                name={name}
                value={option.value}
                checked={checked}
                disabled={disabled}
                onChange={() => onChange(option.value)}
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default RadioGroup;
