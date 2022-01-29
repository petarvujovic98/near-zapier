import { BasicDisplay } from "./display";
import { DynamicFields } from "./fields";
import {
  BasicActionOperation,
  BasicHookOperation,
  BasicOperation,
  BasicPollingOperation,
  OutputItem,
} from "./operation";

/** Represents a resource, which will in turn power triggers, searches, or creates. */
export interface Resource<
  Type extends OutputItem = OutputItem,
  GetInput = unknown,
  GetOutput extends Type = Type,
  HookInput = unknown,
  HookOutput extends Type = Type,
  ListInput = unknown,
  ListOutput extends Type = Type,
  SearchInput = unknown,
  SearchOutput extends Type = Type,
  CreateInput = unknown,
  CreateOutput extends Type = Type
> {
  /** A key to uniquely identify this resource. */
  key: string;

  /** A noun for this resource that completes the sentence "create a new XXX". */
  noun: string;

  /** How will we get a single object given a unique identifier/id? */
  get?: ResourceMethodGet<GetInput, GetOutput>;

  /** How will we get notified of new objects? Will be turned into a trigger
   * automatically. */
  hook?: ResourceMethodHook<HookInput, HookOutput>;

  /** How will we get a list of new objects? Will be turned into a trigger automatically. */
  list?: ResourceMethodList<ListInput, ListOutput>;

  /** How will we find a specific object given filters or search terms? Will be turned
   * into a search automatically. */
  search?: ResourceMethodSearch<SearchInput, SearchOutput>;

  /** How will we find create a specific object given inputs? Will be turned into a
   * create automatically. */
  create?: ResourceMethodCreate<CreateInput, CreateOutput>;

  /** What fields of data will this return? */
  outputFields?: DynamicFields;

  /** What does a sample of data look like? */
  sample?: Type;
}

/** How will we get a single object given a unique identifier/id? */
export interface ResourceMethodGet<
  Input = unknown,
  Output extends OutputItem = OutputItem
> {
  /** Define how this get method will be exposed in the UI. */
  display: BasicDisplay;

  /** Define how this get method will work. */
  operation: BasicOperation<Input, Output>;
}

/** How will we get notified of new objects? Will be turned into a trigger automatically. */
export interface ResourceMethodHook<
  Input = unknown,
  Output extends OutputItem = OutputItem
> {
  /** Define how this hook/trigger method will be exposed in the UI. */
  display: BasicDisplay;

  /** Define how this hook/trigger method will work. */
  operation: BasicHookOperation<Input, Output>;
}

/** How will we get a list of new objects? Will be turned into a trigger automatically. */
export interface ResourceMethodList<
  Input = unknown,
  Output extends OutputItem = OutputItem
> {
  /** Define how this list/trigger method will be exposed in the UI. */
  display: BasicDisplay;

  /** Define how this list/trigger method will work. */
  operation: BasicPollingOperation<Input, Output>;
}

/** How will we find a specific object given filters or search terms? Will be turned into
 * a search automatically. */
export interface ResourceMethodSearch<
  Input = unknown,
  Output extends OutputItem = OutputItem
> {
  /** Define how this search method will be exposed in the UI. */
  display: BasicDisplay;

  /** Define how this search method will work. */
  operation: BasicActionOperation<Input, Output>;
}

/** How will we find create a specific object given inputs? Will be turned into a create
 * automatically. */
export interface ResourceMethodCreate<
  Input = unknown,
  Output extends OutputItem = OutputItem
> {
  /** Define how this create method will be exposed in the UI. */
  display: BasicDisplay;

  /** Define how this create method will work. */
  operation: BasicActionOperation<Input, Output>;
}
/**
 * Helper function to create a resource.
 *
 * @param  {Resource<Output>} definition
 * @returns Resource
 */
export function createResource<Output extends OutputItem = OutputItem>(
  definition: Resource<Output>
): Resource<Output> {
  return definition;
}
