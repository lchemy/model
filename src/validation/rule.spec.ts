import { checkRules, isRule } from "./rule";
import * as rules from "./rules";

describe("validation: rule", () => {
	it("should check rules against a value", async () => {
		expect(await checkRules([
			rules.required(),
			rules.isInt()
		], 1, undefined)).toBeNull();

		expect(await checkRules([
			rules.required(),
			rules.isInt()
		], undefined as any, undefined)).toEqual({
			required: true
		});
	});

	it("should check if rule object is a rule", () => {
		expect(isRule(undefined)).toBe(false);
		expect(isRule({})).toBe(false);
		expect(isRule({ name: "test" })).toBe(false);
		expect(isRule({ name: "test", check: "test" })).toBe(false);
		expect(isRule({ name: "test", check: () => { /* noop */ }})).toBe(true);
		expect(isRule({ $rule: false, name: "test", check: () => { /* noop */ }})).toBe(false);
	});
});
