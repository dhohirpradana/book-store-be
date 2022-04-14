const { Chat, Role, Profile, Gender } = require("../../models");
const { Op } = require("sequelize");

const chatDao = {
  findAll,
  create,
};

async function findAll(idRecipient, idSender) {
  return await Chat.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    where: {
      idRecipient: {
        [Op.or]: [idRecipient, idSender],
      },
      idSender: {
        [Op.or]: [idRecipient, idSender],
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
