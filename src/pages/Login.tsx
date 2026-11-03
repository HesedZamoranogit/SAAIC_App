import type { SubmitEvent } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';

const Login = () => {

    //Pendiente: conectar con el servicio de autenticacion
    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <div className="login-page">
            <main className="login-card" aria-labelledby="login-title">
                <header className="login-card__header">
                    <h1 id="login-title" className="login-card__title">Log In</h1>
                    <p className="login-card__subtitle">Sistema de reservas de espacios</p>
                </header>

                <form className="login-form" onSubmit={handleSubmit} noValidate>
                    <div className="login-form__fields">
                        <Input
                            label="Id Usuario"
                            name="idUsuario"
                            placeholder="Ingrese su Id"
                            autoComplete="username"
                            required
                            startAdornment={<span className="icon-slot" />} //Icono account
                        />
                        <PasswordInput
                            label="Contraseña"
                            name="contrasena"
                            placeholder="Ingrese su Contraseña"
                            autoComplete="current-password"
                            required
                            startAdornment={<span className="icon-slot" />} //Icono lock
                        />
                    </div>

                    <Link to="/recuperar-contrasena" className="login-form__forgot">
                        ¿Olvidaste tu Contraseña?
                    </Link>

                    <Button type="submit" size="lg" className="login-form__submit">
                        Log in
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
