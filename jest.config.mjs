export default {
	preset: "ts-jest", // Use ts-jest for TypeScript support
	// collectCoverage: true, // Uncomment if you want coverage reports
	coverageReporters: ["json", "text", "lcov", "clover"], // Types of coverage reports
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"], // Supported file extensions
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest", // Transform TypeScript files with ts-jest
	},
	moduleNameMapper: {
		"^~/(.*)$": "<rootDir>/$1", // Map `~/` to the root directory
		"^@/(.*)$": "<rootDir>/src/$1", // Map `@/` to the src directory
	},
	testMatch: [
		"**/__tests__/**/*.+(ts|js|tsx|jsx)", // Include files in `__tests__` folders
		"**/?(*.)+(spec|test).+(ts|js|tsx|jsx)", // Match `*.spec.ts` and `*.test.ts`
	],
	testEnvironment: "node", // Use Node.js as the test environment
};
