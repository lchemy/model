import { Rule, Rules, checkRules } from "../rule";
import { Validator } from "../validator";

export type RuleSet<T, M extends object> = Rules<T, M> | Rule<T, M> | (T extends object ? Validator<T> : never);

const requiredRule = {
	check: (value) => value != null ? null : { required: true },
	nullable: true
} as Rule;
export function required(): Rule {
	return requiredRule;
}

export function checkIf<T, M extends object>(
	condition: (value: T | null | undefined, model: M) => boolean,
	rulesInit: RuleSet<T, M>,
	elseRulesInit?: RuleSet<T, M>
): Rule<T, M> {
	type CheckIfRules = Rules<T, M> | (T extends object ? Validator<T> : never);

	let rules: CheckIfRules;
	if (rulesInit instanceof Validator || Array.isArray(rulesInit)) {
		rules = rulesInit;
	} else {
		rules = [rulesInit];
	}

	let elseRules: CheckIfRules | undefined;
	if (elseRulesInit instanceof Validator || Array.isArray(elseRulesInit)) {
		elseRules = elseRulesInit;
	} else if (elseRulesInit != null) {
		elseRules = [elseRulesInit];
	}

	return {
		check: (value, model) => {
			let check: CheckIfRules;
			if (condition(value, model)) {
				check = rules;
			} else if (elseRules != null) {
				check = elseRules;
			} else {
				return null;
			}

			if (check instanceof Validator) {
				return check.validate(value!);
			} else {
				return checkRules(check, value, model);
			}
		},
		nullable: true
	};
}

export function checkSwitch<T, M extends object>(
	mapper: (value: T | null | undefined, model: M) => string,
	ruleSet: { [key: string]: RuleSet<T, M> | undefined },
	defaultRulesInit?: RuleSet<T, M>
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

			if (rulesInit instanceof Validator) {
				return rulesInit.validate(value!);
			} else {
				const rules = Array.isArray(rulesInit) ? rulesInit : [rulesInit];
				return checkRules(rules, value, model);
			}
		},
		nullable: true
	};
}
