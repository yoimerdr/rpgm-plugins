import {fetch as polyfillFetch} from "@jstls/core/polyfills/fetch";
import {parameters, setParameterPolyfill} from "@core-plugin/parameters";
import {HeadersPolyfill} from "@jstls/core/polyfills/fetch/headers";
import {Promise as PromisePolyfill} from "@jstls/core/polyfills/promise";
import {ResponsePolyfill} from "@jstls/core/polyfills/fetch/response";

if (parameters.polyfills) {
  setParameterPolyfill(
    parameters.fetch,
    "fetch",
    polyfillFetch
  );

  setParameterPolyfill(
    parameters.headers,
    "Headers",
    HeadersPolyfill
  )

  setParameterPolyfill(
    parameters.response,
    "Response",
    ResponsePolyfill
  )

  setParameterPolyfill(
    parameters.promise,
    "Promise",
    PromisePolyfill
  )
}


/**
 * Fetches a resource and parses the response as JSON.
 *
 * Automatically handles the `Content-Type` header to determine if the response should be parsed as JSON.
 *
 * @param url The URL to fetch.
 * @param init The fetch options.
 * @returns A promise that resolves to the parsed JSON.
 */
export function fetchJson<T = any>(url: string, init?: RequestInit): Promise<T> {
  return fetch(url, init)
    .then(res => {
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.startsWith('application/json'))
        return res.text()
          .then(text => JSON.parse(text))
      return res.json()
    }) as Promise<T>
}

/**
 * The core requests module.
 *
 * Provides utilities for performing network requests.
 * It includes a wrapper around the standard `fetch` API and a specialized `fetchJson` function
 * for automatically parsing JSON responses, handling content types appropriately.
 */
export interface CoreRequests {
  fetch: typeof fetch;
  fetchJson: typeof fetchJson;
}


/**
 * The core requests module instance.
 */
export const requests: CoreRequests = {
  fetch,
  fetchJson
}

