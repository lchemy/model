import * as rules from "../rules";

describe("validation: conditional rules", () => {
	describe("required", () => {
		it("should check value is not null", () => {
			const { check } = rules.required();
			expect(check(1, {})).toBeNull();
			expect(check(null, {})).toEqual({
				required: true
			});
			expect(check(undefined, {})).toEqual({
				required: true
			});
		});
	});

	describe("check if", () => {
		it("should execute rule if condition passes", async () => {
			const ifMockCheck = jest.fn().mockReturnValue(null);
			const { check } = rules.checkIf(() => true, {
				name: "if",
				check: ifMockCheck
			});
			await check(1, {});
			expect(ifMockCheck).toHaveBeenCalledTimes(1);
		});

		it("should execute multiple rules if condition passes", async () => {
			const ifMockCheck = jest.fn().mockReturnValue(null);
			const { check } = rules.checkIf(() => true, [{
				name: "if1",
				check: ifMockCheck
			}, {
				name: "if2",
				check: ifMockCheck
			}]);
			await check(1, {});
			expect(ifMockCheck).toHaveBeenCalledTimes(2);
		});

		it("should not execute rules if condition fails", async () => {
			const ifMockCheck = jest.fn().mockReturnValue(null);
			const { check } = rules.checkIf(() => false, {
				name: "if",
				check: ifMockCheck
			});
			await check(1, {});
			expect(ifMockCheck).toHaveBeenCalledTimes(0);
		});

		it("should execute else rule if condition fails and there are else rules", async () => {
			const ifMockCheck = jest.fn().mockReturnValue(null),
				elseMockCheck = jest.fn().mockReturnValue(null);
			const { check } = rules.checkIf(() => false, {
				name: "if",
				check: ifMockCheck
			}, {
				name: "else",
				check: elseMockCheck
			});
			await check(1, {});
			expect(ifMockCheck).toHaveBeenCalledTimes(0);
			expect(elseMockCheck).toHaveBeenCalledTimes(1);
		});

		it("should execute multiple else rules if condition fails and there are else rules", async () => {
			const ifMockCheck = jest.fn().mockReturnValue(null),
				elseMockCheck = jest.fn().mockReturnValue(null);
			const { check } = rules.checkIf(() => false, {
				name: "if",
				check: ifMockCheck
			}, [{
				name: "else1",
				check: elseMockCheck
			}, {
				name: "else2",
				check: elseMockCheck
			}]);
			await check(1, {});
			expect(ifMockCheck).toHaveBeenCalledTimes(0);
			expect(elseMockCheck).toHaveBeenCalledTimes(2);
		});
	});

	describe("check switch", () => {
		it("should execute rule based on mapper results if matched", async () => {
			const switchMockCheck = jest.fn().mockReturnValue(null);
			const { check } = rules.checkSwitch(() => "a", {
				a: {
					name: "a",
					check: switchMockCheck
				}
			});
			await check(1, {});
			expect(switchMockCheck).toHaveBeenCalledTimes(1);
		});

		it("should execute multiple rules based on mapper results if matched", async () => {
			const switchMockCheck = jest.fn().mockReturnValue(null);
			const { check } = rules.checkSwitch(() => "a", {
				a: [{
					name: "a",
					check: switchMockCheck
				}, {
					name: "b",
					check: switchMockCheck
				}]
			});
			await check(1, {});
			expect(switchMockCheck).toHaveBeenCalledTimes(2);
		});

		it("should pass based on mapper results if none matched", async () => {
			const switchMockCheck = jest.fn().mockReturnValue(null);
			const { check } = rules.checkSwitch(() => "b", {
				a: {
					name: "a",
					check: switchMockCheck
				}
			});
			await check(1, {});
			expect(switchMockCheck).toHaveBeenCalledTimes(0);
		});

		it("should execute default rules based on mapper results if none matched and there are default rules", async () => {
			const switchMockCheck = jest.fn().mockReturnValue(null),
				defaultMockCheck = jest.fn().mockReturnValue(null);
			const { check } = rules.checkSwitch(() => "b", {
				a: {
					name: "a",
					check: switchMockCheck
				}
			}, {
				name: "default",
				check: defaultMockCheck
			});
			await check(1, {});
			expect(switchMockCheck).toHaveBeenCalledTimes(0);
			expect(defaultMockCheck).toHaveBeenCalledTimes(1);
		});
	});
});
