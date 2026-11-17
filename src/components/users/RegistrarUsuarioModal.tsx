import { useState, type FormEvent } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import Select from '../ui/Select';
import { useRegisterUser } from '../../hooks/useRegisterUser';
import type { RegistrarUsuarioRequest, RolSistema } from '../../models/Auth.types';

type RegistrarUsuarioModalProps = {
  onClose: () => void;
  onSuccess: () => void;
};

const RegistrarUsuarioModal = ({
  onClose,
  onSuccess,
}: RegistrarUsuarioModalProps) => {
  const { registrar, loading, error } = useRegisterUser();
  const [rol, setRol] = useState<RolSistema | ''>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rol) return;

    const form = event.currentTarget;
    const values = new FormData(form);

    const request: RegistrarUsuarioRequest = {
      idInstitucional: String(values.get('idInstitucional') ?? ''),
      email: String(values.get('email') ?? ''),
      password: String(values.get('password') ?? ''),
      nombreCompleto: String(values.get('nombreCompleto') ?? ''),
      departamento: String(values.get('departamento') ?? ''),
      rol,
    };

    if (await registrar(request)) onSuccess();
  };

  return (
    <Modal open title="Registrar usuario" onClose={onClose}>
      <form className="user-form" onSubmit={handleSubmit}>
        <Input
          label="ID institucional"
          name="idInstitucional"
          autoComplete="username"
          required
        />
        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <Input
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
        <Input
          label="Nombre completo"
          name="nombreCompleto"
          autoComplete="name"
          required
        />
        <Input label="Departamento" name="departamento" required />
        <Select
          label="Rol"
          name="rol"
          value={rol}
          onChange={(event) => {
            const value = event.currentTarget.value;
            if (value === 'Profesor' || value === 'Administrador') {
              setRol(value);
            } else {
              setRol('');
            }
          }}
          options={[
            { value: 'Profesor', label: 'Profesor' },
            { value: 'Administrador', label: 'Administrador' },
          ]}
          placeholder="Selecciona un rol"
          required
        />

        {error && (
          <div className="user-notice user-notice--error" role="alert">
            <span className="user-notice__icon" aria-hidden="true">!</span>
            <div>
              <p className="user-notice__title">No se pudo registrar el usuario</p>
              <p className="user-notice__message">{error}</p>
            </div>
          </div>
        )}

        <div className="user-form__actions">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar usuario'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RegistrarUsuarioModal;
