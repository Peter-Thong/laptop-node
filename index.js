const fs = require("fs");
const http = require("http");
const url = require("url");

const json = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true).pathname;
  const id = url.parse(req.url, true).query.id;
  console.log(pathName);

  //PRODUCT LIST
  if (pathName === "/products" || pathName === "/") {
    res.writeHead(200, { "content-type": "text/html" });
    fs.readFile(
      `${__dirname}/templates/templates-overview.html`,
      "utf-8",
      (err, data) => {
        let output = data;
        fs.readFile(
          `${__dirname}/templates/templates-card.html`,
          "utf-8",
          (err, data) => {
            const cardsOuput = laptopData

              .map((el) => templateReplace(data, el))
              .join("");
            output = output.replace("{%CARDS%}", cardsOuput);
            res.end(output);
          }
        );
      }
    );
  }
  //LAPTOP DETAIL
  else if (pathName === "/laptop" && id < laptopData.length) {
    res.writeHead(200, { "content-type": "text/html" });

    fs.readFile(
      `${__dirname}/templates/templates-laptop.html`,
      "utf-8",
      (err, data) => {
        const laptop = laptopData[id];
        const output = templateReplace(data, laptop);
        res.end(output);
      }
    );
  }
  //REQUEST IMAGE
  else if (/\.(jpg|jpeg|png|gif)$/i.test(pathName)) {
    fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
      res.writeHead(200, { "content-type": "image/jpg" });
      res.end(data);
    });
  } else {
    res.writeHead(404, { "content-type": "text/html" });
    res.end("can not found the url");
  }
});

server.listen(1337, "127.0.0.1", () => {
  console.log("Listening for request now");
});

const templateReplace = (originalHtml, laptop) => {
  let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
  output = output.replace(/{%PRICE%}/g, laptop.price);
  output = output.replace(/{%IMAGE%}/g, laptop.image);
  output = output.replace(/{%SCREEN%}/g, laptop.screen);
  output = output.replace(/{%CPU%}/g, laptop.cpu);
  output = output.replace(/{%STORAGE%}/g, laptop.storage);
  output = output.replace(/{%RAM%}/g, laptop.ram);
  output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
  output = output.replace(/{%ID%}/g, laptop.id);
  return output;
};
