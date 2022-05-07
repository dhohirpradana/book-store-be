const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

exports.uploadFile = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // cb(null, "uploads");
      if (file.fieldname === "image") {
        // if uploading resume
        cb(null, "uploads/image");
      } else {
        // else uploading image
        cb(null, "uploads/document");
      }
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + uuidv4() + file.originalname.replace(/\s/g, "")
      );
    },
  });

  const fileFilter = function (req, file, cb) {
    if (file.fieldname == "image") {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        req.fileValidationError = {
          message: "Image extension not allowed!",
        };
        return cb(new Error("Image extension not allowed!", false));
      }
    } else if (file.fieldname == "document") {
      if (!file.originalname.match(/\.(pdf|doc|PDF|DOC|docx|DOCX)$/)) {
        req.fileValidationError = {
          message: "Document extension not allowed!",
        };
        return cb(new Error("Document extension not allowed!", false));
      }
    }
    cb(null, true);
  };

  const sizeInMB = 10;
  const maxSize = sizeInMB * 1000 * 1000;

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).fields([
    { name: "image", maxCount: 5 },
    { name: "document", maxCount: 1 },
  ]);

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }

      if (!req.files.image && !err) {
        return res.status(400).send({
          message: "Please select image to upload",
        });
      }

      // if (!req.files.document && !err) {
      //   return res.status(400).send({
      //     message: "Please select document to upload",
      //   });
      // }

      if (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file sized 10MB",
          });
        }

        return res.status(400).send(err);
      }

      return next();
    });
  };
};
