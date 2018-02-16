import { List } from "immutable";

const PATH_REGEXP = /\[(?:\d+|"(?:\\.|[^"\\])+"|'(?:\\.|[^'\\])+')\]|(?:^|\.)[0-9a-z_$]+?(?=\.|\[|$)/ig;

export function pathToList(path: string): List<string | number> {
	const raw = path.match(PATH_REGEXP)!;
	if (raw == null || raw.join("") !== path) {
		throw new Error(`Invalid path ${ path }`);
	}

	const pieces = raw.map((piece) => {
		if (piece[0] === "[") {
			if (piece[1] === "'" || piece[1] === '"') {
				return piece.substr(2, piece.length - 4).replace(/\\(.)/g, "$1");
			} else {
				return Number(piece.substr(1, piece.length - 2));
			}
		} else if (piece[0] === ".") {
			return piece.substr(1);
		} else {
			return piece;
		}
	});

	return List(pieces);
}
