import { BasicDisplay } from "./display";

/** Pair an existing search and a create to enable "Find or Create" functionality in
 * your app */
export interface SearchOrCreate {
  /** A key to uniquely identify this search-or-create. Must match the search key. */
  key: string;

  /** Configures the UI for this search-or-create. */
  display: BasicDisplay;

  /** The key of the search that powers this search-or-create */
  search: string;

  /** The key of the create that powers this search-or-create */
  create: string;
}
/**
 * Helper function to create a search-or-create.
 *
 * @param  {SearchOrCreate} definition
 * @returns SearchOrCreate
 */
export function createSearchOrCreate(
  definition: SearchOrCreate
): SearchOrCreate {
  return definition;
}
