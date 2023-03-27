
const User= require("../models/userModel");



async function UserName(){
  const UserNameData = await User.findOne({
    _id: req.session.user._id,
  });
return UserNameData
}


module.exports={
    UserName
}