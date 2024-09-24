export type Method = "GET" | "POST" | "UPDATE" | "DELETE";

export type ErrorResponse = {
  success: boolean;
  error: string;
} | null;

export type DataResponse<T> = {
  success: boolean;
  data: T;
} | null;

export type JSONResponse<T> = DataResponse<T> | ErrorResponse;

export type ClientParams<T> = {
  url: string;
  method: Method;
  options?: Omit<RequestInit, "method">;
  body?: Record<keyof T, unknown> | null;
};

export type Client<T, U> = ({
  url,
  method,
  options,
  body,
}: ClientParams<T>) => Promise<U>;

interface ClientResult<T> {
  get: ({ url, method, options }: ClientParams<T>) => Promise<JSONResponse<T>>;
  post: ({
    url,
    method,
    options,
    body,
  }: ClientParams<T>) => Promise<JSONResponse<T>>;
}

export type ResponseHandler<T, U> = (
  response: Promise<U>
) => Promise<JSONResponse<T>>;

type ClientFactoryParams<T, U> = {
  client: Client<T, U>;
  handleResponse: ResponseHandler<T, U>;
};

export type IClientFactory<T, U> = ({
  client,
  handleResponse,
}: ClientFactoryParams<T, U>) => ClientResult<T>;

export const clientFactory = <T, U>({
  client,
  handleResponse,
}: ClientFactoryParams<T, U>): ClientResult<T> => {
  return {
    get: async ({ url, options }: ClientParams<T>) => {
      return await handleResponse(client({ url, method: "GET", options }));
    },
    post: async ({ url, options, body }: ClientParams<T>) => {
      return await handleResponse(
        client({
          url,
          method: "POST",
          options,
          body,
        })
      );
    },
  };
};

export const fetchClient = async <T>({
  url,
  method,
  options,
  body,
}: ClientParams<T>) => {
  return await fetch(url, {
    method,
    ...(options as RequestInit),
    body: JSON.stringify(body),
  });
};

export async function handleFetchResponse<T>(
  response: Promise<Response>
): Promise<JSONResponse<T>> {
  const result = await response;
  const text = await result.text();
  const data = text && JSON.parse(text);
  if (!result.ok) {
    const error = data?.error
      ? data
      : { success: false, error: result.statusText };
    return Promise.reject(error instanceof Error ? error : new Error(error));
  }

  return data as DataResponse<T>;
}
