const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      extensions: [".ts", ".js", ".vue", ".json"], // Add .ts to extensions
    },
    module: {
      rules: [
        {
          test: /\.ts$/, // Match TypeScript files
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
  },
});
