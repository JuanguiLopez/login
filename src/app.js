const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const handlebars = require("express-handlebars");
const sessionRouter = require("./routes/sessions.router");
const viewsRouter = require("./routes/views.router");
require("dotenv").config();
const passport = require("passport");
const initializePassport = require("./config/passport.config");

const port = 8080;

const app = express();

/** Database connection */
mongoose
  .connect(
    `mongodb+srv://juanguilopezh:${process.env.MONGO_PASSWORD}@coderhcluster.xwnfwp2.mongodb.net/login`
  )
  .then(() => {
    console.log(`connected succesfully`);
  });

/** Sessions settings (middleware) */
app.use(
  session({
    secret: "ourNewSecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://juanguilopezh:${process.env.MONGO_PASSWORD}@coderhcluster.xwnfwp2.mongodb.net/login`,
      ttl: 3600,
    }),
  })
);

/** middlewares */
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** passport */
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

/** Handlebars config */
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

/** Routes */
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

app.listen(port, () => {
  console.log(`up and runnig on port ${port}`);
});
