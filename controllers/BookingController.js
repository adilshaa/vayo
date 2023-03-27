const Booking = require("../models/BookingModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Category = require("../models/CatogeryModel");
const resortsManage = require("../models/resortsManage");
const { method } = require("lodash");
const { v4: uuidv4 } = require("uuid");
const mongoose = require('mongoose');

// const Razorpay = require('razorpay');
let razorpay = require("razorpay");
require("dotenv").config();
const crypto = require("crypto");
const { nextTick } = require("process");
const { log } = require("console");

var Instance = new razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});
// console.log(instance);
const ResortBooking = async (req, res) => {
  try {
    let resortId = req.params.id;

    if (req.session.user) {
      const UserNameData = await User.findOne({
        _id: req.session.user._id,
      });
      const resortData = await resortsManage.findOne({ _id: resortId });
      const UserId = await User.findOne({ _id: req.session.user._id });
      // calcutlating Gst
      const date = new Date();
      const currentDate = date.toLocaleDateString();
      let ResortPice = resortData.resortPrice;
      let CUrrentGstRate = 0.18;
      let Gstprice = CUrrentGstRate * ResortPice;
      console.log(currentDate);

      res.render("bookingPage", {
        resortData: resortData,
        gstRate: Gstprice,
        userid: UserId,
        PassUserName: UserNameData,
        date:currentDate
      });
    } else {
      res.redirect("/UserLogin");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const Insert_resortBooking = async (req, res) => {
  try {
    if (req.session.user) {
      console.log("HELOOOO");
      let id = req.params.id;
      const resortid = await resortsManage.findOne({ _id: req.body.resortId });
      let ResortPice = resortid.resortPrice;
      let CUrrentGstRate = 0.18;
      let Gstprice = CUrrentGstRate * ResortPice;

      console.log(req.body + "haaaaaaaaaaaaa");
      let paymethod = req.body.payM;
      if (paymethod == "PDC") {
        console.log("hai");
        const username = await User.findOne({
          _id: req.session.user._id,
        });
        const id = username._id;
        if (
          req.body.bookername == "" ||
          req.body.bookereamil == "" ||
          req.body.bookeraddress == "" ||
          req.body.bookerphonenumber == ""
        ) {
          res.render("bookingPage", {
            message: "all fields are rquired",
            resortData: resortid,
            gstRate: Gstprice,
          });
        } else {
          console.log("am here");
          const resortDetals = await resortsManage.findOne({
            _id: req.body.resortId,
          });
          const DataOfBookedresort = new Booking({
            bookerName: req.body.bookername,
            bookerEmail: req.body.bookereamil,
            ResortName: req.body.resortId,
            bookerNumber: req.body.bookerphonenumber,
          bookingAmount:req.body.bookingAmount,
            BookerId: id,
            bookerAddress: [
              {
                street: req.body.street,
                city: req.body.city,
                state: req.body.state,
                pinCode: req.body.pinCode,
              },
            ],
            paymentMethod: paymethod,
            CurrentBookingData: Date.now(),
             cheakoutDate:req.body.CheakoutDate,

            bookingId: `booking_id_${uuidv4()}`,
            status: "confirmed",
          });
          console.log(DataOfBookedresort);
          await DataOfBookedresort.save();
          // res.render("successPage");
          res.json({ status: true });
        }
      } else if (paymethod == "ONLINEPAY") {
        console.log(paymethod);

        const username = await User.findOne({
          _id: req.session.user._id,
        });
        const id = username._id;
        let booking = req.body;
        console.log(booking);
        const bookingdetails = [];
        const resortid = req.body.resortId;
        console.log(resortid);
        const DataOfBookedresort = new Booking({
          bookerName: req.body.bookername,
          bookerEmail: req.body.bookereamil,
          ResortName: req.body.resortId,
          bookingAmount:req.body.bookingAmount,
          bookerNumber: req.body.bookerphonenumber,
          BookerId: id,
          bookerAddress: [
            {
              street: req.body.street,
              city: req.body.city,
              state: req.body.state,
              pinCode: req.body.pinCode,
            },
          ],
          paymentMethod: paymethod,
          cheakoutDate: req.body.CheakoutDate,
          CurrentBookingData: Date.now(),
          bookingId: `booking_id_${uuidv4()}`,
          status: "Payment Failed",
        });
        const saveData = await DataOfBookedresort.save();

        const LatestBooking = await Booking.findOne({})
          .sort({ CurrentBookingData: -1 })
          .lean();

        console.log(LatestBooking);

        let Options = {
          amount: req.body.bookingAmount * 100,
          currency: "INR",
          receipt: "" + LatestBooking._id,
        };
        console.log(Options);

        Instance.orders.create(Options, function (err, booking) {
          console.log("don gyssss");
          res.json({ viewRazorpay: true, booking });
        });
      } else {
        res.json({ radio: true });
      }
    } else {
      res.redirect("/UserLogin");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const verifyPayment = async (req, res) => {
  try {
    if (req.session.user) {
      const LatestBooking = await Booking.findOne({})
        .sort({ CurrentBookingData: -1 })
        .lean();
      await Booking.updateOne(
        { bookingId: LatestBooking.bookingId },
        { $set: { status: "confirmed" } }
      );
      const Details = req.body;
      console.log(Details["payment"]["razorpay_signature"]);
      let hmac = crypto.createHmac("sha256", process.env.KEY_SECRET);
      hmac.update(
        Details["payment"]["razorpay_order_id"] +
          "|" +
          Details["payment"]["razorpay_payment_id"]
      );
      hmac = hmac.digest("hex");
      if (hmac == Details["payment"]["razorpay_signature"]) {
        console.log("success");

        res.json({ status: true });
      } else {
        res.json({ failed: true });
      }
    } else {
      res.redirect("/UserLogin");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const VeiwBooking = async (req, res) => {
  try {
    if (req.session.user) {
      const UserNameData = await User.findOne({
        _id: req.session.user._id,
      });
      const BookingData = await Booking.find({BookerId:UserNameData._id}).populate("ResortName");
      res.render("BookingViewPage", {
        BookingData: BookingData,
        PassUserName: UserNameData,
      });
    } else {
      res.redirect("/UserLogin");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const Successpage = async (req, res) => {
  try {
    if (req.session.user) {
      const UserNameData = await User.findOne({
        _id: req.session.user._id,
      });
      res.render("successPage", { PassUserName: UserNameData });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const BookingDetalsis = async (req, res) => {
  try {
    if(req.session.user){
      const UserNameData = await User.findOne({
        _id: req.session.user._id,
      });
      let id = req.params.id;
      const Bookingdata = await Booking.findOne({ _id: id }).populate(
        "ResortName"
      );
      console.log(Bookingdata + "kkkkkkkkkkkkkkk");
      res.render("BookingDetailedView", {
        Bookingdata: Bookingdata,
        PassUserName: UserNameData,
      });
    }else{
      res.redirect("/UserLogin");

    }
  
  } catch (error) {
    console.log(error.message);
  }
};
const CancelBooking = async (req, res) => {
  try {
    if (req.session.user) {
      console.log("helooooooooooooooooooooooooooo");

      let BookingId = req.body.BookingId;
      console.log(BookingId);
      const OrderData = await Booking.updateOne(
        { _id: BookingId },
        {
          $set: {
            status: "cancelled",
          },
        }
      );
      console.log(OrderData);
      res.json({ success: true });
    } else {
      res.redirect("/UserLogin");
    }
  } catch (error) {}
};



const BookingList = async (req, res) => {
  try {
    console.log("llllllllllllllllllllllll");
    const BookingData = await Booking.find({}).populate("ResortName");
    console.log("sssssssssssss");
    console.log(BookingData);
    res.render("BookingList", {
      BookingData: BookingData,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const UpdateBookingStatus = async (req, res) => {
  try {
    console.log("ppppppppppp");
    let BookingId = req.body.BookingId;
    let Status = req.body.status;
    console.log(BookingId);

    const OrderData = await Booking.updateOne(
      { bookingId:BookingId },
      {
        $set: {
          status:Status,
        },
      }
    );
    console.log(OrderData);
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
  }
};



const ViewSeprateBooking =async(req,res)=>{
  let id=req.params.id
  const BookingData=await Booking.findById({_id:id}).populate("ResortName")
  console.log(BookingData+"lllllllllllll");
  res.render("bookingDetaile",{Bookingdata:BookingData})
}

module.exports = {
  ResortBooking,
  Insert_resortBooking,
  VeiwBooking,
  verifyPayment,
  Successpage,
  BookingDetalsis,
  CancelBooking,
  UpdateBookingStatus,
  BookingList,
  ViewSeprateBooking
};
