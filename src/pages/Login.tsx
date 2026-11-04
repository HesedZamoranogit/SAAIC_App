import { useState, type SubmitEvent } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../Services/apiError';

type FieldErrors = {
    idInstitucional?: string;
    password?: string;
};

const Login = () => {
    const { login } = useAuth();

    const [idInstitucional, setIdInstitucional] = useState('');
    const [password, setPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const validate = (): FieldErrors => {
        const errors: FieldErrors = {};
        if (!idInstitucional.trim()) errors.idInstitucional = 'Ingresa tu Id de usuario.';
        if (!password) errors.password = 'Ingresa tu contraseña.';
        return errors;
    };

    //Al iniciar sesion, GuestRoute redirige al Home o a la ruta que intentaba abrir
    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (submitting) return;

        const errors = validate();
        setFieldErrors(errors);
        setFormError('');
        if (Object.keys(errors).length > 0) return;

        setSubmitting(true);
        try {
            await login({ idInstitucional, password });
        } catch (error) {
            setFormError(getErrorMessage(error, 'No se pudo iniciar sesión.'));
            setSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <main className="login-card" aria-labelledby="login-title">
                <header className="login-card__header">
                    <h1 id="login-title" className="login-card__title">Log In</h1>
                    <p className="login-card__subtitle">Sistema de reservas de espacios</p>
                </header>

                <form className="login-form" onSubmit={handleSubmit} noValidate aria-busy={submitting}>
                    <div className="login-form__fields">
                        <Input
                            label="Id Usuario"
                            name="idInstitucional"
                            placeholder="Ingrese su Id"
                            autoComplete="username"
                            required
                            value={idInstitucional}
                            onChange={(e) => setIdInstitucional(e.target.value)}
                            error={fieldErrors.idInstitucional}
                            disabled={submitting}
                            startAdornment={<span className="icon-slot" />} //Icono account
                        />
                        <PasswordInput
                            label="Contraseña"
                            name="password"
                            placeholder="Ingrese su Contraseña"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={fieldErrors.password}
                            disabled={submitting}
                            startAdornment={<span className="icon-slot" />} //Icono lock
                        />
                    </div>

                    {formError && (
                        <p className="login-form__error" role="alert">
                            {formError}
                        </p>
                    )}

                    <Link to="/recuperar-contrasena" className="login-form__forgot">
                        ¿Olvidaste tu Contraseña?
                    </Link>

                    <Button type="submit" size="lg" className="login-form__submit" disabled={submitting}>
                        {submitting ? 'Ingresando...' : 'Log in'}
                    </Button>
                </form>
            </main>

            <footer>
                <p className="login-page__copyright">© ACTI ITSON Navojoa Sur</p>
                {/* Logo ACTI */}
                <div className="login-page__logo" aria-hidden="true" />
            </footer>
        </div>
    );
}

export default Login;
