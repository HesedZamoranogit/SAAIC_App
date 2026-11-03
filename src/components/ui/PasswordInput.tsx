import { useState, type ComponentProps } from 'react';
import Input from './Input';

type PasswordInputProps = Omit<ComponentProps<typeof Input>, 'type' | 'endAdornment'>;

const PasswordInput = (props: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      {...props}
      type={visible ? 'text' : 'password'}
      endAdornment={
        <button
          type="button"
          className="field__action"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={visible}
        >
          {/* Icono eye / eye-off */}
          <span className="icon-slot" aria-hidden="true" />
        </button>
      }
    />
  );
};

export default PasswordInput;
