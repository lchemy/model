export interface TransformerDefinition<M = object, J = object> {
	toJson(model: M): J;
	toModel(json: J): M;
}

export class Transformer<M = object, J = object> {
	constructor(private definition: TransformerDefinition<M, J>) {

	}

	toJson(model: M): J {
		return this.definition.toJson(model);
	}

	toModel(json: J): M {
		return this.definition.toModel(json);
	}
}
