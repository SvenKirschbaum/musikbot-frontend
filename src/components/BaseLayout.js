import {Component, Fragment, useState} from 'react';
import {Link} from "react-router-dom";
import CookieConsent from 'react-cookie-consent';
import Col from 'react-bootstrap/Col';
import {CSSTransition} from 'react-transition-group';

import Clock from './Clock.js';
import Version from './Version.js';

import GravatarIMG from "./GravatarIMG";
import Alerts from "./Alerts";
import Config from "./Configuration";
import useUser from "../hooks/user";
import {useKeycloak} from "@react-keycloak/web";

import {TbPlaylist} from "react-icons/tb";
import {MdMusicOff, MdPlaylistAdd} from "react-icons/md";
import {IoStatsChart} from "react-icons/io5";
import {AiOutlineFileText} from "react-icons/ai";
import {BiLogOut} from "react-icons/bi";
import {GiJumpAcross} from "react-icons/gi";
import {FiUsers} from "react-icons/fi";
import {FaHome, FaUserCog} from "react-icons/fa";
import {BsBootstrapReboot} from "react-icons/bs";


class BaseLayout extends Component {

    render() {
        return (
            <Fragment>
                <div className="page-body">
                    <CookieConsent
                        location="top"
                        cookieSecurity={true}
                        sameSite="strict"
                        style={{background: "black"}}
                    >
                        This website uses cookies to ensure you get the best experience on our website. <a
                        className="cookielink" href="https://cookiesandyou.com/">Learn more</a>
                    </CookieConsent>
                    {Config.showversion && <Version/>}
                    <Alerts/>
                    {this.props.children}
                </div>
                <Footer/>
            </Fragment>
        );
    }
}

function Footer() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <Fragment>
            <CSSTransition
                classNames="slideup"
                timeout={300}
                unmountOnExit
                in={isMenuOpen}>
                <Menu onItemClick={() => setIsMenuOpen(false)}/>
            </CSSTransition>
            {Config.showfooter &&
                <footer className="d-flex flex-row justify-content-between g-0">
                    <Col className="text-start">
                        {Config.enableusers &&
                            <LoginFooter onMenu={() => setIsMenuOpen(!isMenuOpen)}/>}
                    </Col>
                    <Col className="text-center">
                        {Config.showstats && <Link to="/statistik">Statistik</Link>}
                    </Col>
                    <Col className="text-end">
                        {Config.showrights && <a href={Config.rightslink}>Impressum<span
                            className="d-none d-sm-inline">/Disclaimer/Datenschutz</span></a>}

                        {Config.showclock && <Clock className="clock d-none d-md-inline"/>}
                    </Col>
                </footer>
            }
        </Fragment>
    );
}

function LoginFooter(props) {

    const user = useUser();
    const {keycloak} = useKeycloak();

    if (user) {
        return (
            <span className="LoginFooter">
                <Link to={`/user/${user.name}`}>
                    <GravatarIMG>{user.gravatarId}</GravatarIMG>
                    <span><span className="d-none d-sm-inline">Willkommen </span>{user.name}</span>
                </Link>
                <Link to="#" onClick={props.onMenu}>Menü</Link>
            </span>
        );
    }
    else {
        return (
            <span className="LoginFooter">
                <Link to="#" onClick={keycloak.login}>Login</Link>
            </span>
        );
    }
}

function Menu(props) {

    const user = useUser();
    const {keycloak} = useKeycloak();

    return (
        <nav className="menu">
            <MenuEntry
                to="/"
                icon={<FaHome/>}
                displayName={'Startseite'}
                onItemClick={props.onItemClick}
            />
            {Config.showarchive &&
                <MenuEntry
                    to="/archiv"
                    icon={<TbPlaylist/>}
                    displayName={'Archiv'}
                    onItemClick={props.onItemClick}
                />
            }
            {Config.showstats &&
                <MenuEntry
                    to="/statistik"
                    icon={<IoStatsChart/>}
                    displayName={'Statistik'}
                    onItemClick={props.onItemClick}
                />
            }
            {user && user.admin &&
                <Fragment>
                    <MenuEntry
                        to="/import"
                        icon={<MdPlaylistAdd/>}
                        displayName={'Playlist Importieren'}
                        onItemClick={props.onItemClick}
                    />
                    <MenuEntry
                        to="/songs"
                        icon={<MdMusicOff/>}
                        displayName={'Gesperrte Songs'}
                        onItemClick={props.onItemClick}
                    />
                    <MenuEntry
                        to="/gapcloser"
                        icon={<GiJumpAcross/>}
                        displayName={'Gapcloser'}
                        onItemClick={props.onItemClick}
                    />
                    <MenuEntry
                        to="/log"
                        icon={<AiOutlineFileText/>}
                        displayName={'Log'}
                        onItemClick={props.onItemClick}
                    />
                    <MenuEntry
                        to="/users"
                        icon={<FiUsers/>}
                        displayName={'Users'}
                        onItemClick={props.onItemClick}
                    />
                    <MenuEntry
                        to="/debug"
                        icon={<BsBootstrapReboot/>}
                        displayName={'Entwicklermenü'}
                        onItemClick={props.onItemClick}
                    />
                </Fragment>
            }
            {user &&
                <MenuEntry
                    to="#"
                    icon={<FaUserCog/>}
                    displayName={'Account bearbeiten'}
                    onItemClick={() => {
                        props.onItemClick();
                        keycloak.accountManagement();
                    }}
                />
            }
            {user &&
                <MenuEntry
                    to="#"
                    icon={<BiLogOut/>}
                    displayName={'Logout'}
                    onItemClick={() => {
                        props.onItemClick();
                        keycloak.logout()
                    }}
                />
            }
        </nav>
    );
}

function MenuEntry(props) {
    return (
        <li>
            <Link to={props.to} onClick={props.onItemClick}>
                {props.icon}
                <span className={'menuEntryDisplayName'}>{props.displayName}</span>
            </Link>
        </li>
    );
}

export default BaseLayout;
