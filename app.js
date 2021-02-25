const express = require("express");
const app = express();
const PORT = 4000;
const cookieParser = require("cookie-parser");
const socketIO = require("socket.io");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();

app.use("/assets", express.static("assets"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));

app.set("view engine", "pug");

app.get('/', (req, res)=> {
    res.render("home");
});

app.post("/", (req, res)=> {
    const user_data = req.body;
    data.push(user_data);
    res.send(data);
});


const server = app.listen(PORT, ()=>{
    console.log(`✅ SERVER RUNNING AT ${PORT}`)
});


const io = socketIO(server);

let users = [];

io.on("connection", socket => {
    setInterval(()=> {
        socket.emit("addUsers", { 
            users : users 
        });
        socket.broadcast.emit("addUsers", {
            users : users
        });
    }, 1000);
    
    socket.on("msg", ({ msg }) => {
        socket.emit("handleChat", { myMsg : msg });
        socket.broadcast.emit("handleChat", { 
            msg, 
            nickname: socket.nickname 
        });
    });

    socket.on("nickname", ({ nickname })=> {
        socket.nickname = nickname || "Anonymous";
        socket.broadcast.emit("welcomeMsg", {
            nickname
        });
        users.push(socket.nickname);
    });

    //참여자가 접속을 끊으면 disconnect 이벤트가 발생함.
    socket.on("disconnect", ()=> {
        nickname = socket.nickname;
        socket.broadcast.emit("goodbyeMsg", {
            nickname
        });
        users.splice(users.indexOf(nickname),1);
    });
});

