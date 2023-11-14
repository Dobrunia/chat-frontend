import {
  findUserByName,
  getMyInfo,
  getNotifications,
  responseToFriendRequest,
  saveFriendRequest,
} from './general_request.js';

const $ = (element) => document.querySelector(element);
/**
 * получить свои данные настройки и тд себя как пользователя
 */
export async function getAndRenderMyInfo() {
  const myDATA = await getMyInfo();
  if (myDATA.backgroundStyle) {
    document.getElementById('nav_content').style = myDATA.backgroundStyle;
    $('#nav_sections').style = 'border: none; background: none;';
  } else {
    document.getElementById('nav_content').style = '';
    $('#nav_sections').style = '';
  }

  // Установка значения переменной CSS
  document.documentElement.style.setProperty(
    '--navColor',
    `${myDATA.colorInputNav ? myDATA.colorInputNav : '#ffffff'}`,
  );
  document.documentElement.style.setProperty(
    '--attention',
    `${myDATA.colorInputAttention ? myDATA.colorInputAttention : '#ffc107'}`,
  );
  document.documentElement.style.setProperty(
    '--navLightBg',
    `${myDATA.colorInputNavLightBg ? myDATA.colorInputNavLightBg : '#222222'}`,
  );

  //только для profile page
  // $('#colorInputNav').value = myDATA.colorInputNav
  //   ? myDATA.colorInputNav
  //   : '#ffffff';
  // $('#colorInputAttention').value = myDATA.colorInputAttention
  //   ? myDATA.colorInputAttention
  //   : '#ffc107';
  // $('#colorInputNavLightBg').value = myDATA.colorInputNavLightBg
  //   ? myDATA.colorInputNavLightBg
  //   : '#222222';

  if (myDATA.isRain) {
    makeItRain(0);
  } else {
    makeItRain(100);
  }
  localStorage.setItem('username', myDATA.username);
  $('#my_name').innerHTML = myDATA.username;
  localStorage.setItem('avatar', myDATA.avatar);
  $(
    '#my_avatar',
  ).innerHTML = `<img class="user_avatar_img" src="${myDATA.avatar}" alt="фото профиля" /><div class="status"></div>`;
  await renderNotifications();
}

/* rain */
export function makeItRain(increment) {
  // Clear out everything
  const rainFrontRow = document.querySelector('.rain.front-row');
  const rainBackRow = document.querySelector('.rain.back-row');
  rainFrontRow.innerHTML = '';
  rainBackRow.innerHTML = '';

  // let increment = 0;
  let drops = '';
  let backDrops = '';

  while (increment < 100) {
    // Generate random numbers for various properties
    const randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);
    const randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);
    increment += randoFiver;

    // Create a new raindrop element with random properties
    const frontDrop = document.createElement('div');
    frontDrop.classList.add('drop');
    frontDrop.style.left = `${increment}%`;
    frontDrop.style.bottom = `${randoFiver + randoFiver - 1 + 90}%`;
    frontDrop.style.animationDelay = `0.${randoHundo}s`;
    frontDrop.style.animationDuration = `0.5${randoHundo}s`;
    frontDrop.innerHTML = `
        <div class="stem" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
        <div class="splat" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
      `;
    rainFrontRow.appendChild(frontDrop);

    const backDrop = document.createElement('div');
    backDrop.classList.add('drop');
    backDrop.style.right = `${increment}%`;
    backDrop.style.bottom = `${randoFiver + randoFiver - 1 + 90}%`;
    backDrop.style.animationDelay = `0.${randoHundo}s`;
    backDrop.style.animationDuration = `0.5${randoHundo}s`;
    backDrop.innerHTML = `
        <div class="stem" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
        <div class="splat" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
      `;
    rainBackRow.appendChild(backDrop);
  }
}
/* rain */

/**
 * открытие меню профиля
 */
export function showSmallMenu() {
  $('#avatar_hover').classList.remove('none');
}

