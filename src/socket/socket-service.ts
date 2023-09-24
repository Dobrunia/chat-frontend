import socket from './socket';

class SocketService {
  login(email: string) {
    socket.auth = { email };
    socket.connect();
    console.log('Пользователь ' + email + ' подключился');
    socket.on('user connected', (socket) => {
      console.log(typeof (socket as any).userID);
      console.log('в чат зашёл ' + (socket as any).userID);
    });
    socket.on('private message', (message) => {
      let event = new CustomEvent('newMessage', {
        detail: { message },
        bubbles: true,
        cancelable: true,
        composed: false,
      });
      document.dispatchEvent(event);
    });
  }

  sendMessage(content: string, chatId: string) {
    socket.emit('private message', {
      content,
      to: chatId,
    });
    let message = {
      content,
      from: 'me',
    };
    let event = new CustomEvent('newMessage', {
      detail: { message },
      bubbles: true,
      cancelable: true,
      composed: false,
    });
    document.dispatchEvent(event);//TODO:: видимо тут сохраняем в базу
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
