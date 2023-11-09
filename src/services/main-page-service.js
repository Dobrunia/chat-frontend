import {
  globalClickAnimation,
  hideConfirmationMenu,
  hideSections,
  logInView,
  logOutView,
  scrollChatToBottom,
  showAnnouncementMenu,
  showConfirmationMenu,
  showUserInfoEditWindow,
} from '../animation.js';
import debounce from 'lodash/debounce';
import { $api } from '../http/api.ts';
import socketService from '../socket/socket-service.ts';
import { makeCats } from '../pages/cats.js';

export const $ = (element) => document.querySelector(element);

/**
 * проверка и авторизация пользователя
 */
export async function isUserLoggedInCheck() {
  try {
    const userId = localStorage.getItem('id');
    if (userId) {
      const userData = await findUserById(userId);
      if (userData !== null) {
        userIn();
      }
    }
  } catch (eror) {
    userOut();
    return console.log('ошибку при входе отловил');
  }
}

/**
 * функция генерации chatID
 */
// function generateChatID(companionEmail: string) {
//   const myEmail = localStorage.getItem('email');
//   const emails = [myEmail, companionEmail];
//   const sortedEmails = emails.sort();
//   return sortedEmails[0] + sortedEmails[1] + '';
// }

/**
 * рендер пользователя с которым переписка
 */
function renderChatHeader(chatId, companionData) {
  const dialogue_with_wrapper = $('#dialogue_with_wrapper');
  dialogue_with_wrapper.innerHTML = '';
  dialogue_with_wrapper.innerHTML = `
        <div class="dialogue_with_text">
          <div class="dialogue_with_name" id="data_chatID" data-chatId="${chatId}">${companionData.username}</div>
          <div class="last_entrance">был в сети час назад</div>
        </div>
        <div class="user_avatar user_avatar_small">
          <img class="user_avatar_img openProfile" src="${companionData.avatar}" alt="" data-id="${companionData.id}" title="${companionData.username}"/>
          <div class="status"></div>
        </div>`;
}

/**
 * рендер переписки с собеседником
 */
async function renderMessages(chatId, companionData) {
  $api
    .get(`/getMessagesByChatId/${chatId}`)
    .then((response) =>
      response.data.forEach((message) => {
        renderMessage(message);
      }),
    )
    .catch((error) => console.log('Ошибка:', error));
}

/**
 * обработка клика по чату с собеседником
 */
