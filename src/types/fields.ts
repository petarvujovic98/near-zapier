import { Primitive } from "type-fest";

import { FunctionSchema } from "./function";

/** An array or collection of fields. */
export type Fields = Field[];

export enum FieldType {
  STRING = "string",
  TEXT = "text",
  INTEGER = "integer",
  NUMBER = "number",
  BOOLEAN = "boolean",
  DATETIME = "datetime",
  FILE = "file",
  PASSWORD = "password",
  COPY = "copy",
  CODE = "code",
}

export interface FieldChoiceWithLabel {
  label: string;
  value: string;
  sample: string;
}

export type FieldChoices =
  | Array<string>
  | Array<FieldChoiceWithLabel>
  | Record<string, Primitive>;

export interface BaseField {
  key: string;
  label?: string;
  helpText?: string;
  type?: FieldType;
  required?: boolean;
  placeholder?: string;
  default?: string;
  dynamic?: string;
  search?: string;
  choices?: FieldChoices;
  list?: string;
  children?: Fields;
  dict?: boolean;
  computed?: boolean;
  altersDynamicFields?: boolean;
  inputFormat?: string;
}

export interface FieldWithChildren
  extends Omit<
    BaseField,
    "list" | "dict" | "type" | "placeholder" | "helpText" | "default"
  > {
  children: Fields;
}

export interface FieldWithDict extends Omit<BaseField, "list"> {
  dict: boolean;
}

export interface FieldWithList extends Omit<BaseField, "dict"> {
  list: string;
}

export interface DynamicField extends Omit<BaseField, "dict" | "choices"> {
  dynamic: string;
}

export type Field =
  | FieldWithChildren
  | FieldWithDict
  | FieldWithList
  | DynamicField
  | Omit<BaseField, "children" | "dict" | "list" | "dynamic">;

export type DynamicFields<Input = unknown> =
  | Fields
  | Array<FunctionSchema<Input, Field>>;
