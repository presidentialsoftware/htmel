const typescript = require("rollup-plugin-typescript2");
const { dts } = require("rollup-plugin-dts");

module.exports = [
  {
    input: "dist/index.js", // Entry point, adjust as needed
    output: {
      file: "dist/script.js", // Output file name and path
      format: "es", // Adjust the output format as needed (e.g., 'es', 'umd', 'cjs')
    },
    plugins: [
      typescript(), // Use the TypeScript plugin
    ],
  },
  {
    input: "dist/index.d.ts",
    output: [{ file: "dist/script.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
