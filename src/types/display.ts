export interface BasicDisplayVisible {
  /** A short label like "New Record" or "Create Record in Project". Optional if hidden is true. */
  label: string;
  /** A description of what this trigger, search, or create does. Optional if hidden is true. */
  description: string;
  /** A short blurb that can explain how to get this working. EG: how and where to copy-paste a static hook URL into your application. Only evaluated for static webhooks. */
  directions?: string;
  /** Affects how prominently this operation is displayed in the UI. Only mark a few of the most popular operations important. */
  important?: string;
  /** Should this operation be unselectable by users? */
  hidden?: false;
}

export interface BasicDisplayHidden {
  /** A short label like "New Record" or "Create Record in Project". Optional if hidden is true. */
  label?: string;
  /** A description of what this trigger, search, or create does. Optional if hidden is true. */
  description?: string;
  /** A short blurb that can explain how to get this working. EG: how and where to copy-paste a static hook URL into your application. Only evaluated for static webhooks. */
  directions?: string;
  /** Affects how prominently this operation is displayed in the UI. Only mark a few of the most popular operations important. */
  important?: string;
  /** Should this operation be unselectable by users? */
  hidden: true;
}

/** Represents user information for a trigger, search, or create. */
export type BasicDisplay = BasicDisplayVisible | BasicDisplayHidden;
