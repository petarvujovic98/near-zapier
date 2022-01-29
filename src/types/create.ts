import { BasicDisplayVisible } from "./display";
import { BasicCreateActionOperation } from "./operation";

/** How will Zapier create a new object? */
export interface Create {
  /** A key to uniquely identify this create. */
  key: string;

  /** A noun for this create that completes the sentence "creates a new XXX". */
  noun: string;

  /** Configures the UI for this create. */
  display: BasicDisplayVisible;

  /** Powers the functionality for this create. */
  operation: BasicCreateActionOperation;
}
