// require("dotenv").config();

/**
 * Import module
 */

const path = require("path");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require('cors');
const express = require("express");
const helmet = require("helmet");
const session = require("express-session");

const passport = require("./auth/passport");
const MySQLStore = require("express-mysql-session")(session);

/**
 * Application Initiation
 */

const app = express();

/**
 * Application configuration
 */

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

const publicPath = path.join(__dirname + "/../public");
const viewPath = path.join(publicPath + "/views");

app.set("view engine", "ejs");
app.set("views", viewPath);

app.use(cors());
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(
  session({
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_PASSWORD,
    cookie: {
      maxAge: 900000
    },
    store: sessionStore,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
app.use(compression());

app.disable("x-powered-by");

/**
 * Routes
 */
const authRoutes = require("./routes/auth");
const errorsController = require("./controllers/errors");
const rewardLevelRoutes = require("./routes/rewardLevel");

// const rewQuery = require("./controllers/query_reward_con");

app.get("/", (req, res) => res.render("index", {
  pageTitle: "TravelAloha",
  user: req.user
}));

app.use(authRoutes);
//

//reward level controller caller and put on ejs file
const rewModel = require("./models/query_coupon");

// app.use(rewQuery.getvalidCoupon);
// app.use(rewController.getPoints);
// <%= coupon[0]. %>
//   // <%= string %>
//
// console.log(`code: ${key} -> ${queryCoupons[key].CouponCode}`);

app.get('/rewardLevel', async (req, res) => {
  const user_id = req.user.user_id;
  const queryCoupons = await rewModel.showValidCouponAc(user_id);
  const queryPoints = await rewModel.showPoints(user_id);
  const queryUsed = await rewModel.showUsedCouponAc(user_id);
   console.log(queryUsed);
  // const couponcode = result[0].CouponCode;
    res.render('rewardLevel/reward', {
      coupons: queryCoupons,
      point: queryPoints,
      pageTitle: "Reward",
      user: req.user,
      expDate: "DATE_FORMAT(`ExpDate`,'%W %M %Y')",
      usedDate: "DATE_FORMAT(`usedDate`,'%W %M %Y')",
      usedCoupon: queryUsed
  });
  // console.log(coupons.expdate);
});



// app.use("/rewardLevel", rewardLevelRoutes);

app.use(errorsController.get404);

app.listen(process.env.APP_PORT, () => {
  if (process.env.NODE_ENV !== "production")
    console.log(`Server is up on http://localhost:${process.env.APP_PORT}`);
});
