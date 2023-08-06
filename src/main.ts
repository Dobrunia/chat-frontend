import './style.css';
import socket from './socket';
import { v1 } from 'uuid';

export const $ = (element: string) => document.querySelector(element);

const temporary_users = $('#temporary_users');
export type usersArray = {
  userID: string;
  username: string;
  avatar: string;
};
import { getIn } from './render';
(function getUsers() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:5000/users', false);
  xhr.onloadend = function () {
    if (xhr.status == 200) {
      const users = JSON.parse(xhr.responseText);
      //renderAccounts(users); //TODO::почему срабатывает 2жды?
      const temporary_registrition = $('#temporary_registrition');
      temporary_registrition.innerHTML = '';
      users.forEach((e) => {
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
socket.on('user connected', (socket) => {
  console.log('в чат зашел ' + (socket as any).username);
});

function updateUsers(users: any) {
  if (temporary_users) temporary_users.innerHTML = '';
  users.forEach((e) => {
    if (temporary_users) {
      temporary_users.innerHTML += '<button>' + e.username + '</button>';
    }
  });
}

socket.on('users', (users) => {
  users.forEach((user) => {
    user.self = user.userID === socket.id;
  });
  // put the current user first, and then sort by username
  users = users.sort((a, b) => {
    if (a.self) return -1;
    if (b.self) return 1;
    if (a.username < b.username) return -1;
    return a.username > b.username ? 1 : 0;
  });
  updateUsers(users);
});

function messageSend(content: string) {
  console.log('сообщение для ' + selectedUser);
  if (selectedUser) {
    socket.emit('private message', {
      content,
      to: selectedUser,
    });
  }
}

socket.on('private message', ({ content, from }) => {
  console.log('сообщение от ' + from + ' написал: ' + content);
});

const send = document.getElementById('send');
send?.addEventListener('click', () => {
  messageSend('54321');
});
