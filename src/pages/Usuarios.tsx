import { useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PageHeader from '../components/layout/PageHeader';
import RegistrarUsuarioModal from '../components/users/RegistrarUsuarioModal';

const Usuarios = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const openModal = () => {
    setSuccessMessage(null);
    setModalOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Usuarios"
        subtitle="Registra usuarios y asigna su información institucional."
        actions={<Button onClick={openModal}>Registrar usuario</Button>}
      />

      {successMessage && (
        <div className="user-notice user-notice--success" role="status">
          <span className="user-notice__icon" aria-hidden="true">✓</span>
          <div>
            <p className="user-notice__title">Usuario registrado</p>
            <p className="user-notice__message">{successMessage}</p>
          </div>
          <button
            type="button"
            className="user-notice__dismiss"
            aria-label="Cerrar mensaje"
            onClick={() => setSuccessMessage(null)}
          >
            ×
          </button>
        </div>
      )}

      <Card
        title="Registro de usuarios"
        subtitle="El formulario solicita los datos institucionales necesarios para crear una cuenta."
      >
        <p>De momento solo esta la opcion de registrar usuarios, no sabemos si habra mas asi que de momento esto queda vacio</p>
      </Card>

      {modalOpen && (
        <RegistrarUsuarioModal
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setModalOpen(false);
            setSuccessMessage('El usuario se registró correctamente.');
          }}
        />
      )}
    </>
  );
};

export default Usuarios;
