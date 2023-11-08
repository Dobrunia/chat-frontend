import { genSaltSync, hashSync } from 'bcrypt-ts';
import { validation } from './validation.ts';
import { announcementMessage, userOut } from '../services/main-page-service.js';

/**
 * функция регистрации пользователей
 */
export function registration(event) {
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
        announcementMessage('Пользователь c такой почтой уже существует');
      } else {
        userOut();
        announcementMessage('Пользователь успешно зарегистрирован');
      }
    })
    .catch((error) => console.log('Ошибка:', error));
  return false;
}
