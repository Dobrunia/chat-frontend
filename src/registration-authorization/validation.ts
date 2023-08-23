import { FormValidationType, ValidationType } from '../models/types';

/**
 * Функция валидации формы
 * @param data
 */
export function validation(data: FormValidationType, type: ValidationType) {
  if (type === 'registration') {
    if (!data.username) {
      return 'Некорректное имя пользователя';
    }
    if (data.password !== data.password2) {
      return 'Пароли не совпадают';
    }
  }
  const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (!data.email || !emailRegex.test(data.email)) {
    return 'Невалидный формат электронной почты';
  }
  if (!data.password) {
    return 'Невалидный формат пароля';
  }
  return true;
}
