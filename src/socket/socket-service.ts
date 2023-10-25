import socket from './socket';

export class SocketService {
  // login(email: string) {
  //   socket.auth = { email };
  //   socket.connect();
  //   console.log('Пользователь ' + email + ' подключился');
  //   socket.on('user connected', (socket) => {
  //     console.log(typeof (socket as any).userId);
  //     console.log('в чат зашёл ' + (socket as any).userId);
  //   });
  //   socket.on('private message', (message) => {
  //     let event = new CustomEvent('newMessage', {
  //       detail: { message },
  //       bubbles: true,
  //       cancelable: true,
  //       composed: false,
  //     });
  //     document.dispatchEvent(event);
  //   });
  // }

  startChat(chatId: string, userId: string) {
    socket.auth = { chatId, userId };
    socket.connect();
    //console.log('зашли в чат ' + userId + ' подключился');
    socket.on('user connected', (socket) => {
      // console.log('в чат  ' + (socket as any).chatId);
      // console.log('в чат зашёл ' + (socket as any).userId);
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

  sendMessage(content: string, chatId: string, userId: string) {
    socket.emit('private message', {
      content,
      to: chatId,
    });
    let message = {
      chatId,
      content,
      from: userId,
    };
    let event = new CustomEvent('newMessage', {
      detail: { message },
      bubbles: true,
      cancelable: true,
      composed: false,
    });
    document.dispatchEvent(event);
  }
}
export default new SocketService();
