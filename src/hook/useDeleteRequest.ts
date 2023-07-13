/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import axios, { AxiosError, AxiosProgressEvent, AxiosResponse } from "axios";

type ApiResponse<T> = {
  deleteData: (url: string, token: string) => void;
  data: T | null;
  hasError: boolean;
  isLoading: boolean;
  errorMessage: string;
  status: number | null;
  statusText: string | null;
  progress: number | null;
  error: AxiosError | null;
};

export const useDeleteRequest = <T>(): [
  (url: string, token: string) => void,
  ApiResponse<T>
] => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState<number | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);

  const deleteData = useCallback(
    async (url: string, token: string): Promise<void> => {
      try {
        setIsLoading(true);
        setHasError(false);
        setErrorMessage("");
        setError(null);
        const response: AxiosResponse<T> = await axios.delete(url, {
          headers: { Authorization: `token ${token}` },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const timer = setTimeout(() => {
              if (progressEvent.total !== undefined) {
                const progress = Math.round(
                  (progressEvent.loaded / progressEvent.total) * 100
                );
                setProgress(progress);
              }
              clearTimeout(timer);
            }, 100);
          },
        });
        if (response.statusText !== "OK") {
          throw new Error("Server response was not ok");
        }
        setData(response.data);
        setStatus(response.status);
        setStatusText(response.statusText);
        setProgress(null);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error);
          setStatus(error.response?.status || null);
          setStatusText(error.response?.statusText || null);
          setHasError(true);
          setErrorMessage(error.response?.data.message || "");
        }
      } finally {
        setProgress(null);
        setIsLoading(false);
      }
    },
    []
  );
  return [
    deleteData,
    {
      deleteData,
      data,
      isLoading,
      hasError,
      errorMessage,
      status,
      statusText,
      progress,
      error,
    },
  ];
};