async function selectChatHandler(elem, chatId) {
  const companionData = {
    id: elem.getAttribute('data-id'),
    username: elem.getAttribute('data-username'),
    email: elem.getAttribute('data-email'),
    avatar: elem.getAttribute('data-avatar'),
  };
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
  />
  <input
    class="message_submit btn btn-warning"
    type="submit"
    name="submit"
    value="Отправить"
  />
</form>`;
  $('#messages').innerHTML = '';
  socketService.startChat(chatId, localStorage.getItem('id'));
  /**
   * отправка сообщений по кнопке
   */
  $('#chat_form').addEventListener('submit', messageHandler);
  renderChatHeader(chatId, companionData);
  await renderMessages(chatId, companionData);
}

/**
 * создает в бд новый объект chat
 */
async function createNewChat(isPrivate) {
  return $api
    .post('/createNewChat', { isPrivate })
    .then((response) => {
      const chatId = response.data.insertId;
      return chatId;
    })
    .catch((error) => console.log('Ошибка:', error));
}

/**
 * создает в бд новый объект chat
 */
async function writeNewUserInChat(chatId, userId) {
  return $api
    .post('/writeNewUserInChat', { chatId, userId })
    .then((response) => {
      return response.data.affectedRows;
    })
    .catch((error) => console.log('Ошибка:', error));
}

/**
 * создания chatId если он отсутствует
 */
async function renderChatId(currentElement) {
  const newPrivateChatId = await createNewChat(true);
  const companionId = currentElement.getAttribute('data-id');
  const request1 = writeNewUserInChat(newPrivateChatId);
  const request2 = writeNewUserInChat(newPrivateChatId, companionId);
  if ((await request1) && (await request2)) {
    selectChatHandler(currentElement, newPrivateChatId);
  }
}

/**
 * смена выбранной секции в навигации
 */
export function changeSection(data_section, userId) {
  switch (data_section) {
    case 'profile_page':
      hideSections('profile_page');
      userId
        ? renderUserProfilePage(userId)
        : renderUserProfilePage(localStorage.getItem('id'));
      break;
    case 'messenger':
      hideSections('messenger');
      break;
    case 'cats':
      hideSections('cats');
      makeCats();
      break;
    case 'aboutUs':
      hideSections('aboutUs');
      break;
    default:
      hideSections('hideAll');
      break;
  }
}

/**
 * поиск данных для страницы профиля пользователя и запуск отрисовки
 */
async function findUserById(userId) {
  try {
    const response = await $api.get(`/findUserById?search_value=${userId}`);
    return response.data[0];
  } catch (error) {
    throw error;
  }
}

/**
 * функция получения статуса дружбы
 * @param myId id пользователя, который делает запрос
 * @param userId id пользователя, к которому на страницу зашел
 * @param status статус запроса в друзья 'pending' | 'accepted' | 'rejected'
 */
function getFriendStatusInfo(userId) {
  return $api
    .get(`/getFriendStatusInfo/${userId}`)
    .then((response) => response.data)
    .catch((error) => console.log('Ошибка:', error));
}

/**
 * поиск всех уведомлений
 */
async function getNotifications() {
  return $api
    .get(`/getNotifications`)
    .then((response) => response.data)
    .catch((error) => console.log('Ошибка:', error));
}

/**
 * рендер уведомлений
 */
async function renderNotifications() {
  let notificationsNumber = 0;
  let content = '';
  $('#notifications_list').innerHTML = '';
  const isFriend = await getNotifications();
  isFriend.forEach((element) => {
    if (element.status === 'pending') {
      notificationsNumber += 1;
      content += `<div class="user_avatar user_avatar_small notification_user" title="${element.username}">
      <img
        class="user_avatar_img openProfile"
        src="${element.avatar}"
        data-id="${element.user_id}"
        alt=""
      />
    </div><span class="friendName">${element.username}</span><br>хочет добавить Вас в друзья<br>
    <div class="reaction responseToFriendRequest" data-id="${element.user_id}" data-status='accepted'>Принять</div>
    <div class="reaction responseToFriendRequest" data-id="${element.user_id}" data-status='rejected'>Отказать</div><br><br><br>`;
    }
  });

  if (notificationsNumber === 0) {
    content = '<div class="notification">Уведомлений нет</div>';
    $('#notification_bell_number').classList.add('none');
  } else {
    $('#notification_bell_number').classList.remove('none');
  }
  $('#notifications_list').innerHTML = content;

  /**
   * ответ на запрос дружбы
   */
  let btns = [...document.getElementsByClassName('responseToFriendRequest')];
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      responseToFriendRequest(
        btn.getAttribute('data-id'),
        btn.getAttribute('data-status'),
      );
    });
  });
}

/**
 * рендер верстки страницы пользователя
 */
async function renderProfilePage(userDATA) {
  let friendBtn = `<div class="btn btn-outline-light me-2 nav_user_writeTo openDialog" data-id="${userDATA.id}" data-username="${userDATA.username}" data-email="${userDATA.email}" data-avatar="${userDATA.avatar}" data-chatid="${userDATA.chatId}" title="Открыть переписку с ${userDATA.username}">Написать</div>`;
  if (userDATA.id.toString() === localStorage.getItem('id')) {
    friendBtn = '';
  } else {
    const isFriend = await getFriendStatusInfo(userDATA.id.toString());
    if (!isFriend[0]) {
      friendBtn += `<div class="btn btn-outline-light me-2 nav_user_add_friend" id="nav_user_add_friend" data-id="${userDATA.id}" title="Добавить ${userDATA.username} в друзья"><svg fill="#ffc107" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
      width="20px" height="20px" viewBox="0 0 45.902 45.902"
      xml:space="preserve">
   <g>
     <g>
       <path d="M43.162,26.681c-1.564-1.578-3.631-2.539-5.825-2.742c1.894-1.704,3.089-4.164,3.089-6.912
         c0-5.141-4.166-9.307-9.308-9.307c-4.911,0-8.932,3.804-9.281,8.625c4.369,1.89,7.435,6.244,7.435,11.299
         c0,1.846-0.42,3.65-1.201,5.287c1.125,0.588,2.162,1.348,3.066,2.26c2.318,2.334,3.635,5.561,3.61,8.851l-0.002,0.067
         l-0.002,0.057l-0.082,1.557h11.149l0.092-12.33C45.921,30.878,44.936,28.466,43.162,26.681z"/>
       <path d="M23.184,34.558c1.893-1.703,3.092-4.164,3.092-6.912c0-5.142-4.168-9.309-9.309-9.309c-5.142,0-9.309,4.167-9.309,9.309
         c0,2.743,1.194,5.202,3.084,6.906c-4.84,0.375-8.663,4.383-8.698,9.318l-0.092,1.853h14.153h15.553l0.092-1.714
         c0.018-2.514-0.968-4.926-2.741-6.711C27.443,35.719,25.377,34.761,23.184,34.558z"/>
       <path d="M6.004,11.374v3.458c0,1.432,1.164,2.595,2.597,2.595c1.435,0,2.597-1.163,2.597-2.595v-3.458h3.454
         c1.433,0,2.596-1.164,2.596-2.597c0-1.432-1.163-2.596-2.596-2.596h-3.454V2.774c0-1.433-1.162-2.595-2.597-2.595
         c-1.433,0-2.597,1.162-2.597,2.595V6.18H2.596C1.161,6.18,0,7.344,0,8.776c0,1.433,1.161,2.597,2.596,2.597H6.004z"/>
     </g>
   </g>
   </svg></div>`;
    } else {
      if (isFriend[0].status === 'accepted') {
        //TODO:: проверка есть ли в друзьях
        friendBtn += `<div class="btn btn-outline-light me-2 nav_user_add_friend nav_user_remove_friend" id="nav_user_remove_friend" data-id="${userDATA.id}" title="Удалить из друзей ${userDATA.username}"><svg fill="#ffc107" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
        viewBox="0 0 512 512" xml:space="preserve">
     <g>
       <g>
         <rect y="100.174" width="33.391" height="144.696"/>
       </g>
     </g>
     <g>
       <g>
         <rect x="311.652" y="100.174" width="33.391" height="144.696"/>
       </g>
     </g>
     <g>
       <g>
         <rect x="100.174" width="144.696" height="33.391"/>
       </g>
     </g>
     <g>
       <g>
         <rect x="33.391" y="66.783" width="33.391" height="33.391"/>
       </g>
     </g>
     <g>
       <g>
         <rect x="66.783" y="33.391" width="33.391" height="33.391"/>
       </g>
     </g>
     <g>
       <g>
         <rect x="244.87" y="33.391" width="33.391" height="33.391"/>
       </g>
     </g>
     <g>
       <g>
         <rect x="278.261" y="66.783" width="33.391" height="33.391"/>
       </g>
     </g>
     <g>
       <g>
         <rect x="33.391" y="244.87" width="33.391" height="33.391"/>
       </g>
     </g>
     <g>
       <g>
         <rect x="278.261" y="244.87" width="33.391" height="33.391"/>
       </g>
     </g>
     <g>
       <g>
         <polygon points="244.87,278.261 244.87,311.652 211.478,311.652 211.478,345.043 278.261,345.043 278.261,278.261 		"/>
       </g>
     </g>
     <g>
       <g>
         <rect x="33.391" y="345.043" width="33.391" height="33.391"/>
       </g>
     </g>
     <g>
       <g>
         <polygon points="100.174,311.652 100.174,278.261 66.783,278.261 66.783,345.043 133.565,345.043 133.565,311.652 		"/>
       </g>
     </g>
     <g>
       <g>
         <rect x="345.043" y="378.435" width="100.174" height="33.391"/>
       </g>
     </g>
     <g>
       <g>
         <rect x="478.609" y="345.043" width="33.391" height="100.174"/>
       </g>
     </g>
     <g>
       <g>
         <rect x="345.043" y="478.609" width="100.174" height="33.391"/>
       </g>
     </g>
     <g>
       <g>
         <rect x="345.043" y="278.261" width="100.174" height="33.391"/>
       </g>
     </g>
     <g>
       <g>
         <polygon points="278.261,345.043 278.261,411.826 33.391,411.826 33.391,378.435 0,378.435 0,445.217 311.652,445.217 
           311.652,345.043 		"/>
       </g>
     </g>
     <g>
       <g>
         <rect x="311.652" y="311.652" width="33.391" height="33.391"/>
       </g>
     </g>
     <g>
       <g>
         <rect x="445.217" y="311.652" width="33.391" height="33.391"/>
       </g>
     </g>
     <g>
       <g>
         <rect x="445.217" y="445.217" width="33.391" height="33.391"/>
       </g>
     </g>
     <g>
       <g>
         <rect x="311.652" y="445.217" width="33.391" height="33.391"/>
       </g>
     </g>
     </svg></div>`;
      } else if (isFriend[0].status === 'rejected') {
        friendBtn += `<div class="btn btn-outline-light me-2 nav_user_add_friend" id="nav_user_add_friend" data-id="${userDATA.id}" title="Добавить ${userDATA.username} в друзья"><svg fill="#ffc107" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
        width="20px" height="20px" viewBox="0 0 45.902 45.902"
        xml:space="preserve">
     <g>
       <g>
         <path d="M43.162,26.681c-1.564-1.578-3.631-2.539-5.825-2.742c1.894-1.704,3.089-4.164,3.089-6.912
           c0-5.141-4.166-9.307-9.308-9.307c-4.911,0-8.932,3.804-9.281,8.625c4.369,1.89,7.435,6.244,7.435,11.299
           c0,1.846-0.42,3.65-1.201,5.287c1.125,0.588,2.162,1.348,3.066,2.26c2.318,2.334,3.635,5.561,3.61,8.851l-0.002,0.067
           l-0.002,0.057l-0.082,1.557h11.149l0.092-12.33C45.921,30.878,44.936,28.466,43.162,26.681z"/>
         <path d="M23.184,34.558c1.893-1.703,3.092-4.164,3.092-6.912c0-5.142-4.168-9.309-9.309-9.309c-5.142,0-9.309,4.167-9.309,9.309
           c0,2.743,1.194,5.202,3.084,6.906c-4.84,0.375-8.663,4.383-8.698,9.318l-0.092,1.853h14.153h15.553l0.092-1.714
           c0.018-2.514-0.968-4.926-2.741-6.711C27.443,35.719,25.377,34.761,23.184,34.558z"/>
         <path d="M6.004,11.374v3.458c0,1.432,1.164,2.595,2.597,2.595c1.435,0,2.597-1.163,2.597-2.595v-3.458h3.454
           c1.433,0,2.596-1.164,2.596-2.597c0-1.432-1.163-2.596-2.596-2.596h-3.454V2.774c0-1.433-1.162-2.595-2.597-2.595
           c-1.433,0-2.597,1.162-2.597,2.595V6.18H2.596C1.161,6.18,0,7.344,0,8.776c0,1.433,1.161,2.597,2.596,2.597H6.004z"/>
       </g>
     </g>
     </svg></div>`;
      } else if (isFriend[0].status === 'pending') {
        friendBtn += ``;
      }
    }
  }
  let save = `<input
  id="file"
  type="file"
  name="file"
  multiple
  style="display: none"
/>
<label
  for="file"
  class="file-icon picker"
  title="Загрузить файл"
>
  <img src="./src/img/File.svg" alt="" />
</label>`;
  $('#profile_page').innerHTML = '';
  let canEditInfo = '';
  let scrollingText = '';
  let telegramLink = '';
  let steamLink = '';
  let shikimoriLink = '';
  if (localStorage.getItem('id') === userDATA.id.toString()) {
    canEditInfo = `<div class="nav_user_info_edit" id="nav_user_info_edit">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="25px"
      height="25px"
    >
      <path
        d="M 23.90625 3.96875 C 22.859375 3.96875 21.8125 4.375 21 5.1875 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L 5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 26.8125 11 C 28.4375 9.375 28.4375 6.8125 26.8125 5.1875 C 26 4.375 24.953125 3.96875 23.90625 3.96875 Z M 23.90625 5.875 C 24.410156 5.875 24.917969 6.105469 25.40625 6.59375 C 26.378906 7.566406 26.378906 8.621094 25.40625 9.59375 L 24.6875 10.28125 L 21.71875 7.3125 L 22.40625 6.59375 C 22.894531 6.105469 23.402344 5.875 23.90625 5.875 Z M 20.3125 8.71875 L 23.28125 11.6875 L 11.1875 23.78125 C 10.53125 22.5 9.5 21.46875 8.21875 20.8125 Z M 6.9375 22.4375 C 8.136719 22.921875 9.078125 23.863281 9.5625 25.0625 L 6.28125 25.71875 Z"
        fill="#FFF"
      />
    </svg>
  </div>`;
  }
  if (userDATA.scrollingText) {
    scrollingText = `<div class="nav_user_marquee fade_in_out"><span>${userDATA.scrollingText}</span></div>`;
    $('#scrollingText_input').value = userDATA.scrollingText;
  }
  if (userDATA.telegramLink) {
    telegramLink = `<a
    href="https://t.me/${userDATA.telegramLink}"
    target="_blank"
    title="Ссылка на телеграм ${userDATA.username}"
    ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="50px" height="50px">
    <path fill="#141414" d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z" />
    <path fill="#ffc107" d="M33.95,15l-3.746,19.126c0,0-0.161,0.874-1.245,0.874c-0.576,0-0.873-0.274-0.873-0.274l-8.114-6.733 l-3.97-2.001l-5.095-1.355c0,0-0.907-0.262-0.907-1.012c0-0.625,0.933-0.923,0.933-0.923l21.316-8.468 c-0.001-0.001,0.651-0.235,1.126-0.234C33.667,14,34,14.125,34,14.5C34,14.75,33.95,15,33.95,15z" />
    <path fill="#ffc107" d="M23,30.505l-3.426,3.374c0,0-0.149,0.115-0.348,0.12c-0.069,0.002-0.143-0.009-0.219-0.043 l0.964-5.965L23,30.505z" />
    <path fill="#ffc107" d="M29.897,18.196c-0.169-0.22-0.481-0.26-0.701-0.093L16,26c0,0,2.106,5.892,2.427,6.912 c0.322,1.021,0.58,1.045,0.58,1.045l0.964-5.965l9.832-9.096C30.023,18.729,30.064,18.416,29.897,18.196z" />
  </svg>
  </a>`;
    $('#telegramLink_input').value = userDATA.telegramLink;
  }
  if (userDATA.steamLink) {
    steamLink = `<a
    href="https://steamcommunity.com/id/${userDATA.steamLink}"
    target="_blank"
    title="Ссылка на steam ${userDATA.username}"
    ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="50px" height="50px">
    <linearGradient id="wI0QYw54EXg5_LlgK1HXYa" x1="24" x2="24" y1="44" y2="4" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#141414" />
      <stop offset="1" stop-color="#141414" />
    </linearGradient>
    <path fill="url(#wI0QYw54EXg5_LlgK1HXYa)" d="M44,24c0,11.04-8.96,20-20,20c-8.39,0-15.57-5.16-18.53-12.48c-0.09-0.2-0.16-0.4-0.24-0.6 c-0.07-0.19-0.14-0.39-0.2-0.59C4.36,28.34,4,26.21,4,24c0-0.17,0-0.35,0.02-0.52c-0.01-0.17,0-0.35,0.01-0.52 C4.57,12.4,13.3,4,24,4C35.04,4,44,12.95,44,24z" />
    <circle cx="28.5" cy="18.5" r="3.5" fill="#ffc107" />
    <path d="M28.5,14.5c-2.21,0-4,1.79-4,4c0,2.21,1.79,4,4,4s4-1.79,4-4C32.5,16.29,30.71,14.5,28.5,14.5z M28.5,22c-1.93,0-3.5-1.57-3.5-3.5s1.57-3.5,3.5-3.5s3.5,1.57,3.5,3.5S30.43,22,28.5,22z" opacity=".07" />
    <path fill="#ffc107" d="M28.5,10c-4.69,0-8.5,3.81-8.5,8.5c0,0.18,0.02,0.35,0.03,0.52L17,24c-2.07,0-3.92,0.9-5.2,2.32 L4,24c0,2.21,0.36,4.34,1.03,6.33l5.04,1.61C10.53,35.36,13.45,38,17,38c3.87,0,7-3.13,7-7c0-0.37-0.04-0.73-0.09-1.08l5.06-2.94 C33.44,26.73,37,23.03,37,18.5C37,13.81,33.19,10,28.5,10z M17,36c-2.18,0-4.02-1.41-4.7-3.35l3.75,1.19l0.01-0.01 c0,0.01,0.01,0.01,0.02,0.01c0.14,0.04,0.27,0.08,0.41,0.11C16.66,33.98,16.83,34,17,34c1.66,0,3-1.34,3-3 c0-1.3-0.85-2.41-2.02-2.82c-0.01-0.01-0.03-0.03-0.03-0.03l-3.91-1.16C14.87,26.38,15.89,26,17,26c2.76,0,5,2.24,5,5 S19.76,36,17,36z M28.5,24c-3.04,0-5.5-2.46-5.5-5.5c0-3.04,2.46-5.5,5.5-5.5s5.5,2.46,5.5,5.5C34,21.54,31.54,24,28.5,24z" />
    <path d="M33.4,17.49c-0.07-0.32-0.17-0.63-0.29-0.93c-0.06-0.15-0.14-0.3-0.21-0.44 c-0.47-0.85-1.17-1.55-2.02-2.02c-0.14-0.07-0.29-0.15-0.44-0.21c-0.3-0.12-0.61-0.22-0.93-0.29c-0.33-0.06-0.67-0.1-1.01-0.1 s-0.68,0.04-1.01,0.1c-0.32,0.07-0.63,0.17-0.93,0.29c-0.15,0.06-0.3,0.14-0.44,0.21c-0.85,0.47-1.55,1.17-2.02,2.02 c-0.07,0.14-0.15,0.29-0.21,0.44c-0.12,0.3-0.22,0.61-0.29,0.93c-0.06,0.33-0.1,0.67-0.1,1.01c0,0.34,0.04,0.68,0.1,1.01 c0.07,0.32,0.17,0.63,0.29,0.93c0.06,0.15,0.14,0.3,0.21,0.44c0.47,0.85,1.17,1.55,2.02,2.02c0.14,0.07,0.29,0.15,0.44,0.21 c0.3,0.12,0.61,0.22,0.93,0.29c0.33,0.06,0.67,0.1,1.01,0.1s0.68-0.04,1.01-0.1c0.32-0.07,0.63-0.17,0.93-0.29 c0.15-0.06,0.3-0.14,0.44-0.21c0.85-0.47,1.55-1.17,2.02-2.02c0.07-0.14,0.15-0.29,0.21-0.44c0.12-0.3,0.22-0.61,0.29-0.93 c0.06-0.33,0.1-0.67,0.1-1.01C33.5,18.16,33.46,17.82,33.4,17.49z M28.5,22.5c-2.21,0-4-1.79-4-4c0-2.21,1.79-4,4-4s4,1.79,4,4 C32.5,20.71,30.71,22.5,28.5,22.5z M17,26.5c-0.59,0-1.16,0.12-1.7,0.34l2.79,0.83l0.12,0.06l0.01,0.01 c1.37,0.51,2.28,1.81,2.28,3.26c0,1.93-1.57,3.5-3.5,3.5c-0.19,0-0.39-0.02-0.59-0.06h-0.03l-0.01,0.03l-0.47-0.15l-2.63-0.84 c0.82,1.24,2.21,2.02,3.73,2.02c2.48,0,4.5-2.02,4.5-4.5C21.5,28.52,19.48,26.5,17,26.5z M17,26.5c-0.59,0-1.16,0.12-1.7,0.34 l2.79,0.83l0.12,0.06l0.01,0.01c1.37,0.51,2.28,1.81,2.28,3.26c0,1.93-1.57,3.5-3.5,3.5c-0.19,0-0.39-0.02-0.59-0.06h-0.03 l-0.01,0.03l-0.47-0.15l-2.63-0.84c0.82,1.24,2.21,2.02,3.73,2.02c2.48,0,4.5-2.02,4.5-4.5C21.5,28.52,19.48,26.5,17,26.5z M28.5,9 c-5.24,0-9.5,4.26-9.5,9.5c0,0.09,0,0.18,0.01,0.27l-2.58,4.25c-1.84,0.13-3.58,0.9-4.92,2.17l-7.22-2.15l-0.26-0.08 c-0.01,0.17-0.02,0.35-0.01,0.52l0.12,0.04l7.51,2.24c1.34-1.37,3.16-2.18,5.07-2.25l2.8-4.61c-0.01-0.13-0.02-0.27-0.02-0.4 c0-4.96,4.04-9,9-9s9,4.04,9,9c0,4.73-3.67,8.64-8.38,8.97l-4.67,2.72c0.03,0.28,0.05,0.55,0.05,0.81c0,4.14-3.36,7.5-7.5,7.5 c-3.63,0-6.75-2.64-7.38-6.18l-4.39-1.4c0.08,0.2,0.15,0.4,0.24,0.6l3.72,1.19C9.98,36.34,13.23,39,17,39c4.41,0,8-3.59,8-8 c0-0.18-0.01-0.36-0.02-0.54l4.29-2.5c4.92-0.4,8.73-4.51,8.73-9.46C38,13.26,33.74,9,28.5,9z M17,34.5 c-0.19,0-0.39-0.02-0.59-0.06h-0.03l-0.01,0.03l-0.47-0.15l-2.63-0.84c0.82,1.24,2.21,2.02,3.73,2.02c2.48,0,4.5-2.02,4.5-4.5 c0-2.48-2.02-4.5-4.5-4.5c-0.59,0-1.16,0.12-1.7,0.34l2.79,0.83l0.12,0.06l0.01,0.01c1.37,0.51,2.28,1.81,2.28,3.26 C20.5,32.93,18.93,34.5,17,34.5z M17,26.5c-0.59,0-1.16,0.12-1.7,0.34l2.79,0.83l0.12,0.06l0.01,0.01 c1.37,0.51,2.28,1.81,2.28,3.26c0,1.93-1.57,3.5-3.5,3.5c-0.19,0-0.39-0.02-0.59-0.06h-0.03l-0.01,0.03l-0.47-0.15l-2.63-0.84 c0.82,1.24,2.21,2.02,3.73,2.02c2.48,0,4.5-2.02,4.5-4.5C21.5,28.52,19.48,26.5,17,26.5z M17,26.5c-0.59,0-1.16,0.12-1.7,0.34 l2.79,0.83l0.12,0.06l0.01,0.01c1.37,0.51,2.28,1.81,2.28,3.26c0,1.93-1.57,3.5-3.5,3.5c-0.19,0-0.39-0.02-0.59-0.06h-0.03 l-0.01,0.03l-0.47-0.15l-2.63-0.84c0.82,1.24,2.21,2.02,3.73,2.02c2.48,0,4.5-2.02,4.5-4.5C21.5,28.52,19.48,26.5,17,26.5z M17,26.5c-0.59,0-1.16,0.12-1.7,0.34l2.79,0.83l0.12,0.06l0.01,0.01c1.37,0.51,2.28,1.81,2.28,3.26c0,1.93-1.57,3.5-3.5,3.5 c-0.19,0-0.39-0.02-0.59-0.06h-0.03l-0.01,0.03l-0.47-0.15l-2.63-0.84c0.82,1.24,2.21,2.02,3.73,2.02c2.48,0,4.5-2.02,4.5-4.5 C21.5,28.52,19.48,26.5,17,26.5z M17,26.5c-0.59,0-1.16,0.12-1.7,0.34l2.79,0.83l0.12,0.06l0.01,0.01 c1.37,0.51,2.28,1.81,2.28,3.26c0,1.93-1.57,3.5-3.5,3.5c-0.19,0-0.39-0.02-0.59-0.06h-0.03l-0.01,0.03l-0.47-0.15l-2.63-0.84 c0.82,1.24,2.21,2.02,3.73,2.02c2.48,0,4.5-2.02,4.5-4.5C21.5,28.52,19.48,26.5,17,26.5z" opacity=".05" />
    <path d="M28.5,9.5c-4.96,0-9,4.04-9,9c0,0.13,0.01,0.27,0.02,0.4l-2.8,4.61c-1.91,0.07-3.73,0.88-5.07,2.25 l-7.51-2.24l-0.12-0.04C4,23.65,4,23.83,4,24l7.8,2.32C13.08,24.9,14.93,24,17,24l3.03-4.98C20.02,18.85,20,18.68,20,18.5 c0-4.69,3.81-8.5,8.5-8.5s8.5,3.81,8.5,8.5c0,4.53-3.56,8.23-8.03,8.48l-5.06,2.94C23.96,30.27,24,30.63,24,31c0,3.87-3.13,7-7,7 c-3.55,0-6.47-2.64-6.93-6.06l-5.04-1.61c0.06,0.2,0.13,0.4,0.2,0.59l4.39,1.4c0.63,3.54,3.75,6.18,7.38,6.18 c4.14,0,7.5-3.36,7.5-7.5c0-0.26-0.02-0.53-0.05-0.81l4.67-2.72c4.71-0.33,8.38-4.24,8.38-8.97C37.5,13.54,33.46,9.5,28.5,9.5z M28.5,24c3.04,0,5.5-2.46,5.5-5.5c0-3.04-2.46-5.5-5.5-5.5S23,15.46,23,18.5C23,21.54,25.46,24,28.5,24z M23.89,20.44 c-0.13-0.3-0.22-0.61-0.29-0.93c-0.06-0.33-0.1-0.67-0.1-1.01c0-0.34,0.04-0.68,0.1-1.01c0.07-0.32,0.16-0.63,0.29-0.93 c0.06-0.15,0.14-0.3,0.21-0.44c0.47-0.85,1.17-1.55,2.02-2.02c0.14-0.07,0.29-0.15,0.44-0.21c0.3-0.13,0.61-0.22,0.93-0.29 c0.33-0.06,0.67-0.1,1.01-0.1s0.68,0.04,1.01,0.1c0.32,0.07,0.63,0.16,0.93,0.29c0.15,0.06,0.3,0.14,0.44,0.21 c0.85,0.47,1.55,1.17,2.02,2.02c0.07,0.14,0.15,0.29,0.21,0.44c0.13,0.3,0.22,0.61,0.29,0.93c0.06,0.33,0.1,0.67,0.1,1.01 c0,0.34-0.04,0.68-0.1,1.01c-0.07,0.32-0.16,0.63-0.29,0.93c-0.06,0.15-0.14,0.3-0.21,0.44c-0.47,0.85-1.17,1.55-2.02,2.02 c-0.14,0.07-0.29,0.15-0.44,0.21c-0.3,0.13-0.61,0.22-0.93,0.29c-0.33,0.06-0.67,0.1-1.01,0.1s-0.68-0.04-1.01-0.1 c-0.32-0.07-0.63-0.16-0.93-0.29c-0.15-0.06-0.3-0.14-0.44-0.21c-0.85-0.47-1.55-1.17-2.02-2.02 C24.03,20.74,23.95,20.59,23.89,20.44z M17,34c-0.17,0-0.34-0.02-0.51-0.05c-0.14-0.03-0.27-0.07-0.41-0.11 c-0.01,0-0.02,0-0.02-0.01l-0.01,0.01l-3.75-1.19C12.98,34.59,14.82,36,17,36c2.76,0,5-2.24,5-5s-2.24-5-5-5 c-1.11,0-2.13,0.38-2.96,0.99l3.91,1.16c0,0,0.02,0.02,0.03,0.03C19.15,28.59,20,29.7,20,31C20,32.66,18.66,34,17,34z M20.5,31 c0-1.45-0.91-2.75-2.28-3.26l-0.01-0.01l-0.12-0.06l-2.79-0.83c0.54-0.22,1.11-0.34,1.7-0.34c2.48,0,4.5,2.02,4.5,4.5 c0,2.48-2.02,4.5-4.5,4.5c-1.52,0-2.91-0.78-3.73-2.02l2.63,0.84l0.47,0.15l0.01-0.03h0.03c0.2,0.04,0.4,0.06,0.59,0.06 C18.93,34.5,20.5,32.93,20.5,31z M17,26c-1.11,0-2.13,0.38-2.96,0.99l3.91,1.16c0,0,0.02,0.02,0.03,0.03C19.15,28.59,20,29.7,20,31 c0,1.66-1.34,3-3,3c-0.17,0-0.34-0.02-0.51-0.05c-0.14-0.03-0.27-0.07-0.41-0.11c-0.01,0-0.02,0-0.02-0.01l-0.01,0.01l-3.75-1.19 C12.98,34.59,14.82,36,17,36c2.76,0,5-2.24,5-5S19.76,26,17,26z M17,35.5c-1.52,0-2.91-0.78-3.73-2.02l2.63,0.84l0.47,0.15 l0.01-0.03h0.03c0.2,0.04,0.4,0.06,0.59,0.06c1.93,0,3.5-1.57,3.5-3.5c0-1.45-0.91-2.75-2.28-3.26l-0.01-0.01l-0.12-0.06 l-2.79-0.83c0.54-0.22,1.11-0.34,1.7-0.34c2.48,0,4.5,2.02,4.5,4.5C21.5,33.48,19.48,35.5,17,35.5z M28.5,13 c-3.04,0-5.5,2.46-5.5,5.5c0,3.04,2.46,5.5,5.5,5.5s5.5-2.46,5.5-5.5C34,15.46,31.54,13,28.5,13z M33.11,20.44 c-0.06,0.15-0.14,0.3-0.21,0.44c-0.47,0.85-1.17,1.55-2.02,2.02c-0.14,0.07-0.29,0.15-0.44,0.21c-0.3,0.13-0.61,0.22-0.93,0.29 c-0.33,0.06-0.67,0.1-1.01,0.1s-0.68-0.04-1.01-0.1c-0.32-0.07-0.63-0.16-0.93-0.29c-0.15-0.06-0.3-0.14-0.44-0.21 c-0.85-0.47-1.55-1.17-2.02-2.02c-0.07-0.14-0.15-0.29-0.21-0.44c-0.13-0.3-0.22-0.61-0.29-0.93c-0.06-0.33-0.1-0.67-0.1-1.01 c0-0.34,0.04-0.68,0.1-1.01c0.07-0.32,0.16-0.63,0.29-0.93c0.06-0.15,0.14-0.3,0.21-0.44c0.47-0.85,1.17-1.55,2.02-2.02 c0.14-0.07,0.29-0.15,0.44-0.21c0.3-0.13,0.61-0.22,0.93-0.29c0.33-0.06,0.67-0.1,1.01-0.1s0.68,0.04,1.01,0.1 c0.32,0.07,0.63,0.16,0.93,0.29c0.15,0.06,0.3,0.14,0.44,0.21c0.85,0.47,1.55,1.17,2.02,2.02c0.07,0.14,0.15,0.29,0.21,0.44 c0.13,0.3,0.22,0.61,0.29,0.93c0.06,0.33,0.1,0.67,0.1,1.01c0,0.34-0.04,0.68-0.1,1.01C33.33,19.83,33.24,20.14,33.11,20.44z M28.5,13c-3.04,0-5.5,2.46-5.5,5.5c0,3.04,2.46,5.5,5.5,5.5s5.5-2.46,5.5-5.5C34,15.46,31.54,13,28.5,13z M33.11,20.44 c-0.06,0.15-0.14,0.3-0.21,0.44c-0.47,0.85-1.17,1.55-2.02,2.02c-0.14,0.07-0.29,0.15-0.44,0.21c-0.3,0.13-0.61,0.22-0.93,0.29 c-0.33,0.06-0.67,0.1-1.01,0.1s-0.68-0.04-1.01-0.1c-0.32-0.07-0.63-0.16-0.93-0.29c-0.15-0.06-0.3-0.14-0.44-0.21 c-0.85-0.47-1.55-1.17-2.02-2.02c-0.07-0.14-0.15-0.29-0.21-0.44c-0.13-0.3-0.22-0.61-0.29-0.93c-0.06-0.33-0.1-0.67-0.1-1.01 c0-0.34,0.04-0.68,0.1-1.01c0.07-0.32,0.16-0.63,0.29-0.93c0.06-0.15,0.14-0.3,0.21-0.44c0.47-0.85,1.17-1.55,2.02-2.02 c0.14-0.07,0.29-0.15,0.44-0.21c0.3-0.13,0.61-0.22,0.93-0.29c0.33-0.06,0.67-0.1,1.01-0.1s0.68,0.04,1.01,0.1 c0.32,0.07,0.63,0.16,0.93,0.29c0.15,0.06,0.3,0.14,0.44,0.21c0.85,0.47,1.55,1.17,2.02,2.02c0.07,0.14,0.15,0.29,0.21,0.44 c0.13,0.3,0.22,0.61,0.29,0.93c0.06,0.33,0.1,0.67,0.1,1.01c0,0.34-0.04,0.68-0.1,1.01C33.33,19.83,33.24,20.14,33.11,20.44z M17,26c-1.11,0-2.13,0.38-2.96,0.99l3.91,1.16c0,0,0.02,0.02,0.03,0.03C19.15,28.59,20,29.7,20,31c0,1.66-1.34,3-3,3 c-0.17,0-0.34-0.02-0.51-0.05c-0.14-0.03-0.27-0.07-0.41-0.11c-0.01,0-0.02,0-0.02-0.01l-0.01,0.01l-3.75-1.19 C12.98,34.59,14.82,36,17,36c2.76,0,5-2.24,5-5S19.76,26,17,26z M17,35.5c-1.52,0-2.91-0.78-3.73-2.02l2.63,0.84l0.47,0.15 l0.01-0.03h0.03c0.2,0.04,0.4,0.06,0.59,0.06c1.93,0,3.5-1.57,3.5-3.5c0-1.45-0.91-2.75-2.28-3.26l-0.01-0.01l-0.12-0.06 l-2.79-0.83c0.54-0.22,1.11-0.34,1.7-0.34c2.48,0,4.5,2.02,4.5,4.5C21.5,33.48,19.48,35.5,17,35.5z" opacity=".07" />
    <path d="M28.5,13c-3.04,0-5.5,2.46-5.5,5.5c0,3.04,2.46,5.5,5.5,5.5s5.5-2.46,5.5-5.5 C34,15.46,31.54,13,28.5,13z M33.11,20.44c-0.06,0.15-0.14,0.3-0.21,0.44c-0.47,0.85-1.17,1.55-2.02,2.02 c-0.14,0.07-0.29,0.15-0.44,0.21c-0.3,0.13-0.61,0.22-0.93,0.29c-0.33,0.06-0.67,0.1-1.01,0.1s-0.68-0.04-1.01-0.1 c-0.32-0.07-0.63-0.16-0.93-0.29c-0.15-0.06-0.3-0.14-0.44-0.21c-0.85-0.47-1.55-1.17-2.02-2.02c-0.07-0.14-0.15-0.29-0.21-0.44 c-0.13-0.3-0.22-0.61-0.29-0.93c-0.06-0.33-0.1-0.67-0.1-1.01c0-0.34,0.04-0.68,0.1-1.01c0.07-0.32,0.16-0.63,0.29-0.93 c0.06-0.15,0.14-0.3,0.21-0.44c0.47-0.85,1.17-1.55,2.02-2.02c0.14-0.07,0.29-0.15,0.44-0.21c0.3-0.13,0.61-0.22,0.93-0.29 c0.33-0.06,0.67-0.1,1.01-0.1s0.68,0.04,1.01,0.1c0.32,0.07,0.63,0.16,0.93,0.29c0.15,0.06,0.3,0.14,0.44,0.21 c0.85,0.47,1.55,1.17,2.02,2.02c0.07,0.14,0.15,0.29,0.21,0.44c0.13,0.3,0.22,0.61,0.29,0.93c0.06,0.33,0.1,0.67,0.1,1.01 c0,0.34-0.04,0.68-0.1,1.01C33.33,19.83,33.24,20.14,33.11,20.44z M28.5,13c-3.04,0-5.5,2.46-5.5,5.5c0,3.04,2.46,5.5,5.5,5.5 s5.5-2.46,5.5-5.5C34,15.46,31.54,13,28.5,13z M33.11,20.44c-0.06,0.15-0.14,0.3-0.21,0.44c-0.47,0.85-1.17,1.55-2.02,2.02 c-0.14,0.07-0.29,0.15-0.44,0.21c-0.3,0.13-0.61,0.22-0.93,0.29c-0.33,0.06-0.67,0.1-1.01,0.1s-0.68-0.04-1.01-0.1 c-0.32-0.07-0.63-0.16-0.93-0.29c-0.15-0.06-0.3-0.14-0.44-0.21c-0.85-0.47-1.55-1.17-2.02-2.02c-0.07-0.14-0.15-0.29-0.21-0.44 c-0.13-0.3-0.22-0.61-0.29-0.93c-0.06-0.33-0.1-0.67-0.1-1.01c0-0.34,0.04-0.68,0.1-1.01c0.07-0.32,0.16-0.63,0.29-0.93 c0.06-0.15,0.14-0.3,0.21-0.44c0.47-0.85,1.17-1.55,2.02-2.02c0.14-0.07,0.29-0.15,0.44-0.21c0.3-0.13,0.61-0.22,0.93-0.29 c0.33-0.06,0.67-0.1,1.01-0.1s0.68,0.04,1.01,0.1c0.32,0.07,0.63,0.16,0.93,0.29c0.15,0.06,0.3,0.14,0.44,0.21 c0.85,0.47,1.55,1.17,2.02,2.02c0.07,0.14,0.15,0.29,0.21,0.44c0.13,0.3,0.22,0.61,0.29,0.93c0.06,0.33,0.1,0.67,0.1,1.01 c0,0.34-0.04,0.68-0.1,1.01C33.33,19.83,33.24,20.14,33.11,20.44z M28.5,13c-3.04,0-5.5,2.46-5.5,5.5c0,3.04,2.46,5.5,5.5,5.5 s5.5-2.46,5.5-5.5C34,15.46,31.54,13,28.5,13z M33.11,20.44c-0.06,0.15-0.14,0.3-0.21,0.44c-0.47,0.85-1.17,1.55-2.02,2.02 c-0.14,0.07-0.29,0.15-0.44,0.21c-0.3,0.13-0.61,0.22-0.93,0.29c-0.33,0.06-0.67,0.1-1.01,0.1s-0.68-0.04-1.01-0.1 c-0.32-0.07-0.63-0.16-0.93-0.29c-0.15-0.06-0.3-0.14-0.44-0.21c-0.85-0.47-1.55-1.17-2.02-2.02c-0.07-0.14-0.15-0.29-0.21-0.44 c-0.13-0.3-0.22-0.61-0.29-0.93c-0.06-0.33-0.1-0.67-0.1-1.01c0-0.34,0.04-0.68,0.1-1.01c0.07-0.32,0.16-0.63,0.29-0.93 c0.06-0.15,0.14-0.3,0.21-0.44c0.47-0.85,1.17-1.55,2.02-2.02c0.14-0.07,0.29-0.15,0.44-0.21c0.3-0.13,0.61-0.22,0.93-0.29 c0.33-0.06,0.67-0.1,1.01-0.1s0.68,0.04,1.01,0.1c0.32,0.07,0.63,0.16,0.93,0.29c0.15,0.06,0.3,0.14,0.44,0.21 c0.85,0.47,1.55,1.17,2.02,2.02c0.07,0.14,0.15,0.29,0.21,0.44c0.13,0.3,0.22,0.61,0.29,0.93c0.06,0.33,0.1,0.67,0.1,1.01 c0,0.34-0.04,0.68-0.1,1.01C33.33,19.83,33.24,20.14,33.11,20.44z" opacity=".07" />
  </svg>
  </a>`;
    $('#steamLink_input').value = userDATA.steamLink;
  }
  if (userDATA.shikimoriLink) {
    shikimoriLink = `<a
    href="https://shikimori.one/${userDATA.shikimoriLink}"
    target="_blank"
    title="Ссылка на шикимори ${userDATA.username}"
    ><img src="https://shikimori.one/favicon.ico" alt=""
  /></a>`;
    $('#shikimoriLink_input').value = userDATA.shikimoriLink;
  }
  $('#profile_page').innerHTML = `
<div class="nav_profile_header">
    <div class="nav_profile_avatar">
      <img
        class="nav_profile_avatar_img"
        src="${userDATA.avatar}"
        alt=""
      />
      <div class="nav_status"></div>
    </div>
    <div class="nav_profile_name">${userDATA.username}</div>
    ${canEditInfo}
  </div>
  <div class="nav_user_info">
  <div class="nav_user_info_text"></div>
  ${scrollingText}
  <div class="nav_user_social_media_links">
  ${telegramLink}
  ${steamLink}
  ${shikimoriLink}
  </div>
  ${friendBtn}
</div>
  <div class="nav_user_wall_wrapper">
    <div class="nav_user_wall">
      <form
        id="addPost"
        class="nav_user_wall_postForm"
        enctype="multipart/form-data"
        role="form"
      >
        <textarea
          name="postText"
          class="nav_user_wall_postTextarea"
          id="postText"
          placeholder="Что у Вас нового..."
          oninput="autoResize(this)"
          maxlength="250"
        ></textarea>
        <div class="nav_user_wall_files_wrapper">
        <p class="nav_user_wall_files_charCount">Осталось символов: <span id="charCount">250</span></p>
          <div class="emoji_picker" id="emoji_picker">
            <!-- Здесь может быть панель с эмодзи для выбора -->
            <!-- Например, используя библиотеку как EmojiMart -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="50px" height="50px">
  <linearGradient id="TIZHtCnMUiS3rznMpT1gYa" x1="30.5" x2="30.5" y1="35" y2="17" gradientTransform="matrix(1 0 0 -1 0 66)" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#6dc7ff" />
    <stop offset="1" stop-color="#e6abff" />
  </linearGradient>
  <path fill="url(#TIZHtCnMUiS3rznMpT1gYa)" d="M40,33c0,0-3,1-7,1c-7,0-10-3-10-3s-4,2-4,7c0,7,5.625,11,12,11c6,0,11-3.75,11-10 C42,35,40,33,40,33z M31,46c-3.866,0-7-1.567-7-3.5s3.134-3.5,7-3.5s7,1.567,7,3.5S34.866,46,31,46z" />
  <linearGradient id="TIZHtCnMUiS3rznMpT1gYb" x1="48.5" x2="48.5" y1="40" y2="32" gradientTransform="matrix(1 0 0 -1 0 66)" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#6dc7ff" />
    <stop offset="1" stop-color="#e6abff" />
  </linearGradient>
  <path fill="url(#TIZHtCnMUiS3rznMpT1gYb)" d="M48.5,26c-1.381,0-2.5,1.791-2.5,4s1.119,4,2.5,4s2.5-1.791,2.5-4S49.881,26,48.5,26z M48,29 c-0.552,0-1-0.448-1-1s0.448-1,1-1s1,0.448,1,1S48.552,29,48,29z" />
  <linearGradient id="TIZHtCnMUiS3rznMpT1gYc" x1="17" x2="17" y1="45.018" y2="35.999" gradientTransform="matrix(1 0 0 -1 0 66)" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#6dc7ff" />
    <stop offset="1" stop-color="#e6abff" />
  </linearGradient>
  <path fill="url(#TIZHtCnMUiS3rznMpT1gYc)" d="M19.225,21.175c-1.111-0.718-3.008,0.632-4.237,3.016s-1.325,4.898-0.214,5.617 c1.111,0.718,3.008-0.632,4.237-3.016C20.241,24.408,20.337,21.893,19.225,21.175z M18,24c-0.552,0-1-0.448-1-1s0.448-1,1-1 s1,0.448,1,1S18.552,24,18,24z" />
  <linearGradient id="TIZHtCnMUiS3rznMpT1gYd" x1="31.994" x2="31.994" y1="59" y2="9" gradientTransform="matrix(1 0 0 -1 0 66)" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#6dc7ff" />
    <stop offset="1" stop-color="#e6abff" />
  </linearGradient>
  <path fill="url(#TIZHtCnMUiS3rznMpT1gYd)" d="M34.88,7C18,7,5.989,23,5.989,38c0,11.72,9.967,19,26.011,19c16.523,0,26-6.925,26-19 C58,28.798,49.027,7,34.88,7z M29.5,10c0.828,0,1.5,0.672,1.5,1.5S30.328,13,29.5,13S28,12.328,28,11.5S28.672,10,29.5,10z M32,54 C17.591,54,8.989,48.019,8.989,38c0-10.171,6.279-21.22,16.101-25.806C25.504,13.794,27.32,15,29.5,15c2.485,0,4.5-1.567,4.5-3.5 c0-0.524-0.158-1.016-0.423-1.462C34.008,10.014,34.442,10,34.88,10C46.504,10,55,29.648,55,38C55,51.921,40.59,54,32,54z" />
  <linearGradient id="TIZHtCnMUiS3rznMpT1gYe" x1="30.5" x2="30.5" y1="60.25" y2="7.9" gradientTransform="matrix(1 0 0 -1 0 66)" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#1a6dff" />
    <stop offset="1" stop-color="#c822ff" />
  </linearGradient>
  <path fill="url(#TIZHtCnMUiS3rznMpT1gYe)" d="M31,50c-6.46,0-13-4.122-13-12c0-5.554,4.367-7.802,4.553-7.895 c0.383-0.193,0.846-0.118,1.15,0.184C23.768,30.351,26.607,33,33,33c3.794,0,6.655-0.939,6.684-0.948 c0.359-0.122,0.756-0.026,1.023,0.241C40.801,32.387,43,34.636,43,39C43,45.374,37.953,50,31,50z M22.92,32.226 C21.948,32.915,20,34.709,20,38c0,6.871,5.702,10,11,10c5.888,0,10-3.701,10-9c0-2.523-0.858-4.13-1.36-4.854 C38.501,34.452,36.034,35,33,35C27.398,35,24.185,33.155,22.92,32.226z" />
  <linearGradient id="TIZHtCnMUiS3rznMpT1gYf" x1="32" x2="32" y1="60.25" y2="7.9" gradientTransform="matrix(1 0 0 -1 0 66)" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#1a6dff" />
    <stop offset="1" stop-color="#c822ff" />
  </linearGradient>
  <path fill="url(#TIZHtCnMUiS3rznMpT1gYf)" d="M32,58C15.339,58,5,50.337,5,38C5,22.864,17.264,6,34.88,6C49.639,6,59,28.501,59,38 C59,50.71,49.159,58,32,58z M34.88,8C18.443,8,7,23.811,7,38c0,11.103,9.573,18,25,18c15.888,0,25-6.561,25-18 C57,29.348,48.185,8,34.88,8z" />
</svg>
            <div
              class="emoji_picker_wrapper none"
              id="emoji_picker_wrapper"
            ></div>
          </div>
          <input
            id="photo"
            type="file"
            name="photo"
            accept="image/*"
            style="display: none"
          />
          <label
            for="photo"
            class="photo-icon picker"
            title="Загрузить фото"
          >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="50px" height="50px">
          <path d="M 11.5 6 C 8.4802259 6 6 8.4802259 6 11.5 L 6 36.5 C 6 39.519774 8.4802259 42 11.5 42 L 36.5 42 C 39.519774 42 42 39.519774 42 36.5 L 42 11.5 C 42 8.4802259 39.519774 6 36.5 6 L 11.5 6 z M 11.5 9 L 36.5 9 C 37.898226 9 39 10.101774 39 11.5 L 39 36.5 C 39 36.632609 38.980071 36.76013 38.960938 36.886719 L 26.814453 25.134766 C 26.035864 24.38142 25.017476 24.005859 24 24.005859 C 22.982524 24.005859 21.966089 24.38142 21.1875 25.134766 L 9.0390625 36.886719 C 9.0199291 36.76013 9 36.632609 9 36.5 L 9 11.5 C 9 10.101774 10.101774 9 11.5 9 z M 30.5 13 C 29.125 13 27.903815 13.569633 27.128906 14.441406 C 26.353997 15.313179 26 16.416667 26 17.5 C 26 18.583333 26.353997 19.686821 27.128906 20.558594 C 27.903815 21.430367 29.125 22 30.5 22 C 31.875 22 33.096185 21.430367 33.871094 20.558594 C 34.646003 19.686821 35 18.583333 35 17.5 C 35 16.416667 34.646003 15.313179 33.871094 14.441406 C 33.096185 13.569633 31.875 13 30.5 13 z M 30.5 16 C 31.124999 16 31.403816 16.180367 31.628906 16.433594 C 31.853997 16.686821 32 17.083333 32 17.5 C 32 17.916667 31.853997 18.313179 31.628906 18.566406 C 31.403816 18.819633 31.124999 19 30.5 19 C 29.875001 19 29.596184 18.819633 29.371094 18.566406 C 29.146003 18.313179 29 17.916667 29 17.5 C 29 17.083333 29.146003 16.686821 29.371094 16.433594 C 29.596184 16.180367 29.875001 16 30.5 16 z M 24.001953 26.988281 C 24.261517 26.988281 24.520104 27.089361 24.728516 27.291016 L 36.800781 38.970703 C 36.701225 38.982362 36.603103 39 36.5 39 L 11.5 39 C 11.396897 39 11.298775 38.982362 11.199219 38.970703 L 23.273438 27.291016 C 23.481848 27.089361 23.742389 26.988281 24.001953 26.988281 z" fill="#FFF" />
        </svg>
          </label>
          
          <input
            id="wallId"
            type="text"
            value="${userDATA.id}"
            name="wallId"
            style="display: none"
          />
          <button type="submit" class="btn btn-outline-light me-2">
            Опубликовать
          </button>
        </div>
      </form>
      <div class="nav_user_wall_wrapper_posts" id="nav_user_wall_wrapper_posts"></div>
    </div>
    <div class="nav_users_friends">
      <div class="nav_friends" id="nav_all_friends"></div>
    </div>
  </div>`;

  /**
   * лисинер на изменения личной инфы
   */
  $('#nav_user_info_edit')?.addEventListener('click', showUserInfoEditWindow);

  /**
   * Добавить в друзья
   */
  $('#nav_user_add_friend')?.addEventListener('click', addFriend);

  /**
   * Удалить из друзей
   */
  $('#nav_user_remove_friend')?.addEventListener('click', removeFriend);
}

/**
 * поиск и отрисовка постов на странице пользователя
 */
async function renderUsersPosts(userDATA) {
  //TODO:: переделать SQL
  $api
    .get(`/getUserPosts?search_value=${userDATA.id}`)
    .then(async (response) => {
      $('#nav_user_wall_wrapper_posts').innerHTML = '';
      for (const element of response.data) {
        let content = '';
        element.text
          ? (content += `<div class="nav_user_wall_postTextarea">${element.text}</div>`)
          : (content += '');
        element.photos && element.photos.data[0]
          ? (content += `<div class="nav_user_wall_post_imgWrapper"><img src="data:image/png;base64,${element.photosString}" alt="" /></div>`)
          : (content += '');
        element.files && element.files.data[0]
          ? (content += `<a href="${element.files}" class="nav_user_wall_post_file" target="_blank"><img src="./src/img/File.svg" alt="" /></a>`)
          : (content += '');
        localStorage.getItem('id') === element.wallId.toString() ||
        localStorage.getItem('id') === element.id.toString()
          ? (content += `<div class="delete_post" data-postId="${element.postsid}" data-wallId="${element.wallId}" title="Удалить пост">x</div>`)
          : (content += '');
        $('#nav_user_wall_wrapper_posts').insertAdjacentHTML(
          'afterbegin',
          `<div class="nav_user_wall_post">
            <div class="user_avatar user_avatar_small" title="${element.username}">
                <img
                  class="user_avatar_img openProfile"
                  src="${element.avatar}"
                  data-id="${element.id}"
                  alt=""
                />
                <div class="status"></div>
                <div class="post_author_name">${element.username}</div>
            </div>
            ${content}
          </div>`,
        );
        // if (userDATA.id === element.authorId) {
        //   $('#nav_user_wall_wrapper_posts').insertAdjacentHTML(
        //     'afterbegin',
        //     `<div class="nav_user_wall_post">
        //   <div class="user_avatar user_avatar_small" title="${userDATA.username}">
        //         <img
        //           class="user_avatar_img openProfile"
        //           src="${userDATA.avatar}"
        //           data-id="${userDATA.id}"
        //           alt=""
        //         />
        //         <div class="status"></div>
        //   </div>${content}</div>`,
        //   );
        // } else {
        //   let authorDATA = await findUserById(element.authorId);
        //   $('#nav_user_wall_wrapper_posts').insertAdjacentHTML(
        //     'afterbegin',
        //     `<div class="nav_user_wall_post">
        //   <div class="user_avatar user_avatar_small" title="${authorDATA.username}">
        //         <img
        //           class="user_avatar_img openProfile"
        //           src="${authorDATA.avatar}"
        //           data-id="${authorDATA.id}"
        //           alt=""
        //         />
        //         <div class="status"></div>
        //   </div>${content}</div>`,
        //   );
        // }
      }

      /**
       * наполнение смайликов
       */
      function insertEmoji(emoji) {
        $('#postText').value += emoji.native;
      }
      const pickerOptions = { onEmojiSelect: insertEmoji };
      const picker = new EmojiMart.Picker(pickerOptions);
      $('#emoji_picker_wrapper')?.appendChild(picker);

      /**
       * выбор смайликов на главной
       */
      $('#emoji_picker').addEventListener('click', showSmiles);

      /**
       * submit поста
       */
      $('#addPost').addEventListener('submit', addPost);

      /**
       * удаление поста
       */
      let deleteBtns = [...document.getElementsByClassName('delete_post')];
      deleteBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          deletePost(
            btn.getAttribute('data-postId'),
            btn.getAttribute('data-wallId'),
          );
        });
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 * возвращает всех друзей пользователя с бд с их данными
 */
