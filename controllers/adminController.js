const admin = require("../models/adminLoginModel");
const User = require("../models/userModel");
const Booking = require("../models/BookingModel");
const CategoryModel = require("../models/CatogeryModel");
const Admins = require("../models/adminLoginModel");

const adminLogin = async (req, res) => {
  try {
    res.render("adminLogin");
  } catch (error) {
    console.log(error.message);
  }
};

const loginVerify = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
console.log(username,password);
    const adminData = await Admins.findOne({ username: username });
      console.log(adminData)

    if (adminData) {
      if (password == adminData.password) {
        session = req.session;
        session.admin = adminData;

        res.redirect("/admin/dashboard");
      } else {
        res.render("adminLogin", { message: " Password is incorrect" });
      }
    } else if (username == "" && password == "") {
      res.render("adminLogin", { message: "User and passwoard required" });
    } else {
      res.render("adminLogin", { message: "Enter a valid username" });
    }
  } catch (error) {
    console.log(error);
  }
};
const loadDashboard = async (req, res) => {
  try {

//Chart of payment

    const COD= await Booking.find({paymentMethod:"PDC"}).count()
    const UPI= await Booking.find({paymentMethod:"ONLINEPAY"}).count()

//sales Chart

    const totalSalesLine = await Booking.aggregate([
      {
        $match: {
          status: {
            $eq: "confirmed",	
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$CurrentBookingData" } },
          sales: { $sum: "$bookingAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $limit: 7,
      },
    ]);
    const date = totalSalesLine.map((item) => {
      return item._id;
    });
    const sales = totalSalesLine.map((item) => {
      return item.sales;
    });

   let salesCount=sales.length
   let dateCount=date.length


//category Wase Sales Chart



const booking = await Booking.find().populate({
  path: 'ResortName',
  populate: {
      path: 'category',
      model: CategoryModel
  }
})
const categoryCount = {};

booking.forEach(Booked => {
      const category = Booked.ResortName.category.category;
      if (category in categoryCount) {
          categoryCount[category] += 1;
      } else {
          categoryCount[category] = 1;
      }
});
const sortedCategoryCount = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);

const numbersOnly = sortedCategoryCount.map(innerArray => innerArray[1]);

const categoryNames = sortedCategoryCount.map((categoryCount) => {
  return categoryCount[0];
});

console.log(categoryCount);





    res.render("dashboard",{
      COD:COD,
      UPI:UPI,
      date:date,
      sales:sales,
      dateCount:dateCount,
      salesCount:salesCount,
      categoryName:categoryNames,
      catogorySaleCount:numbersOnly

      
    }
    );
  } catch (error) {
    console.log(error.message);
  }
};
const adminLogout = async (req, res) => {
  try {
    req.session.admin = null;
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};

const UserDetails = async (req, res) => {
  try {
    const userData = await User.find({});

    res.render("UsersPage", { PassUserData: userData });
  } catch (error) {}
};

const BlockUser = async (req, res) => {
  let id = req.params.id;

  const UserStatuSData = await User.findOne(
    { _id: id },
    { user_status: 1, _id: 0 }
  );
  if (UserStatuSData.user_status == true) {
    await User.updateOne({ _id: id }, { $set: { user_status: false } });
    req.session.user = null;
    res.redirect("/admin/UserDetails");
  } else {
    await User.updateOne({ _id: id }, { $set: { user_status: true } });
    res.redirect("/admin/UserDetails");
  }
};

const SalesReportSearch=async(req,res)=>{
  try {
    res.render("salesresportsnew")
  } catch (error) {
    
  }
}


const salesReport = async (req, res) => {
  try {
      const currentDate = new Date(req.body.to)
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 1)

      if (req.body.from.trim() == '' || req.body.to.trim() == '') {
          res.render('sales', { message: 'All feilds are required' })
      } else {
          const salesdata = await Booking.find({
              status: 'confirmed',
              CurrentBookingData:
                  { $gte: new Date(req.body.from), $lte: new Date(newDate) }
          })
              .populate
              ('ResortName')


          res.render('salesReportPage', {sales: salesdata })
      }
  } catch (error) {
      console.log(error.message);
    }
}


module.exports = {
  adminLogin,
  loginVerify,
  loadDashboard,
  adminLogout,
  UserDetails,
  BlockUser,
  salesReport,
  SalesReportSearch
};
