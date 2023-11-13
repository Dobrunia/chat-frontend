import socket from './socket.js';

export class SocketService {
  // status(userId: string) {
  //   socket.auth = { userId };
  //   socket.connect();
  //   socket.on('user online', (socket) => {
  //     //event и в базу
  //   });
  // }

  startChat(chatId: string, userId: string) {
    socket.auth = { chatId, userId };
    socket.connect();
    //console.log('зашли в чат ' + userId + ' подключился');
    socket.on('user connected', (socket) => {
      console.log(socket);
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
