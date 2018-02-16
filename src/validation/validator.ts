import deepAssign from "deep-assign";

import { ValidationResult } from "./result";
import { Rule, RuleCheckResult } from "./rule";
import { model } from "./rules/nested";
import { BaseValidatorRawSchema, ValidatorSchema, normalizeSchema } from "./schema";

export class Validator<M = object> {
	schema: ValidatorSchema<M, M>;
	private rule: Rule<M, M>;
	private parent?: Validator<M>;

	constructor(schema: BaseValidatorRawSchema<M>) {
		this.schema = normalizeSchema(schema);
		this.rule = model(this) as Rule<M, any>;
	}

	async validate(target: M): Promise<ValidationResult<M>> {
		let parentResult: RuleCheckResult | undefined;
		if (this.parent != null) {
			parentResult = await this.parent.rule.check(target, target);
		}

		const selfResult = await this.rule.check(target, target);

		let result: RuleCheckResult;
		if (parentResult != null && selfResult != null) {
			result = deepAssign({}, parentResult, selfResult);
		} else if (parentResult != null) {
			result = parentResult;
		} else {
			result = selfResult;
		}

		return new ValidationResult(result, target);
	}

	extend<C>(schema: BaseValidatorRawSchema<C>): Validator<M & C> {
		const child = new Validator(schema);
		child.parent = this as any;
		return child as any;
	}
}
