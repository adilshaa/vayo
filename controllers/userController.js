const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Category = require("../models/CatogeryModel");
const resortsManage = require("../models/resortsManage");
const { raw } = require("body-parser");
const mongoose = require('mongoose');
require("dotenv").config();
const accountsid = process.env.TWILIO_ACCOUNT_SID;
const authtoken = process.env.TWILIO_AUTH_TOKEN;
const Client = require("twilio")(accountsid, authtoken);

const UserNameData = require("../middleware/Connection");
// ---------------

const loadHome = async (req, res) => {
  try {
    const ResortData = await resortsManage.find({}).populate("category");
// console.log(ResortData);
    const categoryData = await Category.find({});
    const lowestResorts = await resortsManage.find({resortPrice:{$lte:10000}}).sort({resortPrice:1}).populate("category");
    const HighestResorts = await resortsManage.find({resortPrice:{$gte:8000}}).sort({resortPrice:-1}).populate("category");

   console.log(lowestResorts);

    let UserNameData = undefined;
    if (req.session.user) {
      UserNameData = await User.findOne({
        _id: req.session.user._id,
      });
      console.log(UserNameData);
    } else {
      UserNameData = undefined;
    }
    res.render("GuestPage", {
      PassUserName: UserNameData,
      PassResortDataToGestPage: ResortData,
      passCategoryData: categoryData,
      lowestResorts:lowestResorts,
      HighestResorts:HighestResorts

      
    });
  } catch (error) {
    console.log(error.massage);
  }
};

const UserSignup = async (req, res) => {
  try {
    res.render("userSignup");
  } catch (error) {}
};

const NewtUser2 = async (req, res) => {
  console.log(req.body);
  req.session.user = req.body;
  const found = await User.findOne({ userName: req.body.userName });
  if (found) {
    res.render("userSignup", {
      message: "username already exist ,try another",
    });
  } else {
    // console.log('body'+req.body)
    phonenumber = req.body.mobileNumber;
    try {
      const otpResponse = await Client.verify.v2
        .services("VAc41c25f4897bbbbf6bd11e834af9efef")
        .verifications.create({
          to: `+91${phonenumber}`,
          channel: "sms",
        });
      res.render("otpPage");
    } catch (error) {
      console.log(error.message);
    }
  }
};

