const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage(); // Use memory, not disk

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "text/csv") {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
