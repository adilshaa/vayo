const mongoose = require("mongoose");

const CouponManagment = new mongoose.Schema({
  couponName: {
    type: String,
    required: true,
  },
  CouponCode: {
    type: String,
    required: true,
    // unique: true,
  },
  CouponDiscount: {
    type: Number,
    // min: 0,
    // max: 100,
  },
  CoupoEexpirationDate: {
    type: Date,
    required: true,
  },
  CouponMaxDiscount: {
    type: Number,
    required: true,
  },
  CouponMinPurchaseAmount: {
    type: Number,
    required: true,
  },
  CouponercentageOff: {
    type: Number,
    required: true,
    // min: 0,
    // max: 100,
  },
  userUsed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user,",
  },
});

module.exports = mongoose.model("coupon", CouponManagment);
