import { Server } from "socket.io";

const io = new Server({
    cors:{
        origin:"http://localhost:3000",
    },
});

let onlineUsers = [];

const addNewUser = (username, socketId) => {
    !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
    return onlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {


    console.log(socket.id);

    socket.on("newUser", (username) => {
        addNewUser(username, socket.id);
    });

    socket.on("sendNotification",({ senderName, recieverName, type }) => {
        const reciever = getUser(recieverName);
        io.to(reciever.socketId).emit("getNotification",{
            senderName,
            type,
        });
    });

    socket.on("disconnect", () => {
        removeUser(socket.id);
    });
});

io.listen(5000);