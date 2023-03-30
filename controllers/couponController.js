const CouponManagment = require("../models/CoupenModel");
const User = require("../models/userModel");

const ListCoupon = async (req, res) => {
  try {
    const CouponData = await CouponManagment.find({});
    res.render("couponpage", { CouponData: CouponData });
  } catch (error) {}
};

const AddCouponPage = async (req, res) => {
  try {
    res.render("addCoupon");
  } catch (error) {
    console.log(error.message);
  }
};

const InserCoupon = async (req, res) => {
  try {
    console.log("hello");

    const Coupon = req.body.CouponCode;

    // console.log(ExistCoupon);

    let couponName = req.body.CouponName;
    let CouponCode = req.body.CouponCode;
    let CouponDiscount = req.body.Coupondiscount;
    let CouponMaxDiscount = req.body.CouponMaxDicount;
    let CoupoEexpirationDate = req.body.CouponexDate;

    let CouponPercentageOff = req.body.CouponPasantage;

    let CouponMinPurchaseAmount = req.body.CouponMinPurchaseAmount;

    const ExistCoupon = await CouponManagment.findOne({ CouponCode: Coupon });

    if (ExistCoupon) {
      console.log("exist error");
      res.render("addCoupon", { message: "This Coupon is already exists" });
    } else if (
      couponName.trim() == "" &&
      CouponCode.trim() == "" &&
      CouponDiscount.trim() == "" &&
      CouponMaxDiscount.trim() == "" &&
      CoupoEexpirationDate.trim() == "" &&
      CouponPercentageOff.trim() == "" &&
      CouponMinPurchaseAmount.trim() == ""
    ) {
      console.log("field error");

      res.render("addCoupon", { message: "All Fields are required" });
    } else {
      console.log("this");
      const CouponData = new CouponManagment({
        couponName: couponName,
        CouponCode: CouponCode,
        CouponDiscount: CouponDiscount,
        CoupoEexpirationDate: CoupoEexpirationDate,
        CouponMaxDiscount: CouponMaxDiscount,
        CouponMinPurchaseAmount: CouponMinPurchaseAmount,
        CouponercentageOff: CouponPercentageOff,
      });
      await CouponData.save();
      console.log(CouponData);
      res.redirect("/admin/coupenLoad");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const editCoupon = async (req, res) => {
  try {
    let id = req.params.id;
    const CouponData = await CouponManagment.findOne({ _id: id });
    res.render("EditCoupon", { CouponData: CouponData });
  } catch (error) {}
};

const UpdateEditCoupon = async (req, res) => {
  let id = req.params.id;
  // let newCouponCode=req.body.CouponCode

  const couponData = await CouponManagment.findById({ _id: id });
  let couponName = req.body.CouponName;
  let CouponCode = req.body.CouponCode;
  let CouponDiscount = req.body.Coupondiscount;
  let CouponMaxDiscount = req.body.CouponMaxDicount;
  let CoupoEexpirationDate = req.body.CouponexDate;

  let CouponPercentageOff = req.body.CouponPasantage;

  let CouponMinPurchaseAmount = req.body.CouponMinPurchaseAmount;

  const UpdateData = await CouponManagment.updateOne(
    { _id: id },
    {
      $set: {
        couponName: couponName,
        CouponCode: CouponCode,
        CouponDiscount: CouponDiscount,
        CoupoEexpirationDate: CoupoEexpirationDate,
        CouponMaxDiscount: CouponMaxDiscount,
        CouponMinPurchaseAmount: CouponMinPurchaseAmount,
        CouponercentageOff: CouponPercentageOff,
      },
    }
  );
  console.log(UpdateData);
  res.redirect("/admin/coupenLoad");
};


const applayCoupen=async(req,res)=>{
  try {
    console.log(req.body.code);
    const CouponData=await CouponManagment.findOne({CouponCode:req.body.code})
    console.log(CouponData);
  if(CouponData){
    const user=req.session.user
    console.log(user);
    const UserData=await User.findOne({_id:user._id})
    const FoundData=await CouponManagment.findOne({
      CouponCode:req.body.CouponCode,
      userUsed:{$in:[user._id]}
    })
    const code=CouponData.CouponCode
    const currentDate=Date.now();
    if(FoundData){
      res.json({ used: true });

    }else{
if(currentDate <= CouponData.CoupoEexpirationDate){
  if(req.body.total >= CouponData.CouponMinPurchaseAmount){
    let discountAmount= 

    (req.body.total*CouponData.CouponercentageOff)/100;
    console.log(discountAmount);
    if(discountAmount<= CouponData.CouponMaxDiscount){
      console.log("mmmmooooi");

      let discountValue= discountAmount;
      let Value =req.body.total -discountValue
      res.json({ amountokay: true, Value, discountValue, code });


    }else{
      console.log("gooooi");
      let discountValue = CouponData.CouponMaxDiscount;
      console.log(discountValue);
    let Value = req.body.total - discountValue;
    res.json({ amountokay: true, Value, discountValue, code });
    }
  }else{
    console.log("koiiiiiiiiiiii");
    res.json({ amountnotoky:true });
  }
}else{
  res.json({ datefailed: true });
  console.log("bbbbboiiiiiiiiiiii");

}
    }

  }else{
    res.json({ invaild: true });

  }
  } catch (error) {
    console.log(error.message);
  }
  
}


module.exports = {
  ListCoupon,
  AddCouponPage,
  InserCoupon,
  editCoupon,
  UpdateEditCoupon,
  applayCoupen
};