function getAllFriendsInfo(userId) {
  return $api
    .get(`/getAllFriendsInfo/${userId}`)
    .then((response) => response.data)
    .catch((error) => console.log('Ошибка:', error));
}

/**
 * рендер друзей пользователя
 */
async function renderUsersFriends(userDATA) {
  let save = `<div class="nav_friends nav_friends_line">
  Друзья онлайн <span>2</span>
  <div class="nav_friends_wrapper">
    <div class="user_avatar user_avatar_small">
      <img
        class="user_avatar_img"
        src="./src/img/1.jpg"
        alt=""
      />
      <div class="status"></div>
    </div>
    <div class="user_avatar user_avatar_small">
      <img
        class="user_avatar_img"
        src="./src/img/1.jpg"
        alt=""
      />
      <div class="status"></div>
    </div>
    <div class="user_avatar user_avatar_small">
      <img
        class="user_avatar_img"
        src="./src/img/1.jpg"
        alt=""
      />
      <div class="status"></div>
    </div>
    <div class="user_avatar user_avatar_small">
      <img
        class="user_avatar_img"
        src="./src/img/1.jpg"
        alt=""
      />
      <div class="status"></div>
    </div>
    <div class="user_avatar user_avatar_small">
      <img
        class="user_avatar_img"
        src="./src/img/1.jpg"
        alt=""
      />
      <div class="status"></div>
    </div>
    <div class="user_avatar user_avatar_small">
      <img
        class="user_avatar_img"
        src="./src/img/1.jpg"
        alt=""
      />
      <div class="status"></div>
    </div>
    <div class="user_avatar user_avatar_small">
      <img
        class="user_avatar_img"
        src="./src/img/1.jpg"
        alt=""
      />
      <div class="status"></div>
    </div>
  </div>
</div>`;
  let numberOfFriends = 0;
  let friends = '';
  $('#nav_all_friends').innerHTML = '';
  const friendsArray = await getAllFriendsInfo(userDATA.id);
  await Promise.all(
    friendsArray.map(async (friend) => {
      friends += `
    <div class="user_avatar user_avatar_small" title="${friend.username}">
      <img class="user_avatar_img openProfile" src="${friend.avatar}" data-id="${friend.id}" alt=""/>
      <div class="status"></div>
    </div>`;
      numberOfFriends += 1;
    }),
  );
  let content = `Друзья <span>${numberOfFriends}</span><div class="nav_friends_wrapper">${friends}</div>`;
  $('#nav_all_friends').innerHTML = content;
}

