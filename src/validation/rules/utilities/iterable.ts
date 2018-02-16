import * as Immutable from "immutable";

export type IterableType<T = any> = T[] | Immutable.List<T> |
	Set<T> | Immutable.Set<T> |
	Record<string, T> |
	Map<any, T> | Immutable.Map<any, T>;

export function getSize(value: IterableType): number {
	if (Array.isArray(value)) {
		return value.length;
	} else if (value instanceof Map) {
		return value.size;
	} else if (value instanceof Set) {
		return value.size;
	} else if (value instanceof Immutable.Map) {
		return (value as Immutable.Map<any, any>).size;
	} else if (value instanceof Immutable.Set) {
		return (value as Immutable.Set<any>).size;
	} else if (value instanceof Immutable.List) {
		return (value as Immutable.List<any>).size;
	} else {
		return Object.keys(value).length;
	}
}

export function getValuesSet<T>(value: IterableType<T>): Immutable.Set<T> {
	if (Array.isArray(value)) {
		return Immutable.Set(value);
	} else if (value instanceof Map) {
		return Immutable.Set(value.values());
	} else if (value instanceof Set) {
		return Immutable.Set(value);
	} else if (value instanceof Immutable.Map) {
		return (value as Immutable.Map<any, any>).valueSeq().toSet();
	} else if (value instanceof Immutable.Set) {
		return value as Immutable.Set<any>;
	} else if (value instanceof Immutable.List) {
		return (value as Immutable.List<any>).toSet();
	} else {
		return Immutable.Set(Object.values(value));
	}
}

export function getEntries<T>(value: IterableType<T>): Array<[string | number, T]> {
	if (Array.isArray(value)) {
		return value.map((v, i) => [i, v] as [number, T]);
	} else if (value instanceof Map) {
		return Array.from(value.entries()).map(([k, v]) => {
			return [String(k), v] as [string, T];
		});
	} else if (value instanceof Set) {
		return Array.from(value).map((v, i) => [i, v] as [number, T]);
	} else if (value instanceof Immutable.Map) {
		return (value as Immutable.Map<any, any>).entrySeq().toArray().map(([k, v]) => {
			return [String(k), v] as [string, T];
		});
	} else if (value instanceof Immutable.Set) {
		return (value as Immutable.Set<any>).valueSeq().toArray().map((v, i) => [i, v] as [number, T]);
	} else if (value instanceof Immutable.List) {
		return (value as Immutable.List<any>).toArray().map((v, i) => [i, v] as [number, T]);
	} else {
		return Object.entries(value);
	}
}
