
const { addNominee, getNominees } = require('./nominee.controller');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + ext);
  }
});

const upload = multer({ storage });
const nomineeRouter = require('express').Router();
nomineeRouter.post("/add", upload.single('image'), addNominee)
nomineeRouter.get("/get",getNominees)
module.exports = nomineeRouter;