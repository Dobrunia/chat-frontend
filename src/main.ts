import './style.css';
import './styles/navigation.css';
import './styles/profile.css';
import './registration-authorization/reg_auth.css';
import { isUserLoggedInCheck } from './services/main-page-service';

isUserLoggedInCheck();
// setTimeout(isUserLoggedIn, 5000);
// var blobfile = atob(base64);
//    window.blobFromBlob = new Blob([binaryString], {
//      type: MIMEType
//    });
//    window.blobURL = URL.createObjectURL(window.blobFromBlob);
//    var a = "<a href=\"" + window.blobURL + "\">Binary Blob Link</a>";
//    document.getElementById('byte_content').innerHTML = a;