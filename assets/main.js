let user_chat = document.querySelector(".user_chat");
let chat_box = document.querySelector(".chatBox");
let user_name = document.querySelector(".user_name");
let user_nickname_controller = document.querySelector(".chat_controller_userNone_display");
let user_chat_controller = document.querySelector(".chat_controller_user");
let user_box = document.querySelector(".showUsers");

const socket = io("/");
let i = 1;

const sendMsg = () => {
    let msg = user_chat.value;
    socket.emit("msg", { msg });
};

const addUsers = (data) => {
    const users = data.users;
    if(users.length === i){
        //어떻게하면 생성이 아닌 수정으로 바꿀 수 있을까...?
        let user_text_box = document.createElement("span");
        user_text_box.textContent=users[users.length-1];
        user_box.appendChild(user_text_box);
        i++;
    }
};

const setNickname = () => {
    let nickname = user_name.value;
    socket.emit("nickname", { nickname });
    user_nickname_controller.classList.remove("chat_controller_userNone_display");
    user_nickname_controller.classList.add("chat_controller_userNone");
    user_chat_controller.classList.remove("chat_controller_user");
    user_chat_controller.classList.add("chat_controller_user_display");
};

const handleWelcome = (data) => {
    let welcomeMsg = document.createElement("div");
    welcomeMsg.classList.add("welcomeText");
    welcomeMsg.textContent=`${data.nickname}님이 참여했습니다.`;
    chat_box.appendChild(welcomeMsg);
};

const handleGoodbye = (data) => {
    const leavedUser = data.nickname;
    if(leavedUser){
        let welcomeMsg = document.createElement("div");
        welcomeMsg.classList.add("welcomeText");
        welcomeMsg.textContent=`${leavedUser}님이 퇴장했습니다.`;
        chat_box.appendChild(welcomeMsg);
    }
}

const handleChat = (data) => {
    let text_box = document.createElement("div");
    let my_text = document.createElement("div");
    let chat = data.msg;
    let myChat = data.myMsg;
    let nickname = data.nickname;
    if(myChat){
        my_text.classList.add("myText");
        my_text.textContent=`${myChat}`;
        chat_box.appendChild(my_text);
    };
    if(chat){
        text_box.classList.add("other_text");
        text_box.textContent=`${nickname} : ${chat}`;
        chat_box.appendChild(text_box);
    };
    user_chat.value = "";
};



socket.on("welcomeMsg", handleWelcome);
socket.on("handleChat", handleChat);
socket.on("goodbyeMsg", handleGoodbye);
socket.on("addUsers", addUsers);

