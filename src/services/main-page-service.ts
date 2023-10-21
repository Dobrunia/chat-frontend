import {
  globalClickAnimation,
  hideSections,
  logInView,
  logOutView,
} from '../animation';
import { FriendshipStatus, SectionType, UsersResponseResult } from '../models/types';
import debounce from 'lodash/debounce';
import { $api } from '../http/api';
import socketService from '../socket/socket-service';
import { functionsIn, isNull } from 'lodash';
import fs from 'fs';
import { makeCats } from '../pages/cats';

export const $ = (element: string) =>
  document.querySelector(element) as HTMLFormElement;

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
    return console.log('dfdfdf');
  }
}

/**
 * функция генерации chatID
 */
function generateChatID(companionEmail: string) {
  const myEmail = localStorage.getItem('email');
  const emails = [myEmail, companionEmail];
  const sortedEmails = emails.sort();
  return sortedEmails[0] + sortedEmails[1] + '';
}

/**
 * отображение переписки с собеседником
 */
function correspondence(chatID: string, companionData) {
  const dialogue_with_wrapper = $('#dialogue_with_wrapper');
  dialogue_with_wrapper.innerHTML = '';
  dialogue_with_wrapper.innerHTML = `
        <div class="dialogue_with_text">
          <div class="dialogue_with_name" id="data_chatID" data-chatId="${chatID}">${companionData.username}</div>
          <div class="last_entrance">был в сети час назад</div>
        </div>
        <div class="user_avatar user_avatar_small">
          <img class="user_avatar_img openProfile" src="${companionData.avatar}" alt="" data-id="${companionData.id}" title="${companionData.username}"/>
          <div class="status"></div>
        </div>`;
}

/**
 * обработка клика по чату с собеседником
 */
function userHandler(elem, chatID: string) {
  const companionData = {
    id: elem.getAttribute('data-id'),
    username: elem.getAttribute('data-username'),
    email: elem.getAttribute('data-email'),
    avatar: elem.getAttribute('data-avatar'),
  };
  correspondence(chatID, companionData);
}

/**
 * создания chatId если он отсутствует
 */
function renderChatId(currentElement) {
  // const currentUserId = localStorage.getItem('id');
  // let chatId = '';
  // $api
  //   .get(`/findChatByUserId/${id}?hostUserId=${currentUserId}`)
  //   .then((response) => {
  //     if (response.data.length == 0) {
  //       chatId = `new_${id}_${currentUserId}`;
  //     } else {
  //       chatId = response.data[0];
  //     }
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
  const companionEmail = currentElement.getAttribute('data-email');
  const companionId = currentElement.getAttribute('data-id');
  userHandler(currentElement, generateChatID(companionEmail)); //TODO:: сохранять chatId в БД
}

/**
 * смена выбранной секции в навигации
 */
export function changeSection(data_section: SectionType, userId?: string) {
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
    default:
      hideSections('hideAll');
      break;
  }
}

/**
 * поиск данных для страницы профиля пользователя и запуск отрисовки
 */
async function findUserById(userId: string | null) {
  try {
    const response = await $api.get(`/find-user-by-id?search_value=${userId}`);
    return response.data[0];
  } catch (error) {
    throw error;
  }
}

/**
 * функция получения статуса дружбы
 * @param userId id пользователя, который делает запрос
 * @param status статус запроса в друзья 'pending' | 'accepted' | 'rejected'
 */
function getFriendStatusInfo(userId: string, status: FriendshipStatus) {
  return $api
  .get(`/getFriendStatusInfo/userId=${userId}/status=${status}`)
  .then((response) => response.data)
  .catch((error) => console.log('Ошибка:', error));
}

/**
 * рендер верстки страницы пользователя
 */
