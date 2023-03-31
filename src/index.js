const express = require("express");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const MySQLStore = require("express-mysql-session");
const { database } = require("./keys");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

//Inicializaciones.........................
const app = express();
require("./lib/passport");

//Settings.................................
app.set("port", process.env.PORT || 8033);

/* -------------------------- Handlebars */
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require("./lib/handlebars"),
  })
);
app.set("view engine", ".hbs");

//Middlewares..............................
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser("secret"));
app.use(
  session({
    secret: "mysqlnodesession",
    resave: false,
    saveUninitialized: false,
    // store: new MySQLStore(database) //Se elimina registro de sesión en la base de datos
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Variables Globales......................
app.use((req, res, next) => {
  app.locals.success = req.flash("success");
  app.locals.message = req.flash("message");
  app.locals.user = req.user;
  next();
});

global.array = [];
global.bdd_name = "dbp_virtualavaya";

//Routes..................................
app.use(require("./routes"));
app.use(require("./routes/authentication"));
app.use(require("./routes/crud"));
app.use(require("./routes/roles"));
//Public..................................
app.use(express.static(path.join(__dirname, "public")));

//Starting server.........................
app.listen(app.get("port"), () => {
  // console.log('►--<-<-< ◄◄◄ Welcome Juan Mendoza ►►► >->->--◄');
  console.log(
    "-<-<-< ◄◄◄ Server running on port",
    app.get("port"),
    "►►► >->->-"
  );
});

app.use((req, res, next) => {
  res.status(404).render("404");
});

app.use(bodyParser.urlencoded({ extended: false }));
