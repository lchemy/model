import { Rule, Rules, isRule } from "./rule";
import { model, object } from "./rules";
import { Validator } from "./validator";

export type ValidatorSchema<T, M extends object> = {
	[K in keyof T]?: Rules<T[K], M>;
};

export type ValidatorRawSchema<T, M extends object> = {
	[K in keyof T]?: ValidatorRawSchemaValue<T[K], M>;
};

export type ValidatorRawSchemaValue<T, M extends object> =
	(T extends object ? ValidatorRawSchema<T, M> | Validator<T> : unknown) |
	Rule<T, M> | Rules<T, M>;

export type BaseValidatorRawSchema<M extends object> = ValidatorRawSchema<M, M>;

export function normalizeSchema<T, M extends object>(schema: ValidatorRawSchema<T, M>): ValidatorSchema<T, M> {
	return (Object.keys(schema) as Array<keyof T>).reduce((memo, key) => {
		memo[key] = normalizeSchemaValue<T[keyof T], M>(schema[key]!);
		return memo;
	}, {} as ValidatorSchema<T, M>);
}

function normalizeSchemaValue<T, M extends object>(value?: ValidatorRawSchemaValue<T, M>): Rules<T, M> {
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
			return object(rule as ValidatorRawSchema<T, M>);
		}

		throw new Error("Invalid validator schema value");
	}) as Rules<T, any>;
}
