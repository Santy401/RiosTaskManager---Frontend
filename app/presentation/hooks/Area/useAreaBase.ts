import { useState } from "react";

interface UseAreaBaseResult {
    isLoading: boolean;
    error: string | null;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useAreaBase = (): UseAreaBaseResult => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return {
        isLoading,
        error,
        setLoading: setIsLoading,
        setError
    }
}