async function renderProfilePage(userDATA) {
  let friendBtn = `<div class="btn btn-outline-light me-2 nav_user_writeTo openDialog" data-id="${userDATA.id}" title="Открыть переписку с ${userDATA.username}">Написать</div><div class="btn btn-outline-light me-2 nav_user_add_friend" title="Добавить ${userDATA.username} в друзья"><img src="../src/img/add-friend-svgrepo-com.svg" alt=""/></div>`;
  if (userDATA.id.toString() === localStorage.getItem('id')) {
    friendBtn = '';
  }
  const fgfg = await getFriendStatusInfo(localStorage.getItem('id'), 'accepted');
  console.log(fgfg)
  if (false) {
    //TODO:: проверка есть ли в друзьях
    friendBtn = `<div class="btn btn-outline-light me-2 nav_user_writeTo openDialog" data-id="${userDATA.id}" title="Открыть переписку с ${userDATA.username}">Написать</div><div class="btn btn-outline-light me-2 nav_user_add_friend" title="Удалить из друзей ${userDATA.username}"><img src="../src/img/delete-friend-svgrepo-com.svg" alt=""/></div>`;
  }
//   $('#profile_page').innerHTML = '';
//   $('#profile_page').innerHTML = `<div class="nav_profile_header">
//   <div class="nav_profile_avatar">
//     <img
//       class="nav_profile_avatar_img"
//       src="${userDATA.avatar}"
//       alt=""
//     />
//     <div class="nav_status"></div>
//   </div>
//   <div class="nav_profile_name">${userDATA.username}</div>
// </div>
// <div class="nav_user_info">
//   <div class="nav_user_info_text">
//     Id: ${userDATA.id} email: ${userDATA.email}
//   </div>
//   ${friendBtn}
// </div>
// <div class="nav_user_wall_wrapper">
//   <div class="nav_user_wall">
//     <form
//       id="addPost"
//       class="nav_user_wall_postForm"
//       enctype="multipart/form-data"
//       role="form"
//     >
//       <textarea
//         name="postText"
//         class="nav_user_wall_postTextarea"
//         id="postText"
//         placeholder="Что у Вас нового..."
//         oninput="autoResize(this)"
//         required
//       ></textarea>
//       <div class="nav_user_wall_files_wrapper">
//         <div class="emoji_picker" id="emoji_picker">
//           <!-- Здесь может быть панель с эмодзи для выбора -->
//           <!-- Например, используя библиотеку как EmojiMart -->
//           <img src="./src/img/smile.svg" alt="" />
//           <div
//             class="emoji_picker_wrapper none"
//             id="emoji_picker_wrapper"
//           ></div>
//         </div>
//         <input
//           id="photo"
//           type="file"
//           name="photo"
//           accept="image/*"
//           style="display: none"
//         />
//         <label
//           for="photo"
//           class="photo-icon picker"
//           title="Загрузить фото"
//         >
//           <img src="./src/img/Picture.svg" alt="" />
//         </label>
//         <input
//           id="file"
//           type="file"
//           name="file"
//           multiple
//           style="display: none"
//         />
//         <label
//           for="file"
//           class="file-icon picker"
//           title="Загрузить файл"
//         >
//           <img src="./src/img/File.svg" alt="" />
//         </label>
//         <input
//           id="wallId"
//           type="text"
//           value="${userDATA.id}"
//           name="wallId"
//           style="display: none"
//         />
//         <button type="submit" class="btn btn-outline-light me-2">
//           Опубликовать
//         </button>
//       </div>
//     </form>
//     <div class="nav_user_wall_wrapper_posts" id="nav_user_wall_wrapper_posts"></div>
//   </div>
//   <div class="nav_users_friends">
//     <div class="nav_friends nav_friends_line">
//       Друзья онлайн <span>2</span>
//       <div class="nav_friends_wrapper">
//         <div class="user_avatar user_avatar_small">
//           <img
//             class="user_avatar_img"
//             src="./src/img/1.jpg"
//             alt=""
//           />
//           <div class="status"></div>
//         </div>
//         <div class="user_avatar user_avatar_small">
//           <img
//             class="user_avatar_img"
//             src="./src/img/1.jpg"
//             alt=""
//           />
//           <div class="status"></div>
//         </div>
//         <div class="user_avatar user_avatar_small">
//           <img
//             class="user_avatar_img"
//             src="./src/img/1.jpg"
//             alt=""
//           />
//           <div class="status"></div>
//         </div>
//         <div class="user_avatar user_avatar_small">
//           <img
//             class="user_avatar_img"
//             src="./src/img/1.jpg"
//             alt=""
//           />
//           <div class="status"></div>
//         </div>
//         <div class="user_avatar user_avatar_small">
//           <img
//             class="user_avatar_img"
//             src="./src/img/1.jpg"
//             alt=""
//           />
//           <div class="status"></div>
//         </div>
//         <div class="user_avatar user_avatar_small">
//           <img
//             class="user_avatar_img"
//             src="./src/img/1.jpg"
//             alt=""
//           />
//           <div class="status"></div>
//         </div>
//         <div class="user_avatar user_avatar_small">
//           <img
//             class="user_avatar_img"
//             src="./src/img/1.jpg"
//             alt=""
//           />
//           <div class="status"></div>
//         </div>
//       </div>
//     </div>
//     <div class="nav_friends">
//       Друзья <span>10</span>
//       <div class="nav_friends_wrapper">
//         <div class="user_avatar user_avatar_small">
//           <img
//             class="user_avatar_img"
//             src="./src/img/1.jpg"
//             alt=""
//           />
//           <div class="status"></div>
//         </div>
//         <div class="user_avatar user_avatar_small">
//           <img
//             class="user_avatar_img"
//             src="./src/img/1.jpg"
//             alt=""
//           />
//           <div class="status"></div>
//         </div>
//         <div class="user_avatar user_avatar_small">
//           <img
//             class="user_avatar_img"
//             src="./src/img/1.jpg"
//             alt=""
//           />
//           <div class="status"></div>
//         </div>
//         <div class="user_avatar user_avatar_small">
//           <img
//             class="user_avatar_img"
//             src="./src/img/1.jpg"
//             alt=""
//           />
//           <div class="status"></div>
//         </div>
//         <div class="user_avatar user_avatar_small">
//           <img
//             class="user_avatar_img"
//             src="./src/img/1.jpg"
//             alt=""
//           />
//           <div class="status"></div>
//         </div>
//         <div class="user_avatar user_avatar_small">
//           <img
//             class="user_avatar_img"
//             src="./src/img/1.jpg"
//             alt=""
//           />
//           <div class="status"></div>
//         </div>
//         <div class="user_avatar user_avatar_small">
//           <img
//             class="user_avatar_img"
//             src="./src/img/1.jpg"
//             alt=""
//           />
//           <div class="status"></div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>`;
}