/**
 * общий рендер страницы пользователя
 */

async function renderUserProfilePage(userId) {
  const userDATA = await findUserById(userId);
  await renderProfilePage(userDATA);
  await renderUsersPosts(userDATA);
  await renderUsersFriends(userDATA);
}

/**
 * отработка глобального клика
 */
export function globalClickHandler(event) {
  const targetElement = event.target; // Элемент, на который был совершен клик

  if (targetElement.classList.contains('openProfile')) {
    //добавлять в img класс openProfile и атрибут data-id="${element.id}" title="${userData.username}"
    const userId = targetElement.getAttribute('data-id');
    changeSection('profile_page', userId);
  }

  if (
    targetElement.closest('.openDialog') &&
    !targetElement.classList.contains('openProfile')
  ) {
    //добавлять в div класс openDialog и атрибут data-chatId или data-id="${user.id}" data-email="${user.email}"
    const currentElement = targetElement.closest('.openDialog');
    const chatId = currentElement?.getAttribute('data-chatId');
    changeSection('messenger');
    chatId !== 'null'
      ? selectChatHandler(currentElement, chatId)
      : renderChatId(currentElement);
  }
  globalClickAnimation(event);
}

/**
 * отображает окно авторизованного пользователя сверху с его данными
 */
function renderAccount() {
  const username = localStorage.getItem('username');
  const avatar = localStorage.getItem('avatar');
  const my_name = $('#my_name');
  my_name ? (my_name.innerHTML = username) : console.log('my_name не найден');
  const my_avatar = $('#my_avatar');
  my_avatar
    ? (my_avatar.innerHTML = `<img class="user_avatar_img" src="${avatar}" alt="фото профиля" />
    <div class="status"></div>`)
    : console.log('my_avatar не найден');
}

