const Koa = require("koa");
const static = require("koa-static");
const fs = require("fs");
const path = require("path");

const app = new Koa();

function sleep(time) {
  return new Promise((res) => {
    setTimeout(() => res(), time);
  });
}

app.use(static(__dirname + "/static/html")).use(async (ctx) => {
  let { url } = ctx.request;

  const _timeArr = url.match(/sleep-(\d+)(?=-)/);
  let time = null;

  if (_timeArr) {
    url = url.replace(/sleep-\d+-/, "");
    time = _timeArr[1];
  }

  const res = await new Promise((res, rej) => {
    fs.readFile(path.join(__dirname, "static", url), (err, data) => {
      if (err) return rej(err);
      res(data);
    });
  });

  if (/css/.test(url)) {
    ctx.response.set("Content-Type", "text/css");
  }

  // time 秒以后将 css 文件从服务器返回
  if (time) {
    await sleep(time);
  }

  ctx.body = res;
});

app.listen(3000, () => {
  console.log("it is 3000...");
});
