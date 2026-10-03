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