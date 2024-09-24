import {
  clientFactory,
  type Client,
  type DataResponse,
  type ErrorResponse,
  type JSONResponse,
  type Method,
  type ResponseHandler,
} from "@/lib/client";
import { useCallback, useState } from "react";

type UseApiProps<T, U> = {
  url: string;
  client: Client<T, U>;
  handleResponse: ResponseHandler<T, U>;
};

export function useApi({ url }: { url: string }) {
  // Statevariabler vi trenger for å holde styr på statusen til kallet
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [status, setStatus] = useState("idle");

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  // En funksjon som tar inn en metode og eventuelt en body
  // og gjør et kall til API-et
  // Bruker useCallback for å unngå at funksjonen endrer seg
  const handler = useCallback(
    async (method: string, body?: any) => {
      let response = null;
      setStatus("loading");
      try {
        switch (method?.toLowerCase()) {
          case "get":
            response = await fetch(url, { method: "GET" });
            break;
          case "post":
            response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            });
            break;
          default:
            break;
        }
        if (response) {
          const text = await response.text();
          const data = text && JSON.parse(text);
          if (!response.ok) {
            const error = data?.error
              ? data
              : { success: false, error: response.statusText };
            setError(error);
            setStatus("error");
          } else {
            setData(data);
            setStatus("success");
          }
        } else {
          setData(null);
          setError(null);
          setStatus("idle");
        }
      } catch (err) {
        console.log(err);
        setError("Noe gikk galt");
        setStatus("error");
      }
    },
    [url]
  );

  return { isSuccess, isError, isLoading, handler, data, error };
}

export function useApiAdvanced<T, U>({
  url,
  client,
  handleResponse,
}: UseApiProps<T, U>) {
  const [data, setData] = useState<DataResponse<T>>(null);
  const [error, setError] = useState<ErrorResponse>(null);
  const [status, setStatus] = useState("idle");

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  const handler = async (method: Method, body?: Record<keyof T, unknown>) => {
    const { get, post } = clientFactory({ client, handleResponse });
    let result: JSONResponse<T> = null;
    setStatus("loading");
    try {
      switch (method?.toLowerCase()) {
        case "get":
          result = await get({ url, method: "GET" });
          break;
        case "post":
          result = await post({
            url,
            method: "POST",
            options: {
              headers: {
                "Content-Type": "application/json",
              },
            },
            body,
          });
          break;
        default:
          break;
      }
      setData(result as DataResponse<T>);
      setStatus("success");
    } catch (error) {
      setError(error as ErrorResponse);
      setStatus("error");
    }
  };

  return { isSuccess, isError, isLoading, handler, data, error };
}
