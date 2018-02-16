import { BigNumber } from "bignumber.js";

import { Rule } from "../rule";

import { IterableType, getSize, getValuesSet } from "./utilities/iterable";

export function min(minValue: number | BigNumber): Rule<number | BigNumber> {
	const comparison = minValue instanceof BigNumber ? minValue : new BigNumber(minValue);
	return {
		name: "min",
		check: (value) => comparison.lte(value) ? null : {
			min: {
				requiredValue: minValue,
				actualValue: value
			}
		}
	};
}

export function max(maxValue: number | BigNumber): Rule<number | BigNumber> {
	const comparison = maxValue instanceof BigNumber ? maxValue : new BigNumber(maxValue);
	return {
		name: "max",
		check: (value) => comparison.gte(value) ? null : {
			max: {
				requiredValue: maxValue,
				actualValue: value
			}
		}
	};
}

export function minDate(minValue: Date): Rule<Date> {
	return {
		name: "minDate",
		check: (value) => minValue <= value  ? null : {
			minDate: {
				requiredValue: minValue,
				actualValue: value
			}
		}
	};
}

export function maxDate(maxValue: Date): Rule<Date> {
	return {
		name: "maxDate",
		check: (value) => maxValue >= value ? null : {
			maxDate: {
				requiredValue: maxValue,
				actualValue: value
			}
		}
	};
}

export function minLength(minValue: number): Rule<string> {
	return {
		name: "minLength",
		check: (value) => value.length >= minValue ? null : {
			minLength: {
				requiredLength: minValue,
				actualLength: value.length
			}
		}
	};
}

export function maxLength(maxValue: number): Rule<string> {
	return {
		name: "maxLength",
		check: (value) => value.length <= maxValue ? null : {
			maxLength: {
				requiredLength: maxValue,
				actualLength: value.length
			}
		}
	};
}

export function minSize(minValue: number): Rule<IterableType> {
	return {
		name: "minSize",
		check: (value) => {
			const size = getSize(value);
			return minValue <= size ? null : {
				minSize: {
					requiredSize: minValue,
					actualSize: size
				}
			};
		}
	};
}

export function maxSize(maxValue: number): Rule<IterableType> {
	return {
		name: "maxSize",
		check: (value) => {
			const size = getSize(value);
			return maxValue >= size ? null : {
				maxSize: {
					requiredSize: maxValue,
					actualSize: size
				}
			};
		}
	};
}

export function isIn<T = any>(rawValues: IterableType<T>): Rule<T> {
	const values = getValuesSet(rawValues);
	return {
		name: "isIn",
		check: (value) => values.includes(value) ? null : { isIn: true }
	};
}
