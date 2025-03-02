import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import * as ReactDOM from "react-dom/client";
import moment from "moment/min/moment-with-locales";
import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(moment);
moment.locale(window.navigator.language)

ReactDOM.createRoot(document.getElementById('root')).render(
    <App/>
);
