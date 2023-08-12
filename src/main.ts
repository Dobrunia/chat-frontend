import './style.css';
import socket from './socket';
import { v1 } from 'uuid';

export const $ = (element: string) => document.querySelector(element);

const temporary_users = $('#temporary_users');
export type UsersArray = [
  {
    userID: string;
    username: string;
    avatar: string;
  },
];
let usersArray: UsersArray;
import { getIn, renderMessage } from './render';
(function getUsers() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:5000/users', false);
  xhr.onloadend = function () {
    if (xhr.status == 200) {
      usersArray = JSON.parse(xhr.responseText);
      //renderAccounts(users); //TODO::почему срабатывает 2жды?
      const temporary_registrition = $('#temporary_registrition');
      temporary_registrition.innerHTML = '';
      usersArray.forEach((e) => {
        temporary_registrition &&
          (temporary_registrition.innerHTML += `<button class="username">${e.username}</button>`);
      });
      getIn();
    }
  };
  xhr.send();
})();
export function login(username: string) {
  socket.auth = { username };
  socket.connect();
  console.log('Пользователь ' + username + ' подключился');
}

let selectedUser: any;
function selectMessageTo() {
  document.querySelectorAll('.chats_with').forEach((elem) => {
    elem.addEventListener('click', (e) => {
      selectedUser = (e.currentTarget as HTMLElement).textContent;
    });
  });
}
socket.on('user connected', (socket) => {
  console.log(
    'в чат зашёл ' + socket.username + ' ID: ' + (socket as any).userID,
  );
});

function updateUsers(users: any) {
  if (temporary_users) temporary_users.innerHTML = '';
  users.forEach((e) => {
    if (temporary_users) {
      temporary_users.innerHTML +=
        '<button class="chats_with">' + e.username + '</button>';
    }
  });
  selectMessageTo();
}

socket.on('users', (users) => {
  usersArray = users;
  users.forEach((user) => {
    user.self = user.userID === socket.id;
    //console.log(user.self);
  });
  // put the current user first, and then sort by username
  usersArray = users.sort((a, b) => {
    if (a.self) return -1;
    if (b.self) return 1;
    if (a.username < b.username) return -1;
    return a.username > b.username ? 1 : 0;
  });
  updateUsers(usersArray);
});

function sendMessage(content: string) {
  //console.log('сообщение для ' + selectedUser);
  let selectedUserID = null;
  usersArray.forEach((elem) => {
    if (selectedUser === elem.username) {
      selectedUserID = elem.userID;
      //console.log(elem.username + ' ' + elem.userID);
    }
  });
  if (selectedUserID) {
    socket.emit('private message', {
      content,
      to: selectedUserID,
    });
  }
}

socket.on('private message', (message) => {
  //renderMessage(content);
  console.log('сообщение от ' + message.from + ' написал: ' + message.content);
});

const send = document.getElementById('send');
send?.addEventListener('click', () => {
  sendMessage('54321');
  //console.log("сообщение отправил на сервер")
});
