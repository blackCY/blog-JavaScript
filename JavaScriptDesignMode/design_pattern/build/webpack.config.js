const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { join } = path;

module.exports = {
  entry: {
    main: join(__dirname, "../src/index.ts"),
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    modules: ["node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: "ts-loader" }],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: join(__dirname, "../src/index.html"),
      filename: "index.html",
      hash: true,
    }),
  ],
  devServer: {
    contentBase: join(__dirname, "../dist"),
    host: "localhost",
    port: 8080,
  },
};
