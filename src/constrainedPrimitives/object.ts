import { Rule, Static } from '../core';
import { unconstrainedObject, UnconstrainedObject } from '../unconstrainedPrimitives/object';
import { ComposedValidationErrors } from "../errors/ComposedValidationErrors";
import { KeyValidationErrors } from "../errors/KeyValidationErrors";
import { allowUndefined } from '../utilPrimitives/allowUndefined';

type Schema = { [key: string]: Rule<any>; };
type RequiredObject<Schema> = {
  [K in keyof Schema]: Static<Schema[K]>;
};
type PartialObject<Schema> = {
  [K in keyof Schema]?: Static<Schema[K]>;
};
type ConstrainedObject<RequiredSchema, OptionalSchema> = (
  RequiredObject<RequiredSchema> & PartialObject<OptionalSchema>
);

function validateRequiredObject<T extends Schema>(schema: T, objectInput: UnconstrainedObject) {
  const keys: (keyof T)[] = Object.keys(schema);
  const output = {} as RequiredObject<T>;
  const errors = [] as KeyValidationErrors[];
  const initialResult = { output, errors };
  const finalResult = keys.reduce((result, key) => {
    const value = objectInput[key as string];
    try {
      const rule = schema[key];
      result.output[key] = rule(value);
    } catch (err) {
      result.errors.push(new KeyValidationErrors(key as string, value, err));
    }
    return result;
  }, initialResult);
  return finalResult;
}

function validatePartialObject<T extends Schema>(schema: T, objectInput: UnconstrainedObject) {
  const keys: (keyof T)[] = Object.keys(schema);
  const output = {} as PartialObject<T>;
  const errors = [] as KeyValidationErrors[];
  const initialResult = { output, errors };
  const finalResult = keys.reduce((result, key) => {
    const value = objectInput[key as string];
    try {
      const rule = allowUndefined(schema[key]);
      result.output[key] = rule(value);
    } catch (err) {
      result.errors.push(new KeyValidationErrors(key as string, value, err));
    }
    return result;
  }, initialResult);
  return finalResult;
}

export function object<Required extends Schema, Optional extends Schema>(opts: {
  readonly required: Required,
  readonly optional: Optional,
}) {
  return (input: unknown) => {
    const objectInput = unconstrainedObject(input);
    const requiredObjectResult = validateRequiredObject(opts.required, objectInput);
    const optionalObjectResult = validatePartialObject(opts.optional, objectInput);
    const errors = [...requiredObjectResult.errors, ...optionalObjectResult.errors];
    if (errors.length > 0) {
      throw new ComposedValidationErrors(errors);
    }
    return {
      ...requiredObjectResult.output,
      ...optionalObjectResult.output
    } as ConstrainedObject<Required, Optional>;
  };
}
