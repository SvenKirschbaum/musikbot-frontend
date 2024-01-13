import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import * as ReactDOM from "react-dom";
import Moment from "react-moment";
import moment from "moment/min/moment-with-locales";
import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(moment);
moment.locale(window.navigator.language)
Moment.globalLocale = window.navigator.language;
Moment.globalMoment = moment;
Moment.startPooledTimer(10000);

ReactDOM.render(<App/>, document.getElementById('root'));
