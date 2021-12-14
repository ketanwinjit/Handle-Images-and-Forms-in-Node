require("dotenv").config();
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
// TO set ejs
app.set("view engine", "ejs");

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true, // we are setting use temprarory directory
    tempFileDir: "/temp/", //  we have to pass data url, Create path under temFilePath: ''
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to IMAGE AND FILE SECTION");
});

/**
 * ? ### 1. Get request for get data under query
 */

app.get("/myget", (req, res) => {
  res.send(req.query);
});

/**
 * ? ### 1.Post Data and Images in req.body
 * ? ### 2.Also handle how to upload single and multiple images to cloudinary
 */

app.post("/mypost", async (req, res) => {
  console.log("REQ FILES", req.files);

  let imageArray = [];

  //? ### use case - To upload multiple images
  if (req.files) {
    for (let index = 0; index < req.files.SampleFile.length; index++) {
      let result = await cloudinary.uploader.upload(
        req.files.SampleFile[index].tempFilePath,
        {
          folder: "users",
        }
      );
      imageArray.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
    }

    console.log(imageArray);
  }

  //? ### USE CASE FOR SINGLE IMAGE TO BE UPLOAD ON CLOUDINARY
  // let file = req.files.SampleFile;
  // result = await cloudinary.uploader.upload(file.tempFilePath, {
  //   folder: "users", // Floder name under cloudinary
  // });
  // console.log(result);

  details = {
    firstname: req.body.Firstname,
    lastname: req.body.Lastname,
    // result,
  };
  res.send(details);
});

/**
 * ? ### To render get form EJS
 */

app.get("/mygetform", (req, res) => {
  res.render("getform");
});

/**
 * ? ### To render post form EJS
 */

app.get("/mypostform", (req, res) => {
  res.render("postform");
});

app.listen(process.env.PORT, () =>
  console.log(`Server is listing on PORT: ${process.env.PORT}`)
);
