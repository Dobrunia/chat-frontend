import './style.css';
import './styles/navigation.css';
import './registration-authorization/reg_auth.css';
import { isUserLoggedIn, userIn, userOut } from './services/main-page-service';

if (isUserLoggedIn()) {
  userIn();
} else {
  userOut();
}
