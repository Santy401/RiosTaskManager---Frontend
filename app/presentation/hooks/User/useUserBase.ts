import { useState } from "react";

interface UseUserBaseResult {
    isLoading: boolean;
    error: string | null;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useUserBase = ():UseUserBaseResult => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return {
        isLoading,
        setLoading: setIsLoading,
        error,
        setError
    }
}