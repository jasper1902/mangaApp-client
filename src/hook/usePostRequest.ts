/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import axios, { AxiosProgressEvent, AxiosResponse } from "axios";

type ApiResponse<T> = {
  postData: (requestData: ApiPostRequestData) => void;
  data: T | null;
  hasError: boolean;
  isLoading: boolean;
  errorMessage: string;
  status: number | null;
  statusText: string | null;
  progress: number | null;
};

type ApiPostRequestData = {
  [key: string]: any;
};

export const usePostRequest = <T>(
  url: string,
  token?: string
): [(requestData: ApiPostRequestData) => void, ApiResponse<T>] => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState<number | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const postData = useCallback(
    async (requestData: ApiPostRequestData): Promise<void> => {
      try {
        setIsLoading(true);
        setHasError(false);
        setErrorMessage("");
        const response: AxiosResponse<T> = await axios.post(url, requestData, {
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
      } catch (error: any) {
        setHasError(true);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [token, url]
  );

  return [
    postData,
    {
      postData,
      data,
      isLoading,
      hasError,
      errorMessage,
      status,
      statusText,
      progress,
    },
  ];
};