/**
 * открытие списка уведомлений
 */
export function showNotificationsMenu() {
  $('#notifications').classList.remove('none');
}

/**
 * поиск собеседников, раз в 500мл проверка, что ввел пользователь и запрос на сервер
 */
export async function searchInputHandler(usernameValue) {
  // const debouncedFunction = debounce(() => {
  //   const users_search = document.querySelector('#users_search');
  //   const userName = escapeSql(escapeHtml(users_search.value.trim()));
  //   if (userName && userName !== ' ') {
  //     renderUsers(findUserByName(userName));
  //   } else {
  //     $('#search_request').innerHTML = '';
  //   }
  // }, 300);
  // debouncedFunction();
  const username = escapeSql(escapeHtml(usernameValue));
  const foundUsers = await findUserByName(username);
  //еще 1 проверка, друг пользователь уже стер данные пака запрос приходил
  const users_search = document.querySelector('#users_search').value.trim();
  if (users_search && users_search !== ' ') {
    renderUsers(foundUsers);
  } else {
    $('#search_request').innerHTML = '';
  }
}

/**
 * закрыть окно оповещений
 */
export function hideAnnouncementMenu() {
  $('#announcement').classList.add('none');
}

/**
 * открыть окно оповещений
 */
function showAnnouncementMenu() {
  $('#announcement').classList.remove('none');
  //$('#nav_elements').classList.add('blur');
}

/**
 * открыть окно подтверждений
 */
function showConfirmationMenu() {
  $('#confirmation').classList.remove('none');
  //$('#nav_elements').classList.add('blur');
}

/**
 * закрыть окно подтверждений
 */
function hideConfirmationMenu() {
  $('#confirmation').classList.add('none');
}

/**
 * функция закрытия при клике вне области
 */
let search_request_counter = 0;
export function globalClickAnimation(event) {
  const targetElement = event.target; // Элемент, на который был совершен клик
  // Проверяем, является ли элемент меню или его потомком
  if (
    !$('#my_avatar')?.contains(targetElement) &&
    !$('#avatar_hover')?.contains(targetElement)
  ) {
    // убираем меню под аватаром (настройки)
    // Клик был совершен вне меню, поэтому закрываем его
    $('#avatar_hover').classList.add('none');
  }

  //скрыть поиск пользователей при 2м клике
  if (!$('#search_request')?.contains(targetElement)) {
    search_request_counter += 1;
  }
  if (search_request_counter === 3) {
    $('#search_request').innerHTML = '';
    $('#users_search').value = '';
    search_request_counter = 0;
  }
  //скрыть поиск пользователей при 2м клике

  //скрыть смайлы
  if (!$('#emoji_picker')?.contains(targetElement)) {
    $('.emoji_picker_wrapper')?.classList.add('none');
  }
  //скрыть смайлы

  //скрыть уведомления
  if (
    !$('#notification_bell')?.contains(targetElement) &&
    !$('#notifications')?.contains(targetElement)
  ) {
    // убираем меню под аватаром (настройки)
    // Клик был совершен вне меню, поэтому закрываем его
    $('#notifications').classList.add('none');
  }
  //скрыть уведомления

  //скрыть оконо оповещений
  if (!$('#announcement')?.contains(targetElement)) {
    hideAnnouncementMenu();
  }
  //скрыть оконо оповещений

  // //скрыть окно UserInfoEditWindow
  // if (
  //   !$('#nav_user_info_edit_window')?.contains(targetElement) &&
  //   !$('#nav_user_info_edit')?.contains(targetElement)
  // ) {
  //   hideUserInfoEditWindow();
  // }
  // //скрыть окно UserInfoEditWindow

  //blur $('#nav_user_info_edit_window').classList.contains('none') &&
  // if (
  //   $('#announcement').classList.contains('none') &&
  //   $('#confirmation').classList.contains('none')
  // ) {
  //   $('#nav_elements').classList.remove('blur');
  // }
  //blur
}

