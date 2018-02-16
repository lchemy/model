import { BigNumber } from "bignumber.js";
import * as Immutable from "immutable";

import * as rules from "../rules";

describe("validation: bound rules", () => {
	describe("min", () => {
		it("should compare numbers", () => {
			const { check } = rules.min(0);
			expect(check(0, {})).toBeNull();
			expect(check(1, {})).toBeNull();
			expect(check(-1, {})).toEqual({
				min: {
					requiredValue: 0,
					actualValue: -1
				}
			});
		});

		it("should compare bignumbers", () => {
			const { check } = rules.min(new BigNumber(0));
			expect(check(new BigNumber(0), {})).toBeNull();
			expect(check(new BigNumber(1), {})).toBeNull();
			expect(check(new BigNumber(-1), {})).toEqual({
				min: {
					requiredValue: new BigNumber(0),
					actualValue: new BigNumber(-1)
				}
			});
		});
	});

	describe("max", () => {
		it("should compare numbers", () => {
			const { check } = rules.max(0);
			expect(check(0, {})).toBeNull();
			expect(check(-1, {})).toBeNull();
			expect(check(1, {})).toEqual({
				max: {
					requiredValue: 0,
					actualValue: 1
				}
			});
		});

		it("should compare bignumbers", () => {
			const { check } = rules.max(new BigNumber(0));
			expect(check(new BigNumber(0), {})).toBeNull();
			expect(check(new BigNumber(-1), {})).toBeNull();
			expect(check(new BigNumber(1), {})).toEqual({
				max: {
					requiredValue: new BigNumber(0),
					actualValue: new BigNumber(1)
				}
			});
		});
	});

	describe("min date", () => {
		it("should compare dates", () => {
			const { check } = rules.minDate(new Date("2018-01-01"));
			expect(check(new Date("2018-01-01"), {})).toBeNull();
			expect(check(new Date("2018-01-02"), {})).toBeNull();
			expect(check(new Date("2017-12-31"), {})).toEqual({
				minDate: {
					requiredValue: new Date("2018-01-01"),
					actualValue: new Date("2017-12-31")
				}
			});
		});
	});

	describe("max date", () => {
		it("should compare dates", () => {
			const { check } = rules.maxDate(new Date("2018-01-01"));
			expect(check(new Date("2018-01-01"), {})).toBeNull();
			expect(check(new Date("2017-12-31"), {})).toBeNull();
			expect(check(new Date("2018-01-02"), {})).toEqual({
				maxDate: {
					requiredValue: new Date("2018-01-01"),
					actualValue: new Date("2018-01-02")
				}
			});
		});
	});

	describe("min length", () => {
		it("should check strings", () => {
			const { check } = rules.minLength(1);
			expect(check("a", {})).toBeNull();
			expect(check("aa", {})).toBeNull();
			expect(check("", {})).toEqual({
				minLength: {
					requiredLength: 1,
					actualLength: 0
				}
			});
		});
	});

	describe("max length", () => {
		it("should check strings", () => {
			const { check } = rules.maxLength(1);
			expect(check("a", {})).toBeNull();
			expect(check("", {})).toBeNull();
			expect(check("aa", {})).toEqual({
				maxLength: {
					requiredLength: 1,
					actualLength: 2
				}
			});
		});
	});

	describe("min size", () => {
		it("should check arrays", () => {
			const { check } = rules.minSize(1);
			expect(check([1], {})).toBeNull();
			expect(check([1, 2], {})).toBeNull();
			expect(check([], {})).toEqual({
				minSize: {
					requiredSize: 1,
					actualSize: 0
				}
			});
		});

		it("should check immutable list", () => {
			const { check } = rules.minSize(1);
			expect(check(Immutable.List([1]), {})).toBeNull();
			expect(check(Immutable.List([1, 2]), {})).toBeNull();
			expect(check(Immutable.List([]), {})).toEqual({
				minSize: {
					requiredSize: 1,
					actualSize: 0
				}
			});
		});

		it("should check set", () => {
			const { check } = rules.minSize(1);
			expect(check(new Set([1]), {})).toBeNull();
			expect(check(new Set([1, 2]), {})).toBeNull();
			expect(check(new Set([]), {})).toEqual({
				minSize: {
					requiredSize: 1,
					actualSize: 0
				}
			});
		});

		it("should check immutable set", () => {
			const { check } = rules.minSize(1);
			expect(check(Immutable.Set([1]), {})).toBeNull();
			expect(check(Immutable.Set([1, 2]), {})).toBeNull();
			expect(check(Immutable.Set([]), {})).toEqual({
				minSize: {
					requiredSize: 1,
					actualSize: 0
				}
			});
		});

		it("should check object", () => {
			const { check } = rules.minSize(1);
			expect(check({ a: 1 }, {})).toBeNull();
			expect(check({ a: 1, b: 2}, {})).toBeNull();
			expect(check({}, {})).toEqual({
				minSize: {
					requiredSize: 1,
					actualSize: 0
				}
			});
		});

		it("should check map", () => {
			const { check } = rules.minSize(1);
			expect(check(new Map([["a", 1]]), {})).toBeNull();
			expect(check(new Map([["a", 1], ["b", 2]]), {})).toBeNull();
			expect(check(new Map(), {})).toEqual({
				minSize: {
					requiredSize: 1,
					actualSize: 0
				}
			});
		});

		it("should check immutable map", () => {
			const { check } = rules.minSize(1);
			expect(check(Immutable.Map([["a", 1]]), {})).toBeNull();
			expect(check(Immutable.Map([["a", 1], ["b", 2]]), {})).toBeNull();
			expect(check(Immutable.Map(), {})).toEqual({
				minSize: {
					requiredSize: 1,
					actualSize: 0
				}
			});
		});
	});

	describe("max size", () => {
		it("should check arrays", () => {
			const { check } = rules.maxSize(1);
			expect(check([1], {})).toBeNull();
			expect(check([], {})).toBeNull();
			expect(check([1, 2], {})).toEqual({
				maxSize: {
					requiredSize: 1,
					actualSize: 2
				}
			});
		});

		it("should check immutable list", () => {
			const { check } = rules.maxSize(1);
			expect(check(Immutable.List([1]), {})).toBeNull();
			expect(check(Immutable.List([]), {})).toBeNull();
			expect(check(Immutable.List([1, 2]), {})).toEqual({
				maxSize: {
					requiredSize: 1,
					actualSize: 2
				}
			});
		});

		it("should check set", () => {
			const { check } = rules.maxSize(1);
			expect(check(new Set([1]), {})).toBeNull();
			expect(check(new Set([]), {})).toBeNull();
			expect(check(new Set([1, 2]), {})).toEqual({
				maxSize: {
					requiredSize: 1,
					actualSize: 2
				}
			});
		});

		it("should check immutable set", () => {
			const { check } = rules.maxSize(1);
			expect(check(Immutable.Set([1]), {})).toBeNull();
			expect(check(Immutable.Set([]), {})).toBeNull();
			expect(check(Immutable.Set([1, 2]), {})).toEqual({
				maxSize: {
					requiredSize: 1,
					actualSize: 2
				}
			});
		});

		it("should check object", () => {
			const { check } = rules.maxSize(1);
			expect(check({ a: 1 }, {})).toBeNull();
			expect(check({}, {})).toBeNull();
			expect(check({ a: 1, b: 2}, {})).toEqual({
				maxSize: {
					requiredSize: 1,
					actualSize: 2
				}
			});
		});

		it("should check map", () => {
			const { check } = rules.maxSize(1);
			expect(check(new Map([["a", 1]]), {})).toBeNull();
			expect(check(new Map(), {})).toBeNull();
			expect(check(new Map([["a", 1], ["b", 2]]), {})).toEqual({
				maxSize: {
					requiredSize: 1,
					actualSize: 2
				}
			});
		});

		it("should check immutable map", () => {
			const { check } = rules.maxSize(1);
			expect(check(Immutable.Map([["a", 1]]), {})).toBeNull();
			expect(check(Immutable.Map(), {})).toBeNull();
			expect(check(Immutable.Map([["a", 1], ["b", 2]]), {})).toEqual({
				maxSize: {
					requiredSize: 1,
					actualSize: 2
				}
			});
		});
	});

	describe("is in", () => {
		it("should check arrays", () => {
			const { check } = rules.isIn([1, 2]);
			expect(check(1, {})).toBeNull();
			expect(check(2, {})).toBeNull();
			expect(check(3, {})).toEqual({
				isIn: true
			});
		});

		it("should check immutable list", () => {
			const { check } = rules.isIn(Immutable.List([1, 2]));
			expect(check(1, {})).toBeNull();
			expect(check(2, {})).toBeNull();
			expect(check(3, {})).toEqual({
				isIn: true
			});
		});

		it("should check set", () => {
			const { check } = rules.isIn(new Set([1, 2]));
			expect(check(1, {})).toBeNull();
			expect(check(2, {})).toBeNull();
			expect(check(3, {})).toEqual({
				isIn: true
			});
		});

		it("should check immutable set", () => {
			const { check } = rules.isIn(Immutable.Set([1, 2]));
			expect(check(1, {})).toBeNull();
			expect(check(2, {})).toBeNull();
			expect(check(3, {})).toEqual({
				isIn: true
			});
		});

		it("should check object", () => {
			const { check } = rules.isIn({ a: 1, b: 2});
			expect(check(1, {})).toBeNull();
			expect(check(2, {})).toBeNull();
			expect(check(3, {})).toEqual({
				isIn: true
			});
		});

		it("should check map", () => {
			const { check } = rules.isIn(new Map([["a", 1], ["b", 2]]));
			expect(check(1, {})).toBeNull();
			expect(check(2, {})).toBeNull();
			expect(check(3, {})).toEqual({
				isIn: true
			});
		});

		it("should check immutable map", () => {
			const { check } = rules.isIn(Immutable.Map([["a", 1], ["b", 2]]));
			expect(check(1, {})).toBeNull();
			expect(check(2, {})).toBeNull();
			expect(check(3, {})).toEqual({
				isIn: true
			});
		});
	});
});
