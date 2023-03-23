require("dotenv").config();

const routesHandler = require("./routes/handler.js");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use("/", routesHandler);
app.use("/", cors);
app.use(cookieParser());

app.listen(8080, () => {
  console.log("App is listening on port 8080!\n");
});