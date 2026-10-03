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
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        //нужен ебаный сигнал
        const response = await fetch(url);

        setStatus(response.status);

        if (!response.ok) {
          throw new Error(`Ошибка ${response.status}`);
        }

        const result: T = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
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