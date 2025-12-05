import {nullable} from "@jstls/core/utils/types";
import {setTo} from "@jstls/core/objects/handlers/getset";
import {string} from "@jstls/core/objects/handlers";
import {keach} from "@jstls/core/iterable/each";
import {KeyableObject} from "@jstls/types/core/objects";
import {assign2} from "@jstls/core/objects/factory";
import {Promise} from "@jstls/core/polyfills/promise";
import {IllegalArgumentError} from "@jstls/core/exceptions";

/**
 * Options for making a request, extending RequestInit with optional responseType.
 */
export type RequestOptions = RequestInit & { responseType?: XMLHttpRequestResponseType };

/**
 * Fetches a resource and parses the response as JSON.
 *
 * Forces the response type to JSON and sets the Content-Type header to 'application/json'.
 *
 * @param url The URL to fetch.
 * @param init The fetch options.
 * @returns A RequestJsonHandler for managing callbacks.
 */
export function fetchJson<T = any>(url: string, init?: RequestOptions): Promise<T> {
  const options: RequestOptions = assign2({} as RequestOptions, init!),
    headers = assign2({}, options.headers!);

  assign2(options, {
    responseType: "json",
    headers
  });

  assign2(headers, {
    "Content-Type": "application/json",
  });

  return fetchRequest(url, options)
    .then(
      function (xhr) {
        if (xhr.status >= 400)
          throw new IllegalArgumentError("Unexpected response status: " + xhr.status);

        return xhr.response;
      }
    )
}

export function fetchRequest(input: string | URL, init?: RequestOptions): Promise<XMLHttpRequest> {
  if (typeof XMLHttpRequest === "undefined")
    throw new ReferenceError('This fetch polyfills requires XMLHttpRequest. You must call this on the browser.');

  input = string(input);
  const xhr = new XMLHttpRequest(),
    options = {
      url: input,
      method: "GET",
      headers: <Record<string, any>>{},
      body: <ReadableStream<Uint8Array> | null | BodyInit>nullable
    } as KeyableObject;

  const assignKeys: any[] = ["url", "method", "headers"];

  init && setTo(init, assignKeys, options);

  const {headers, responseType} = options,
    mimeType = headers["Content-Type"] || headers["content-type"];

  mimeType && xhr.overrideMimeType(mimeType);
  responseType && (xhr.responseType = responseType);

  xhr.open(options.method, options.url, true);

  keach(options.headers, function (value, key) {
    xhr.setRequestHeader(key as string, value);
  });

  xhr.send(options.body);

  return new requests.Promise((resolve, reject) => {
    xhr.onload = function () {
      resolve(this)
    }

    xhr.onerror = function () {
      reject(this)
    }
  });
}

/**
 * The core requests module.
 *
 * Provides utilities for performing network requests.
 * It includes a wrapper around the standard `fetch` API and a specialized `fetchJson` function
 * for automatically parsing JSON responses, handling content types appropriately.
 */
export interface CoreRequests {
  fetch: typeof fetchRequest;
  fetchJson: typeof fetchJson;
  Promise: typeof Promise;
}


/**
 * The core requests module instance.
 */
export const requests: CoreRequests = {
  fetch: fetchRequest,
  fetchJson,
  Promise
}
