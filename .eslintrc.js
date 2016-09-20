module.exports = {
	env: {
		amd: true,
		browser: true,
		es6: true,
		jasmine: true,
		jquery: true,
		node: true,
		mocha: true,
		moment: true
	},
	extends: [
		"eslint:recommended",
		"plugin:react/recommended"
	],
	parser: "babel-eslint",
	plugins: [
		"react"
	],
	parserOptions: {
		ecmaVersion: 7,
		sourceType: "module",
		ecmaFeatures: {
			arrowFunctions: true,
			binaryLiterals: true,
			blockBindings: true,
			classes: true,
			defaultParams: true,
			destructuring: true,
			experimentalObjectRestSpread: true,
			forOf: true,
			generators: true,
			modules: true,
			objectLiteralComputedProperties: true,
			objectLiteralDuplicateProperties: true,
			objectLiteralShorthandMethods: true,
			objectLiteralShorthandProperties: true,
			octalLiterals: true,
			regexUFlag: true,
			regexYFlag: true,
			spread: true,
			superInFunctions: true,
			templateStrings: true,
			unicodeCodePointEscapes: true,
			globalReturn: true,
			jsx: true
		},
		sourceType: "module"
	},
	rules: {
		"eol-last": [0],
		"no-console": [1],
		"no-mixed-requires": [0],
		"no-underscore-dangle": [2],
		"no-unused-vars": [0],

		// React
		"react/display-name": [0],
		"react/no-multi-comp": [1, { ignoreStateless: true }],
		"react/no-string-refs": [0],
		"react/prop-types": [0],

		// JSX
		"jsx-quotes": [1, "prefer-double"],
		"react/jsx-no-bind": [2, {
			ignoreRefs: true,
			allowArrowFunctions: true,
			allowBind: true
		}],
		"react/jsx-pascal-case": [2]
	}
}