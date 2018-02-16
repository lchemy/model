import { List } from "immutable";

import { pathToList } from "./path-to-list";

describe("utilties: path to list", () => {
	it("should parse paths properly", () => {
		expect(pathToList(`a`)).toEqual(List(["a"]));
		expect(pathToList(`a.b`)).toEqual(List(["a", "b"]));
		expect(pathToList(`a.b[0]`)).toEqual(List(["a", "b", 0]));
		expect(pathToList(`a.b[0].c`)).toEqual(List(["a", "b", 0, "c"]));
		expect(pathToList(`a.b[0].c['d']`)).toEqual(List(["a", "b", 0, "c", "d"]));
		expect(pathToList(`a.b[0].c['d']["e"]`)).toEqual(List(["a", "b", 0, "c", "d", "e"]));
		expect(pathToList(`a.b[0].c['d']["e"].f`)).toEqual(List(["a", "b", 0, "c", "d", "e", "f"]));
		expect(pathToList(`a.b[0].c['d']["e"].f.1`)).toEqual(List(["a", "b", 0, "c", "d", "e", "f", "1"]));
		expect(pathToList(`a.b[0].c['d']["e"].f.1['\\'g']`)).toEqual(List(["a", "b", 0, "c", "d", "e", "f", "1", "'g"]));
		expect(pathToList(`a.b[0].c['d']["e"].f.1['\\'g']["\\"h"]`)).toEqual(List(["a", "b", 0, "c", "d", "e", "f", "1", "'g", '"h']));
	});

	it("should throw when path is invalid", () => {
		expect(() => pathToList(`'`)).toThrow();
		expect(() => pathToList(`"`)).toThrow();
		expect(() => pathToList(`[`)).toThrow();
		expect(() => pathToList(`]`)).toThrow();
		expect(() => pathToList(`a[]`)).toThrow();
		expect(() => pathToList(`a[']`)).toThrow();
		expect(() => pathToList(`a['b\\']`)).toThrow();
		expect(() => pathToList(`a["b']`)).toThrow();
		expect(() => pathToList(`a['b"]`)).toThrow();
		expect(() => pathToList(`a.'b`)).toThrow();
		expect(() => pathToList(`a.b'`)).toThrow();
		expect(() => pathToList(`a.b"`)).toThrow();
	});
});
