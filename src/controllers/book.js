const bookDao = require("../daos/book");
const userDao = require("../daos/user");
const addressDao = require("../daos/address");
const Joi = require("joi");

const bookController = {
  findBooks,
  findBookById,
  createBook,
  updateBook,
  deleteBook,
};

function findBooks(req, res) {
  bookDao
    .findAll()
    .then((books) => {
      const uploadURL = process.env.UPLOADS;
      books = books.map((obj) => {
        const image = !obj.image ? null : uploadURL + "image/" + obj.image;
        return { ...obj.dataValues, image };
      });
      res.send({
        status: "success",
        data: { books },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function findBookById(req, res) {
  const id = req.params.id;
  bookDao
    .findById(id)
    .then((book) => {
      if (!book)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
      userDao
        .findById(book.userId)
        .then((user) => {
          if (!user)
            return res.status(404).json({
              error: {
                message: "Not exists!",
                "object id": book.userId,
              },
            });
          addressDao
            .findById(user.address.id)
            .then((address) => {
              if (!address)
                return res.status(404).json({
                  error: {
                    message: "Book Address Not exists!",
                    "object id": user.addressId,
                  },
                });
              book.dataValues.address = address;
              book.dataValues.image = !book.image
                ? null
                : process.env.UPLOADS + book.dataValues.image;
              res.send({
                status: "success",
                data: { book },
              });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

function createBook(req, res) {
  let book = req.body;
  book.image = req.files.image[0].filename;
  if (req.files.document && req.files.document[0])
    book.document = req.files.document[0].filename;

  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    author: Joi.string().min(3).required(),
    isbn: Joi.string(),
    isEbook: Joi.number().min(0).max(1),
    desc: Joi.string().min(3).required(),
    price: Joi.number().min(3).required(),
    image: Joi.string().required(),
    document: book.isEbook == 1 ? Joi.string().required() : Joi.string(),
    publicationDate: Joi.string().min(4).required(),
    qty: Joi.number().min(1).required(),
  });

  const { error } = schema.validate(book);
  book.userId = req.user.id;

  if (error)
    return res
      .status(400)
      .send({ error: { message: error.details[0].message } });

  bookDao
    .create(book)
    .then((book) => {
      //   book.dataValues.user = {
      //     id: req.user.id,
      //     name: req.user.name,
      //     email: req.user.email,
      //     image: "user_" + req.user.id + ".jpg",
      //   };
      res.status(201).send({
        status: "success",
        data: { book },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function updateBook(req, res) {
  const id = req.params.id;

  let book = req.body;
  book.image = req.files.image[0].filename;
  if (req.files.document && req.files.document[0])
    book.document = req.files.document[0].filename;

  const schema = Joi.object({
    title: Joi.string().min(3),
    author: Joi.string().min(3),
    isbn: Joi.string(),
    isEbook: Joi.number().min(0).max(1),
    desc: Joi.string().min(3),
    price: Joi.number().min(3),
    image: Joi.string().required(),
    document: book.isEbook == 1 ? Joi.string() : Joi.string(),
    publicationDate: Joi.string().min(4),
    qty: Joi.number().min(1),
  });

  const { error } = schema.validate(book);

  if (error)
    return res
      .status(400)
      .send({ error: { message: error.details[0].message } });

  bookDao
    .findById(id)
    .then((book) => {
      if (!book)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
      if (req.user.id != book.userId)
        return res.status(403).json({
          error: {
            message: "Forbidden, You not owner!",
          },
        });

      delete book.dataValues.idUser;
      for (const [key, value] of Object.entries(req.body)) {
        book.dataValues[key] = value;
      }
      bookDao
        .update(req.body, id)
        .then(() => {
          res.status(200).json({
            message: "Book updated successfully",
            data: { book },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

function deleteBook(req, res) {
  const id = req.params.id;
  bookDao
    .findById(id)
    .then((book) => {
      if (!book)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
      if (req.user.id != book.userId)
        return res.status(403).json({
          error: {
            message: "Forbidden!",
          },
        });

      bookDao
        .deleteById(id)
        .then((book) => {
          res.status(200).json({
            message: "Book deleted successfully",
            "object id": id,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = bookController;
