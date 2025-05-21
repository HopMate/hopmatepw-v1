// src/hooks/useColors.ts
import { useState, useEffect, useCallback } from 'react';
import { colorService } from '@/services/colorService';
import type { Color } from '@/types/color';

export const useColors = () => {
    const [colors, setColors] = useState<Color[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchColors = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await colorService.getAllColors();
            setColors(data);
        } catch (err) {
            console.error('Error fetching colors:', err);
            setError(err instanceof Error ? err.message : 'Failed to load colors');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchColors();
    }, [fetchColors]);

    const refetch = useCallback(async () => {
        await fetchColors();
    }, [fetchColors]);

    return {
        colors,
        loading,
        error,
        refetch
    };
};