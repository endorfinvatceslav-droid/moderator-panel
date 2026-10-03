import { useEffect, useState } from 'react';

export type FetchState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  status: number | null;
  refetch: () => void;
};

export function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(url, {
          signal: controller.signal,
        });

        setStatus(response.status);

        if (!response.ok) {
          throw new Error(`Ошибка ${response.status}`);
        }

        const result: T = await response.json();
        setData(result);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => controller.abort();
  }, [url, attempt]);

  function refetch() {
    setAttempt((value: number) => value + 1);
  }

  return {
    data,
    isLoading,
    error,
    status,
    refetch,
  };
}