// babel.config.cjs
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: "node 22", // Ensure it targets Node.js 22.x
      },
    ],
  ],
  plugins: ["@babel/plugin-transform-modules-commonjs"], // Transform ES Modules to CommonJS
};
