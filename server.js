const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const morgan = require("morgan");
const mongoose = require("mongoose");
const URI =
  "mongodb+srv://Mohit:9166927513@cluster0.1milb.mongodb.net/RestfulAPI?retryWrites=true&w=majority";

const productRoute = require("./routes/products");
const ordersRoute = require("./routes/orders");
const userRoute = require("./routes/user");
const homeRoute = require("./routes/home");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");

const cookieParser = require("cookie-parser");

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.connection.on("connected", () => {
  console.log("connected to db");
});

const hbs = require("express-handlebars");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const { user } = require("./authentication/auth");

// view engine setup
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Acces-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Method", "PUT, POST, PATCH, DELETE");
    return res.status(200).jsonp({});
  }
  next();
});

app.use("/products", productRoute);
app.use("/orders", ordersRoute);
app.use("/signup", userRoute);
app.use("/", homeRoute);

app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, () => console.log(`Listning server at port `, port));
