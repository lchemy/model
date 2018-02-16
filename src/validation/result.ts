import { List } from "immutable";

import { pathToList } from "../utilities";

import { RuleCheckResult } from "./rule";

export class ValidationResult<M = object> {
	static VALID_RESULT = new ValidationResult<any>(null, null);

	static create<T = object>(resultsByPath: { [path: string]: RuleCheckResult } | null, target: T): ValidationResult<T> {
		if (resultsByPath == null) {
			return ValidationResult.VALID_RESULT;
		}

		const paths = Object.keys(resultsByPath);
		if (paths.length === 0) {
			return ValidationResult.VALID_RESULT;
		}

		const errors: RuleCheckResult = {
			model: true,
			nested: {}
		};

		paths.forEach((path) => {
			const results = resultsByPath[path],
				pieces = pathToList(path);

			const l = pieces.size;
			pieces.reduce((memo, piece, i) => {
				if (memo.nested == null) {
					if (typeof piece === "number") {
						memo.each = true;
						memo.nested = [];
					} else {
						memo.object = true;
						memo.nested = {};
					}
				}

				if (i === l - 1) {
					memo.nested[piece!] = results;
					return;
				}

				if (memo.nested[piece!] == null) {
					memo.nested[piece!] = {};
				}

				return memo.nested[piece!];
			}, errors as any);
		});

		return new ValidationResult<T>(errors, target);
	}

	private cache: Map<string, ValidationResult<any> | undefined> = new Map();

	get isValid(): boolean {
		return this.errors == null;
	}

	constructor(public errors: RuleCheckResult = null, private target: M) {

	}

	get<T = object>(path: string): ValidationResult<T> | undefined {
		if (this.errors == null || this.errors.nested == null) {
			return undefined;
		}

		const pieces = pathToList(path);

		// normalize field for cache hit check
		path = pieces.join(".");
		if (this.cache.has(path)) {
			return this.cache.get(path) as any;
		}

		const pathExists = this.checkPathExists(pieces);

		let out: ValidationResult<T> | undefined;
		if (pathExists) {
			const errors = this.getErrorsAtPath(pieces),
				value = this.getValueAtPath(pieces) as T;
			out = new ValidationResult<T>(errors, value);
		}

		this.cache.set(path, out);
		return out;
	}

	private checkPathExists(pieces: List<string | number>): boolean {
		let part = this.target as any;

		if (part == null) {
			return false;
		}

		const l = pieces.size;
		return pieces.every((piece, i) => {
			part = part[piece!];
			return i === l - 1 || (part != null && typeof part === "object");
		});
	}

	private getErrorsAtPath(pieces: List<string | number>): RuleCheckResult | null {
		const l = pieces.size;
		return pieces.reduce((memo, piece, i) => {
			if (i === l - 1) {
				return memo != null ? memo[piece!] : null;
			}
			return memo != null && memo[piece!] != null ? memo[piece!].nested : null;
		}, this.errors!.nested as any) as RuleCheckResult | null;
	}

	private getValueAtPath(pieces: List<string | number>): any {
		return pieces.reduce((memo, piece) => {
			return memo[piece!];
		}, this.target as any);
	}
}
