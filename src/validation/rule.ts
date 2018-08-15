export type RuleCheckResult = Record<string, any> | null | undefined;

export type RuleCheckFn<T, M extends object> = (value: T, model: M) => RuleCheckResult | Promise<RuleCheckResult>;

export interface NonNullableRule<T, M extends object> {
	check: RuleCheckFn<NonNullable<T>, M>;
	nullable: false;
}
export interface NullableRule<T, M extends object> {
	check: RuleCheckFn<T | null | undefined, M>;
	nullable: true;
}

export type Rule<T = any, M extends object = object> = RuleCheckFn<NonNullable<T>, M> | NonNullableRule<NonNullable<T>, M> | NullableRule<NonNullable<T>, M>;
export type Rules<T = any, M extends object = object> = Array<Rule<T, M>>;

export async function checkRules<T, M extends object>(rules: Rules<T, M>, value: T | null | undefined, model: M): Promise<RuleCheckResult> {
	let out: RuleCheckResult = null;

	for (const rule of rules) {
		const { check, nullable } = typeof rule !== "function" ? rule : { check: rule, nullable: false };
		if (value == null && !nullable) {
			continue;
		}

		const result = await (check as RuleCheckFn<T | null | undefined, M>)(value, model);
		if (result != null) {
			out = {
				...(out as any),
				...result
			};
		}
	}

	return out;
}

export function isRule(value: any): value is Rule {
	if (typeof value === "function") {
		return true;
	}
	if (typeof value === "object") {
		return value.$rule !== false &&
			value.check != null &&
			typeof value.check === "function";
	}
	return false;
}

export function getRuleCheck(rule: Rule): RuleCheckFn<any, object> {
	if (typeof rule === "function") {
		return rule;
	} else {
		return rule.check;
	}
}
