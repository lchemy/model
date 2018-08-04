import { normalizeSchema } from "./schema";
import { Validator } from "./validator";

describe("validation: schema", () => {
	it("should normalize to an expected form", () => {
		const ruleFn = () => null;

		const rule = {
			name: "rule",
			check: ruleFn,
			nullable: false
		};

		const validator = new Validator({});

		const object = {
			a: rule
		};

		const empty = undefined;

		const normalizedSchema = normalizeSchema({
			ruleFn,
			rule,
			validator,
			object,
			empty
		}) as any;

		expect(normalizedSchema.ruleFn).toBeInstanceOf(Array);
		expect(normalizedSchema.ruleFn[0]).toBe(ruleFn);
		expect(normalizedSchema.rule).toBeInstanceOf(Array);
		expect(normalizedSchema.rule[0]).toBe(rule);
		expect(normalizedSchema.validator).toBeInstanceOf(Array);
		expect(normalizedSchema.object).toBeInstanceOf(Array);
		expect(normalizedSchema.empty).toEqual([]);
	});

	it("should throw if provided an unexpected schema value", () => {
		expect(() => {
			normalizeSchema([
				1
			] as any);
		}).toThrow();
	});
});
