import './style.css';
import './registration-authorization/reg_auth.css';
import { isUserLoggedIn, userIn, userOut } from './services/main-page-service';

export const $ = (element: string) =>
  document.querySelector(element) as HTMLFormElement;

if (isUserLoggedIn()) {
  userIn();
} else {
  userOut();
}
