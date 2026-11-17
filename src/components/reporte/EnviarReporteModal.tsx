import { useEffect, useId, useRef, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { normalizarCorreos, validateCorreos } from '../../validations/reporte.validate';
import Button from '../ui/Button';
import Input from '../ui/Input';

type EnviarReporteModalProps = {
  //Periodo del reporte (ej. "16 al 22 de noviembre"), para que se vea que es lo que se va a enviar
  periodo: string;
  //Ultimo correo usado, para no escribirlo de nuevo en cada envio
  correoInicial: string;
  loading: boolean;
  error: string | null;
  //Manda el reporte; la pagina cierra el modal si el envio sale bien
  onEnviar: (correos: string) => void;
  onClose: () => void;
};

const EnviarReporteModal = ({ periodo, correoInicial, loading, error, onEnviar, onClose }: EnviarReporteModalProps) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [correos, setCorreos] = useState(correoInicial);
  const [correosError, setCorreosError] = useState<string>();
  //El error de la API solo se muestra despues de intentar enviar desde este modal, no uno viejo de la pantalla
  const [intentado, setIntentado] = useState(false);

  //showModal() abre el <dialog> como modal: el navegador atrapa el foco, oscurece el fondo y cierra con Escape
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCorreos(e.target.value);
    setCorreosError(undefined);
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const mensaje = validateCorreos(correos);
    setCorreosError(mensaje);
    if (mensaje) return;

    setIntentado(true);
    onEnviar(normalizarCorreos(correos));
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={titleId}
      onClose={onClose}
      //Mientras se envia no se puede cerrar con Escape
      onCancel={(e) => {
        if (loading) e.preventDefault();
      }}
      //Clic en el fondo oscuro (el <dialog> ocupa solo la tarjeta, su contenido la llena)
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <form className="modal__content" onSubmit={handleSubmit} noValidate aria-busy={loading}>
        <div className="modal__header">
          <h2 id={titleId} className="modal__title">
            Enviar reporte a seguridad
          </h2>
          <p className="modal__text">Se enviará por correo el Excel de eventos del {periodo}.</p>
        </div>

        <Input
          label="Correo del destinatario"
          name="correos"
          type="text"
          inputMode="email"
          autoComplete="email"
          placeholder="supervisor@itson.edu.mx"
          hint="Para varios destinatarios sepáralos con coma."
          required
          value={correos}
          onChange={handleChange}
          error={correosError}
          disabled={loading}
        />

        {intentado && error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="form-actions">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </form>
    </dialog>
  );
};

export default EnviarReporteModal;
