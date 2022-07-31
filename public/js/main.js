const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// get username and room from url, we are using qs cdn for getting query string
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// console.log(username, room);

const socket = io();

// join char room
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
//   console.log(message);
  outputMessage(message);

  //for scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit - chat.html - chat box to type
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //we are getting message text,  msg is the id of the input message
  const msg = e.target.msg.value;

  // emitting a message to server
  socket.emit("chatMessage", msg);

  //clear input
  e.target.msg.value = ``;
  e.target.msg.focus();
});

// output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message"); // here message is the class name ->attributes and styles
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time} </span></p>
    <p class="text">
        ${message.text}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  users.map((user) => console.log(user.username));
  userList.innerHTML = `${users.map((user) => `<li>${user.username}</li>`).join('')}`;
}
