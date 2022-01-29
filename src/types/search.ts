import { BasicDisplayHidden, BasicDisplayVisible } from "./display";
import { BasicActionOperation, OutputItem } from "./operation";

/** How will Zapier search for existing objects? */
export interface SearchHidden<Input, Output extends OutputItem = OutputItem> {
  /** A key to uniquely identify this search. */
  key: string;
  /** A noun for this search that completes the sentence "finds a specific XXX". */
  noun: string;
  /** Configures the UI for this search. */
  display: BasicDisplayHidden;
  /** Powers the functionality for this search. */
  operation: BasicActionOperation<Input, Output>;
}

/** How will Zapier search for existing objects? */
export interface SearchVisible<Input, Output extends OutputItem = OutputItem> {
  /** A key to uniquely identify this search. */
  key: string;
  /** A noun for this search that completes the sentence "finds a specific XXX". */
  noun: string;
  /** Configures the UI for this search. */
  display: BasicDisplayVisible;
  /** Powers the functionality for this search. */
  operation: BasicActionOperation<Input, Output>;
}

/** How will Zapier get notified of new objects? */
export type Search<Input, Output extends OutputItem = OutputItem> =
  | SearchHidden<Input, Output>
  | SearchVisible<Input, Output>;

/**
 * Helper function to create a search operation.
 *
 * @param  {Search} definition The search definition.
 * @returns Search
 */
export function createSearch<Input, Output extends OutputItem = OutputItem>(
  definition: Search<Input, Output>
): Search<Input, Output> {
  return definition;
}
