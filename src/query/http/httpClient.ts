import Cookies from 'js-cookie';
import { FetchError } from './FetchError';
import { getJson } from './getJson';
import { isBrowser } from './isBrowser';

export const createHttpClient = (defaults?: {
  baseURL?: string;
  init?: RequestInit;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
}) => {
  const defaultOptions = defaults ?? {};

  const httpClient = async <T>(
    endpoint: string,
    init?: RequestInit,
  ): Promise<T> => {
    const xsrfCookie = Cookies.get(
      defaultOptions?.xsrfCookieName ?? 'XSRF-TOKEN',
    );
    const input = `${defaultOptions?.baseURL ?? ''}${endpoint}`;
    const response = await fetch(input, {
      ...defaultOptions.init,
      ...init,
      headers: {
        ...{
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        ...defaultOptions.init?.headers,
        ...(!!xsrfCookie && {
          [defaults?.xsrfHeaderName ?? 'X-XSRF-TOKEN']: xsrfCookie,
        }),
        ...init?.headers,
      },
    });

    const data = await getJson(response);

    if (response.ok) {
      return data;
    }

    if (!isBrowser()) {
      console.log(
        '[httpClient]: ',
        response.status,
        response.statusText,
        endpoint,
        data,
      );
    }

    throw new FetchError({
      message: response.statusText,
      response,
      data,
    });
  };

  httpClient.get = <T>(input: string, init?: RequestInit) =>
    httpClient<T>(input, {
      ...init,
      method: 'GET',
    });

  httpClient.post = <T>(input: string, data?: unknown, init?: RequestInit) =>
    httpClient<T>(input, {
      ...init,
      method: 'POST',
      ...(!!data && { body: JSON.stringify(data) }),
    });

  httpClient.patch = <T>(input: string, data?: unknown, init?: RequestInit) =>
    httpClient<T>(input, {
      ...init,
      method: 'PATCH',
      ...(!!data && { body: JSON.stringify(data) }),
    });

  httpClient.put = <T>(input: string, data?: unknown, init?: RequestInit) =>
    httpClient<T>(input, {
      ...init,
      method: 'PUT',
      ...(!!data && { body: JSON.stringify(data) }),
    });

  return httpClient;
};
