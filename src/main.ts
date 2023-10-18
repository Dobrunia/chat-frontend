import './style.css';
import './styles/navigation.css';
import './styles/profile.css';
import './registration-authorization/reg_auth.css';
import { isUserLoggedInCheck } from './services/main-page-service';

isUserLoggedInCheck();
// setTimeout(isUserLoggedIn, 5000);
