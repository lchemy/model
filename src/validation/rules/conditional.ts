import { Rule, Rules, checkRules } from "../rule";

const requiredRule: Rule = {
	name: "required",
	check: (value) => value != null ? null : { required: true },
	checkNull: true
};
export function required(): Rule {
	return requiredRule;
}

export function checkIf<T, M>(
	condition: (value: T, model: M) => boolean,
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
		name: "checkIf",
		check: (value, model) => {
			if (!condition(value, model)) {
				return elseRules == null ? null : checkRules(elseRules, value, model);
			}
			return checkRules(rules, value, model);
		},
		checkNull: true
	};
}

export function checkSwitch<T, M>(
	mapper: (value: T, model: M) => string,
	ruleSet: { [key: string]: Rules<T, M> | Rule<T, M> | undefined },
	defaultRulesInit?: Rules<T, M> | Rule<T, M>
): Rule<T, M> {
	return {
		name: "checkSwitch",
		check: (value: any, model: M) => {
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
		checkNull: true
	};
}
