import { HttpMethod } from "zapier-platform-core";

import { FunctionSchema } from "./function";
import { FlatObject } from "./object";

/** A representation of a HTTP request - you can use the {{syntax}} to inject
 * authentication, field or global variables. */
export interface Request<Type = FlatObject> {
  /** The HTTP method for the request. */
  method?: HttpMethod;
  /** A URL for the request (we will parse the querystring and merge with params).
   * Keys and values will not be re-encoded. */
  url?: string;
  /** Can be nothing, a raw string or JSON (object or array). */
  body?: null | string | Array<Type> | Type;
  /** A mapping of the querystring - will get merged with any query params in the URL.
   * Keys and values will be encoded. */
  params?: FlatObject;
  /** The HTTP headers for the request. */
  headers?: FlatObject;
  /** An object holding the auth parameters for OAuth1 request signing, like
   * {oauth_token: 'abcd', oauth_token_secret: '1234'}. Or an array reserved
   * (i.e. not implemented yet) to hold the username and password for Basic Auth.
   * Like ['AzureDiamond', 'hunter2']. */
  auth?: Array<string> | FlatObject;
  /** Should missing values be sent? (empty strings, null, and undefined only — [], {},
   * and false will still be sent). Allowed fields are params and body.
   * The default is false, ex: removeMissingValuesFrom: { params: false, body: false } */
  removeMissingValuesFrom?: boolean | { params?: boolean; body?: boolean };
  /** A function to customize how to serialize a value for curlies {{var}} in the
   * request object. By default, when this is unspecified, the request client only
   * replaces curlies where variables are strings, and would throw an error for
   * non-strings. The function should accepts a single argument as the value to be
   * serialized and return the string representation of the argument. */
  serializeValueForCurlies?: FunctionSchema<unknown, string>;
  /** If true, don't throw an exception for response 400 <= status < 600 automatically
   * before resolving with the response. Defaults to false. */
  skipThrowForStatus?: boolean;
}

/** A representation of a HTTP redirect - you can use the {{syntax}} to inject
 * authentication, field or global variables. */
export interface RedirectRequest {
  /** The HTTP method for the request. */
  method?: "GET";
  /** A URL for the request (we will parse the querystring and merge with params).
   * Keys and values will not be re-encoded. */
  url?: string;
  /** A mapping of the querystring - will get merged with any query params in the URL.
   * Keys and values will be encoded. */
  params?: FlatObject;
}
