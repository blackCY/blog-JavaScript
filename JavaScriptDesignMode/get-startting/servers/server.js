const express = require("express");
const webpack = require("webpack");
const WebpackDevMiddleware = require("webpack-dev-middleware");
const WebpackHotMiddleware = require("webpack-hot-middleware");

const homeRouter = require("./routes/");
const interviewRouter = require("./routes/interview");

const config = require("../build/webpack.dev");
const compiler = webpack(config);

const app = express();

const middleware = WebpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  hot: true
});
app.use(middleware);

app.use(
  WebpackHotMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

// router
app.use("/", homeRouter);
app.use("/interview", interviewRouter);

app.listen(3000, () => {
  console.log("3000...");
});
