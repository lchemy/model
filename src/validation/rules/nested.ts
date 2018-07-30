import { Rule, RuleCheckResult, Rules, checkRules } from "../rule";
import { BaseValidatorRawSchema, ValidatorRawSchema, ValidatorSchema, normalizeSchema } from "../schema";
import { Validator } from "../validator";

import { IterableType, getEntries } from "./utilities/iterable";

export function each<T, M>(rulesInit: Rule<T, M> | Rules<T, M>): Rule<IterableType<T>, M> {
	const rules = Array.isArray(rulesInit) ? rulesInit : [rulesInit];
	return {
		name: "each",
		check: async (iterable, target) => {
			const entries = getEntries(iterable);

			const results: Array<[any, RuleCheckResult]> = [];
			await entries.reduce(async (prev, [key, value]) => {
				await prev;

				const result = await checkRules(rules, value, target);
				if (result != null) {
					results.push([key, result]);
				}
			}, Promise.resolve());

			if (results.length === 0) {
				return null;
			}

			let nested: RuleCheckResult[] | Record<string, RuleCheckResult>;
			if (typeof results[0][0] === "number") {
				nested = results.reduce((memo, [i, v]) => {
					memo[i] = v;
					return memo;
				}, [] as RuleCheckResult[]);
			} else {
				nested = results.reduce((memo, [k, v]) => {
					memo[k] = v;
					return memo;
				}, {} as Record<string, RuleCheckResult>);
			}

			return {
				each: true,
				nested
			};
		}
	};
}

async function checkSchema<T, M>(schema: ValidatorSchema<T, M>, value: T, target: M): Promise<RuleCheckResult> {
	const nested: Partial<Record<keyof T, RuleCheckResult>> = {};

	let isValid = true;

	await (Object.keys(schema) as Array<keyof T>).reduce(async (prev, key) => {
		await prev;

		const rules = schema[key] as Rules<T[keyof T], M>,
			result = await checkRules(rules, value[key], target);
		if (result != null) {
			isValid = false;
			nested[key] = result;
		}
	}, Promise.resolve());

	return isValid ? null : nested;
}

export type ValidatorRef<M> = Validator<M> | (() => Validator<M>) | BaseValidatorRawSchema<M>;
function derefValidatorRef<M>(validatorRef: ValidatorRef<M>): ValidatorSchema<M, M> {
	if (typeof validatorRef === "function") {
		return validatorRef().schema;
	}
	if (validatorRef instanceof Validator) {
		return validatorRef.schema;
	}
	if (typeof validatorRef === "object") {
		return normalizeSchema(validatorRef);
	}
	throw new Error("Invalid validator reference");
}

export function object<T, M>(rawSchema: ValidatorRawSchema<T, M>): Rule<T, M> {
	const schema = normalizeSchema(rawSchema);

	return {
		name: "object",
		check: (value, target) => {
			return checkSchema(schema, value, target).then((nested) => {
				return nested == null ? null : {
					object: true,
					nested
				};
			});
		}
	};
}

export function model<T>(validatorRef: ValidatorRef<T>, keys?: Array<keyof T>): Rule<T> {
	let schema: ValidatorSchema<T, T>;

	return {
		name: "model",
		check: (value: T) => {
			if (schema == null) {
				schema = derefValidatorRef(validatorRef);
				if (keys != null) {
					schema = keys.reduce((memo, key) => {
						memo[key] = schema[key];
						return memo;
					}, {} as ValidatorSchema<T, T>);
				}
			}

			return checkSchema(schema, value, value).then((nested) => {
				return nested == null ? null : {
					model: true,
					nested
				};
			});
		}
	};
}
