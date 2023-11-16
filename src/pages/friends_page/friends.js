import { getAndRenderMyInfo } from '../general.js';
import { getAllUsers, getAllMyFriends } from '../general_request.js';

let friendsArray;
let allUsersArray;

async function start() {
  document.getElementById('spinner_wrapper').classList.remove('none');
  await getAndRenderMyInfo();
  document.getElementById('spinner_wrapper').classList.add('none');

  document.getElementById('friends_anim').classList.remove('none');
  friendsArray = await getAllMyFriends();
  renderUsers(document.getElementById('friends'), friendsArray);
  document.getElementById('friends_anim').classList.add('none');

  document.getElementById('all_users_anim').classList.remove('none');
  allUsersArray = await getAllUsers();
  renderUsers(document.getElementById('all_users'), allUsersArray);
  document.getElementById('all_users_anim').classList.add('none');
}
start();

function renderUsers(where, usersArray) {
  where.innerHTML = '';
  usersArray.forEach((user) => {
    where.innerHTML += `<a href="${
      import.meta.env.VITE_SRC + 'pages/profile_page/profile.html?id=' + user.id
    }" 
    class="user_v1" title="${user.username}">
    <img class="user_v1_img" src="${user.avatar}" alt="" />
    <div>
      <div class="user_v1_name ${user.permission === 3 ? 'glitch-text' : ''}">${
      user.username
    }</div>
      <div class="user_v1_info"></div>
    </div>
  </a>`;
  });
  if (usersArray.length < 1) {
    where.innerHTML = '<div style="width: 100%;text-align: center;">Никого не найдено</div>';
  }
}

export function serch(value, where, usersArray) {
  const filteredArray = (
    usersArray === 'friends' ? friendsArray : allUsersArray
  ).filter((obj) => {
    return obj.username.toLowerCase().startsWith(value.toLowerCase());
  });
  renderUsers(where, filteredArray);
}
