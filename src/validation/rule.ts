export type RuleCheckResult = { [key: string]: any } | null;
export type RuleCheckFn<T = any, M = object> = (value: T, model: M) => RuleCheckResult | Promise<RuleCheckResult>;

export interface Rule<T = any, M = object> {
	name: string;
	check: RuleCheckFn<T, M>;
	checkNull?: boolean;
}

export type Rules<T = any, M = object> = Array<Rule<T, M>>;

export async function checkRules<T, M = object>(rules: Rules<T, M>, value: T, model: any): Promise<RuleCheckResult> {
	let out: RuleCheckResult = null;

	await rules.filter((rule) => {
		return value != null || rule.checkNull;
	}).reduce(async (prev, rule) => {
		await prev;

		const result = await rule.check(value, model);
		if (result != null) {
			out = {
				...out,
				...result
			};
		}
	}, Promise.resolve());

	return out;
}

export function isRule(value: any): value is Rule {
	return typeof value === "object" &&
		value.name != null &&
		value.check != null &&
		typeof value.check === "function" &&
		value.$rule !== false;
}
