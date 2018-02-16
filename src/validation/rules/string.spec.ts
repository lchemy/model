import * as rules from "../rules";

describe("validation: string rules", () => {
	describe("matches", () => {
		it("should match arbitrary regexp expressions", () => {
			const regexp = /^[a-z]{2}$/i,
				{ check } = rules.matches(regexp);
			expect(check("aa", {})).toBeNull();
			expect(check("aaa", {})).toEqual({
				matches: {
					requiredPattern: regexp,
					actualValue: "aaa"
				}
			});
		});
	});

	describe("is email", () => {
		it("should match emails", () => {
			const { check } = rules.isEmail();
			expect(check("a@a.com", {})).toBeNull();
			expect(check("not-email", {})).toEqual({
				isEmail: true
			});
		});
	});

	describe("is alphanumeric", () => {
		it("should match alphanumeric strings", () => {
			const { check } = rules.isAlphanumeric();
			expect(check("4lphanumeric", {})).toBeNull();
			expect(check("not-alphanumeric", {})).toEqual({
				isAlphanumeric: true
			});
		});
	});

	describe("is url", () => {
		it("should match urls", () => {
			const { check } = rules.isUrl();
			expect(check("http://a.com", {})).toBeNull();
			expect(check("not-url", {})).toEqual({
				isUrl: true
			});
		});
	});

	describe("is uppercase", () => {
		it("should match uppercase strings", () => {
			const { check } = rules.isUppercase();
			expect(check("UPPERCASE", {})).toBeNull();
			expect(check("notuppercase", {})).toEqual({
				isUppercase: true
			});
		});
	});

	describe("is lowercase", () => {
		it("should match lowercase strings", () => {
			const { check } = rules.isLowercase();
			expect(check("lowercase", {})).toBeNull();
			expect(check("NOTLOWERCASE", {})).toEqual({
				isLowercase: true
			});
		});
	});
});
