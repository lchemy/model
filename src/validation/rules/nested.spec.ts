// tslint:disable:no-sparse-arrays

import Immutable from "immutable";

import { getRuleCheck } from "../rule";
import * as rules from "../rules";
import { Validator } from "../validator";

describe("validation: nested rules", () => {
	describe("each", () => {
		it("should check arrays", async () => {
			const check = getRuleCheck(rules.each([
				rules.min(0),
				rules.max(1)
			]));

			expect(await check([0, 1], {})).toBeNull();

			expect(await check([-2, -1, 0, 1, 2], {})).toEqual({
				each: true,
				nested: [{
					min: {
						requiredValue: 0,
						actualValue: -2
					}
				}, {
					min: {
						requiredValue: 0,
						actualValue: -1
					}
				}, , , {
					max: {
						requiredValue: 1,
						actualValue: 2
					}
				}]
			});
		});

		it("should check immutable lists", async () => {
			const check = getRuleCheck(rules.each(rules.min(0)));

			expect(await check(Immutable.List([-2, -1, 0, 1, 2]), {})).toEqual({
				each: true,
				nested: [{
					min: {
						requiredValue: 0,
						actualValue: -2
					}
				}, {
					min: {
						requiredValue: 0,
						actualValue: -1
					}
				}]
			});
		});

		it("should check sets", async () => {
			const check = getRuleCheck(rules.each(rules.min(0)));

			const result = await check(new Set([-2, -1, 0, 1, 2]), {}),
				nested = result!.nested as any[];

			expect(nested).toHaveLength(2);

			expect(nested.find((res) => {
				return res.min != null && res.min.actualValue === -2;
			})).toBeDefined();

			expect(nested.find((res) => {
				return res.min != null && res.min.actualValue === -1;
			})).toBeDefined();
		});

		it("should check immutable sets", async () => {
			const check = getRuleCheck(rules.each(rules.min(0)));

			const result = await check(Immutable.Set([-2, -1, 0, 1, 2]), {}),
				nested = result!.nested as any[];

			expect(nested).toHaveLength(2);

			expect(nested.find((res) => {
				return res.min != null && res.min.actualValue === -2;
			})).toBeDefined();

			expect(nested.find((res) => {
				return res.min != null && res.min.actualValue === -1;
			})).toBeDefined();
		});

		it("should check objects", async () => {
			const check = getRuleCheck(rules.each(rules.min(0)));

			expect(await check({
				a: -2,
				b: -1,
				c: 0,
				d: 1,
				e: 2
			}, {})).toEqual({
				each: true,
				nested: {
					a: {
						min: {
							requiredValue: 0,
							actualValue: -2
						}
					},
					b: {
						min: {
							requiredValue: 0,
							actualValue: -1
						}
					}
				}
			});
		});

		it("should check maps", async () => {
			const check = getRuleCheck(rules.each(rules.min(0)));

			expect(await check(new Map([
				["a", -2],
				["b", -1],
				["c", 0],
				["d", 1],
				["e", 2],
			]), {})).toEqual({
				each: true,
				nested: {
					a: {
						min: {
							requiredValue: 0,
							actualValue: -2
						}
					},
					b: {
						min: {
							requiredValue: 0,
							actualValue: -1
						}
					}
				}
			});
		});

		it("should check immutable maps", async () => {
			const check = getRuleCheck(rules.each(rules.min(0)));

			expect(await check(Immutable.Map([
				["a", -2],
				["b", -1],
				["c", 0],
				["d", 1],
				["e", 2],
			]), {})).toEqual({
				each: true,
				nested: {
					a: {
						min: {
							requiredValue: 0,
							actualValue: -2
						}
					},
					b: {
						min: {
							requiredValue: 0,
							actualValue: -1
						}
					}
				}
			});
		});
	});

	describe("object", () => {
		it("should check objects", async () => {
			const check = getRuleCheck(rules.object({
				int: rules.isInt(),
				string: rules.isString()
			}));

			expect(await check({
				int: 1,
				string: ""
			}, {})).toBeNull();

			expect(await check({
				int: "not int",
				string: 1
			} as any, {})).toEqual({
				object: true,
				nested: {
					int: {
						isInt: true
					},
					string: {
						isString: true
					}
				}
			});
		});
	});

	describe("model", () => {
		it("should pass the child model to the rules", async () => {
			const mockCheck = jest.fn().mockReturnValue(null);
			const check = getRuleCheck(rules.object({
				a: rules.model({
					b: mockCheck
				})
			}));

			expect(await check({
				a: {
					b: 2
				}
			}, {})).toBeNull();

			expect(mockCheck).toHaveBeenCalledWith(2, {
				b: 2
			});
		});

		it("should allow the definition to be another validator with optional keys", async () => {
			const validator = new Validator({
				b: rules.isInt(),
				c: rules.isInt()
			});

			const check = getRuleCheck(rules.model(validator, ["b"]));

			expect(await check({
				b: 1,
				c: ""
			}, {})).toBeNull();

			expect(await check({
				b: "",
				c: ""
			}, {})).toEqual({
				model: true,
				nested: {
					b: {
						isInt: true
					}
				}
			});
		});

		it("should allow the definition to be a reference to another validator", async () => {
			const validator = new Validator({
				b: rules.isInt(),
				c: rules.isInt()
			});

			const check = getRuleCheck(rules.model(() => validator, ["b"]));

			expect(await check({
				b: 1,
				c: ""
			}, {})).toBeNull();

			expect(await check({
				b: "",
				c: ""
			}, {})).toEqual({
				model: true,
				nested: {
					b: {
						isInt: true
					}
				}
			});
		});

		it("should allow the definition to be a validator schema", async () => {
			const check = getRuleCheck(rules.model({
				b: rules.isInt(),
				c: rules.isInt()
			}, ["b"]));

			expect(await check({
				b: 1,
				c: ""
			}, {})).toBeNull();

			expect(await check({
				b: "",
				c: ""
			}, {})).toEqual({
				model: true,
				nested: {
					b: {
						isInt: true
					}
				}
			});
		});

		it("should throw if provided an invalid validator ref", async () => {
			expect(() => {
				getRuleCheck(rules.model(undefined as any))({}, {});
			}).toThrow();
		});
	});
});
