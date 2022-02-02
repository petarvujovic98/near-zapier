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
  /** A human readable label for this value. */
  label: string;
  /** The actual value that is sent into the Zap. Should match sample exactly. */
  value: string;
  /** Displayed as light grey text in the editor. It's important that the value match the
   * sample. Otherwise, the actual value won't match what the user picked, which is
   * confusing. */
  sample: string;
}

export type FieldChoices =
  | Array<string>
  | Array<FieldChoiceWithLabel>
  | Record<string, Primitive>;

export interface BaseField {
  /** A unique machine readable key for this value (IE: "fname"). */
  key: string;
  /** A human readable label for this value (IE: "First Name"). */
  label?: string;
  /** A human readable description of this value (IE: "The first part of a full name.").
   * You can use Markdown. */
  helpText?: string;
  /** The type of this value. Use string for basic text input, text for a large,
   * <textarea> style box, and code for a <textarea> with a fixed-width font. */
  type?: FieldType;
  /** If this value is required or not. */
  required?: boolean;
  /** An example value that is not saved. */
  placeholder?: string;
  /** A default value that is saved the first time a Zap is created. */
  default?: string;
  /** A reference to a trigger that will power a dynamic dropdown. */
  dynamic?: string;
  /** A reference to a search that will guide the user to add a search step to populate
   * this field when creating a Zap. */
  search?: string;
  /** An object of machine keys and human values to populate a static dropdown. */
  choices?: FieldChoices;
  /** Acts differently when used in inputFields vs. when used in outputFields.
   * In inputFields: Can a user provide multiples of this field? In outputFields:
   * Does this field return an array of items of type type? */
  list?: boolean;
  /** An array of child fields that define the structure of a sub-object for this field.
   * Usually used for line items. */
  children?: Fields;
  /** Is this field a key/value input? */
  dict?: boolean;
  /** Is this field automatically populated (and hidden from the user)? */
  computed?: boolean;
  /** Does the value of this field affect the definitions of other fields in the set? */
  altersDynamicFields?: boolean;
  /** Useful when you expect the input to be part of a longer string. Put "{{input}}"
   * in place of the user's input (IE: "https://{{input}}.yourdomain.com"). */
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
  list: boolean;
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