const VerifyUser2 = async (req, res, next) => {
  const otp = req.body.otp;
  try {
    req.session.user;
    const details = req.session.user;

    const verifiedResponse = await Client.verify.v2
      .services("VAc41c25f4897bbbbf6bd11e834af9efef")
      .verificationChecks.create({
        to: `+91${details.mobileNumber}`,
        code: otp,
      });
    console.log("details" + details);
    if (verifiedResponse.status === "approved") {
      details.password = await bcrypt.hash(details.password, 10);
      const userdata = new User({
        userName: details.userName,
        email: details.email,
        mobileNumber: details.mobileNumber,
        password: details.password,
      });
      session = req.session;
        session.user = userdata;

      const userData = await userdata.save();
      // console.log()
      // console.log("sss" + userData)
      if (userData) {
        res.redirect("/");

      } else {
        res.render("otpPage", { message: "wrong otp" });
      }
    } else {
      res.render("otpPage", { message: "wrong otp" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const UserLogin = async (req, res) => {
  try {
    res.render("userLogin");
  } catch (error) {}
};

const VerifyUser = async (req, res) => {
  try {
    let Cheakemail = req.body.email;
    let CheakUserPassword = req.body.password;

    let OldUserData = await User.findOne({ email: Cheakemail });
    if (OldUserData) {
      console.log(OldUserData);
      const ComparePassword = await bcrypt.compare(
        CheakUserPassword,
        OldUserData.password
      );
      console.log(ComparePassword);
      if (ComparePassword) {
        session = req.session;
        session.user = OldUserData;
        res.redirect("/");
        console.log("User Logined");
        console.log(req.session.user);
      } else {
        res.render("userLogin", { message: "Password is incorrect" });
      }
    } else if (Cheakemail == "" || CheakUserPassword == "") {
      res.render("userLogin", { message: "email and password required" });
    } else {
      res.render("userLogin", { message: "enter valid email and password" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const UserLogout = async (req, res) => {
  if (req.session.user) {
    console.log("kooooi");
    req.session.user = null;
    res.redirect("/");

  }
};

const UserListPage = async (req, res) => {
  try {
    let ResortDataForListpage = await resortsManage.find({});
    let UserNameData = undefined;
    if (req.session.user) {
      UserNameData = await User.findOne({
        _id: req.session.user._id,
      });
    } else {
      UserNameData = undefined;
    }
    res.render("resortListPages", {
      passResortDataForListpage: ResortDataForListpage,
      PassUserName: UserNameData,
    });
  } catch (error) {
    console.log(error);
  }
};

const SrearchResorts = async (req, res) => {
  try {
    let UserNameData = undefined;

    console.log(req.query.search);
    let search = "";
    if (req.query.search) {
      search = req.query.search;
    }
    let page = 1;
    let inc = 1;
    if (req.query.page) {
      page = req.query.page;
    }

      let date ;

    
    if (req.query.arravaleDate) {
      date =  new Date(req.query.arravaleDate) 
    }
    console.log(date);
    const limit = 2;

    const searchRegex = new RegExp(search, "i");

    const ResortData = await resortsManage
      .find({
        $or: [
          {
            $or: [
              { resortName: searchRegex },
              { resortDiscription: searchRegex },
          { resortLocation: searchRegex },
            ],
          },
          {
            $or:[
              { resortAvailabilityData: date },

            ]
          }
        ],
      })
      .populate("category")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

      console.log(ResortData);
    const CountData = await resortsManage
      .find({
       
        $or: [
          {
            $or: [
              { resortName: searchRegex },
              { resortDiscription: searchRegex },
          { resortLocation: searchRegex },

            ],
          },
          {
            $or:[
              { resortAvailabilityData: date },

            ]
          }
          // date, // add the date filter to the query
          // location, // add the location filter to the query
        ],
      })
      .countDocuments();

    if (req.session.user) {
      const UserNameData = await User.findOne({
        _id: req.session.user._id,
      });
    } else {
      UserNameData = undefined;
    }

    res.render("resortListPages", {
      ResortData: ResortData,
      Passsearch: search,
      totelPage: Math.ceil(CountData / limit),
      currentPage: page,
      previousPage: page - 1,
      nextPage: page * inc,
      PassUserName: UserNameData,
      date:date
    });
  } catch (error) {
    console.log(error.message);
  }
};

const filterByCategory = async (req, res) => {
  try {
    let catId = req.params.id;

    let page = 1;
    let inc = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 2;

    const catadata = await resortsManage
      .find({ category: catId })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const catadatacount = await resortsManage
      .find({ category: catId })
      .countDocuments();

    console.log(catadata + "lllllllllllllll");

    let UserNameData = undefined;

    if (req.session.user) {
      const UserNameData = await User.findOne({
        _id: req.session.user._id,
      });
    } else {
      UserNameData = undefined;
    }
    res.render("categorywisePage", {
      ResortElements: catadata,
      totelPage: Math.ceil(catadatacount / limit),
      currentPage: page,
      previousPage: page - 1,
      nextPage: page * inc,
      PassUserName: UserNameData,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const wishList = async (req, res) => {
  if (req.session.user) {
    const UserNameData = await User.findOne({
      _id: req.session.user._id,
    });
    const wishData = await User.findOne({ _id: req.session.user._id })
      .populate("wishlist.ResortId")
      .exec();
    console.log(wishData);
    res.render("wishList", {
      PasswishData: wishData,
      PassUserName: UserNameData,
    });
  } else {
    res.redirect("/UserLogin");
  }
};

const AddWishlist = async (req, res) => {
  try {
    if (req.session.user) {
      console.log("uuuuuuuuuuuuuu");
      const id = req.params.id;
      const resortData = await resortsManage.find({ _id: id });
      const resort = resortData[0]._id;

      const Existwish = await User.findOne({
        _id: req.session.user._id,
        "wishlist.ResortId": id,
      });
      console.log(Existwish);
      if (Existwish) {
        console.log("xxxxxxxx");
      } else {
        console.log("hhhh");
        const wishList = await User.updateOne(
          { _id: req.session.user._id },
          { $push: { wishlist: { ResortId: id } } }
        ).then((response) => {
          res.redirect("/whisList");
        });
      }

      // const user=await User.find({userName:req.session.user.userName})

      const wishData = await User.findOne({ _id: req.session.user._id })
        .populate("wishlist.ResortId")
        .exec();
      console.log(wishData);
      res.render("wishList", { PasswishData: wishData });
    } else {
      res.redirect("/UserLogin");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const removefromwishlist = async (req, res) => {
  try {
    if (req.session.user) {
      const user = req.session.user;
      const id = req.params.id;
      const resort = await User.updateOne(
        { _id: user._id },
        { $pull: { wishlist: { ResortId: id } } }
      );
      const userData = await User.findOne({ _id: user._id }).populate(
        "wishlist.ResortId"
      );
      console.log(resort);

      res.redirect("/whisList");
    } else {
      res.redirect("/UserLogin");
    }
  } catch (error) {
    console.log(error.message);
  }
};




const openResorts = async (req, res) => {
  try {
    const resortId = req.params.id;
    let UserNameData = undefined;
    const ResortData = await resortsManage.findOne({ _id: resortId }).populate("review.userId");
    console.log(ResortData);
    if (req.session.user) {
      UserNameData = await User.findOne({
        _id: req.session.user._id,
      });
    } else {
      UserNameData = undefined;
    }
    res.render("ResortPage", {
      passResortDatas: ResortData,
      PassUserName: UserNameData,
    });
    console.log("page rendered");
  } catch (error) {
    console.log(error.message);
  }
};

const LoadUserpage = async (req, res) => {
  try {
    if (req.session.user) {
      const UserNameData = await User.findOne({
        _id: req.session.user._id,
      });

      const userData = await User.findOne({ _id: req.session.user._id });
      console.log(userData);
      res.render("userpage", {
        userData: userData,
        PassUserName: UserNameData,
      });
    } else {
      res.redirect("/UserLogin");
    }
  } catch (error) {
    console.log(error.massage);
  }
};

const UpdateUserData = async (req, res) => {
  try {
    if (req.session.user) {
      let Userid = req.session.user;
      const UserData = await User.findOne({ _id: Userid._id });

      console.log(req.body.userName, req.body.email);

      const UpdateData = await User.updateOne(
        { _id: Userid._id },
        {
          $set: {
            userName: req.body.userName,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
          },
        }
      );
      res.json({ success: true });
    } else {
      res.json({ failed: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const ChangePassword = async (req, res) => {
  const userData = await User.findOne({ _id: req.session.user._id });
  const camparePass = await bcrypt.compare(
    req.body.OldPassword,
    userData.password
  );
  let newPassowrd = req.body.NewPassword;
  if (camparePass) {
    const Newpassword = await bcrypt.hash(newPassowrd, 10);
    const PushNewPassowrd = await User.updateOne(
      { _id: req.session.user._id },
      {
        $set: {
          password: Newpassword,
        },
      }
    );
    res.json({ success: true });
  } else {
    res.json({ failed: true });
  }
};

const registerComplainte=async(req,res)=>{
  try {
    if(req.session.user){
      console.log(req.body.complainte);
      let id=req.session.user._id
      console.log(id);
      
      const UserData= await User.findByIdAndUpdate({_id:id},{$push:{
        complanteRegister:req.body.complainte
      }})
      res.json({ success: true });
    }else{
      res.redirect("/UserLogin");

    }
  } catch (error) {
    console.log(error.massage);
  }
  
}

const Review=async(req,res)=>{
  if(req.session.user){
    let UserId=req.session.user._id
    let ResortId=req.body.resortId
    let ResortObjectid= mongoose.Types.ObjectId(ResortId);
    let reviewBody=req.body.ReviewBody
    let reviewTitle=req.body.reviewTitle
  console.log(ResortObjectid);
  
    const UpdateToresort=await resortsManage.updateOne({_id:ResortObjectid},{$push:{review:{
      body:reviewBody,
      title:reviewTitle,
      userId:UserId
    }}})
    console.log(UpdateToresort);
    res.json({ success: true });

  }else{
    res.redirect("/UserLogin");
  }
  
}

module.exports = {

  loadHome,
  UserSignup,
  UserLogin,
  VerifyUser,
  UserLogout,
  UserListPage,
  SrearchResorts,
  wishList,
  AddWishlist,
  removefromwishlist,
  openResorts,
  NewtUser2,
  VerifyUser2,
  filterByCategory,
  LoadUserpage,
  UpdateUserData,
  ChangePassword,
  registerComplainte,
  Review
};
