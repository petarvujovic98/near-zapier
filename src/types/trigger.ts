import {
  BasicHookOperation,
  BasicPollingOperation,
  OutputItem,
} from "./operation";
import { BasicDisplayHidden, BasicDisplayVisible } from "./display";

/** How will Zapier get notified of new objects? */
export interface TriggerHidden<
  Input = unknown,
  Output extends OutputItem = OutputItem
> {
  /** A key to uniquely identify this trigger. */
  key: string;
  /** A noun for this trigger that completes the sentence "triggers on a new XXX". */
  noun: string;
  /** Configures the UI for this trigger. */
  display: BasicDisplayHidden;
  /** Powers the functionality for this trigger. */
  operation:
    | BasicPollingOperation<Input, Output>
    | BasicHookOperation<Input, Output>;
}

/** How will Zapier get notified of new objects? */
export interface TriggerVisible<
  Input = unknown,
  Output extends OutputItem = OutputItem
> {
  /** A key to uniquely identify this trigger. */
  key: string;
  /** A noun for this trigger that completes the sentence "triggers on a new XXX". */
  noun: string;
  /** Configures the UI for this trigger. */
  display: BasicDisplayVisible;
  /** Powers the functionality for this trigger. */
  operation:
    | BasicPollingOperation<Input, Output>
    | BasicHookOperation<Input, Output>;
}

/** How will Zapier get notified of new objects? */
export type Trigger<Input = unknown, Output extends OutputItem = OutputItem> =
  | TriggerHidden<Input, Output>
  | TriggerVisible<Input, Output>;

/**
 * Helper function to create a trigger.
 *
 * @param  {Trigger} definition The trigger definition.
 * @returns Trigger
 */
export function createTrigger<
  Input = unknown,
  Output extends OutputItem = OutputItem
>(definition: Trigger<Input, Output>): Trigger<Input, Output> {
  return definition;
}
