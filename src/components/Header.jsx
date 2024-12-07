import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import './Header.css';
import Config from './Configuration';
import {NavLink} from "react-router-dom";

function Header(props) {
    return (
        <header>
            <Row>
                <Col className="Header text-center"><NavLink to={"/"}>{Config.title2}</NavLink><NavLink
                    to={"/"}>{Config.title}</NavLink></Col>
            </Row>
        </header>
    );
}

export default Header;