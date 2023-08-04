import './style.css';
export const $ = (element: string) => document.querySelector(element);

function renderMessage(data: string) {
  const messagesWrapper = $('#messages') as HTMLFormElement;
  let date = new Date();
  let formatter1 = new Intl.DateTimeFormat('ru', {
    month: 'long',
    day: 'numeric',
  });
  let formatter2 = new Intl.DateTimeFormat('ru', {
    hour: 'numeric',
    minute: 'numeric',
  });
  messagesWrapper.innerHTML += `
    <div class="message my">
      <div class="message_metric">${formatter2.format(
        date,
      )}<br />${formatter1.format(date)}</div>
      <div class="message_text">
        ${data}
      </div>
      <div class="user_avatar user_avatar_small"></div>
    </div>`;
}

// function connect() {
//   const socket = io("http://localhost:5000");
//   //socket.on("connect", () => console.log(socket.id));
//   socket.on("connect_error", () => {
//     console.error("connection error, reconnecting...");
//     setTimeout(() => socket.connect(), 5000);
//   });
//   // socket.on("hehe", (data) => console.log(data));
//   socket.on("disconnect", () => console.error("server disconnected"));
//   socket.on("message", (data) =>
//     data.trim() !== "" ? renderMessage(data.trim()) : false
//   ); //обрабатываю, что пришло
// }

// async function handleSumbit(e: Event) {
//   e.preventDefault();
//   const formData = new FormData(e.target as HTMLFormElement);
//   const textArea = $("#message_text") as HTMLFormElement;
//   textArea.value = "";
//   const data = transformFormData(formData);
//   await axios.post("http://localhost:5000/messages", data);
// }

// const messageForm = $("#chat_form") as HTMLFormElement;
// messageForm.addEventListener("submit", handleSumbit);

// window.onload = connect;

// ############################################## //
import socket from './socket';
import { v1 } from 'uuid';

let selectedUser: any;

const temporary_registrition = $('#temporary_registrition');
const username = document.querySelectorAll('.username');
const account = $('#account');
const my_name = $('#my_name');
const reg_btns = $('#reg_btns');

function login() {
  if (my_name) {
    socket.auth = { username: my_name.textContent };
    socket.connect();
  } else {
    alert('Пользователь не найден');
  }
}

username.forEach((e) => {
  e.addEventListener('click', (e) => {
    if (my_name) my_name.innerHTML = e.currentTarget.textContent;
    temporary_registrition?.classList.add('none');
    reg_btns?.classList.add('none');
    account?.classList.remove('none');
    login();
  });
});

socket.on(
  'user connected',
  (socket) => (selectedUser = (socket as any).username),
);
const send = document.getElementById('send');

function messageSend(content: string) {
  console.log("сообщение для " + selectedUser);
  if (selectedUser) {
    socket.emit('private message', {
      content,
      to: selectedUser,
    });
    // selectedUser.messages.push({
    //   content,
    //   fromSelf: true,
    // });
  }
}

socket.on('private message', ({ content, from }) => {
  // for (let i = 0; i < this.users.length; i++) {
  //   const user = this.users[i];
  //   if (user.userID === from) {
  //     user.messages.push({
  //       content,
  //       fromSelf: false,
  //     });
  //     if (user !== this.selectedUser) {
  //       user.hasNewMessages = true;
  //     }
  //     break;
  //   }
  // }
  console.log('сообщение от ' + from);
});

send?.addEventListener('click', () => {
  messageSend('54321');
});
