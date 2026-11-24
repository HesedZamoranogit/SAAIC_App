import { useEffect, useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { usePerfil } from '../../hooks/usePerfil';
import type { PerfilResponse } from '../../models/Auth.types';

type MisDatosModalProps = {
  onClose: () => void;
};

//Datos del usuario en sesion (GET /Auth/perfil), solo lectura
const MisDatosModal = ({ onClose }: MisDatosModalProps) => {
  const { GetPerfil, error } = usePerfil();
  //null mientras no llega la respuesta
  const [perfil, setPerfil] = useState<PerfilResponse | null>(null);

  //Al abrir el modal se piden los datos
  useEffect(() => {
    const cargarPerfil = async () => {
      const response = await GetPerfil();
      if (response?.data) setPerfil(response.data);
    };

    cargarPerfil();
  }, [GetPerfil]);

  const renderContenido = () => {
    if (error) {
      return (
        <div className="user-notice user-notice--error" role="alert">
          <span className="user-notice__icon" aria-hidden="true">!</span>
          <div>
            <p className="user-notice__title">No se pudieron cargar tus datos</p>
            <p className="user-notice__message">{error}</p>
          </div>
        </div>
      );
    }

    if (!perfil) {
      return (
        <p className="modal__text" role="status">
          Cargando tus datos...
        </p>
      );
    }

    return (
      <>
        <Input label="Nombre completo" name="nombreCompleto" value={perfil.nombreCompleto ?? ''} disabled />
        <Input label="ID institucional" name="idInstitucional" value={perfil.idInstitucional ?? ''} disabled />
        <Input label="Correo electrónico" name="email" value={perfil.email ?? ''} disabled />
        <Input label="Rol" name="rol" value={perfil.roles.join(', ')} disabled />
      </>
    );
  };

  return (
    <Modal open title="Mis datos" onClose={onClose}>
      <div className="user-form">
        {renderContenido()}

        <div className="user-form__actions">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default MisDatosModal;
