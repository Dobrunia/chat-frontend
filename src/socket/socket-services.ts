import socket from './socket';

class SocketService {
  login(username: string) {
    socket.auth = { username };
    socket.connect();
    console.log('Пользователь ' + username + ' подключился');
    socket.on('user connected', (socket) => {
      console.log(typeof (socket as any).userId);
      console.log(
        'в чат зашёл ' + socket.username + ' ID: ' + (socket as any).userId,
      );
    });
    socket.on('private message', (message) => {
      //renderMessage(content);
      console.log(
        'сообщение от ' + message.from + ' написал: ' + message.content,
      );
    });
  }

  sendMessage(content: string, chatId: number) {
    socket.emit('private message', {
      content,
      to: chatId,
    });
  }
}
export default new SocketService();
// let selectedUser: any;
// function selectMessageTo() {
//   document.querySelectorAll('.chats_with').forEach((elem) => {
//     elem.addEventListener('click', (e) => {
//       selectedUser = (e.currentTarget as HTMLElement).textContent;
//     });
//   });
// }

// const send = document.getElementById('send');
// send?.addEventListener('click', () => {
//   sendMessage('54321');
//   console.log('сообщение отправил на сервер');
// });
