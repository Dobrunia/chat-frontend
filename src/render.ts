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
