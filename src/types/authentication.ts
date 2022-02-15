import { Fields } from "./fields";
import { FunctionSchema } from "./function";
import { OutputItem } from "./operation";
import { RedirectRequest, Request } from "./request";

/** Config for Basic Authentication. No extra properties are required to setup Basic Auth,
 * so you can leave this empty if your app uses Basic Auth. */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BasicConfig {}

/** Config for custom authentication (like API keys). No extra properties are required to
 * setup this auth type, so you can leave this empty if your app uses a custom auth
 * method. */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomConfig {}

/** Config for Digest Authentication. No extra properties are required to setup Digest
 * Auth, so you can leave this empty if your app uses Digets Auth. */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DigestConfig {}

/** Config for OAuth1 authentication. */
export interface OAuth1Config<
  RequestInput = unknown,
  RequestOutput extends OutputItem = OutputItem,
  RedirectInput = unknown,
  RedirectOutput extends OutputItem = OutputItem,
  AccessInput = unknown,
  AccessOutput extends OutputItem = OutputItem
> {
  /** Define where Zapier will acquire a request token which is used for the rest of the
   * three legged authentication process. */
  getRequestToken: Request | FunctionSchema<RequestInput, RequestOutput>;

  /** Define where Zapier will redirect the user to authorize our app. Typically, you
   * should append an oauth_token querystring parameter to the request. */
  authorizeUrl: RedirectRequest | FunctionSchema<RedirectInput, RedirectOutput>;

  /** Define how Zapier fetches an access token from the API */
  getAccessToken: Request | FunctionSchema<AccessInput, AccessOutput>;
}

/** Config for OAuth2 authentication. */
export interface OAuth2Config<
  RedirectInput = unknown,
  RedirectOutput extends OutputItem = OutputItem,
  AccessInput = unknown,
  AccessOutput extends OutputItem = OutputItem,
  RefreshInput = unknown,
  RefreshOutput extends OutputItem = OutputItem
> {
  /** Define where Zapier will redirect the user to authorize our app. Note: we append
   * the redirect URL and state parameters to return value of this function. */
  authorizeUrl: RedirectRequest | FunctionSchema<RedirectInput, RedirectOutput>;

  /** Define how Zapier fetches an access token from the API */
  getAccessToken: Request | FunctionSchema<AccessInput, AccessOutput>;

  /** Define how Zapier will refresh the access token from the API */
  refreshAccessToken?: Request | FunctionSchema<RefreshInput, RefreshOutput>;

  /** Define a non-standard code param Zapier should scrape instead. */
  codeParam?: string;

  /** What scope should Zapier request? */
  scope?: string;

  /** Should Zapier invoke refreshAccessToken when we receive an error for a 401 response? */
  autoRefresh?: boolean;
}

/** Config for session authentication. */
export interface SessionConfig<
  Input = unknown,
  Output extends OutputItem = OutputItem
> {
  /** Define how Zapier fetches the additional authData needed to make API calss. */
  perform: Request | FunctionSchema<Input, Output>;
}

export enum AuthenticationType {
  BASIC = "basic",
  CUSTOM = "custom",
  DIGEST = "digest",
  OAUTH1 = "oauth1",
  OAUTH2 = "oauth2",
  SESSION = "session",
}

/** Represents authentication schemes. */
export interface Authentication<
  TestInput = unknown,
  TestOutput = unknown,
  LabelInput = unknown,
  LabelOutput = unknown
> {
  /** Choose which scheme you want to use. */
  type: AuthenticationType;

  /** A function or request that confirms the authentication is working. */
  test: Request | FunctionSchema<TestInput, TestOutput>;

  /** Fields you can request from the user before they connect your app to Zapier. */
  fields?: Fields;

  /** A string with variables, function, or request that returns the connection label
   * for the authenticated user. */
  connectionLabel?: Request | FunctionSchema<LabelInput, LabelOutput> | string;

  basicConfig?: BasicConfig;

  customConfig?: CustomConfig;

  digestConfig?: DigestConfig;

  oauth1Config?: OAuth1Config;

  oauth2Config?: OAuth2Config;

  sessionConfig?: SessionConfig;
}

/**
 * Helper fucntion to create an authentication operation.
 *
 * @param  {Authentication} definition The authentication definition.
 * @returns Authentication
 */
export function createAuth<
  TestInput = unknown,
  TestOutput = unknown,
  LabelInput = unknown,
  LabelOutput = unknown
>(
  definition: Authentication<TestInput, TestOutput, LabelInput, LabelOutput>
): Authentication<TestInput, TestOutput, LabelInput, LabelOutput> {
  return definition;
}
