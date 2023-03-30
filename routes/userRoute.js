const express = require("express");

const User_route = express();

User_route.set("view engine", "ejs");
User_route.set("views", "views/users");

const config = require("../config/config");
const session = require("express-session");

User_route.use(session({ secret: config.sessionSecret ,
  resave: false,
  saveUninitialized: false // add this line
}));

const nocache = require("nocache");
User_route.use(nocache());

const auth = require("../middleware/auth");
const bosyparser = require("body-parser");
User_route.use(bosyparser.json());
User_route.use(bosyparser.urlencoded({ extended: true }));

const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/userImages"));
  },
  filename: function () {
    const name = Date.now() + "-" + file.orginalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });
const authUser = require("../middleware/authUser");
const userController = require("../controllers/userController");
const bookingController = require("../controllers/bookingController1");
const resortsManage = require("../models/resortsManage");
const coupenController=require('../controllers/couponController')


User_route.get("/", userController.loadHome);
User_route.get("/UserSignUp", authUser.isLogout, userController.UserSignup);
User_route.post("/UserSignUp", userController.NewtUser2);
User_route.post("/otpVerify", userController.VerifyUser2);
User_route.get("/UserLogin", authUser.isLogout, userController.UserLogin);
User_route.post("/UserLogin", authUser.isLogout, userController.VerifyUser);
User_route.get("/UserLogout", userController.UserLogout);
User_route.get("/search", userController.SrearchResorts);
User_route.get("/whisList", authUser.isLogin, userController.wishList);
User_route.get(
  "/AddTOwishList/:id",
  authUser.isLogin,
  userController.AddWishlist
);
User_route.get(
  "/removewishlist/:id",
  authUser.isLogin,
  userController.removefromwishlist
);
User_route.get("/catfilter/:id", userController.filterByCategory);
User_route.get("/open_resort/:id", userController.openResorts);
User_route.get(
  "/placeBooking/:id",
  authUser.isLogin,
  bookingController.ResortBooking
);
User_route.post(
  "/placeBooking",
  authUser.isLogin,
  bookingController.Insert_resortBooking
);
User_route.get("/userpage", authUser.isLogin, userController.LoadUserpage);
User_route.post(
  "/UpdateuserData",
  authUser.isLogin,
  userController.UpdateUserData
);
User_route.post("/ResetPass", authUser.isLogout, userController.ChangePassword);
User_route.get(
  "/viewBooking",
  authUser.isLogin,
  bookingController.VeiwBooking
);
// User_route.get("/successPage", BookingController);
User_route.post(
  "/verifyPayment",
  authUser.isLogin,
  bookingController.verifyPayment
);

User_route.post("/userReviews",userController.Review)
User_route.get("/ViewSeprateBooking/:id",bookingController.BookingDetalsis)
User_route.get("/sucesspage", authUser.isLogin, bookingController.Successpage);

User_route.post("/cancelBooking",bookingController.CancelBooking)
User_route.post("/applyCoupon",coupenController.applayCoupen)

User_route.post("/complanteRegister",userController.registerComplainte)
module.exports = User_route;
