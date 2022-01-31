import { Authentication } from "./authentication";
import { BulkRead } from "./bulk-read";
import { Create } from "./create";
import { FunctionSchema } from "./function";
import { Middlewares } from "./middleware";
import { Request } from "./request";
import { Resource } from "./resource";
import { Search } from "./search";
import { SearchOrCreate } from "./search-create";
import { Trigger } from "./trigger";

/** Codifies high-level options for your app. */
export interface AppFlags {
  /** By default, Zapier patches the core http module so that all requests
   * (including those from 3rd-party SDKs) can be logged. Set this to true if you're
   * seeing issues using an SDK (such as AWS). */
  skipHttpPatch?: boolean;
}

/** Represents a full app. */
export interface App {
  /** A version identifier for your code. */
  version: string;

  /** A version identifier for the Zapier execution environment. */
  platformVersion: string;

  /** EXPERIMENTAL: Before the perform method is called on your app, you can modify the
   * execution context. */
  beforeApp?: Middlewares;

  /** EXPERIMENTAL: After the perform method is called on your app, you can modify the
   * response. */
  afterApp?: Middlewares;

  /** Choose what scheme your API uses for authentication. */
  authentication?: Authentication;

  /** An optional bank of named functions that you can use in z.hydrate('someName')
   * to lazily load data. */
  hydrators?: {
    [key: string]: FunctionSchema;
  };

  /** Define a request mixin, great for setting custom headers, content-types, etc. */
  requestTemplate?: Request;

  /** Before an HTTP request is sent via our z.request() client, you can modify it. */
  beforeRequest?: Middlewares;

  /** After an HTTP response is recieved via our z.request() client, you can modify it. */
  afterResponse?: Middlewares;

  /** All the resources for your app. Zapier will take these and generate the relevent
   * triggers/searches/creates automatically. */
  resources?: {
    [key: Resource["key"]]: Resource;
  };

  /** All the triggers for your app. You can add your own here, or Zapier will
   * automatically register any from the list/hook methods on your resources. */
  triggers?: {
    [key: Trigger["key"]]: Trigger;
  };

  /** All of the read bulks (GETs) your app exposes to retrieve resources in batches. */
  bulkReads?: {
    [key: BulkRead["key"]]: BulkRead;
  };

  /** All the searches for your app. You can add your own here, or Zapier will
   * automatically register any from the search method on your resources. */
  searches?: {
    [key: Search["key"]]: Search;
  };

  /** All the creates for your app. You can add your own here, or Zapier will
   * automatically register any from the create method on your resources. */
  creates?: {
    [key: Create["key"]]: Create;
  };

  /** All the search-or-create combos for your app. You can create your own here, or
   * Zapier will automatically register any from resources that define a search, a create,
   * and a get (or define a searchOrCreate directly). Register non-resource
   * search-or-creates here as well. */
  searcheOrCreates?: {
    [key: SearchOrCreate["key"]]: SearchOrCreate;
  };

  /** Top-level app options */
  flags?: AppFlags;
}

/**
 * Helper function to create a Zapier app.
 *
 * @param  {App} definition
 * @returns App
 */
export function createApp(definition: App): App {
  return definition;
}
