
export type LoginValues = {
  idInstitucional: string;
  password: string;
};

export type LoginErrors = Partial<Record<keyof LoginValues, string>>;

export const validateLogin = ({ idInstitucional, password }: LoginValues): LoginErrors => {
  const errors: LoginErrors = {};
  
  if (!idInstitucional.trim()) errors.idInstitucional = 'Ingresa tu Id de usuario.';
  if (!password) errors.password = 'Ingresa tu contraseña.';
  


  return errors;
};
