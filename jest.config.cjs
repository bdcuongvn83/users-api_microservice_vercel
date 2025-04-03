// jest.config.cjs
module.exports = {
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest", // Use babel-jest to transform JS and TS files
  },
  testEnvironment: "node",
};
