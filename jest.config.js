export default {
    // Plain JavaScript project using ESM modules
    testEnvironment: "node",
    testMatch: ["**/?(*.)+(spec|test).js?(x)"],
    transform: {},
    maxWorkers: 11,
    coverageDirectory: 'coverage',
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.js']
};
