import socketService from '../../socket/socket-service.ts';
import {
  getMessages,
  createNewChat,
  writeNewUserInChat,
  findUserById,
  findChatByUserId,
} from './messenger_request.js';
import { getUsersChats } from '../general_request.js';
import { getAndRenderMyInfo, unescapeSql, checkIfPast15Minutes } from '../general.js';
import { DateTime } from 'luxon';

const $ = (element) => document.querySelector(element);
async function start() {
  await getAndRenderMyInfo();
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  //let chatId = urlParams.get('chatId');
  let companionId = urlParams.get('id');
  const chatId = await findChatByUserId(companionId);
  if (chatId[0]) {
    await selectChatHandler(null, chatId[0].id);
  }
  if (companionId && !chatId[0]) {
    await renderChatId(companionId);
  }
  await renderChats();
  $('#spinner_wrapper').classList.add('none');
}
start();

/**
 * Функция, которая будет скроллить блок переписки вниз
 */
function scrollChatToBottom() {
  const chatContainer = $('#messages');
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * рендер пользователя с которым переписка
 */
function renderChatHeader(chatId, companionData) {
  const dialogue_with_wrapper = $('#dialogue_with_wrapper');
  dialogue_with_wrapper.innerHTML = '';
  dialogue_with_wrapper.innerHTML = `
          <div class="dialogue_with_text">
            <div class="dialogue_with_name" id="data_chatID" data-chatId="${chatId}">${
    companionData.username
  }</div>
            <div class="last_entrance">последний онлайн: ${DateTime.fromISO(companionData.status).toLocaleString({ month: 'long', day: 'numeric' })} в ${DateTime.fromISO(companionData.status).toLocaleString({ hour: 'numeric', minute: 'numeric' })}</div>
          </div>
          <div class="user_avatar user_avatar_small">
          <a href="${
            import.meta.env.VITE_SRC +
            'pages/profile_page/profile.html?id=' +
            companionData.id
          }">
            <img id="user_header" class="user_avatar_img openProfile" src="${
              unescapeSql(companionData.avatar)
            }" alt="" data-id="${companionData.id}" data-username="${
    companionData.username
  }" title="${companionData.username}"/>
            <div class="status ${'online_'+ companionData.id} ${checkIfPast15Minutes(companionData.status) ? 'statusOffline' : 'statusOnline'}"></div>
            </a>
          </div>`;
}

/**
 * создания chatId если он отсутствует
 */
async function renderChatId(companionId) {
  const newPrivateChatId = await createNewChat(true);
  const request1 = writeNewUserInChat(newPrivateChatId);
  const request2 = writeNewUserInChat(newPrivateChatId, companionId);
  if ((await request1) && (await request2)) {
    await selectChatHandler(null, newPrivateChatId);
    socketService.startChat(newPrivateChatId);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    urlParams.set('chatId', newPrivateChatId);
    const newUrl = window.location.pathname + '?' + urlParams.toString();
    window.history.pushState({}, '', newUrl);
  }
}

/**
 * рендер ативных чатов пользователя
 */
export async function renderChats() {
  const jsonData = await getUsersChats();
  const chat_search = document.querySelector('#chat_search');
  const users = $('#users');
  users.innerHTML = '';
  jsonData.sort((a, b) => {
    const dateA = new Date(a.datetime);
    const dateB = new Date(b.datetime);
    return dateB - dateA;
  });
  jsonData.forEach((element) => {
    const messageDate = new Date(element.datetime);
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const isMessageThisWeek = messageDate > oneWeekAgo;
    let formattedTime = ''; // Переменная для хранения форматированной даты и времени
    if (isMessageThisWeek) {
      formattedTime = messageDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }); // Формат часы, минуты
    } else {
      formattedTime = messageDate.toLocaleDateString(); // Формат день, месяц, год
    }
    //<div class="line"></div>
    const content = `<div class="user openDialog" title="${
      element.name
    }" data-id="${element.userId}" data-username="${
      element.name
    }" data-email="${element.userEmail}" data-avatar="${
      element.avatar
    }" data-chatId="${element.chatId}">
          <div class="user_avatar user_avatar_small">
            <a href="${
              import.meta.env.VITE_SRC +
              'pages/profile_page/profile.html?id=' +
              element.userId
            }">
              <img class="user_avatar_img" src="${unescapeSql(element.avatar)}" alt=""/>
              <div class="status ${'online_'+ element.userId} ${checkIfPast15Minutes(element.status) ? 'statusOffline' : 'statusOnline'}"></div>
            </a>
          </div>
          <div class="user_info">
            <div class="user_name"><strong>${element.name}</strong></div>
            <div class="user_last_message" title="${element.last_message}">${
      element.last_message
    }</div>
          </div>
          <div class="user_metric">
            <span>${element.notifications}</span>
            <div>${formattedTime}</div>
          </div>
        </div>`;
    if (chat_search.value) {
      const regex = new RegExp(chat_search.value, 'gi');
      const matches = element.name.match(regex);
      if (matches) {
        users.innerHTML += content;
      }
    } else {
      users.innerHTML += content;
    }
  });
  const openDialogs = document.querySelectorAll('.openDialog');
  openDialogs.forEach((dialog) => {
    //dialog.addEventListener('click', startChatingHandler);
    dialog.addEventListener('click', async () => {
      let userId = dialog.getAttribute('data-id');
      let chatId = dialog.getAttribute('data-chatId');
      // window.location.href = `${
      //   import.meta.env.VITE_SRC
      // }pages/messenger_page/messenger.html?chatId=${chatId}`;
      let queryString = window.location.search;
      let urlParams = new URLSearchParams(queryString);
      urlParams.set('id', userId);
      urlParams.set('chatId', chatId);
      let newUrl = window.location.pathname + '?' + urlParams.toString();
      window.history.pushState({}, '', newUrl);
      await selectChatHandler(null, urlParams.get('chatId'));
    });
  });
}

