import { Rule, Rules, checkRules } from "../rule";

const requiredRule = {
	check: (value) => value != null ? null : { required: true },
	nullable: true
} as Rule;
export function required(): Rule {
	return requiredRule;
}

export function checkIf<T, M extends object>(
	condition: (value: T | null | undefined, model: M) => boolean,
	rulesInit: Rules<T, M> | Rule<T, M>,
	elseRulesInit?: Rules<T, M> | Rule<T, M>
): Rule<T, M> {
	const rules = Array.isArray(rulesInit) ? rulesInit : [rulesInit];

	let elseRules: Rules<T, M> | undefined;
	if (Array.isArray(elseRulesInit)) {
		elseRules = elseRulesInit;
	} else if (elseRulesInit != null) {
		elseRules = [elseRulesInit];
	}

	return {
		check: (value, model) => {
			if (condition(value, model)) {
				return checkRules(rules, value, model);
			} else if (elseRules != null) {
				return checkRules(elseRules, value, model);
			} else {
				return null;
			}
		},
		nullable: true
	};
}

export function checkSwitch<T, M extends object>(
	mapper: (value: T | null | undefined, model: M) => string,
	ruleSet: { [key: string]: Rules<T, M> | Rule<T, M> | undefined },
	defaultRulesInit?: Rules<T, M> | Rule<T, M>
): Rule<T, M> {
	return {
		check: (value, model) => {
			const branch = mapper(value, model);

			let rulesInit = ruleSet[branch];
			if (rulesInit == null) {
				if (defaultRulesInit != null) {
					rulesInit = defaultRulesInit;
				} else {
					return null;
				}
			}

			const rules = Array.isArray(rulesInit) ? rulesInit : [rulesInit];
			return checkRules(rules, value, model);
		},
		nullable: true
	};
}
