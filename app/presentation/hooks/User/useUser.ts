import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface CreateUserData {
  name: string;
  email: string;
  role: string;
  password: string;
}

interface UseUserResult {
  createUser: (data: CreateUserData) => Promise<any>;
  getAllUsers: () => Promise<User[]>;
  isLoading: boolean;
  error: string | null;
}

interface UseUserResult {
  createUser: (data: CreateUserData) => Promise<any>;
  getAllUsers: () => Promise<User[]>;
  deleteUser: (userId: string) => Promise<any>;
  isLoading: boolean;
  error: string | null;
}


export const useUser = (): UseUserResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllUsers = async (): Promise<User[]> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 [HOOK] Iniciando fetch a /api/admin/users');

      const response = await fetch('/api/admin/users', {
        method: 'GET',
        credentials: 'include',
      });

      console.log('📊 [HOOK] Response status:', response.status);
      console.log('📋 [HOOK] Response ok:', response.ok);

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ [HOOK] Error response text:', errorText);

        let errorMessage = 'Error al obtener usuarios';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || `Error ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      // Si la respuesta es exitosa, parsear como JSON
      const users = await response.json();
      console.log('✅ [HOOK] Usuarios obtenidos exitosamente:', users);

      return users;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('💥 [HOOK] Error en getAllUsers:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (data: CreateUserData): Promise<any> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 [HOOK] Iniciando creación de usuario:', data);

      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: (data.role || 'user').toLowerCase()
      };

      console.log('📤 [HOOK] Payload enviado:', payload);

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear usuario');
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string): Promise<any> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🗑️ [HOOK] Eliminando usuario:', userId);

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      console.log('📥 [HOOK] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar usuario');
      }

      const result = await response.json();
      console.log('✅ [HOOK] Usuario eliminado exitosamente:', result);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('💥 [HOOK] Error en deleteUser:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createUser, getAllUsers, isLoading, deleteUser, error };
};