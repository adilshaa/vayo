const Category =require("../models/CatogeryModel");
const fs = require("fs");
const path = require("path");

const ViewCatogory = async (req, res) => {
  try {
    const categoryData = await Category.find({});
    console.log(categoryData.categoryname);
    res.render("category", { pass: categoryData });
  } catch (error) {
    console.log(error.message);
  }
};


const New_category = async (req, res) => {
  try {
    res.render("Add_catogery");
  } catch (error) {
    console.log(error.message);
  }
};

const Add_Category = async (req, res) => {
  try {
    const categoryName = req.body.category.toUpperCase();
    const categoryDiscription = req.body.categorydiscription;
    console.log(categoryName, categoryDiscription);

    const ExistingCategory = await Category.findOne({ category: categoryName });
    if (ExistingCategory) {
      res.render("Add_catogery", {
        message: "This category is already existed",
      });
    } else if (categoryName == "" || categoryDiscription == "") {
      res.render("Add_catogery", { message: "All fields are required" });
    } else {
      const imageAarray = [];
      for (let i = 0; i < req.files.length; i++) {
        imageAarray.push(req.files[i].filename);
      }
      console.log("hai");
      const category = new Category({
        category: req.body.category.toUpperCase(),
        categorydiscription: req.body.categorydiscription,
        categoryImages: imageAarray,
      });
      const categoryData = await category.save();
      console.log(category);
      res.redirect("/admin/Viewcategory");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const Deletecatogery = async (req, res) => {
  try {
    let id = req.params.id;
    await Category.deleteOne({ _id: id });

    res.redirect("/admin/Viewcategory");
  } catch (error) {
    console.log(error.message);
  }
};

const Editcategory = async (req, res) => {
  let id = req.params.id;
  const GetExistinfData = await Category.findOne({ _id: id });
  res.render("editcategory", { vcategory: GetExistinfData });
};

const UpadateCatergory = async (req, res) => {
  try {
    // console.log();
    console.log(req.body);
    let updateCategoryData = req.body.categoryname;
    console.log(updateCategoryData);
    let updateDiscriptionData = req.body.categorydiscription;
    let updateCapitialData = updateCategoryData.toUpperCase();
    console.log(updateCapitialData);
    let id = req.params.id;
    let CollectedCategoryData = await Category.findById({ _id: id });
    // let AllCategoryData = await Category.findOne({
    //   category: updateCapitialData
    // });
    if (CollectedCategoryData.categoryname === updateCapitialData) {
      if (CollectedCategoryData.categorydiscription == updateDiscriptionData) {
        res.render("editcategory", {
          message: "This data is already exist",
          vcategory: CollectedCategoryData,
        });
      } else {
        await Category.updateOne(
          { _id: id },
          { $set: { categorydiscription: updateDiscriptionData } }
        );
        res.redirect("/admin/Viewcategory");
      }
      // } else if (AllCategoryData) {
      //   console.log(AllCategoryData.category);
      //   res.render("editcategory", {
      //     message: "This Category is already exist hello",
      //     vcategory: CollectedCategoryData,
      //   });
    } else {
      await Category.updateOne(
        { _id: id },
        {
          $set: {
            category: updateCapitialData,
            categorydiscription: updateDiscriptionData,
          },
        }
      );
      res.redirect("/admin/Viewcategory");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const editImageCat = async (req, res) => {
  console.log("rexhed");
  let id = req.params.id;
  const imageData = await Category.findOne({ _id: id });
  if (imageData.categoryImages.length <= 2) {
    const images = [];
    for (file of req.files) {
      images.push(file.filename);
    }
    if (imageData.categoryImages.length + images.length <= 6) {
      const inImage = await Category.updateOne(
        { _id: req.params.id },
        { $addToSet: { categoryImages: { $each: images } } }
      );
      if (inImage) {
        console.log("image Uploaeded");
        const imageId = req.params.id;
        res.redirect("/admin/Viewcategory/editcategory/" + imageId);
      } else {
        res.redirect("/admin/Viewcategory/editcategory");
      }
    } else {
      try {
        const resoData = await Category.findOne({ _id: req.params.id });
        const CaptData = await Category.findOne({});
        let imageFull = true;
        res.render("editcategory", { resoData, CaptData, imageFull });
        imageFull = false;
      } catch (error) {
        console.log(error.message);
      }
    }
  }
  //  res.redirect('/View_resort')
};

const DeleteCategoryImage = async (req, res) => {
  let imageId = req.params.imgid;
  let catId = req.params.categoryid;
  console.log(imageId);
  if (imageId) {
    const filePath = path.join(
      __dirname,
      "..",
      "public",
      "CategoryImages",
      imageId
    );
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
      }
    });
    await Category.updateOne(
      { _id: catId },
      { $pull: { categoryImages: imageId } }
    );
    res.redirect("/admin/Viewcategory/editcategory/" + catId);
  }
};

const ListCategory = async (req, res) => {
  let id = req.params.id;
  const TakeListedCategory = await Category.findOne(
    { _id: id },
    { categoryStatus: 1, _id: 0 }
  );
  if (TakeListedCategory.categoryStatus == false) {
    await Category.updateOne({ _id: id }, { $set: { categoryStatus: true } });
    res.redirect("/admin/Viewcategory");
  } else {
    await Category.updateOne({ _id: id }, { $set: { categoryStatus: false } });
    res.redirect("/admin/Viewcategory");
  }
};

insertCategoryImage = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = {
  ViewCatogory,
  New_category,
  Add_Category,
  ListCategory,
  Editcategory,
  UpadateCatergory,
  DeleteCategoryImage,
  editImageCat,
};
