module.exports = {
	root: true,
	env: {
		es2022: true,
		browser: true,
		node: true,
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: ["@typescript-eslint", "react", "react-hooks", "import"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react/recommended",
		"plugin:react-hooks/recommended",
		"plugin:import/recommended",
		"plugin:import/typescript",
		"prettier",
	],
	settings: {
		react: {
			version: "detect",
		},
	},
	rules: {
		"react/react-in-jsx-scope": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"import/order": [
			"warn",
			{
				"groups": ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
				"newlines-between": "always",
				"alphabetize": { "order": "asc", "caseInsensitive": true }
			}
		],
	},
	ignorePatterns: [
		"dist/**",
		"dist-server/**",
		"node_modules/**",
		"drizzle/migrations/**",
		"drizzle/meta/**",
	],
};

