const isProduction = process.env.NODE_ENV === "production";
const path = require("path");
const SheBangPlugin = require("webpack-shebang-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const thisModule = require("./package.json");

function buildConfig(env) {
  return {
    entry: "./src/index.ts",
    target: "node",
    output: {
      path: path.resolve(
        __dirname,
        /^\.{1,2}|\/$/.test(path.dirname(thisModule.main))
          ? "dist"
          : path.dirname(thisModule.main)
      ),
      filename: path.basename(thisModule.main)
    },
    plugins: [
      new SheBangPlugin({
        chmod: 0o755
      }),
      new ESLintPlugin({
        fix: env.WEBPACK_WATCH
      })
    ],
    module: {
      rules: [
        {
          test: /(?<!\.test)\.(ts)$/i,
          loader: "ts-loader",
          exclude: ["/node_modules/", "tests/", "__tests__/"]
        }
      ]
    },
    optimization: {
      // minimize & mangle the output files (TerserPlugin w/ webpack@v5)
      minimize: isProduction,
      // determine which exports are used by modules and removed unused ones
      usedExports: true
    },
    resolve: {
      extensions: [".ts", ".js", ".json"]
    }
  };
}

module.exports = (env) => {
  const config = buildConfig(env);
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
