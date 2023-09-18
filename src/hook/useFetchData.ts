/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse, CancelTokenSource } from "axios";

type ApiResponse<T> = {
  data: T | null;
  hasError: boolean;
  isLoading: boolean;
  errorMessage: string;
  status: number | null;
  statusText: string | null;
  error: AxiosError | null;
};

export const useFetchData = <T>(
  url: string,
  token?: string
): ApiResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState<number | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    let source: CancelTokenSource;

    const fetchData = async () => {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage("");

      try {
        source = axios.CancelToken.source();
        const response: AxiosResponse<T> = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
          cancelToken: source.token,
        });
        if (response.status !== 200) {
          throw new Error("Server response was not ok");
        }
        setData(response.data);
        setStatus(response.status);
        setStatusText(response.statusText);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error);
          setStatus(error.response?.status || null);
          setStatusText(error.response?.statusText || null);
          setHasError(true);
          setErrorMessage(error.response?.data.message || "");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      if (source) {
        source.cancel("Request canceled");
      }
    };
  }, [token, url]);

  return {
    data,
    isLoading,
    hasError,
    errorMessage,
    status,
    statusText,
    error,
  };
};