/**
 * поиск и отрисовка постов на странице пользователя
 */
async function renderUsersPosts(userDATA) {
  //TODO:: emoji_picker вынести переделать SQL
  $api
    .get(`/get-user-posts?search_value=${userDATA.id}`)
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
        if (userDATA.id === element.authorId) {
          $('#nav_user_wall_wrapper_posts').insertAdjacentHTML(
            'afterbegin',
            `<div class="nav_user_wall_post">
          <div class="user_avatar user_avatar_small" title="${userDATA.username}">
                <img
                  class="user_avatar_img openProfile"
                  src="${userDATA.avatar}"
                  data-id="${userDATA.id}"
                  alt=""
                />
                <div class="status"></div>
          </div>${content}`,
          );
        } else {
          let authorDATA = await findUserById(element.authorId);
          $('#nav_user_wall_wrapper_posts').insertAdjacentHTML(
            'afterbegin',
            `<div class="nav_user_wall_post">
          <div class="user_avatar user_avatar_small" title="${authorDATA.username}">
                <img
                  class="user_avatar_img openProfile"
                  src="${authorDATA.avatar}"
                  data-id="${authorDATA.id}"
                  alt=""
                />
                <div class="status"></div>
          </div>${content}</div>`,
          );
        }
      }

      /**
       * наполнение смайликов
       */
      function insertEmoji(emoji) {
        document.getElementById('postText').value += emoji.native;
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
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 * общий рендер страницы пользователя
 */
async function renderUserProfilePage(userId: string | null) {
  const userDATA = await findUserById(userId);
  renderProfilePage(userDATA);
  renderUsersPosts(userDATA);
}

/**
 * отработка глобального клика
 */
export function globalClickHandler(event: MouseEvent) {
  const targetElement = event.target as HTMLElement; // Элемент, на который был совершен клик

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
    chatId ? userHandler(currentElement, chatId) : renderChatId(currentElement);
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
  my_name
    ? (my_name.innerHTML = username as string)
    : console.log('my_name не найден');
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
    themesList.default.forEach((theme: any) => {
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
function renderUsers(users_response_result: UsersResponseResult) {
  if ($('#search_request') && users_response_result != undefined) {
    $('#search_request').innerHTML = '';
    users_response_result.forEach((user) => {
      const id_el = 'id' + user.id;
      $(
        '#search_request',
      ).innerHTML += `<div class="element openDialog" id="${id_el}" data-id="${user.id}" data-username="${user.username}" data-email="${user.email}" data-avatar="${user.avatar}" title="${user.username}">
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
    const users_search = document.querySelector(
      '#users_search',
    ) as HTMLInputElement;
    const search_username_value = escapeSql(
      escapeHtml(users_search.value.trim()),
    );
    if (search_username_value && search_username_value !== ' ') {
      $api
        .get(`/find-users?search_value=${search_username_value}`)
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
function getUsersChats() {
  return $api
    .get(`/returnActiveChats/${localStorage.getItem('id')}`)
    .then((response) => response.data)
    .catch((error) => console.log('Ошибка:', error));
}

/**
 * рендер ативных чатов пользователя
 */
export async function renderChats() {
  const jsonData = await getUsersChats();
  const chat_search = document.querySelector(
    '#chat_search',
  ) as HTMLInputElement;
  const users = $('#users');
  users.innerHTML = '';
  jsonData.forEach((element: any) => {
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
 * рендер сообщений
 * @param content текст сообщения
 */
export function renderMessage(event: CustomEvent) {
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
    <div class="message ${event.detail.message.from === 'me' ? 'my' : 'from'}">
      <div class="message_metric">${formatter2.format(
        date,
      )}<br />${formatter1.format(date)}</div>
      <div class="message_text">
        ${event.detail.message.content}
      </div>
      <div class="user_avatar user_avatar_small"></div>
    </div>`;
}

/**
 * вызывает установщики информации во всех местах + socket
 */
function setInfo() {
  let email = localStorage.getItem('email');
  console.log(socketService);
  if (email) {
    socketService.login(email);
  }
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
export function changeUsername(event: any) {
  event.preventDefault();
  const formData = new FormData(this);
  const username = escapeSql(
    escapeHtml(formData.get('username')?.toString().trim()),
  );
  const email = localStorage.getItem('email');
  if (!email) {
    return 'Прежде всего войдите в аккаунт';
  }
  if (!username) {
    //TODO:: привезать к общей ф-ии валидации
    return 'Некорректное имя пользователя';
  }
  $api
    .post('/changeUsername', { username: username, email: email })
    .then((response) => {
      const data = response.data;
      if (data) {
        localStorage.setItem('username', data);
        renderAccount();
        ($('#changeName_input') as HTMLFormElement).value = '';
        alert('Вы успешно сменили имя');
      }
    })
    .catch((error) => console.log('Ошибка:', error));
  return false;
}

/**
 * экранирование текста
 * @param text
 * @returns
 */
function escapeHtml(text: string) {
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
function escapeSql(text: string) {
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
export function addPost(event: any) {
  //TODO:: photo\file ВАЛИДАЦИЯ
  event.preventDefault();
  const formData = new FormData(this);
  const wallId = formData.get('wallId')?.toString().trim();
  const authorId = localStorage.getItem('id');
  const postText = formData.get('postText')?.toString().trim();
  const photo = formData.get('photo');
  const file = formData.get('file');
  const email = localStorage.getItem('email');
  if (!email) {
    return 'Прежде всего войдите в аккаунт';
  }
  const DATA = {
    wallId,
    authorId,
    postText: postText ? escapeSql(escapeHtml(postText)) : '',
    photo: photo,
    file: file,
  };
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
        console.log('пост добавлен');
      }
    })
    .catch((error) => console.log('Ошибка:', error));
  return false;
}

/**
 * отправка сообщений по клику
 */
export function messageHandler(event: any) {
  //TODO:: Нужно сделать окно уведомлений
  event.preventDefault();
  // const chatID = 'lents@mail.ru';
  try {
    const chatID = $('#data_chatID').getAttribute('data-chatID');
    const content = $('#message_text').value.trim();
    if (!chatID || content == '') {
      alert('Не отправляйте пустые сообщения');
    } else {
      socketService.sendMessage(content, chatID);
      $('#message_text').value = '';
    }
  } catch (e) {
    alert('Выберите собеседника');
  }
}

/**
 * show/hide smiles
 */
export function showSmiles() {
  $('#emoji_picker_wrapper')?.classList.toggle('none');
}
