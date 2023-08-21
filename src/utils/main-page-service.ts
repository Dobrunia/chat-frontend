import { $ } from '../main';
import { logInView } from '../animation';
import { UsersResponseResult } from '../types';
import debounce from 'lodash/debounce';

/**
 * проверка авторизовал ли пользователь
 * @returns true - если авторизован, false - если нет
 */
export function isUserLoggedIn(): boolean {
  let accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    return true;
  } else {
    return false;
  }
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
 * отрисовка полученных с сервера пользователей
 * @param users_response_result данные пользователя
 */
function renderUsers(users_response_result: UsersResponseResult) {
  if ($('#search_request') && users_response_result != undefined) {
    $('#search_request').innerHTML = '';
    users_response_result.forEach((user) => {
      $('#search_request').innerHTML += `<div class="element">
      <div class="user_avatar user_avatar_small">
        <img class="user_avatar_img" src="${user.avatar}" alt="" />
        <div class="status"></div>
      </div>
      <span class="element_span">${user.username}</span>
    </div>`;
    });
  }
}

/**
 * запрос на сервер для получения совпадающих пользователей
 * @param url end-point на сервере, для получения пользователей по поиску
 */
function ajaxGet(url: string) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `http://localhost:5000/api${url}`, false);
  xhr.onloadend = function () {
    if (xhr.status == 200) {
      renderUsers(JSON.parse(xhr.responseText));
    }
  };
  xhr.send();
}

/**
 * раз в 500мл проверка, что ввел пользователь и запрос на сервер
 */
export function searchInputHandler() {
  const debouncedFunction = debounce(() => {
    const users_search = document.querySelector('#users_search') as HTMLInputElement;
    const search_value = users_search.value.trim();
    if (search_value && search_value !== ' ') {
      ajaxGet(`/find-users?search_value=${search_value}`);
    } else {
      $('#search_request').innerHTML = '';
    }
  }, 500);
  debouncedFunction();
}

/**
 * рендер ативных чатов пользователя
 */
export function renderChats() {
  import('../jsons/chats.json').then((activeChats) => {
    const chat_search = document.querySelector(
      '#chat_search',
    ) as HTMLInputElement;
    const users = $('#users');
    users.innerHTML = '';
    activeChats.default.forEach((element: any) => {
      if (chat_search.value) {
        const regex = new RegExp(chat_search.value, 'gi');
        const matches = element.name.match(regex);
        if (matches) {
          //поиск по имени собеседника
          users.innerHTML += `<div class="line"></div>
        <div class="user">
          <div class="user_avatar user_avatar_big">
            <div class="status"></div>
          </div>
          <div class="user_info">
            <div class="user_name"><strong>${element.name}</strong></div>
            <div class="user_last_message">${element.last_message}</div>
          </div>
          <div class="user_metric">
            <div>${element.time}</div>
            <span>${element.notifications}</span>
          </div>
        </div>`;
        }
      } else {
        users.innerHTML += `<div class="line"></div>
        <div class="user">
          <div class="user_avatar user_avatar_big">
            <div class="status"></div>
          </div>
          <div class="user_info">
            <div class="user_name"><strong>${element.name}</strong></div>
            <div class="user_last_message">${element.last_message}</div>
          </div>
          <div class="user_metric">
            <div>${element.time}</div>
            <span>${element.notifications}</span>
          </div>
        </div>`;
      }
    });
  });
}

/**
 * рендер сообщений
 * @param content текст сообщения
 */
function renderMessage(content: string) {
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
    <div class="message my">
      <div class="message_metric">${formatter2.format(
        date,
      )}<br />${formatter1.format(date)}</div>
      <div class="message_text">
        ${content}
      </div>
      <div class="user_avatar user_avatar_small"></div>
    </div>`;
}

/**
 * вызывает установщики информации во всех местах
 */
function setInfo() {
  let email = localStorage.getItem('email');
  let accessToken = localStorage.getItem('accessToken');
  let refreshToken = localStorage.getItem('refreshToken');
  renderAccount();
  renderThemes();
  renderChats();
}

/**
 * запускать при входе пользователя анимация + данные
 */
export function userIn() {
  logInView();
  setInfo();
}
