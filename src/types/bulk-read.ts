import { BasicDisplay } from "./display";
import { BasicActionOperation, OutputItem } from "./operation";

/** How will Zapier fetch resources from your application? */
export interface BulkRead<
  Input = unknown,
  Output extends OutputItem = OutputItem
> {
  /** A key to uniquely identify a record. */
  key: string;

  /** A noun for this read that completes the sentence "reads all of the XXX". */
  noun: string;

  /** Configures the UI for this read bulk. */
  display: BasicDisplay;

  /** Powers the functionality for this read bulk. */
  operation: BasicActionOperation<Input, Output>;
}
/**
 * Helper function to create a bulk read.
 *
 * @param  {BulkRead} definition
 * @returns BulkRead
 */
export function createBulkRead(definition: BulkRead): BulkRead {
  return definition;
}
