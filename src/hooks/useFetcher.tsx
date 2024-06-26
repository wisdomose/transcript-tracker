"use client"
import { useState } from "react";

export default function useFetcher<T extends any>(defaultData?: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<T>(defaultData);

  type F = () => Promise<T>;

  async function wrapper(f: F) {
    setLoading(true);
    setError(null);

    await f()
      .then((res) => {
        setData(res as T);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return {
    loading,
    error,
    data,
    wrapper,
  };
}
