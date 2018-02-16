import { BigNumber } from "bignumber.js";
import * as Immutable from "immutable";

import { Rule } from "../rule";

function wrapTypeCheck<T>(name: string, fn: (value: T) => boolean): Rule<T> {
	return {
		name,
		check: (value) => {
			return fn(value) ? null : {
				[name]: true
			};
		}
	};
}

const isBooleanRule = wrapTypeCheck<boolean>("isBoolean", (value) => typeof value === "boolean");
export function isBoolean(): Rule<boolean> {
	return isBooleanRule;
}

const isStringRule = wrapTypeCheck<string>("isString", (value) => typeof value === "string");
export function isString(): Rule<string> {
	return isStringRule;
}

const isNumberRule = wrapTypeCheck<number | BigNumber | string>("isNumber", (value) => {
	if (typeof value === "number") {
		return !Number.isNaN(value);
	}
	if (typeof value === "string" && value.length > 0) {
		try {
			value = new BigNumber(value);
		} catch {
			return false;
		}
	}
	if (value instanceof BigNumber) {
		return !value.isNaN();
	}
	return false;
});
export function isNumber(): Rule<number | BigNumber | string> {
	return isNumberRule;
}

const isIntRule = wrapTypeCheck<number | BigNumber | string>("isInt", (value) => {
	if (typeof value === "number") {
		return !Number.isNaN(value) && (value % 0 === value || Math.floor(value) === value);
	}
	if (typeof value === "string" && value.length > 0) {
		try {
			value = new BigNumber(value);
		} catch {
			return false;
		}
	}
	if (value instanceof BigNumber) {
		return !value.isNaN() && value.isInteger();
	}
	return false;
});
export function isInt(): Rule<number | BigNumber | string> {
	return isIntRule;
}

const isDateRule = wrapTypeCheck<Date | string>("isDate", (value) => {
	if (typeof value === "string" && value.length > 0) {
		value = new Date(value);
	}
	if (value instanceof Date) {
		return !Number.isNaN(value.getTime());
	}
	return false;
});
export function isDate(): Rule<Date | string> {
	return isDateRule;
}

const isArrayRule = wrapTypeCheck<any[] | Immutable.List<any>>("isArray", (value) => {
	return Array.isArray(value) || value instanceof Immutable.List;
});
export function isArray<T>(): Rule<T[] | Immutable.List<T>> {
	return isArrayRule;
}

const isSetRule = wrapTypeCheck<Set<any> | Immutable.Set<any>>("isSet", (value) => {
	return value instanceof Set || value instanceof Immutable.Set;
});
export function isSet<T>(): Rule<Set<T> | Immutable.Set<T>> {
	return isSetRule;
}

// https://github.com/jonschlinkert/isobject/blob/master/index.js
// https://github.com/jonschlinkert/is-plain-object/blob/master/index.js
function isObjectObject(value: any): boolean {
	return value != null &&
		typeof value === "object" &&
		!Array.isArray(value) &&
		Object.prototype.toString.call(value) === "[object Object]";
}
function isPlainObject(value: any): boolean {
	if (!isObjectObject(value)) {
		return false;
	}

	const ctor = value.constructor;
	if (typeof ctor !== "function") {
		return false;
	}

	const proto = ctor.prototype;
	if (!isObjectObject(proto) || !proto.hasOwnProperty("isPrototypeOf")) {
		return false;
	}

	return true;
}

const isMapRule = wrapTypeCheck<Record<string, any> | Map<any, any> | Immutable.Map<any, any>>("isMap", (value) => {
	return isPlainObject(value) || value instanceof Map || value instanceof Immutable.Map;
});
export function isMap<T>(): Rule<Record<string, T> | Map<any, T> | Immutable.Map<any, T>> {
	return isMapRule;
}

const isObjectRule = wrapTypeCheck<Record<string, any>>("isObject", isPlainObject);
export function isObject<T>(): Rule<Record<string, T>> {
	return isObjectRule;
}
