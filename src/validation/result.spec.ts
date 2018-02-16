import { ValidationResult } from "./result";

describe("validation: result", () => {
	it("should create the correct validation result errors", () => {
		const result = ValidationResult.create({
			"a.b": {},
			"a.c": {},
			"d.e[0]": {},
			"d.e[1].f": {},
			"d.e[2].f": {}
		}, {
			a: {
				b: 1,
				c: 2
			},
			d: {
				e: [ 3, undefined, { f: 4 } ]
			},
			g: 5
		});

		expect(result.isValid).toBe(false);
		expect(result.errors).toEqual({
			model: true,
			nested: {
				a: {
					object: true,
					nested: {
						b: {},
						c: {}
					}
				},
				d: {
					object: true,
					nested: {
						e: {
							each: true,
							nested: [{}, {
								object: true,
								nested: {
									f: {}
								}
							}, {
								object: true,
								nested: {
									f: {}
								}
							}]
						}
					}
				}
			}
		});

		const abRes = result.get("a.b"),
			de0Res = result.get("d.e[0]"),
			de1fRes = result.get("d.e[1].f"),
			de2fRes = result.get("d.e[2].f"),
			gRes = result.get("g");

		expect(abRes).toBeDefined();
		expect(de0Res).toBeDefined();
		expect(de1fRes).toBeUndefined();
		expect(de2fRes).toBeDefined();
		expect(gRes).toBeDefined();

		const abRes1 = result.get("a.b"),
			de0Res1 = result.get("d.e[0]"),
			de1fRes1 = result.get("d.e[1].f"),
			de2fRes1 = result.get("d.e[2].f"),
			gRes1 = result.get("g");

		expect(abRes).toBe(abRes1);
		expect(de0Res).toBe(de0Res1);
		expect(de1fRes).toBe(de1fRes1);
		expect(de2fRes).toBe(de2fRes1);
		expect(gRes).toBe(gRes1);
	});

	it("should get errors from result and have it cached", () => {
		const result = ValidationResult.create({
			"a.b": {},
			"a.c": {},
			"d.e[0]": {},
			"d.e[1].f": {},
			"d.e[2].f": {}
		}, {
			a: {
				b: 1,
				c: 2
			},
			d: {
				e: [ 3, undefined, { f: 4 } ]
			},
			g: 5
		});

		const abRes = result.get("a.b"),
			de0Res = result.get("d.e[0]"),
			de1fRes = result.get("d.e[1].f"),
			de2fRes = result.get("d.e[2].f"),
			gRes = result.get("g");

		expect(abRes).toBeDefined();
		expect(de0Res).toBeDefined();
		expect(de1fRes).toBeUndefined();
		expect(de2fRes).toBeDefined();
		expect(gRes).toBeDefined();

		expect(abRes!.isValid).toBe(false);
		expect(de0Res!.isValid).toBe(false);
		expect(de2fRes!.isValid).toBe(false);
		expect(gRes!.isValid).toBe(true);

		const abRes1 = result.get("a.b"),
			de0Res1 = result.get("d.e[0]"),
			de1fRes1 = result.get("d.e[1].f"),
			de2fRes1 = result.get("d.e[2].f"),
			gRes1 = result.get("g");

		expect(abRes).toBe(abRes1);
		expect(de0Res).toBe(de0Res1);
		expect(de1fRes).toBe(de1fRes1);
		expect(de2fRes).toBe(de2fRes1);
		expect(gRes).toBe(gRes1);
	});

	it("should handle valid results", () => {
		const nullRes = ValidationResult.create(null, undefined),
			emptyRes = ValidationResult.create({}, undefined),
			noErrorsRes = new ValidationResult(null, undefined),
			noNestedRes = new ValidationResult({ nested: undefined }, undefined);

		expect(nullRes!.isValid).toBe(true);
		expect(emptyRes!.isValid).toBe(true);
		expect(noErrorsRes!.isValid).toBe(true);
		expect(noNestedRes!.isValid).toBe(false);

		expect(noErrorsRes.get("a")).toBeUndefined();
		expect(noNestedRes.get("a")).toBeUndefined();
	});

	it("should handle edge cases", () => {
		const nestedUndefinedRes = new ValidationResult({ nested: [] }, undefined);
		expect(nestedUndefinedRes.get("a")).toBeUndefined();

		const nestedErrorsRes = ValidationResult.create({
			"a.b": {}
		}, {
			a: {
				c: {
					d: 1
				}
			}
		});
		const nestedExistsNoErrorRes = nestedErrorsRes.get("a.c.d");
		expect(nestedExistsNoErrorRes!.isValid).toBe(true);
	});
});