/**
 * рендер сообщений
 * @param content текст сообщения
 */
export function renderMessage(message) {
  const isMyMessage = message.sendBy.toString() === localStorage.getItem('id');
  const messagesWrapper = $('#messages');
  let formatter1 = new Intl.DateTimeFormat('ru', {
    month: 'long',
    day: 'numeric',
  });
  let formatter2 = new Intl.DateTimeFormat('ru', {
    hour: 'numeric',
    minute: 'numeric',
  });
  let user = `
    <div class="user_avatar user_avatar_small" title="${
      isMyMessage
        ? localStorage.getItem('username')
        : document.getElementById('user_header').getAttribute('data-username')
    }">
    <a href="${
      import.meta.env.VITE_SRC +
      'pages/profile_page/profile.html?id=' +
      (isMyMessage ? localStorage.getItem('id') : message.sendBy)
    }">
      <img class="user_avatar_img openProfile" src="${
        isMyMessage
          ? localStorage.getItem('avatar')
          : document.getElementById('user_header').src
      }" data-id="${
    isMyMessage ? localStorage.getItem('id') : message.sendBy
  }" alt=""/>
      </a>
    </div>`;
  messagesWrapper.innerHTML += `
      <div class="message ${isMyMessage ? 'my' : 'from'}">
      ${isMyMessage ? '' : user}
        <div class="message_metric">${DateTime.fromISO(message.datetime).toLocaleString({ month: 'long', day: 'numeric' })}
        <br />${DateTime.fromISO(message.datetime).toLocaleString({ hour: 'numeric', minute: 'numeric' })}</div>
        <div class="message_text">
          ${message.content}
        </div>
        <div class="user_avatar user_avatar_small"></div>
        ${isMyMessage ? user : ''}
      </div>`;
  scrollChatToBottom('renderChats');
}

