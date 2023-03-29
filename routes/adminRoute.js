// const adminLogin = require("../controllers/adminController");

const express = require("express");
const adminRoute = express();
const path = require("path");

//body parser
const bodyparser = require("body-parser");
adminRoute.use(bodyparser.json());
adminRoute.use(bodyparser.urlencoded({ extended: true }));

//nocache
const nocache=require('nocache')
adminRoute.use(nocache())

//admin controller
const adminController = require("../controllers/adminController");
//category controller
const categoryController = require("../controllers/categoryController");
//resort controller
const resortMangeController = require("../controllers/resortControllers");

const bookingController = require("../controllers/bookingController");

//coupen Cantroller
const coupenController=require('../controllers/couponController')

const config = require("../config/config");

//session requireing 
const session = require("express-session");
adminRoute.use(session({ secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false // add this line
 }));
//view engine
adminRoute.set("view engine", "ejs");
adminRoute.set("views", "views/admin");

const multer = require("multer");
const storage = require("../middleware/ResortImagemulter");
const upload = multer({ storage: storage });

const catstorage = require("../middleware/categoryImageMulter");

const UploadCategory = multer({ storage: catstorage });



//middileware
const auth = require("../middleware/auth");

adminRoute.get("/", auth.isLogout, adminController.adminLogin);
adminRoute.post("/", adminController.loginVerify);
adminRoute.get("/logout", auth.isLogin, adminController.adminLogout);

adminRoute.get("/dashboard", auth.isLogin, adminController.loadDashboard);

adminRoute.get("/Viewcategory", auth.isLogin, categoryController.ViewCatogory);
adminRoute.post(
  "/Viewcategory/Add_category",
  UploadCategory.array("categoryImages"),
  categoryController.Add_Category
);
adminRoute.post("/Viewcategory/editcatImag/:id",
UploadCategory.array("categoryImages"),
auth.isLogin,
  categoryController.editImageCat, 
  )
adminRoute.get(
  "/Viewcategory/Add_category",
  auth.isLogin,
  categoryController.New_category
);
adminRoute.get(
  "/Viewcategory/listCategory/:id",
  auth.isLogin,
  categoryController.ListCategory
);
adminRoute.get(
  "/Viewcategory/editcategory/:id",
  auth.isLogin,
  categoryController.Editcategory
);

adminRoute.post(
  "/Viewcategory/editcategory/:id",
  auth.isLogin,
  categoryController.UpadateCatergory
);

adminRoute.get(
  "/deleteCatimage/:imgid/:categoryid",
  categoryController.DeleteCategoryImage
);
adminRoute.get(
  "/View_resort/add_resorts",
  auth.isLogin,
  resortMangeController.Add_resorts
);
adminRoute.get(
  "/View_resort",
  auth.isLogin,
  resortMangeController.View_resorts
);
adminRoute.get(
  "/BookingList",
  auth.isLogin,
  bookingController.BookingList
);


adminRoute.post(
  "/View_resort/add_resorts",
  upload.array("resortsOtherImages"),
  resortMangeController.insert_resorts
);
adminRoute.get(
  "/View_resort/deletecategory/:id",
  resortMangeController.DeleteResort
);
adminRoute.get(
  "/View_resort/List/:id",
  resortMangeController.ListResort
);
adminRoute.get(
  "/View_resort/editresort/:id",
  auth.isLogin,
  resortMangeController.editResorts
);
adminRoute.post(
  "/View_resort/editresort/:id",
  resortMangeController.UpdateResort
);
adminRoute.get(
  "/deleteimage/:imgid/:resortid",
  resortMangeController.DeleteResortImage
);
adminRoute.post(
  "/View_resort/editimage/:id",
  upload.array("resortsOtherImages"),
  resortMangeController.editImagae
);

adminRoute.get(
    "/UserDetails",
 auth.isLogin,
  adminController.UserDetails
);

adminRoute.get(
    "/UserDetails/BlockUser/:id", 
adminController.BlockUser
);

adminRoute.get("/coupenLoad",
coupenController.ListCoupon
)

adminRoute.get("/coupenLoad/add_coupon",
coupenController.AddCouponPage
)

adminRoute.post("/coupenLoad/add_coupon",
coupenController.InserCoupon
)
adminRoute.post("/UpdateStatus",
bookingController.UpdateBookingStatus
)


adminRoute.get("/coupenLoad/EditCoupon/:id",
coupenController.editCoupon
)

adminRoute.post("/coupenLoad/EditCoupon/:id",
coupenController.UpdateEditCoupon
)


adminRoute.get("/sales",
adminController.SalesReportSearch
)
adminRoute.post("/sales",
adminController.salesReport
)

adminRoute.get("/ViewUserBookingDetals/:id",bookingController.ViewSeprateBooking)
module.exports = adminRoute;
