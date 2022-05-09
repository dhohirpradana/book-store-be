const { Chat } = require("../../models");
const { Op } = require("sequelize");

const chatDao = {
  findAll,
  create,
};

async function findAll(recipientId, senderId) {
  return await Chat.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    where: {
      recipientId: {
        [Op.or]: [recipientId, senderId],
      },
      senderId: {
        [Op.or]: [recipientId, senderId],
      },
    },
    order: [["createdAt", "ASC"]],
  });
}

async function create(data) {
  var newchat = new Chat(data);
  return await newchat.save();
}

module.exports = chatDao;
