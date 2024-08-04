const express = require("express");
const app = express();
const multer = require('multer');
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require('cors');
const userRoute = require("./routes/users");
const AuthRoute = require("./routes/auth");
const PostRoute = require("./routes/posts");

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join("public", "images");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const filename = `${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

const profilePictureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join("public", "images");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const filename = `${file.originalname}`;
    cb(null, filename);
  },
});
const upload1 = multer({ storage: profilePictureStorage });
const coverPictureStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join("public", "images");
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const filename = `${file.originalname}`;
      cb(null, filename);
    },
  });
  const upload2 = multer({ storage: coverPictureStorage });



app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/uploadprofile", upload1.single("file"), (req, res) => {
  try {
    return res.status(200).json("Profile picture uploaded");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/api/uploadcover", upload2.single("file"), (req, res) => {
    try {
      return res.status(200).json("Profile picture uploaded");
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
app.use("/api/users", userRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/post", PostRoute);

app.listen(8800, () => {
  console.log("Backend is running at port 8800");
});
