export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx}",
    "<rootDir>/src/**/*.{spec,test}.{js,jsx}",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 30,
      lines: 50,
      statements: 50,
    },
  },
  coveragePathIgnorePatterns: [
    "node_modules",
    "<rootDir>/src/components/ui",
    // "<rootDir>/src/services",
    // "<rootDir>/src/store",
  ],
};
