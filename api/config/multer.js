import multer from "multer";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname); // unique name
  },
});

function fileFilter(req, file, cb) {
  const allowedFiles = ["image/png", "image/jpg", "image/jpeg", "image/wbep"];
  if (!allowedFiles.includes(file.mimetype)) {
    //to reject this files pass "false", like so;
    cb(null, false);
  }else{
      //to accept this files pass "true" , like so;
      cb(null, true);
  }
}

const upload = multer({ storage:storage,fileFilter:fileFilter });

export default upload