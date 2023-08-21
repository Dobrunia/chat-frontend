import './style.css';
import './registration-authorization/reg_auth.css';
import { isUserLoggedIn, userIn } from './utils/main-page-service';

export const $ = (element: string) =>
  document.querySelector(element) as HTMLFormElement;

if (isUserLoggedIn()) {
  userIn();
}

// import socket from './socket';

// export function login(username: string) {
//   socket.auth = { username };
//   socket.connect();
//   console.log('Пользователь ' + username + ' подключился');
// }

// let selectedUser: any;
// function selectMessageTo() {
//   document.querySelectorAll('.chats_with').forEach((elem) => {
//     elem.addEventListener('click', (e) => {
//       selectedUser = (e.currentTarget as HTMLElement).textContent;
//     });
//   });
// }
// socket.on('user connected', (socket) => {
//   console.log(typeof((socket as any).userId))
//   console.log(
//     'в чат зашёл ' + socket.username + ' ID: ' + (socket as any).userId,
//   );
// });

// socket.on('users', (users) => {
//   usersArray = users;
//   users.forEach((user) => {
//     user.self = user.userId === socket.id;
//     //console.log(user.self);
//   });
//   // put the current user first, and then sort by username
//   usersArray = users.sort((a, b) => {
//     if (a.self) return -1;
//     if (b.self) return 1;
//     if (a.username < b.username) return -1;
//     return a.username > b.username ? 1 : 0;
//   });
//   updateUsers(usersArray);
// });

// function sendMessage(content: string) {
//   //console.log('сообщение для ' + selectedUser);
//   let selectedUserID = null;
//   console.log("selectedUserID " + selectedUser + "type " + typeof(selectedUser))
//   usersArray.forEach((elem) => {
//     if (selectedUser === elem.username) {
//       selectedUserID = elem.userId;
//       //console.log(elem.username + ' ' + elem.userId);
//     }
//   });
//   if (selectedUserID) {

//     socket.emit('private message', {
//       content,
//       to: selectedUserID,
//     });
//   }
// }

// socket.on('private message', (message) => {
//   //renderMessage(content);
//   console.log('сообщение от ' + message.from + ' написал: ' + message.content);
// });

// const send = document.getElementById('send');
// send?.addEventListener('click', () => {
//   sendMessage('54321');
//   console.log("сообщение отправил на сервер")
// });
