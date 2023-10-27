import { FormValidationType } from '../models/types';
import { announcementMessage, userIn } from '../services/main-page-service';
import { validation } from './validation';

/**
 * функция афторизации пользователей
 */
export function authorization(event: any) {
  //TODO:: type
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
  fetch('http://localhost:5000/api/authorization', requestOptions)
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem('id', data.id);
      localStorage.setItem('email', data.email);
      localStorage.setItem('username', data.username);
      localStorage.setItem('avatar', data.avatar);
      localStorage.setItem('accessToken', data.accessToken);
      userIn(); //рендер входа
    })
    .catch((error) => announcementMessage('Неверное имя пользователя или пароль'));
  return false;
}
