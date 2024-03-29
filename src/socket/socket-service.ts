import socket from './socket.js';

export class SocketService {
  // status(userId: string) {
  //   socket.auth = { userId };
  //   socket.connect();
  //   socket.on('user online', (socket) => {
  //     //event и в базу
  //   });
  // }

  connectUserToSocketServer(userId: string) {
    socket.auth = { userId };
    socket.connect();
    socket.on('user connected', (socket) => {
      // console.log(socket.userId);
      let connect = new CustomEvent('user online', {
        detail: { id: socket.userId },
        bubbles: true,
        cancelable: true,
        composed: false,
      });
      document.dispatchEvent(connect);
    });   
    // socket.on('user disconnected', (socket) => {
    //   let disconnect = new CustomEvent('user disconnected', {
    //     detail: { id: socket.userId },
    //     bubbles: true,
    //     cancelable: true,
    //     composed: false,
    //   });
    //   document.dispatchEvent(disconnect);
    // });
    socket.on('private message', (message) => {
      let event = new CustomEvent('newMessage', {
        detail: { message },
        bubbles: true,
        cancelable: true,
        composed: false,
      });
      document.dispatchEvent(event);
      // Отправка push-уведомления
      if (Notification.permission === 'granted' && message.from.toString() !== localStorage.getItem('id')) {
        const notification = new Notification('Новое сообщение', {
          body: message.content,
          // Дополнительные параметры, если необходимо
        });
      }
    });   
  }

  startChat(chatId: string) {
    socket.emit('join', chatId);
  }

  sendMessage(content: string, chatId: string) {
    socket.emit('private message', {
      content,
      to: chatId,
    });
    // let message = {
    //   chatId,
    //   content,
    //   from: userId,
    // };
    // let event = new CustomEvent('newMessage', {
    //   detail: { message },
    //   bubbles: true,
    //   cancelable: true,
    //   composed: false,
    // });
    // document.dispatchEvent(event);
  }
}
export default new SocketService();
