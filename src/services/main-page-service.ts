import {
  changeSection,
  globalClickAnimation,
  logInView,
  logOutView,
} from '../animation';
import { UsersResponseResult } from '../models/types';
import debounce from 'lodash/debounce';
import { $api } from '../http/api';
import socketService from '../socket/socket-service';
import { functionsIn } from 'lodash';
import fs from 'fs';

export const $ = (element: string) =>
  document.querySelector(element) as HTMLFormElement;

/**
 * проверка авторизовал ли пользователь
 * @returns true - если авторизован, false - если нет
 */
export function isUserLoggedIn(): boolean {
  //TODO:: запрос на проверку
  //return localStorage.getItem('accessToken') != undefined;
}

/**
 * отображение переписки с собеседником
 */
function correspondence(chatID, companionData) {
  const dialogue_with_wrapper = $('#dialogue_with_wrapper');
  dialogue_with_wrapper.innerHTML = '';
  dialogue_with_wrapper.innerHTML = `
        <div class="dialogue_with_text">
          <div class="dialogue_with_name" id="data_chatID" data-chatId="${chatID}">${companionData.username}</div>
          <div class="last_entrance">был в сети час назад</div>
        </div>
        <div class="user_avatar user_avatar_small">
          <img class="user_avatar_img openProfile" src="${companionData.avatar}" alt="" data-id="${companionData.id}"/>
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
  console.log(chatID);
}

/**
 * создания chatId если он отсутствует
 */
function renderChatId(id: string) {
  const currentUserId = localStorage.getItem('id');
  let chatId = '';
  $api
    .get(`/findChatByUserId/${id}?hostUserId=${currentUserId}`)
    .then((response) => {
      if (response.data.length == 0) {
        chatId = `new_${id}_${currentUserId}`;
      } else {
        chatId = response.data[0];
      }
      //TODO:: Отображать собеседника + обновлять чат
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 * отработка глобального клика
 */
export function globalClickHandler(event: MouseEvent) {
  const targetElement = event.target as HTMLElement; // Элемент, на который был совершен клик

  if (targetElement.classList.contains('openProfile')) {
    //добавлять в img класс openProfile и атрибут data-id="${element.id}"
    //TODO:: открытие профиля по id пользователя
    const userId = targetElement.getAttribute('data-id');
    console.log(userId);
  }

  if (
    targetElement.closest('.openDialog') &&
    !targetElement.classList.contains('openProfile')
  ) {
    //добавлять в div класс openDialog и атрибут data-chatId или data-id="${user.id}" data-email="${user.email}"
    const currentElement = targetElement.closest('.openDialog');
    const chatId = currentElement?.getAttribute('data-chatId');
    changeSection('messenger');
    chatId ? userHandler(currentElement, 'chatId') : renderChatId(currentElement.getAttribute('data-id'), currentElement.getAttribute('data-email'));
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
      ).innerHTML += `<div class="element openDialog" id="${id_el}" data-id="${user.id}" data-email="${user.email}">
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
    const search_value = users_search.value.trim();
    if (search_value && search_value !== ' ') {
      $api
        .get(`/find-users?search_value=${search_value}`)
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
 * получение всех пользователей с БД, TODO:: сделать только тех с кем есть переписка
 */
function getAllUsers() {
  return $api
    .get('/allUsers')
    .then((response) => response.data)
    .catch((error) => console.log('Ошибка:', error));
}

/**
 * рендер ативных чатов пользователя
 */
export async function renderChats() {
  const jsonData = await getAllUsers(); //TODO:: тут получать только пользователей с которыми есть переписка и добавить data-chatId
  const chat_search = document.querySelector(
    '#chat_search',
  ) as HTMLInputElement;
  const users = $('#users');
  users.innerHTML = '';
  jsonData.forEach((element: any) => {
    const content = `<div class="line"></div>
      <div class="user openDialog" title="${element.username}" data-id="${element.id}" data-username="${element.username}" data-email="${element.email}" data-avatar="${element.avatar}" data-chatId="${element.id}">
        <div class="user_avatar user_avatar_small">
          <img class="user_avatar_img openProfile" src="${element.avatar}" alt="" data-id="${element.id}"/>
          <div class="status"></div>
        </div>
        <div class="user_info">
          <div class="user_name"><strong>${element.username}</strong></div>
          <div class="user_last_message">${element.last_message}</div>
        </div>
        <div class="user_metric">
          <div>${element.time}</div>
          <span>${element.notifications}</span>
        </div>
      </div>`;
    if (chat_search.value) {
      const regex = new RegExp(chat_search.value, 'gi');
      const matches = element.username.match(regex);
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
  logInView();
  setInfo();
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
  const username = formData.get('username')?.toString().trim();
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
        console.log('Вы успешно сменили имя');
      }
    })
    .catch((error) => console.log('Ошибка:', error));
  return false;
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
      alert('Не отправляйте пустые сообщения'); //TODO:: Нужно сделать окно уведомлений
    } else {
      socketService.sendMessage(content, chatID);
      $('#message_text').value = '';
    }
  } catch (e) {
    alert('Выберите собеседника');
  }
}
