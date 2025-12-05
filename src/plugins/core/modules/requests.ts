import {nullable} from "@jstls/core/utils/types";
import {setTo} from "@jstls/core/objects/handlers/getset";
import {string} from "@jstls/core/objects/handlers";
import {keach} from "@jstls/core/iterable/each";
import {KeyableObject} from "@jstls/types/core/objects";
import {assign2} from "@jstls/core/objects/factory";

/**
 * Callback function invoked when a request loads successfully.
 * @param request The XMLHttpRequest object.
 */
export type OnLoadRequest = (request: XMLHttpRequest) => void;

/**
 * Callback function invoked when a request encounters an error.
 * @param request The XMLHttpRequest object.
 */
export type OnErrorRequest = (request: XMLHttpRequest) => void;

/**
 * Options for making a request, extending RequestInit with optional responseType.
 */
export type RequestOptions = RequestInit & { responseType?: XMLHttpRequestResponseType };

/**
 * Callback function invoked when a JSON request loads successfully.
 * @param data The parsed JSON data.
 * @param request The XMLHttpRequest object.
 */
export type OnLoadJsonRequest<T> = (data: T, request: XMLHttpRequest) => void;

/**
 * Handler for managing request callbacks.
 */
export interface RequestHandler {
  /**
   * Sets the load callback.
   * @param callback The callback to invoke on load.
   * @returns This handler for chaining.
   */
  onLoad(callback: OnLoadRequest): RequestHandler;

  /**
   * Sets the error callback.
   * @param callback The callback to invoke on error.
   * @returns This handler for chaining.
   */
  onError(callback: OnErrorRequest): RequestHandler;

  /**
   * Sets both load and error callbacks.
   * @param onLoad The callback to invoke on load.
   * @param onError The callback to invoke on error.
   * @returns This handler for chaining.
   */
  then(onLoad: OnLoadRequest, onError?: OnErrorRequest): RequestHandler;
}

/**
 * Handler for managing JSON request callbacks.
 */
export interface RequestJsonHandler<T> {
  /**
   * Sets the load callback for JSON data.
   * @param callback The callback to invoke on load with parsed data.
   * @returns This handler for chaining.
   */
  onLoad(callback: OnLoadJsonRequest<T>): RequestJsonHandler<T>;

  /**
   * Sets the error callback.
   * @param callback The callback to invoke on error.
   * @returns This handler for chaining.
   */
  onError(callback: OnErrorRequest): RequestJsonHandler<T>;

  /**
   * Sets both load and error callbacks for JSON data.
   * @param onLoad The callback to invoke on load with parsed data.
   * @param onError The callback to invoke on error.
   * @returns This handler for chaining.
   */
  then(onLoad: OnLoadJsonRequest<T>, onError?: OnErrorRequest): RequestJsonHandler<T>;
}

function createHandler(): [RequestHandler, KeyableObject]
function createHandler<T>(): [RequestJsonHandler<T>, KeyableObject];
function createHandler(): any {
  const source = {
    load: null as Function | null,
    error: null as Function | null
  }

  return [
    {
      onLoad(callback: Function) {
        source.load = callback;
        return this;
      },
      onError(callback: Function) {
        source.error = callback;
        return this;
      },
      then(load: Function, error?: Function) {
        source.load = load;
        source.error = error!;
        return this;
      }
    },
    source
  ]
}

/**
 * Fetches a resource and parses the response as JSON.
 *
 * Forces the response type to JSON and sets the Content-Type header to 'application/json'.
 *
 * @param url The URL to fetch.
 * @param init The fetch options.
 * @returns A RequestJsonHandler for managing callbacks.
 */
export function fetchJson<T = any>(url: string, init?: RequestOptions): RequestJsonHandler<T> {

  const [handler, source] = createHandler<T>(),
    options: RequestOptions = assign2({} as RequestOptions, init!),
    headers = assign2({}, options.headers!);

  assign2(options, {
    responseType: "json",
    headers
  });

  assign2(headers, {
    "Content-Type": "application/json",
  });

  fetchRequest(url, options)
    .then(
      function (xhr) {
        const data: T = xhr.response,
          load = source.load as OnLoadJsonRequest<T>;

        xhr.status < 400 && load && load(data, xhr);
      },
      function (xhr) {
        const error = source.error as OnErrorRequest;
        error && error(xhr);
      }
    )

  return handler;
}

export function fetchRequest(input: string | URL, init?: RequestOptions): RequestHandler {
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

  const assignKeys: any[] = ["url", "method", "headers"],
    [handler, source] = createHandler();

  init && setTo(init, assignKeys, options);


  xhr.onload = function () {
    const load = source.load as OnLoadRequest;
    load && load(this);
  }

  xhr.onerror = function () {
    const error = source.error as OnErrorRequest;
    error && error(this);
  }

  keach(options.headers, function (value, key) {
    xhr.setRequestHeader(key as string, value);
  });

  const {headers, responseType} = options,
    mimeType = headers["Content-Type"] || headers["content-type"];

  mimeType && xhr.overrideMimeType(mimeType);
  responseType && (xhr.responseType = responseType);

  xhr.open(options.method, options.url, true);
  xhr.send(options.body);

  return handler;
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
}


/**
 * The core requests module instance.
 */
export const requests: CoreRequests = {
  fetch: fetchRequest,
  fetchJson
}