/**
 * отправка сообщений по клику
 */
function messageHandler(event) {
  event.preventDefault();
  // const chatID = 'lents@mail.ru';
  try {
    const chatID = $('#data_chatID').getAttribute('data-chatid');
    const content = $('#message_text').value.trim();
    if (!chatID || content == '') {
      announcementMessage('Не отправляйте пустые сообщения');
    } else {
      socketService.sendMessage(content, chatID);
      $('#message_text').value = '';
    }
  } catch (e) {
    announcementMessage('Выберите собеседника');
  }
}

/**
 * обработка клика по чату с собеседником
 */
export async function selectChatHandler(elem, chatId) {
  let companionData;
  if (elem === null) {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    companionData = await findUserById(urlParams.get('id'));
  } else {
    companionData = {
      id: elem.getAttribute('data-id'),
      username: elem.getAttribute('data-username'),
      email: elem.getAttribute('data-email'),
      avatar: elem.getAttribute('data-avatar'),
    };
  }
  //$('#messages_wrapper').style.backgroundImage = "url('./img/ChatbackG.png')";
  $('#messages_wrapper').innerHTML = `<div class="messages" id="messages">
  <!-- <div class="message from">
    <div class="user_avatar user_avatar_small"></div>
    <div class="message_text">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste,
      laudantium praesentium obcaecati facere et hic quia corrupti enim!
      Veritatis praesentium dolorum quo nostrum dicta sit tenetur
      possimus doloribus cupiditate consequuntur. Lorem ipsum dolor sit
      amet consectetur adipisicing elit. Iste, laudantium praesentium
      obcaecati facere et hic quia corrupti enim! Veritatis praesentium
      dolorum quo nostrum dicta sit tenetur possimus doloribus
      cupiditate consequuntur. Lorem ipsum dolor sit amet consectetur
      adipisicing elit. Iste, laudantium praesentium obcaecati facere et
      hic quia corrupti enim! Veritatis praesentium dolorum quo nostrum
      dicta sit tenetur possimus doloribus cupiditate consequuntur.
    </div>
    <div class="message_metric">12:00 PM<br />Aug 13</div>
  </div>
  <div class="message my">
    <div class="message_metric">12:00 PM<br />Aug 13</div>
    <div class="message_text">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste,
      laudantium praesentium obcaecati facere et hic quia corrupti enim!
      Veritatis praesentium dolorum quo nostrum dicta sit tenetur
      possimus doloribus cupiditate consequuntur.
    </div>
    <div class="user_avatar user_avatar_small"></div>
  </div> -->
</div>
<form class="message_send" id="chat_form">
  <input
    class="message_text_value"
    id="message_text"
    type="text"
    name="message"
    placeholder="Ваше сообщение..."
    required="true"
    autocomplete="off"
  />
  <input
    class="message_submit btn btn-warning"
    type="submit"
    name="submit"
    value="Отправить"
  />
</form>`;
  $('#messages').innerHTML = '';
  /**
   * отправка сообщений по кнопке
   */
  $('#chat_form').addEventListener('submit', messageHandler);
  renderChatHeader(chatId, companionData);
  const messages = await getMessages(chatId);
  messages.forEach((message) => {
    renderMessage(message);
  });
}

/**
 * обработка клика для начала переписки
 */
async function startChatingHandler(event) {
  const targetElement = event.target;
  if (!targetElement.classList.contains('openProfile')) {
    //добавлять в div класс openDialog и атрибут data-chatId или data-id="${user.id}" data-email="${user.email}"
    const currentElement = targetElement.closest('.openDialog');
    const chatId = currentElement?.getAttribute('data-chatId');
    chatId !== 'null'
      ? await selectChatHandler(currentElement, chatId)
      : await renderChatId();
    // await selectChatHandler(null, currentElement?.getAttribute('data-chatId'))
  }
}