/**
 * удаляет отображение данных об аккаунте при выходе пользователя
 */
function removeAccount() {
  $('#my_name').innerHTML = '';
  $('#my_avatar').innerHTML = '';
}

/**
 * показывает в меню доступные темы
 */
function renderThemes() {
  import('../jsons/themes_list.json').then((themesList) => {
    $('#themes').innerHTML = '';
    themesList.default.forEach((theme) => {
      $(
        '#themes',
      ).innerHTML += `<option class="option" value="${theme.name}">${theme.name}</option>`;
    });
  });
}

/**
 * убирает доступные темы
 */
function removeThemes() {
  $('#themes').innerHTML = '';
}

/**
 * отрисовка полученных с сервера пользователей
 * @param users_response_result данные пользователя
 */
function renderUsers(users_response_result) {
  if ($('#search_request') && users_response_result != undefined) {
    $('#search_request').innerHTML = '';
    users_response_result.forEach((user) => {
      const id_el = 'id' + user.id;
      $(
        '#search_request',
      ).innerHTML += `<div class="element openDialog" id="${id_el}" data-id="${user.id}" data-username="${user.username}" data-email="${user.email}" data-avatar="${user.avatar}" data-chatid="${user.chatId}" title="${user.username}">
      <div class="user_avatar user_avatar_small">
        <img class="user_avatar_img openProfile" src="${user.avatar}" alt="" data-id="${user.id}"/>
        <div class="status"></div>
      </div>
      <span class="element_span">${user.username}</span>
    </div>`;
    });
  }
}

