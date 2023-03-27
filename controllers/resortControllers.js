const resortMenage = require("../models/resortsManage");
const Category = require("../models/CatogeryModel");
const fs = require("fs");
const path = require("path");
const { log } = require("console");

const View_resorts = async (req, res) => {
  try {
    const takeResortDetails = await resortMenage.find({}).populate("category");
    console.log(takeResortDetails);
    res.render("Resort_view", { passResortData: takeResortDetails });
  } catch (error) {}
};

const Add_resorts = async (req, res) => {
  try {
    const takeCategory = await Category.find({});
    res.render("Add_resorts", { passCatergory: takeCategory });
  } catch (error) {
    console.log(error.message);
  }
};

const insert_resorts = async (req, res) => {
  try {
    let dateWithTime = req.body.resortAvailabilityData
    // const dateWithoutTime = new Date(dateWithTime).toLocaleDateString()
    // console.log(dateWithoutTime);
    const imageAarray = [];
    for (let i = 0; i < req.files.length; i++) {
      imageAarray.push(req.files[i].filename);
    }

    const NewResort = new resortMenage({
      resortName: req.body.resortName,
      resortDiscription: req.body.resortDiscription,
      resortLocation: req.body.resortLocation,
      resortsOtherImages: imageAarray,
      resortPrice: req.body.resortPrice,
      category: req.body.category,
      resortRooms: req.body.resortRooms,
      resortAvailabilityData: req.body.resortRooms,
      resortPolicies: req.body.resortPolicies,
      resortAvailabilityData: dateWithTime,
    });
    await NewResort.save();
    console.log(NewResort);
    res.redirect("/admin/View_resort");
  } catch (error) {
    console.log(error.message);
  }
};

const DeleteResort = async (req, res) => {
  try {
    let id = req.params.id;
    await resortMenage.deleteOne({ _id: id });
    res.redirect("/admin/View_resort");
  } catch (error) {
    console.log(error.message);
  }
};

const editResorts = async (req, res) => {
  let id = req.params.id;
  try {
    const ResortData = await resortMenage
      .findById({ _id: id })
      .populate("category");
    const CategoryData = await Category.find({});
    res.render("edit_resort", {
      passResortData: ResortData,
      PassCategoryData: CategoryData,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const UpdateResort = async (req, res) => {
  try {

    let dateWithTime = req.body.resortAvailabilityData
    // const dateWithoutTime = new Date(dateWithTime).toLocaleDateString()


    let NewresortName = req.body.resortName;
    let newresortDiscription = req.body.resortDiscription;
    let newresortLocation = req.body.resortLocation;

    let newresortPrice = req.body.resortPrice;
    let newresortCategory = req.body.resortCategory;
    let newresortPolicies = req.body.resortPolicies;
  
    let newresortRooms = req.body.resortRooms;
    let id = req.params.id;

    const OldResortData = await resortMenage.findById({ _id: id });
    console.log(NewresortName);

    await resortMenage.updateOne(
      { _id: id },
      {
        $set: {
          resortName: NewresortName,
          resortDiscription: newresortDiscription,
          resortLocation: newresortLocation,
          resortPrice: newresortPrice,
          resortCategory: newresortCategory,
          resortPolicies: newresortPolicies,
          resortRooms: newresortRooms,
          resortAvailabilityData: dateWithTime,
        },
      }
    );
    console.log("resort Data Updated");
    res.redirect("/admin/View_resort");
  } catch (error) {
    console.log(error.message);
  }
};

const editImagae = async (req, res) => {
  console.log("rexhed");
  let id = req.params.id;
  const imageData = await resortMenage.findOne({ _id: id });
  if (imageData.resortsOtherImages.length <= 6) {
    const images = [];
    for (file of req.files) {
      images.push(file.filename);
    }
    if (imageData.resortsOtherImages.length + images.length <= 6) {
      const inImage = await resortMenage.updateOne(
        { _id: req.params.id },
        { $addToSet: { resortsOtherImages: { $each: images } } }
      );
      if (inImage) {
        console.log("image Uploaeded");
        const imageId = req.params.id;
        res.redirect("/admin/View_resort/editresort/" + imageId);
      } else {
        res.redirect("/admin/View_resort/editresort");
      }
    } else {
      try {
        const resoData = await resortMenage.findOne({ _id: req.params.id });
        const CaptData = await Category.findOne({});
        let imageFull = true;
        res.render("edit_resort", { resoData, CaptData, imageFull });
        imageFull = false;
      } catch (error) {
        console.log(error.message);
      }
    }
  }
  //  res.redirect('/View_resort')
};

const DeleteResortImage = async (req, res) => {
  let imageId = req.params.imgid;
  let resortId = req.params.resortid;
  console.log(imageId);
  if (imageId) {
    const filePath = path.join(
      __dirname,
      "..",
      "public",
      "resortImages",
      imageId
    );
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
      }
    });
    await resortMenage.updateOne(
      { _id: resortId },
      { $pull: { resortsOtherImages: imageId } }
    );
    res.redirect("/admin/View_resort/editresort/" + resortId);
  }
};

const ListResort = async (req, res) => {
  let id = req.params.id;
  const resortDetailesById = await resortMenage.findOne(
    { _id: id },
    { resortStatus: 1 },
    { _id: 0 }
  );

  if (resortDetailesById.resortStatus == true) {
    await resortMenage.updateOne(
      { _id: id },
      { $set: { resortStatus: false } }
    );
    res.redirect("/admin/View_resort");
  } else {
    await resortMenage.updateOne({ _id: id }, { $set: { resortStatus: true } });
    res.redirect("/admin/View_resort");
  }
};

module.exports = {
  Add_resorts,
  insert_resorts,
  View_resorts,
  DeleteResort,
  editResorts,
  UpdateResort,
  DeleteResortImage,
  editImagae,
  ListResort,
};
