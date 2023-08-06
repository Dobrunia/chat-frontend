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

//рендер пользователей для временной регистрации
const temporary_registrition = $('#temporary_registrition');
// import { usersArray } from './main';
// export function renderAccounts(usersList: Array<usersArray>) {
//   console.log("renderAccounts")
//   usersList.forEach((e) => {
//     temporary_registrition &&
//       (temporary_registrition.innerHTML += `<button class="username">${e.username}</button>`);
//   });
// }
const account = $('#account');
const reg_btns = $('#reg_btns');
const my_name = $('#my_name');
import { login } from './main';
export function getIn() {
  const username = document.querySelectorAll('.username');
  console.log(username);
  username.forEach((e) => {
    e.addEventListener('click', (e) => {
      if (my_name) my_name.innerHTML = e.currentTarget.textContent;
      temporary_registrition?.classList.add('none');
      reg_btns?.classList.add('none');
      account?.classList.remove('none');
      login(e.currentTarget.textContent);
    });
  });
  console.log('getIn');
}

//рендер пользователей для временной регистрации

//рендер сообщений
function renderMessage(data: string) {
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
