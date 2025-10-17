import { useState } from "react";

export const useCompanyBase = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return {
        isLoading,
        error,
        setLoading: setIsLoading,
        setError
    }
}