import { DynamicFields } from "./fields";
import { FunctionSchema } from "./function";
import { Request } from "./request";

export enum TriggerType {
  POLLING = "polling",
  HOOK = "hook",
}

/** Represents the fundamental mechanics of triggers, searches, or creates. */
export interface BasicOperation<
  Input = unknown,
  Output extends OutputItem = OutputItem
> {
  /** Optionally reference and extends a resource. Allows Zapier to automatically tie
   * together samples, lists and hooks, greatly improving the UX. EG: if you had another
   * trigger reusing a resource but filtering the results. */
  resource?: string;

  /** How will Zapier get the data? This can be a function like (z) => [{id: 123}] or a
   * request like {url: 'http...'}. */
  perform: Request | FunctionSchema<Input, Output>;

  /** What should the form a user sees and configures look like? */
  inputFields?: DynamicFields;

  /** What fields of data will this return? Will use resource outputFields if missing,
   * will also use sample if available. */
  outputFields?: DynamicFields;

  /** What does a sample of data look like? Will use resource sample if missing. Requirement waived if display.hidden is true or if this belongs to a resource that has a top-level sample */
  sample: Output;
}

export interface OutputItem {
  id: string;
}

/** Represents the fundamental mechanics of a trigger. */
export interface BasicPollingOperation<
  Input = unknown,
  Output extends OutputItem = OutputItem
> extends BasicOperation<Input, Output> {
  /** Clarify how this operation works (polling == pull or hook == push). */
  type?: TriggerType.POLLING;

  /** Does this endpoint support pagination via temporary cursor storage? */
  canPaginate?: boolean;
}

/** Represents the inbound mechanics of hooks with optional subscribe/unsubscribe. Defers to list for fields. */
export interface BasicHookOperation<
  Input = unknown,
  Output extends OutputItem = OutputItem
> extends BasicOperation<Input, Output> {
  /** Must be explicitly set to "hook" unless this hook is defined as part of a resource,
   * in which case it's optional. */
  type: TriggerType.HOOK;

  /** Can get "live" data on demand instead of waiting for a hook. If you find yourself
   * reaching for this - consider resources and their built-in hook/list methods. Note:
   * this is required for public apps to ensure the best UX for the end-user. For private
   * apps, you can ignore warnings about this property with the --without-style flag
   * during zapier push. */
  performList: Request | FunctionSchema<Input, Output>;

  /** Does this endpoint support pagination via temporary cursor storage? */
  canPaginate?: boolean;

  /** Takes a URL and any necessary data from the user and subscribes. Note: this is
   * required for public apps to ensure the best UX for the end-user. For private apps,
   * you can ignore warnings about this property with the --without-style flag during
   * zapier push. */
  performSubscribe: Request | FunctionSchema<Input, Output>;

  /** Takes a URL and data from a previous subscribe call and unsubscribes. Note: this is
   * required for public apps to ensure the best UX for the end-user. For private apps,
   * you can ignore warnings about this property with the --without-style flag during
   * zapier push. */
  performUnsubscribe: Request | FunctionSchema<Input, Output>;
}

/** Represents the fundamental mechanics of a search/create. */
export interface BasicActionOperation<
  Input = unknown,
  Output extends OutputItem = OutputItem
> extends BasicOperation<Input, Output> {
  /** A function that parses data from a perform (which uses z.generateCallbackUrl())
   * and callback request to resume this action. */
  performResume?: FunctionSchema<Input, Output>;

  /** How will Zapier get a single record? If you find yourself reaching for this -
   * consider resources and their built-in get methods. */
  performGet?: Request | FunctionSchema<Input, Output>;
}

/** Represents the fundamental mechanics of a create. */
export interface BasicCreateActionOperation<
  Input = unknown,
  Output extends OutputItem = OutputItem
> extends BasicActionOperation<Input, Output> {
  /** A function that parses data from a perform (which uses z.generateCallbackUrl())
   * and callback request to resume this action. */
  performResume?: FunctionSchema<Input, Output>;

  /** How will Zapier get a single record? If you find yourself reaching for this -
   * consider resources and their built-in get methods. */
  performGet?: Request | FunctionSchema<Input, Output>;

  /** Should this action be performed one at a time (avoid concurrency)? */
  shouldLock?: boolean;
}
