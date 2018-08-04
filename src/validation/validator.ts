import deepAssign from "deep-assign";

import { ValidationResult } from "./result";
import { RuleCheckFn, RuleCheckResult, getRuleCheck } from "./rule";
import { model } from "./rules/nested";
import { BaseValidatorRawSchema, ValidatorSchema, normalizeSchema } from "./schema";

export class Validator<M extends object> {
	schema: ValidatorSchema<M, M>;
	private ruleCheck: RuleCheckFn<M, M>;
	private parent?: Validator<M>;

	constructor(schema: BaseValidatorRawSchema<M>) {
		this.schema = normalizeSchema(schema);
		this.ruleCheck = getRuleCheck(model(this));
	}

	async validate(target: M): Promise<ValidationResult<M>> {
		let parentResult: RuleCheckResult | undefined;
		if (this.parent != null) {
			parentResult = await this.parent.ruleCheck(target, target);
		}

		const selfResult = await this.ruleCheck(target, target);

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

	extend<C extends object>(schema: BaseValidatorRawSchema<C>): Validator<M & C> {
		const child = createValidator(schema);
		child.parent = this as any;
		return child as any;
	}
}

export function createValidator<M extends object>(schema: BaseValidatorRawSchema<M>): Validator<M> {
	return new Validator(schema);
}
