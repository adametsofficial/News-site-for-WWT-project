const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const Handlebars = require("handlebars");
const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

const fileMiddleware = require("./middlewares/fileMiddleware");

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

/**
 * Middlewares
 */

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(express.urlencoded({ extended: true }));
app.use(fileMiddleware.single("img"));
/**
 * Routes
 */

app.use("/", require("./routes/homeRoutes"));
app.use("/news", require("./routes/newsRoutes"));
app.use("/admin", require("./routes/adminRoutes"));

/**
 * Started server
 */

const { PORT, MONGODB_URI } = require("./keys");

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    app.listen(PORT, () => {
      console.log(`Server has been started on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
