import { useState } from "react";

export const useTaskBase = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return {
        isLoading,
        setLoading: setIsLoading,
        error,
        setError
    }

}