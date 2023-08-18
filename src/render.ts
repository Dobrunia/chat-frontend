//рендер списка активных чатов
import listProject from './jsons/chats.json';
const $ = (element: string) => document.querySelector(element);
const chat_search = $('#chat_search') as HTMLInputElement;
const users = $('#users') as HTMLFormElement;
function renderChats() {
  users.innerHTML = '';
  listProject.forEach((element: any) => {
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
}
renderChats();
chat_search.addEventListener('input', renderChats);
//рендер списка активных чатов

//рендер сообщений
export function renderMessage(data: string) {
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
        ${data}
      </div>
      <div class="user_avatar user_avatar_small"></div>
    </div>`;
}
//рендер сообщений

//рендер поиска пользователей
import { ajaxGet } from './ajax';
import debounce from 'lodash/debounce';
import { UsersResponseResult } from './types';

const users_search = $('#users_search') as HTMLInputElement;
const search_request = $('#search_request');
function render(users_response_result: UsersResponseResult) {
  if (search_request && users_response_result != undefined) {
    search_request.innerHTML = '';
    users_response_result.forEach((user) => {
      search_request.innerHTML += `<div class="element">
      <div class="user_avatar user_avatar_small">
        <img class="user_avatar_img" src="${user.avatar}" alt="" />
        <div class="status"></div>
      </div>
      <span class="element_span">${user.username}</span>
    </div>`;
    });
  }
}
users_search?.addEventListener(
  'input',
  debounce(() => {
    let search_value = users_search.value.trim();
    if (search_value && search_value != ' ') {
      ajaxGet(`/find-users?search_value=${search_value}`, render);
    } else {
      search_request.innerHTML = '';
    }
  }, 500),
); // установите задержку в миллисекундах, например 500

//рендер поиска пользователей `http://localhost:5000/api/find-users/:${search_value}`
