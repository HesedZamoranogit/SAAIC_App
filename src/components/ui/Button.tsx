import type { ComponentProps } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type ButtonSize = 'md' | 'lg';

type ButtonStyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

//Arma las clases globales definidas en assets/styles/components.css
const buttonClassName = ({ variant = 'primary', size = 'md', fullWidth = false }: ButtonStyleProps, extra?: string) =>
  ['btn', `btn--${variant}`, size === 'lg' && 'btn--lg', fullWidth && 'btn--block', extra]
    .filter(Boolean)
    .join(' ');

type ButtonProps = ComponentProps<'button'> & ButtonStyleProps;

const Button = ({ variant, size, fullWidth, className, type = 'button', ...props }: ButtonProps) => {
  return <button type={type} className={buttonClassName({ variant, size, fullWidth }, className)} {...props} />;
};

type ButtonLinkProps = LinkProps & ButtonStyleProps;

//Navegacion con apariencia de boton (ej. "Nueva reserva")
export const ButtonLink = ({ variant, size, fullWidth, className, ...props }: ButtonLinkProps) => {
  return <Link className={buttonClassName({ variant, size, fullWidth }, className)} {...props} />;
};

export default Button;
