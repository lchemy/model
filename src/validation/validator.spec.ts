import * as rules from "./rules";
import { Validator } from "./validator";

describe("validation: validator", () => {
	it("should validate against a target", async () => {
		const validator = new Validator({
			string: [
				rules.required(),
				rules.isString()
			],
			int: rules.isInt()
		});

		expect((await validator.validate({
			string: "",
			int: 0
		})).isValid).toBe(true);
	});

	it("should be possible to extend a validator", async () => {
		const parentValidator = new Validator({
			string: [
				rules.required(),
				rules.isString()
			],
			int: rules.isInt()
		});

		const childValidator = parentValidator.extend({
			int: rules.required(),
			boolean: [
				rules.required(),
				rules.isBoolean()
			]
		});

		const withParentResult = await childValidator.validate({
			string: 1,
			int: undefined,
			boolean: true
		} as any);

		expect(withParentResult.isValid).toBe(false);
		expect(withParentResult.get("string")!.isValid).toBe(false);
		expect(withParentResult.get("int")!.isValid).toBe(false);
		expect(withParentResult.get("boolean")!.isValid).toBe(true);

		const withoutParentResult = await childValidator.validate({
			string: "",
			int: 1,
			boolean: undefined
		} as any);
		expect(withoutParentResult.isValid).toBe(false);
		expect(withoutParentResult.get("string")!.isValid).toBe(true);
		expect(withoutParentResult.get("int")!.isValid).toBe(true);
		expect(withoutParentResult.get("boolean")!.isValid).toBe(false);

		const onlyParentResult = await childValidator.validate({
			string: undefined,
			int: 1,
			boolean: true
		} as any);
		expect(onlyParentResult.isValid).toBe(false);
		expect(onlyParentResult.get("string")!.isValid).toBe(false);
		expect(onlyParentResult.get("int")!.isValid).toBe(true);
		expect(onlyParentResult.get("boolean")!.isValid).toBe(true);
	});
});
