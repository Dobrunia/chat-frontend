import { successfulLogin } from '../core_animation';
import { FormValidationType } from '../types';
import { validation } from './validation';
import { genSaltSync, hashSync } from 'bcrypt-ts';
/**
 * функция афторизации пользователей
 */
const authorizationForm = document.querySelector(
  '#authorizationForm',
) as HTMLInputElement;
authorizationForm?.addEventListener('submit', function (event) {
  event.preventDefault();
  const formData = new FormData(this);
  let email = formData.get('email')?.toString().trim();
  let password = formData.get('password')?.toString().trim();
  const validData: FormValidationType = {
    email,
    password,
  };
  const valRes = validation(validData, 'authorization');
  if (!(valRes === true)) {
    alert(valRes);
  }
  let salt = genSaltSync(10);
  let passwordHash = hashSync(password as string, salt);
  const DATA = {
    email,
    passwordHash,
  };
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(DATA),
  };
  fetch('http://localhost:5000/api/authorization', requestOptions)
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem('accessToken', data.accessToken);
      successfulLogin(); //рендер входа
    })
    .catch((error) => console.log('Ошибка:', error));
  return false;
});
