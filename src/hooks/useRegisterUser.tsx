import { useCallback, useState } from "react";
import type { RegistrarUsuarioRequest } from "../models/Auth.types";
import { registerUser } from "../Services/Auth/register";

export function useRegisterUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registrar = useCallback(
    async (request: RegistrarUsuarioRequest): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await registerUser(request);
        return true;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo registrar el usuario.",
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { registrar, loading, error };
}