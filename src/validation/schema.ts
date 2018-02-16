import { Rule, Rules, isRule } from "./rule";
import { model, object } from "./rules";
import { Validator } from "./validator";

export type ValidatorSchema<T, M = object> = {
	[K in keyof T]?: Rules<T[K], M>;
};

// TODO: in the future, need to add some conditional types, otherwise value could equal T right now
// "T & object" is a hack, see: https://github.com/Microsoft/TypeScript/issues/14366
export type ValidatorRawSchemaValue<T, M = object> = Rule<T & object, M> | Rules<T & object, M> | ValidatorRawSchema<T, M> | Validator<T>;
export type ValidatorRawSchema<T, M = object> = {
	[K in keyof T]?: ValidatorRawSchemaValue<T[K], M>;
};

export type BaseValidatorRawSchema<M = object> = ValidatorRawSchema<M, M>;

export function normalizeSchema<T, M>(schema: ValidatorRawSchema<T, M>): ValidatorSchema<T, M> {
	return (Object.keys(schema) as Array<keyof T>).reduce((memo, key) => {
		memo[key] = normalizeSchemaValue<T[keyof T], M>(schema[key]!);
		return memo;
	}, {} as ValidatorSchema<T, M>);
}

function normalizeSchemaValue<T, M>(value?: ValidatorRawSchemaValue<T, M>): Rules<T, M> {
	if (value == null) {
		return [];
	}

	return (Array.isArray(value) ? value : [value]).map((rule) => {
		if (typeof rule === "function" || isRule(rule)) {
			return rule;
		}
		if (rule instanceof Validator) {
			return model(rule);
		}
		if (typeof rule === "object" && !Array.isArray(rule)) {
			return object(rule as ValidatorRawSchema<T>);
		}

		throw new Error("Invalid validator schema value");
	}) as Rules<T, any>;
}
