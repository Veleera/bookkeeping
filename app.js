const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { parse } = require("csv-parse/sync");
const port = 3000;
const cors = require('cors'); 
app.use(cors());

// app.all('*', (req, res, next) => {
//   // google需要配置，否则报错cors error
//   res.setHeader('Access-Control-Allow-Credentials', 'true')
//   // 允许的地址,http://127.0.0.1:9000这样的格式
//   res.setHeader('Access-Control-Allow-Origin', req.get('Origin'))
//   // 允许跨域请求的方法
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'POST, GET, OPTIONS, DELETE, PUT'
//   )
//   // 允许跨域请求header携带哪些东西
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since'
//   )
//   next()
// });

app.get("/bill", (req, res) => {
  fs.readFile(path.resolve(__dirname, "./static/bill.csv"), (err, data) => {
    if (err) {
      console.log("读取错误");
      return;
    }
    // console.log(data.toString());//将十六进制转化为字符串
    const records = parse(data.toString(), {
      columns: true,
      skip_empty_lines: true,
    });
    res.send(records);
  });
});
app.get("/category", (req, res) => {
  fs.readFile(path.resolve(__dirname, "./static/categories.csv"), (err, data) => {
    if (err) {
      console.log("读取错误");
      return;
    }
    // console.log(data.toString());//将十六进制转化为字符串
    const records = parse(data.toString(), {
      columns: true,
      skip_empty_lines: true,
    });
    res.send(records);
  });
});

app.use(express.static("./dist"));

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
