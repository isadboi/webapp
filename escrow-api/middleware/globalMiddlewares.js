// const cookieParser = require('cookie-parser')
let { json, static, urlencoded } = require("express");
const expressRateLimit = require("express-rate-limit");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");

// LOAD GLOBAL VARIABLES
require("dotenv").config();

// Customise Morgan:
morgan.token("timestamp", () => {
  let day = new Date().toDateString();
  let timestamp = new Date().toLocaleTimeString();
  return `${day}- ${timestamp}`;
});
const logFormat = ":timestamp :method :url :status :res[content-length] - :response-time ms";

/**
 * @Desc: Global Middlewares
 * @middleware : Rate Limitation Middleware
 * @middleware : Static Path Middleware
 * @middleware : json parser middleware
 * @middleware : cookieParser Middleware
 */
const globalMiddlewares = [
  morgan(logFormat),
  //   cookieParser(),
  //   cors({ origin: 'http://localhost:3000', credentials: true }),
  cors(),
  expressRateLimit({
    windowMs: 1 * 60 * 1000, // 1 Munite
    max: 1000, // How many Request Excepted Each 1 Munite
    message: "Too many request from this IP, please try again after 10 Munite",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req) => req.headers["cf-connecting-ip"] || req.ip,
  }),
  static(path.join(__dirname, "../public")),
  json({ limit: "100mb" }),
  urlencoded({ extended: true }),

  (req, res, next) => {
    // SET THE UPLOAD PUBLIC FOLDER ON THE SERVER TO req.file_url
    // req.file_url = __dirname + "/../../public/uploads";

    // switch (req.get("host")) {
    //   case "192.168.0.250:3000":
    //     req.protocol = process.env.SERVER_LIVE_PROTOCOL;
    //     req.host_url = process.env.SERVER_LIVE_DOMAIN;
    //     req.server_url = `${process.env.SERVER_LIVE_PROTOCOL}://${process.env.SERVER_LIVE_DOMAIN}`;
    //     break;
    //   case "localhost:5002":
    //     /* console.log(
    //       'THIS IP: ' +
    //         process.env.SERVER_LOCAL_PROTOCOL +
    //         '://' +
    //         process.env.SERVER_LOCAL_IP +
    //         ':5002'
    //     ) */
    //     req.protocol = process.env.SERVER_LOCAL_PROTOCOL;
    //     req.host_url = `${process.env.SERVER_LOCAL_IP}:5002`;
    //     req.server_url = `${process.env.SERVER_LOCAL_PROTOCOL}://${process.env.SERVER_LOCAL_IP}:5002`;
    //     break;

    //   default:
    //     req.protocol = process.env.SERVER_LIVE_PROTOCOL;
    //     req.host_url = process.env.SERVER_LIVE_DOMAIN;
    //     req.server_url = `${process.env.SERVER_LIVE_PROTOCOL}://${process.env.SERVER_LIVE_DOMAIN}`;
    //     break;
    // }

    next();
  },
];
module.exports = globalMiddlewares;