/**
 * поиск собеседников, раз в 500мл проверка, что ввел пользователь и запрос на сервер
 */
export function searchInputHandler() {
  const debouncedFunction = debounce(() => {
    const users_search = document.querySelector('#users_search');
    const userName = escapeSql(escapeHtml(users_search.value.trim()));
    if (userName && userName !== ' ') {
      $api
        .get(`/findUserByName/${userName}`)
        .then((response) => {
          renderUsers(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      $('#search_request').innerHTML = '';
    }
  }, 500);
  debouncedFunction();
}

/**
 * получение всех пользователей с БД
 */
function getAllUsers() {
  return $api
    .get('/allUsers')
    .then((response) => response.data)
    .catch((error) => console.log('Ошибка:', error));
}

/**
 * получение чатов пользователя
 */
async function getUsersChats() {
  return $api
    .get(`/returnActiveChats`)
    .then((response) => response.data)
    .catch((error) => console.log('Ошибка:', error));
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
    const content = `<div class="line"></div>
      <div class="user openDialog" title="${element.name}" data-id="${element.userId}" data-username="${element.name}" data-email="${element.userEmail}" data-avatar="${element.avatar}" data-chatId="${element.chatId}">
        <div class="user_avatar user_avatar_small">
          <img class="user_avatar_img" src="${element.avatar}" alt=""/>
          <div class="status"></div>
        </div>
        <div class="user_info">
          <div class="user_name"><strong>${element.name}</strong></div>
          <div class="user_last_message" title="${element.last_message}">${element.last_message}</div>
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
}

/**
 * удаляет отображение чатов
 */
function removeChats() {
  $('#users').innerHTML = '';
}

/**
 * сохраняет сообщение в БД
 */
export async function saveMessageToDb(message) {
  $api
    .post('/saveMessage', { message })
    .then((response) => {
      const data = response.data;
    })
    .catch((error) => console.log('Ошибка:', error));
}

/**
 * обработчик события НОВОЕ СООБЩЕНИЕ
 */
export async function handlerMessageEvent(event) {
  let datetime = new Date();
  let message = {
    chatId: event.detail.message.chatId,
    sendBy: event.detail.message.from,
    datetime,
    content: escapeSql(escapeHtml(event.detail.message.content)),
  };
  await saveMessageToDb(message);
  renderMessage(message);
  await renderChats();
}

/**
 * рендер сообщений
 * @param content текст сообщения
 */
export function renderMessage(message) {
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
    message.username ? message.username : localStorage.getItem('usename')
  }">
    <img class="user_avatar_img openProfile" src="${
      message.avatar ? message.avatar : localStorage.getItem('avatar')
    }" data-id="${
    message.id ? message.id : localStorage.getItem('id')
  }" alt=""/>
    <div class="status"></div>
  </div>`;
  messagesWrapper.innerHTML += `
    <div class="message ${
      message.sendBy.toString() === localStorage.getItem('id') ? 'my' : 'from'
    }">
    ${message.sendBy.toString() === localStorage.getItem('id') ? '' : user}
      <div class="message_metric">${formatter2.format(
        new Date(message.datetime),
      )}<br />${formatter1.format(new Date(message.datetime))}</div>
      <div class="message_text">
        ${message.content}
      </div>
      <div class="user_avatar user_avatar_small"></div>
      ${message.sendBy.toString() === localStorage.getItem('id') ? user : ''}
    </div>`;
  scrollChatToBottom();
}

/**
 * вызывает установщики информации во всех местах + socket
 */
function setInfo() {
  let email = localStorage.getItem('email');
  // if (email) {
  //   socketService.login(email);
  // }
  renderNotifications();
  renderAccount();
  renderThemes();
  renderChats();
}

/**
 * очистить данные пользователя
 */
function removeUserData() {
  localStorage.clear();
  removeAccount();
  removeThemes();
  removeChats();
}

/**
 * запускать при входе пользователя анимация + данные
 */
export function userIn() {
  setInfo();
  logInView();
}

/**
 * запускать при выходе пользователя анимация + данные
 */
export function userOut() {
  logOutView();
  removeUserData();
}

/**
 * смена имени пользователя
 */
export function changeUsername(event) {
  event.preventDefault();
  const formData = new FormData(this);
  const username = escapeSql(
    escapeHtml(formData.get('username')?.toString().trim()),
  );
  if (!localStorage.getItem('email')) {
    announcementMessage('Прежде всего войдите в аккаунт');
    return 'Прежде всего войдите в аккаунт';
  }
  if (!username) {
    announcementMessage('Некорректное имя пользователя');
    return 'Некорректное имя пользователя';
  }
  $api
    .post('/changeUsername', { username: username })
    .then((response) => {
      const data = response.data;
      if (data) {
        localStorage.setItem('username', data);
        renderAccount();
        renderUserProfilePage(localStorage.getItem('id'));
        $('#changeName_input').value = '';
        announcementMessage('Вы успешно сменили имя');
      }
    })
    .catch((error) => console.log('Ошибка:', error));
  return false;
}

/**
 * смена аватара профиля
 */
export function changePhoto() {
  let photoUrl = $('#photoUrl').value.toString().trim();
  if (!photoUrl) {
    alert('Вставьте ссылку на изображение в поле ввода (слева от кнопки)');
    return;
  }
  askConfirmationFromUser('Вы уверены, что хотите сменить аватар?').then(
    (confirmed) => {
      if (confirmed) {
        $api
          .post('/changePhoto', {
            photoUrl: escapeSql(escapeHtml(photoUrl)),
          })
          .then((response) => {
            const data = response.data;
            if (data) {
              localStorage.setItem('avatar', escapeSql(escapeHtml(photoUrl)));
              renderAccount();
              $('#photoUrl').value = '';
              announcementMessage('Вы успешно сменили аватар');
            }
          })
          .catch((error) => console.log('Ошибка:', error));
      }
    },
  );
}

export function changeUserInfo(type) {
  let value = '';
  let infoType = '';
  switch (type) {
    case 'scrollingText':
      value = $('#scrollingText_input').value.toString().trim();
      infoType = 'scrollingText';
      break;
    case 'telegramLink':
      value = $('#telegramLink_input').value.toString().trim();
      infoType = 'telegramLink';
      break;
    case 'steamLink':
      value = $('#steamLink_input').value.toString().trim();
      infoType = 'steamLink';
      break;
    case 'shikimoriLink':
      value = $('#shikimoriLink_input').value.toString().trim();
      infoType = 'shikimoriLink';
      break;
    default:
      break;
  }

  if (!value) {
    alert('Введите данные');
    return;
  } else {
    $api
      .post('/changeUserInfo', {
        value: escapeSql(escapeHtml(value)),
        infoType: infoType,
      })
      .then((response) => {
        const data = response.data;
        if (data) {
          renderUserProfilePage(localStorage.getItem('id'));
          announcementMessage('Вы успешно изменили данные');
        }
      })
      .catch((error) => console.log('Ошибка:', error));
  }
}

/**
 * экранирование текста
 * @param text
 * @returns
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}
function escapeSql(text) {
  return text.replace(/[\0\x08\x09\x1a\n\r"'\\%_]/g, function (char) {
    switch (char) {
      case '\0':
        return '\\0';
      case '\x08':
        return '\\b';
      case '\x09':
        return '\\t';
      case '\x1a':
        return '\\z';
      case '\n':
        return '\\n';
      case '\r':
        return '\\r';
      case '"':
      case "'":
      case '\\':
      case '%':
      case '_':
        return '\\' + char; // экранирование специальных символов
    }
  });
}

/**
 * добавление нового поста
 */
export function addPost(event) {
  //TODO:: photo\file ВАЛИДАЦИЯ
  event.preventDefault();
  const formData = new FormData(this);
  const wallId = formData.get('wallId')?.toString().trim();
  const postText = formData.get('postText')?.toString().trim();
  const photo = formData.get('photo');
  const file = formData.get('file');
  const email = localStorage.getItem('email');
  if (!email) {
    return 'Прежде всего войдите в аккаунт';
  }
  const DATA = {
    wallId,
    postText: postText ? escapeSql(escapeHtml(postText)) : '',
    photo: photo,
    //file: file,
  };
  if (DATA.photo.size === 0) {
    DATA.photo = '';
  }
  $api
    .post('/addPost', DATA, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      const data = response.data;
      if (data) {
        renderUserProfilePage(wallId);
      }
    })
    .catch((error) => console.log('Ошибка:', error));
  return false;
}

/**
 * функция запроса подтверждения у пользователя
 * @param text текст который нужно подтвердить
 */
function askConfirmationFromUser(text) {
  $('#confirmation_text').innerHTML = '';
  return new Promise((resolve, reject) => {
    $('#confirmation_text').innerHTML = text;
    showConfirmationMenu();

    const handleConfirmationYes = () => {
      resolve(true);
      cleanup(); // Удаление eventListener'ов
    };

    const handleConfirmationNo = () => {
      resolve(false);
      cleanup(); // Удаление eventListener'ов
    };

    // Добавление eventListener'ов
    $('#confirmation_yes').addEventListener('click', handleConfirmationYes);
    $('#confirmation_no').addEventListener('click', handleConfirmationNo);

    // Функция для удаления eventListener'ов
    function cleanup() {
      $('#confirmation_yes').removeEventListener(
        'click',
        handleConfirmationYes,
      );
      $('#confirmation_no').removeEventListener('click', handleConfirmationNo);
      hideConfirmationMenu();
    }
  });
}

/**
 * удаление поста
 */
export function deletePost(postId, wallId) {
  //TODO:: тут лучше только посты ререндерить и на сервере проверять права на удаление
  askConfirmationFromUser('Вы уверены, что хотите удалить пост?').then(
    (confirmed) => {
      if (confirmed) {
        $api
          .post('/deletePost', { postId })
          .then((response) => {
            const data = response.data;
            if (data) {
              renderUserProfilePage(wallId);
              announcementMessage('Вы успешно удалили пост');
            }
          })
          .catch((error) => console.log('Ошибка:', error));
      }
    },
  );
}

/**
 * отправка сообщений по клику
 */
export function messageHandler(event) {
  event.preventDefault();
  // const chatID = 'lents@mail.ru';
  try {
    const chatID = $('#data_chatID').getAttribute('data-chatID');
    const content = $('#message_text').value.trim();
    if (!chatID || content == '') {
      announcementMessage('Не отправляйте пустые сообщения');
    } else {
      socketService.sendMessage(content, chatID, localStorage.getItem('id'));
      $('#message_text').value = '';
    }
  } catch (e) {
    announcementMessage('Выберите собеседника');
  }
}

/**
 * show/hide smiles
 */
export function showSmiles() {
  $('#emoji_picker_wrapper')?.classList.toggle('none');
}

/**
 * Добавить текст в окно оповещений
 */
export function announcementMessage(text) {
  $('#announcement_text').innerHTML = '';
  $('#announcement_text').innerHTML = `${text}`;
  showAnnouncementMenu();
}

/**
 * Добавить в друзья
 */
export function addFriend(event) {
  let targetElement = event.target;
  let currentElement = targetElement.closest('.nav_user_add_friend');
  let friendId = currentElement?.getAttribute('data-id');
  $api
    .post('/addFriend', { friendId })
    .then((response) => {
      const data = response.data;
      if (data) {
        announcementMessage('Запрос на добавления в друзья отправлен');
        renderUserProfilePage(friendId);
      }
    })
    .catch((error) => console.log('Ошибка:', error));
}

/**
 * Удалить из друзей
 */
export function removeFriend(event) {
  const targetElement = event.target;
  const currentElement = targetElement.closest('.nav_user_remove_friend');
  const friendId = currentElement?.getAttribute('data-id');
  $api
    .post('/removeFriend', { friendId })
    .then((response) => {
      const data = response.data;
      console.log(data);
      if (data) {
        announcementMessage('Пользователь удален из друзей');
        renderUserProfilePage(friendId);
      }
    })
    .catch((error) => console.log('Ошибка:', error));
}

/**
 * ответ на запрос дружбы
 */
function responseToFriendRequest(friend_id, status) {
  let DATA = {
    friend_id,
    status,
  };
  $api
    .post('/responseToFriendRequest', DATA)
    .then(async (response) => {
      const data = response.data;
      if (data) {
        await renderNotifications();
        await renderUserProfilePage(localStorage.getItem('id'));
      }
    })
    .catch((error) => console.log('Ошибка:', error));
}
