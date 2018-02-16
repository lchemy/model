import { Rule } from "../rule";

export function matches(pattern: RegExp): Rule<string> {
	return {
		name: "matches",
		check: (value) => pattern.test(value) ? null : {
			matches: {
				requiredPattern: pattern,
				actualValue: value
			}
		}
	};
}

function wrapRegexpCheck(name: string, pattern: RegExp): Rule<string> {
	return {
		name,
		check: (value) => pattern.test(value) ? null : { [name]: true }
	};
}

// http://emailregex.com/, https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.multiple
const emailRegexp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const isEmailRule = wrapRegexpCheck("isEmail", emailRegexp);
export function isEmail(): Rule<string> {
	return isEmailRule;
}

const alphanumericRegexp = /^[a-z0-9]+$/i;
const isAlphanumericRule = wrapRegexpCheck("isAlphanumeric", alphanumericRegexp);
export function isAlphanumeric(): Rule<string> {
	return isAlphanumericRule;
}

// https://gist.github.com/dperini/729294
const urlRegexp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
const isUrlRule = wrapRegexpCheck("isUrl", urlRegexp);
export function isUrl(): Rule<string> {
	return isUrlRule;
}

const uppercaseRegexp = /^[A-Z]*$/;
const isUppercaseRule = wrapRegexpCheck("isUppercase", uppercaseRegexp);
export function isUppercase(): Rule<string> {
	return isUppercaseRule;
}

const lowercaseRegexp = /^[a-z]*$/;
const isLowercaseRule = wrapRegexpCheck("isLowercase", lowercaseRegexp);
export function isLowercase(): Rule<string> {
	return isLowercaseRule;
}

