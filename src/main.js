import './style.css';
import { $api } from './http/api.ts';
import { validation } from './validation.ts';
import { genSaltSync, hashSync } from 'bcrypt-ts';

const $ = (element) => document.querySelector(element);
/**
 * проверка и авторизация пользователя
 */
async function isUserLoggedInCheck() {
  $api
    .get(`/isUserLoggedInCheck`)
    .then((response) => {
      if (response.data) {
        window.location.href = `./pages/profile_page/profile.html?id=${response.data}`;
      }
    })
    .catch((error) => {
      localStorage.clear();
      toggleModuleWindow('get_in');
    });
}
isUserLoggedInCheck();

/**
 * открытие/закрытие окн регистриции/авторизации
 */
$('#get_in').addEventListener('click', () => toggleModuleWindow('get_in'));
$('#get_in_2').addEventListener('click', () => toggleModuleWindow('get_in'));
$('#get_in_exit').addEventListener('click', () => toggleModuleWindow('exit'));
$('#registration').addEventListener('click', () =>
  toggleModuleWindow('registration'),
);
$('#registration_2').addEventListener('click', () =>
  toggleModuleWindow('registration'),
);
$('#registration_exit').addEventListener('click', () =>
  toggleModuleWindow('exit'),
);

/**
 * функция афторизации пользователей
 */
$('#authorizationForm').addEventListener('submit', authorization);

/**
 * функция регистриции пользователей
 */
$('#registrationForm').addEventListener('submit', registration);

/**
 * функция авторизации пользователей
 */
function authorization(event) {
  event.preventDefault();
  const formData = new FormData(this);
  let email = formData.get('email')?.toString().trim();
  let password = formData.get('password')?.toString().trim();
  const validData = {
    email,
    password,
  };
  const valRes = validation(validData, 'authorization');
  if (!(valRes === true)) {
    alert(valRes);
    return;
  }
  const DATA = {
    email,
    password,
  };
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(DATA),
  };
  fetch(
    `${import.meta.env.VITE_SERVER_HOST}:${
      import.meta.env.VITE_SERVER_PORT
    }/api/authorization`,
    requestOptions,
  )
    .then((response) => response.json())
    .then((data) => {
      if (
        data.message === 'password invalid' ||
        data.message === "Cannot read properties of undefined (reading 'id')"
      ) {
        localStorage.clear();
        toggleModuleWindow('get_in');
        alert('Неверное имя пользователя или пароль');
      } else {
        localStorage.setItem('id', data.id);
        localStorage.setItem('email', data.email);
        localStorage.setItem('username', data.username);
        localStorage.setItem('avatar', data.avatar);
        localStorage.setItem('accessToken', data.accessToken);
        window.location.href = `./pages/profile_page/profile.html?id=${data.id}`;
      }
    })
    .catch((error) => alert('Неверное имя пользователя или пароль'));
  return false;
}

/**
 * функция регистрации пользователей
 */
function registration(event) {
  //TODO:: type
  event.preventDefault();
  const formData = new FormData(this);
  let username = formData.get('username')?.toString().trim();
  let email = formData.get('email')?.toString().trim();
  let password = formData.get('password')?.toString().trim();
  let password2 = formData.get('password2')?.toString().trim();
  const data = {
    username,
    email,
    password,
    password2,
  };
  const valRes = validation(data, 'registration');
  if (!(valRes === true)) {
    alert(valRes);
    return;
  }
  let salt = genSaltSync(10);
  let passwordHash = hashSync(password, salt);
  const DATA = {
    username: username,
    email: email,
    password: passwordHash,
  };
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(DATA),
  };
  fetch(
    `${import.meta.env.VITE_SERVER_HOST}:${
      import.meta.env.VITE_SERVER_PORT
    }/api/registration`,
    requestOptions,
  )
    .then((response) => response.json())
    .then((data) => {
      if (data === false) {
        alert('Пользователь c такой почтой уже существует');
      } else {
        alert('Пользователь успешно зарегистрирован');
        toggleModuleWindow('get_in');
      }
    })
    .catch((error) => console.log('Ошибка:', error));
  return false;
}

/**
 * открытие/закрытие окн регистриции/авторизации
 * @param e тип окна
 */
function toggleModuleWindow(e) {
  if (e === 'get_in') {
    $('#get_in_window').classList.contains('none')
      ? $('#get_in_window').classList.remove('none')
      : true;
    $('#registration_window').classList.contains('none')
      ? true
      : $('#registration_window').classList.add('none');
  } else if (e === 'registration') {
    $('#registration_window').classList.contains('none')
      ? $('#registration_window').classList.remove('none')
      : true;
    $('#get_in_window').classList.contains('none')
      ? true
      : $('#get_in_window').classList.add('none');
  } else if (e === 'exit') {
    $('#get_in_window').classList.contains('none')
      ? true
      : $('#get_in_window').classList.add('none');
    $('#registration_window').classList.contains('none')
      ? true
      : $('#registration_window').classList.add('none');
  }
}
