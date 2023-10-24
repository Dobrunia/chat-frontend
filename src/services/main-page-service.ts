import {
  globalClickAnimation,
  hideConfirmationMenu,
  hideSections,
  logInView,
  logOutView,
  showAnnouncementMenu,
  showConfirmationMenu,
} from '../animation';
import {
  FriendshipStatus,
  SectionType,
  UsersResponseResult,
} from '../models/types';
import debounce from 'lodash/debounce';
import { $api } from '../http/api';
import socketService from '../socket/socket-service';
import { functionsIn, isNull } from 'lodash';
import fs, { statSync } from 'fs';
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
function renderChatHeader(chatId: string, companionData) {
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
function renderMessages(chatId: string, companionData) {
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
function selectChatHandler(elem, chatId: string) {
  const companionData = {
    id: elem.getAttribute('data-id'),
    username: elem.getAttribute('data-username'),
    email: elem.getAttribute('data-email'),
    avatar: elem.getAttribute('data-avatar'),
  };
  $('#messages_wrapper').style.backgroundImage = "url('src/img/ChatbackG.png')";
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
  renderMessages(chatId, companionData);
}

/**
 * создает в бд новый объект chat
 */
async function createNewChat(isPrivate: boolean) {
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
async function writeNewUserInChat(userId: number, chatId: number) {
  return $api
    .post('/writeNewUserInChat', { userId, chatId })
    .then((response) => {
      return response.data.affectedRows;
      // return chatId ? true : false;
    })
    .catch((error) => console.log('Ошибка:', error));
}

/**
 * создания chatId если он отсутствует
 */
async function renderChatId(currentElement) {
  const newPrivateChatId = await createNewChat(true);
  const companionId = currentElement.getAttribute('data-id');
  const request1 = writeNewUserInChat(
    localStorage.getItem('id'),
    newPrivateChatId,
  );
  const request2 = writeNewUserInChat(companionId, newPrivateChatId);
  if ((await request1) && (await request2)) {
    selectChatHandler(currentElement, newPrivateChatId);
  }
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
 * @param myId id пользователя, который делает запрос
 * @param userId id пользователя, к которому на страницу зашел
 * @param status статус запроса в друзья 'pending' | 'accepted' | 'rejected'
 */
function getFriendStatusInfo(
  myId: string,
  userId: string,
  status?: FriendshipStatus,
) {
  return $api
    .get(
      `/getFriendStatusInfo/myId=${myId}/userId=${userId}/status=${
        status ? status : `status`
      }`,
    )
    .then((response) => response.data)
    .catch((error) => console.log('Ошибка:', error));
}

/**
 * рендер уведомлений
 */
async function renderNotifications() {
  let standart = '<div class="notification">Уведомлений нет</div>';
  let content = '';
  $('#notifications_list').innerHTML = '';
  const isFriend = await getFriendStatusInfo(
    `user_id`,
    localStorage.getItem('id'),
  );
  isFriend.forEach((element) => {
    if (element.status === 'pending') {
      content += `<div class="user_avatar user_avatar_small notification_user" title="">
      <img
        class="user_avatar_img openProfile"
        src=""
        data-id="${element.user_id}"
        alt=""
      />
    </div>${element.user_id}&nbsp; хочет добавить Вас в друзья
    <div class="reaction responseToFriendRequest" data-id="${element.user_id}" data-status='accepted'>Принять</div>
    <div class="reaction responseToFriendRequest" data-id="${element.user_id}" data-status='rejected'>Отказать</div></br>`;
    }
  });
  if (isFriend.length === 0) {
    content = standart;
  }
  content === standart
    ? true
    : $('#notification_bell_number').classList.remove('none');
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
  let friendBtn;
  if (userDATA.id.toString() === localStorage.getItem('id')) {
    //TODO:: можно самого себя добавить изменив id в storage
    friendBtn = '';
  } else {
    const isFriend = await getFriendStatusInfo(
      localStorage.getItem('id'),
      userDATA.id.toString(),
    );
    if (!isFriend[0]) {
      friendBtn = `<div class="btn btn-outline-light me-2 nav_user_writeTo openDialog" data-id="${userDATA.id}" title="Открыть переписку с ${userDATA.username}">Написать</div><div class="btn btn-outline-light me-2 nav_user_add_friend" id="nav_user_add_friend" data-id="${userDATA.id}" title="Добавить ${userDATA.username} в друзья"><img src="../src/img/add-friend-svgrepo-com.svg" alt=""/></div>`;
    } else {
      if (isFriend[0].status === 'accepted') {
        //TODO:: проверка есть ли в друзьях
        friendBtn = `<div class="btn btn-outline-light me-2 nav_user_writeTo openDialog" data-id="${userDATA.id}" title="Открыть переписку с ${userDATA.username}">Написать</div><div class="btn btn-outline-light me-2 nav_user_add_friend nav_user_remove_friend" id="nav_user_remove_friend" data-id="${userDATA.id}" title="Удалить из друзей ${userDATA.username}"><img src="../src/img/delete-friend-svgrepo-com.svg" alt=""/></div>`;
      } else if (isFriend[0].status === 'rejected') {
        friendBtn = `<div class="btn btn-outline-light me-2 nav_user_writeTo openDialog" data-id="${userDATA.id}" title="Открыть переписку с ${userDATA.username}">Написать</div><div class="btn btn-outline-light me-2 nav_user_add_friend" id="nav_user_add_friend" data-id="${userDATA.id}" title="Добавить ${userDATA.username} в друзья"><img src="../src/img/add-friend-svgrepo-com.svg" alt=""/></div>`;
      } else if (isFriend[0].status === 'pending') {
        friendBtn = `<div class="btn btn-outline-light me-2 nav_user_writeTo openDialog" data-id="${userDATA.id}" title="Открыть переписку с ${userDATA.username}">Написать</div>`;
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
  </div>
  <div class="nav_user_info">
    <div class="nav_user_info_text"></div>
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
          required
        ></textarea>
        <div class="nav_user_wall_files_wrapper">
          <div class="emoji_picker" id="emoji_picker">
            <!-- Здесь может быть панель с эмодзи для выбора -->
            <!-- Например, используя библиотеку как EmojiMart -->
            <img src="./src/img/smile.svg" alt="" />
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
            <img src="./src/img/Picture.svg" alt="" />
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
  const myId = localStorage.getItem('id');
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
        myId === element.wallId.toString()
          ? (content += `<div class="delete_post" data-postId="${element.id}" data-wallId="${element.wallId}" title="Удалить пост">x</div>`)
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
          </div>${content}</div>`,
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
function getAllFriendsIfnfo(userId: string | null) {
  return $api
    .get(`/getAllFriendsIfnfo/${userId}`)
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
  const friendsArray = await getAllFriendsIfnfo(userDATA.id);
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

async function renderUserProfilePage(userId: string | null) {
  const userDATA = await findUserById(userId);
  await renderProfilePage(userDATA);
  await renderUsersPosts(userDATA);
  await renderUsersFriends(userDATA);
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
    const users_search = document.querySelector(
      '#users_search',
    ) as HTMLInputElement;
    const userName = escapeSql(escapeHtml(users_search.value.trim()));
    const myId = localStorage.getItem('id');
    if (userName && userName !== ' ') {
      $api
        .get(`/findUserByName/${userName}/${myId}`)
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
 * сохраняет сообщение в БД
 */
export function saveMessageToDb(message) {
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
export function handlerMessageEvent(event: CustomEvent) {
  let datetime = new Date();
  let message = {
    chatId: event.detail.chatId,
    sendBy: event.detail.message.from,
    datetime,
    content: escapeSql(escapeHtml(event.detail.message.content)),
  };
  saveMessageToDb(message);
  renderMessage(message);
}

/**
 * рендер сообщений
 * @param content текст сообщения
 */
export function renderMessage(message) {
  const messagesWrapper = $('#messages') as HTMLFormElement;
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
  let userId = localStorage.getItem('id');
  let photoUrl = $('#photoUrl').value.toString().trim();
  if (!photoUrl) {
    alert('Вставьте ссылку на изображение в поле ввода (слева от кнопки)');
    return;
  }
  if (!userId) return;
  askConfirmationFromUser('Вы уверены, что хотите сменить аватар?').then(
    (confirmed) => {
      if (confirmed) {
        $api
          .post('/changePhoto', {
            userId,
            photoUrl: escapeSql(escapeHtml(photoUrl)),
          })
          .then((response) => {
            const data = response.data;
            if (data) {
              localStorage.setItem('avatar', escapeSql(escapeHtml(photoUrl)));
              renderAccount();
              ($('#photoUrl') as HTMLFormElement).value = '';
              announcementMessage('Вы успешно сменили аватар');
            }
          })
          .catch((error) => console.log('Ошибка:', error));
      }
    },
  );
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
function askConfirmationFromUser(text: string) {
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
export function deletePost(postId: string, wallId: string) {
  //TODO:: тут лучше только посты ререндерить
  const myId = localStorage.getItem('id');
  if (myId !== wallId) return; //Доп вроверка
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
export function messageHandler(event: any) {
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
function announcementMessage(text: string) {
  $('#announcement_text').innerHTML = '';
  $('#announcement_text').innerHTML = `${text}`;
  showAnnouncementMenu();
}

/**
 * Добавить в друзья
 */
export function addFriend(event: MouseEvent) {
  let targetElement = event.target as HTMLElement;
  let currentElement = targetElement.closest('.nav_user_add_friend');
  let friendId = currentElement?.getAttribute('data-id');
  let DATA = {
    myId: localStorage.getItem('id'),
    friendId: friendId,
  };
  $api
    .post('/addFriend', DATA)
    .then((response) => {
      const data = response.data;
      if (data) {
        announcementMessage('Пользователь добавлен в друзья');
        renderUserProfilePage(friendId);
      }
    })
    .catch((error) => console.log('Ошибка:', error));
}

/**
 * Удалить из друзей
 */
export function removeFriend(event: MouseEvent) {
  const targetElement = event.target as HTMLElement;
  const currentElement = targetElement.closest('.nav_user_remove_friend');
  const friendId = currentElement?.getAttribute('data-id');
  let DATA = {
    myId: localStorage.getItem('id'),
    friendId: friendId,
  };
  $api
    .post('/removeFriend', DATA)
    .then((response) => {
      const data = response.data;
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
function responseToFriendRequest(friend_id: string, status: string) {
  let DATA = {
    myId: localStorage.getItem('id'),
    friend_id,
    status,
  };
  $api
    .post('/responseToFriendRequest', DATA)
    .then((response) => {
      const data = response.data;
      if (data) {
        renderNotifications();
      }
    })
    .catch((error) => console.log('Ошибка:', error));
}
