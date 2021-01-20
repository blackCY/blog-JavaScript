const path = require("path");
const glob = require("glob");
const hotMiddlewareScript = "webpack-hot-middleware/client?reload=true";
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // entry: ((filePath) => {
  //   let pathObj = {};
  //   filePath.forEach((path) => {
  //     let pathKey = path.match(/\.\/src\/(\S*)\.js/)[1];
  //     pathObj[pathKey] = [path, hotMiddlewareScript];
  //   });
  //   return pathObj;
  // })(glob.sync("./src/*.js")),
  entry: {
    interview: ["./src/interview.js", hotMiddlewareScript],
    index: ["./src/index.js", hotMiddlewareScript],
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ["dist"],
    }),
    ...glob.sync("./src/*.html").map((html) => {
      return new HtmlWebpackPlugin({
        title: "JavaScriptDesignMode",
        template: html,
        filename: html.match(/\.\/src\/(\S*)\.html/)[1] + ".html",
        inject: true,
        chunks: [html.match(/\.\/src\/(\S*)\.html/)[1]],
      });
    }),
  ],
};
