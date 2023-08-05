import './style.css';
import socket from './socket';
import { v1 } from 'uuid';

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

const temporary_users = $('#temporary_users');

export function login(username: string) {
  socket.auth = { username: username };
  socket.connect();
  console.log('Пользователь ' + username + ' подключился');
}

let selectedUser: any;
let ggg: any[];
socket.on('user connected', (socket) => {
  console.log('в чат зашел ' + (socket as any).username);
  ggg.push({
    userID: (socket as any).userID,
    username: (socket as any).username,
  });
  updateUsers(ggg);
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
  console.log('users');
  ggg = users;
  updateUsers(ggg);
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
