import { FormValidationType } from '../types';
import { validation } from './validation';
import { compareSync } from 'bcrypt-ts';
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
  const DATA = {
    email,
  };
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(DATA),
  };
  fetch('http://localhost:5000/api/authorization', requestOptions)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        if (compareSync(password as string, data)) {
          console.log('successful login');
        } else {
          console.log('incorrect password');
        }
      } else {
        console.log('incorrect email');
      }
    })
    .catch((error) => console.log('Ошибка:', error));
  return false;
});