/**
 * получить текцщую дату в формате "3 апр 2015"
 */
export function getCurrentDate() {
  var months = [
    'янв',
    'фев',
    'мар',
    'апр',
    'май',
    'июн',
    'июл',
    'авг',
    'сен',
    'окт',
    'ноя',
    'дек',
  ];

  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = months[currentDate.getMonth()];
  var year = currentDate.getFullYear();

  var formattedDate = day + ' ' + month + ' ' + year;
  return formattedDate;
}

/**
 * рендер уведомлений
 */
export async function renderNotifications() {
  let notificationsNumber = 0;
  let content = '';
  $('#notifications_list').innerHTML = '';
  const isFriend = await getNotifications();
  isFriend.forEach((element) => {
    if (element.status === 'pending') {
      notificationsNumber += 1;
      content += `<div class="user_avatar user_avatar_small notification_user" title="${
        element.username
      }">
      <a href="${
        import.meta.env.VITE_SRC +
        'pages/profile_page/profile.html?id=' +
        element.user_id
      }">
        <img
        class="user_avatar_img openProfile"
        src="${element.avatar}"
        data-id="${element.user_id}"
        alt=""
        />
      </a>
    </div><span class="friendName">${
      element.username
    }</span><br>хочет добавить Вас в друзья<br>
    <div class="reaction responseToFriendRequest" data-id="${
      element.user_id
    }" data-status='accepted'>Принять</div>
    <div class="reaction responseToFriendRequest" data-id="${
      element.user_id
    }" data-status='rejected'>Отказать</div><br><br><br>`;
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
    btn.addEventListener('click', async () => {
      const data = await responseToFriendRequest(
        btn.getAttribute('data-id'),
        btn.getAttribute('data-status'),
      );
      if (data) {
        renderNotifications();
      }
    });
  });
}

/**
 * отрисовка полученных с сервера пользователей при поиске
 * @param users_response_result данные пользователя
 */
function renderUsers(users_response_result) {
  if ($('#search_request') && users_response_result != undefined) {
    $('#search_request').innerHTML = '';
    users_response_result.forEach((user) => {
      const id_el = 'id' + user.id;
      $(
        '#search_request',
      ).innerHTML += `<div class="element openDialog" id="${id_el}" data-id="${
        user.id
      }" data-username="${user.username}" data-email="${
        user.email
      }" data-avatar="${user.avatar}" data-chatid="${user.chatId}" title="${
        user.username
      }">
      <div class="user_avatar user_avatar_small">
        <a href="${
          import.meta.env.VITE_SRC +
          'pages/profile_page/profile.html?id=' +
          user.id
        }">
          <img class="user_avatar_img openProfile" src="${
            user.avatar
          }" alt="" data-id="${user.id}"/>
          <div class="status"></div>
        </a>
      </div>
      <a href="${
        import.meta.env.VITE_SRC
      }pages/messenger_page/messenger.html?chatId=${user.chatId}" class="chat_id_href element_span"><span class="">${
        user.username
      }</span></a>
    </div>`;
    });
  }
}

/**
 * экранирование текста
 * @param text
 * @returns
 */
export function escapeHtml(text) {
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
export function escapeSql(text) {
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
 * функция запроса подтверждения у пользователя
 * @param text текст который нужно подтвердить
 */
export function askConfirmationFromUser(text) {
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
 * Добавить текст в окно оповещений
 */
export function announcementMessage(text) {
  $('#announcement_text').innerHTML = '';
  $('#announcement_text').innerHTML = `${text}`;
  showAnnouncementMenu();
}

export async function addFriend(event) {
  let targetElement = event.target;
  let currentElement = targetElement.closest('.nav_user_add_friend');
  let friendId = currentElement?.getAttribute('data-id');
  const data = await saveFriendRequest(friendId);
  if (data) {
    announcementMessage('Запрос на добавления в друзья отправлен');
  }
}