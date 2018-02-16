import { BigNumber } from "bignumber.js";
import * as Immutable from "immutable";

import * as rules from "../rules";

describe("validation: type rules", () => {
	const types = {
		boolean: true,
		string: "",
		number: 0.5,
		bignumber: new BigNumber(0.5),
		int: 0,
		bigint: new BigNumber(0),
		date: new Date("2018-01-01"),
		array: [],
		imList: Immutable.List(),
		set: new Set(),
		imSet: Immutable.Set(),
		object: {},
		map: new Map(),
		imMap: Immutable.Map(),
		function: () => { /* noop */ },
		class: class { /* noop */ },
		classInstance: new (class { /* noop */ })(),
		nullCtor: Object.create(null)
	};

	describe("is boolean", () => {
		it("should check boolean", () => {
			const { check } = rules.isBoolean(),
				failObj = { isBoolean: true };
			expect(check(types.boolean as any, {})).toBeNull();
			expect(check(types.string as any, {})).toEqual(failObj);
			expect(check(types.number as any, {})).toEqual(failObj);
			expect(check(types.bignumber as any, {})).toEqual(failObj);
			expect(check(types.int as any, {})).toEqual(failObj);
			expect(check(types.bigint as any, {})).toEqual(failObj);
			expect(check(types.date as any, {})).toEqual(failObj);
			expect(check(types.array as any, {})).toEqual(failObj);
			expect(check(types.imList as any, {})).toEqual(failObj);
			expect(check(types.set as any, {})).toEqual(failObj);
			expect(check(types.imSet as any, {})).toEqual(failObj);
			expect(check(types.object as any, {})).toEqual(failObj);
			expect(check(types.map as any, {})).toEqual(failObj);
			expect(check(types.imMap as any, {})).toEqual(failObj);
			expect(check(types.function as any, {})).toEqual(failObj);
			expect(check(types.class as any, {})).toEqual(failObj);
			expect(check(types.classInstance as any, {})).toEqual(failObj);
			expect(check(types.nullCtor as any, {})).toEqual(failObj);
		});
	});

	describe("is string", () => {
		it("should check string", () => {
			const { check } = rules.isString(),
				failObj = { isString: true };
			expect(check(types.boolean as any, {})).toEqual(failObj);
			expect(check(types.string as any, {})).toBeNull();
			expect(check(types.number as any, {})).toEqual(failObj);
			expect(check(types.bignumber as any, {})).toEqual(failObj);
			expect(check(types.int as any, {})).toEqual(failObj);
			expect(check(types.bigint as any, {})).toEqual(failObj);
			expect(check(types.date as any, {})).toEqual(failObj);
			expect(check(types.array as any, {})).toEqual(failObj);
			expect(check(types.imList as any, {})).toEqual(failObj);
			expect(check(types.set as any, {})).toEqual(failObj);
			expect(check(types.imSet as any, {})).toEqual(failObj);
			expect(check(types.object as any, {})).toEqual(failObj);
			expect(check(types.map as any, {})).toEqual(failObj);
			expect(check(types.imMap as any, {})).toEqual(failObj);
			expect(check(types.function as any, {})).toEqual(failObj);
			expect(check(types.class as any, {})).toEqual(failObj);
			expect(check(types.classInstance as any, {})).toEqual(failObj);
			expect(check(types.nullCtor as any, {})).toEqual(failObj);
		});
	});

	describe("is number", () => {
		it("should check number", () => {
			const { check } = rules.isNumber(),
				failObj = { isNumber: true };
			expect(check(types.boolean as any, {})).toEqual(failObj);
			expect(check(types.string as any, {})).toEqual(failObj);
			expect(check(types.number as any, {})).toBeNull();
			expect(check(types.bignumber as any, {})).toBeNull();
			expect(check(types.int as any, {})).toBeNull();
			expect(check(types.bigint as any, {})).toBeNull();
			expect(check(types.date as any, {})).toEqual(failObj);
			expect(check(types.array as any, {})).toEqual(failObj);
			expect(check(types.imList as any, {})).toEqual(failObj);
			expect(check(types.set as any, {})).toEqual(failObj);
			expect(check(types.imSet as any, {})).toEqual(failObj);
			expect(check(types.object as any, {})).toEqual(failObj);
			expect(check(types.map as any, {})).toEqual(failObj);
			expect(check(types.imMap as any, {})).toEqual(failObj);
			expect(check(types.function as any, {})).toEqual(failObj);
			expect(check(types.class as any, {})).toEqual(failObj);
			expect(check(types.classInstance as any, {})).toEqual(failObj);
			expect(check(types.nullCtor as any, {})).toEqual(failObj);

			expect(check("123", {})).toBeNull();
			expect(check("123.456", {})).toBeNull();
			expect(check("", {})).toEqual(failObj);
			expect(check("not num", {})).toEqual(failObj);
		});
	});

	describe("is int", () => {
		it("should check int", () => {
			const { check } = rules.isInt(),
				failObj = { isInt: true };
			expect(check(types.boolean as any, {})).toEqual(failObj);
			expect(check(types.string as any, {})).toEqual(failObj);
			expect(check(types.number as any, {})).toEqual(failObj);
			expect(check(types.bignumber as any, {})).toEqual(failObj);
			expect(check(types.int as any, {})).toBeNull();
			expect(check(types.bigint as any, {})).toBeNull();
			expect(check(types.date as any, {})).toEqual(failObj);
			expect(check(types.array as any, {})).toEqual(failObj);
			expect(check(types.imList as any, {})).toEqual(failObj);
			expect(check(types.set as any, {})).toEqual(failObj);
			expect(check(types.imSet as any, {})).toEqual(failObj);
			expect(check(types.object as any, {})).toEqual(failObj);
			expect(check(types.map as any, {})).toEqual(failObj);
			expect(check(types.imMap as any, {})).toEqual(failObj);
			expect(check(types.function as any, {})).toEqual(failObj);
			expect(check(types.class as any, {})).toEqual(failObj);
			expect(check(types.classInstance as any, {})).toEqual(failObj);
			expect(check(types.nullCtor as any, {})).toEqual(failObj);

			expect(check("123", {})).toBeNull();
			expect(check("123.456", {})).toEqual(failObj);
			expect(check("", {})).toEqual(failObj);
			expect(check("not int", {})).toEqual(failObj);
		});
	});

	describe("is date", () => {
		it("should check date", () => {
			const { check } = rules.isDate(),
				failObj = { isDate: true };
			expect(check(types.boolean as any, {})).toEqual(failObj);
			expect(check(types.string as any, {})).toEqual(failObj);
			expect(check(types.number as any, {})).toEqual(failObj);
			expect(check(types.bignumber as any, {})).toEqual(failObj);
			expect(check(types.int as any, {})).toEqual(failObj);
			expect(check(types.bigint as any, {})).toEqual(failObj);
			expect(check(types.date as any, {})).toBeNull();
			expect(check(types.array as any, {})).toEqual(failObj);
			expect(check(types.imList as any, {})).toEqual(failObj);
			expect(check(types.set as any, {})).toEqual(failObj);
			expect(check(types.imSet as any, {})).toEqual(failObj);
			expect(check(types.object as any, {})).toEqual(failObj);
			expect(check(types.map as any, {})).toEqual(failObj);
			expect(check(types.imMap as any, {})).toEqual(failObj);
			expect(check(types.function as any, {})).toEqual(failObj);
			expect(check(types.class as any, {})).toEqual(failObj);
			expect(check(types.classInstance as any, {})).toEqual(failObj);
			expect(check(types.nullCtor as any, {})).toEqual(failObj);

			expect(check(new Date("invalid date"), {})).toEqual(failObj);
			expect(check("2020-01-01 00:00:00", {})).toBeNull();
			expect(check("", {})).toEqual(failObj);
			expect(check("not date", {})).toEqual(failObj);
		});
	});

	describe("is array", () => {
		it("should check array", () => {
			const { check } = rules.isArray(),
				failObj = { isArray: true };
			expect(check(types.boolean as any, {})).toEqual(failObj);
			expect(check(types.string as any, {})).toEqual(failObj);
			expect(check(types.number as any, {})).toEqual(failObj);
			expect(check(types.bignumber as any, {})).toEqual(failObj);
			expect(check(types.int as any, {})).toEqual(failObj);
			expect(check(types.bigint as any, {})).toEqual(failObj);
			expect(check(types.date as any, {})).toEqual(failObj);
			expect(check(types.array as any, {})).toBeNull();
			expect(check(types.imList as any, {})).toBeNull();
			expect(check(types.set as any, {})).toEqual(failObj);
			expect(check(types.imSet as any, {})).toEqual(failObj);
			expect(check(types.object as any, {})).toEqual(failObj);
			expect(check(types.map as any, {})).toEqual(failObj);
			expect(check(types.imMap as any, {})).toEqual(failObj);
			expect(check(types.function as any, {})).toEqual(failObj);
			expect(check(types.class as any, {})).toEqual(failObj);
			expect(check(types.classInstance as any, {})).toEqual(failObj);
			expect(check(types.nullCtor as any, {})).toEqual(failObj);
		});
	});

	describe("is set", () => {
		it("should check set", () => {
			const { check } = rules.isSet(),
				failObj = { isSet: true };
			expect(check(types.boolean as any, {})).toEqual(failObj);
			expect(check(types.string as any, {})).toEqual(failObj);
			expect(check(types.number as any, {})).toEqual(failObj);
			expect(check(types.bignumber as any, {})).toEqual(failObj);
			expect(check(types.int as any, {})).toEqual(failObj);
			expect(check(types.bigint as any, {})).toEqual(failObj);
			expect(check(types.date as any, {})).toEqual(failObj);
			expect(check(types.array as any, {})).toEqual(failObj);
			expect(check(types.imList as any, {})).toEqual(failObj);
			expect(check(types.set as any, {})).toBeNull();
			expect(check(types.imSet as any, {})).toBeNull();
			expect(check(types.object as any, {})).toEqual(failObj);
			expect(check(types.map as any, {})).toEqual(failObj);
			expect(check(types.imMap as any, {})).toEqual(failObj);
			expect(check(types.function as any, {})).toEqual(failObj);
			expect(check(types.class as any, {})).toEqual(failObj);
			expect(check(types.classInstance as any, {})).toEqual(failObj);
			expect(check(types.nullCtor as any, {})).toEqual(failObj);
		});
	});

	describe("is map", () => {
		it("should check map", () => {
			const { check } = rules.isMap(),
				failObj = { isMap: true };
			expect(check(types.boolean as any, {})).toEqual(failObj);
			expect(check(types.string as any, {})).toEqual(failObj);
			expect(check(types.number as any, {})).toEqual(failObj);
			expect(check(types.bignumber as any, {})).toEqual(failObj);
			expect(check(types.int as any, {})).toEqual(failObj);
			expect(check(types.bigint as any, {})).toEqual(failObj);
			expect(check(types.date as any, {})).toEqual(failObj);
			expect(check(types.array as any, {})).toEqual(failObj);
			expect(check(types.imList as any, {})).toEqual(failObj);
			expect(check(types.set as any, {})).toEqual(failObj);
			expect(check(types.imSet as any, {})).toEqual(failObj);
			expect(check(types.object as any, {})).toBeNull();
			expect(check(types.map as any, {})).toBeNull();
			expect(check(types.imMap as any, {})).toBeNull();
			expect(check(types.function as any, {})).toEqual(failObj);
			expect(check(types.class as any, {})).toEqual(failObj);
			expect(check(types.classInstance as any, {})).toEqual(failObj);
			expect(check(types.nullCtor as any, {})).toEqual(failObj);
		});
	});

	describe("is object", () => {
		it("should check object", () => {
			const { check } = rules.isObject(),
				failObj = { isObject: true };
			expect(check(types.boolean as any, {})).toEqual(failObj);
			expect(check(types.string as any, {})).toEqual(failObj);
			expect(check(types.number as any, {})).toEqual(failObj);
			expect(check(types.bignumber as any, {})).toEqual(failObj);
			expect(check(types.int as any, {})).toEqual(failObj);
			expect(check(types.bigint as any, {})).toEqual(failObj);
			expect(check(types.date as any, {})).toEqual(failObj);
			expect(check(types.array as any, {})).toEqual(failObj);
			expect(check(types.imList as any, {})).toEqual(failObj);
			expect(check(types.set as any, {})).toEqual(failObj);
			expect(check(types.imSet as any, {})).toEqual(failObj);
			expect(check(types.object as any, {})).toBeNull();
			expect(check(types.map as any, {})).toEqual(failObj);
			expect(check(types.imMap as any, {})).toEqual(failObj);
			expect(check(types.function as any, {})).toEqual(failObj);
			expect(check(types.class as any, {})).toEqual(failObj);
			expect(check(types.classInstance as any, {})).toEqual(failObj);
			expect(check(types.nullCtor as any, {})).toEqual(failObj);
		});
	});
});
