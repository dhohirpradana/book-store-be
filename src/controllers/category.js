const categoryDao = require("../daos/category");
const Joi = require("joi");

const categoryController = {
  findCategories,
  findCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

function findCategories(req, res) {
  categoryDao
    .findAll()
    .then((categories) => {
      res.send({
        status: "success",
        data: { categories },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function findCategoryById(req, res) {
  const id = req.params.id;
  categoryDao
    .findById(id)
    .then((category) => {
      if (!category)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
      res.send({
        status: "success",
        data: { category },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function createCategory(req, res) {
  let category = req.body;

  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(category);

  if (error)
    return res
      .status(400)
      .send({ error: { message: error.details[0].message } });

  categoryDao.findName(category.name).then((isExistsName) => {
    if (isExistsName)
      return res.status(409).json({
        error: {
          message: "Category with that name already exists",
          data: category,
        },
      });

    categoryDao
      .create(category)
      .then((category) => {
        delete category.dataValues.updatedAt;
        delete category.dataValues.createdAt;
        res.status(201).send({
          status: "success",
          data: { category },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

function updateCategory(req, res) {
  const id = req.params.id;
  const category = req.body;

  const schema = Joi.object({
    name: Joi.string().min(2).required(),
  });

  const { error } = schema.validate(category);

  if (error)
    return res
      .status(400)
      .send({ error: { message: error.details[0].message } });

  categoryDao
    .findById(id)
    .then((category) => {
      if (!category)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
      for (const [key, value] of Object.entries(req.body)) {
        category.dataValues[key] = value;
      }
      categoryDao
        .update(req.body, id)
        .then(() => {
          res.status(200).json({
            message: "Category updated successfully",
            data: { category },
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

function deleteCategory(req, res) {
  const id = req.params.id;
  categoryDao
    .findById(id)
    .then((category) => {
      if (!category)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
      categoryDao
        .deleteById(id)
        .then((category) => {
          res.status(200).json({
            message: "Category deleted successfully",
            data: { category },
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

module.exports = categoryController;
