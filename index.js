const mongoose = require("mongoose");

app.use(session({
  secret: 'vayo',
  resave: false,
  saveUninitialized: false // add this line
}));

require('dotenv').config()

mongoose.connect(process.env.Resort);
mongoose.set('strictQuery', false);
const express = require("express");
const app = express();
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

//for user routes
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const { response } = require("./routes/adminRoute");
app.use("/", userRoute);
app.use("/admin", adminRoute);

app.listen(2000, () => {
  console.log("Clint-------------😁-------------Server");
});

module.exports = {
  app,
};
