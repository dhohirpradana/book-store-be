// import models
const { Chat, User, Profile } = require("../../models");
const userDao = require("../daos/user");
const chatDao = require("../daos/chat");
const jwt = require("jsonwebtoken");
const tokenKey = process.env.TOKEN_KEY;

let connectedUser = {};

const socketIo = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    userId = jwt.verify(token, tokenKey).id;
    connectedUser[userId] = socket.id;
    if (socket.handshake.auth && socket.handshake.auth.token) {
      next();
    } else {
      next(new Error("Not Authorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("client connect: ", socket.id);

    // define listener on event load admin contact
    socket.on("load admin contact", () => {
      console.log("load admin");
      userDao.findAllAdmin().then((admins) => {
        try {
          socket.emit("admin contact", admins);
        } catch (err) {
          console.log(err);
        }
      });
    });

    // define listener on event load customer contact
    socket.on("load customer contacts", () => {
      console.log("load customers");
      userDao.findAllCustomer().then((customers) => {
        try {
          socket.emit("customer contacts", customers);
        } catch (err) {
          console.log(err);
        }
      });
    });

    socket.on("load messages", async (payload) => {
      console.log("load message: ", payload);
      const token = socket.handshake.auth.token;
      userId = jwt.verify(token, tokenKey).id;
      try {
        const senderId = userId;
        const recipientId = payload;

        chatDao.findAll(recipientId, senderId).then((data) => {
          socket.emit("messages", data);
        });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("send message", async (payload) => {
      const token = socket.handshake.auth.token;
      userId = jwt.verify(token, tokenKey).id;
      console.log("send message: ", userId);
      try {
        const senderId = userId;
        const { recipientId, message } = payload;
        console.log(senderId, recipientId);

        const data = { senderId, recipientId, message };

        await chatDao.create(data);

        io.to(socket.id).to(connectedUser[recipientId]).emit("new message");
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", () => {
      console.log("client disconnect");
    });
  });
};

module.exports = socketIo;
