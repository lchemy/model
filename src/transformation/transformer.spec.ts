import { Transformer } from "./transformer";

describe("transformation: transformer", () => {
	it("should transform based on definitions", () => {
		const transformer = new Transformer<number, string>({
			toJson(model) {
				return String(model);
			},
			toModel(json) {
				return Number(json);
			}
		});

		expect(transformer.toJson(1)).toBe("1");
		expect(transformer.toModel("1")).toBe(1);
	});
});
