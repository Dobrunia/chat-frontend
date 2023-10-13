import './style.css';
import './styles/navigation.css';
import './styles/profile.css';
import './registration-authorization/reg_auth.css';
import { isUserLoggedIn, userIn, userOut } from './services/main-page-service';

if (true) {//
  userIn();
} else {
  userOut();
}
