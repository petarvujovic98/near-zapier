import { BasicDisplayVisible } from "./display";
import { BasicCreateActionOperation, OutputItem } from "./operation";

import { BasicDisplayHidden } from ".";

/** How will Zapier create a new object? */
export interface CreateHidden<
  Input = unknown,
  Output extends OutputItem = OutputItem
> {
  /** A key to uniquely identify this create. */
  key: string;

  /** A noun for this create that completes the sentence "creates a new XXX". */
  noun: string;

  /** Configures the UI for this create. */
  display: BasicDisplayHidden;

  /** Powers the functionality for this create. */
  operation: BasicCreateActionOperation<Input, Output>;
}

/** How will Zapier create a new object? */
export interface CreateVisible<
  Input = unknown,
  Output extends OutputItem = OutputItem
> {
  /** A key to uniquely identify this create. */
  key: string;

  /** A noun for this create that completes the sentence "creates a new XXX". */
  noun: string;

  /** Configures the UI for this create. */
  display: BasicDisplayVisible;

  /** Powers the functionality for this create. */
  operation: BasicCreateActionOperation<Input, Output>;
}

/** How will Zapier create a new object? */
export type Create<Input = unknown, Output extends OutputItem = OutputItem> =
  | CreateHidden<Input, Output>
  | CreateVisible<Input, Output>;

/**
 * Helper function to create a create operation.
 *
 * @param  {Create} definition The create definition.
 * @returns Create
 */
export function createCreate<
  Input = unknown,
  Output extends OutputItem = OutputItem
>(definition: Create<Input, Output>): Create<Input, Output> {
  return definition;
}
