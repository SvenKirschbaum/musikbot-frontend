import {Component} from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import {Link} from "react-router-dom";

class NoMatch extends Component {
  render() {
    return (
        <Container className="NoMatch vertical-center">
            <Card>
                <Card.Header>Seite nicht gefunden</Card.Header>
                <Card.Body>
                    <Card.Text>
                        Die gewünschte Seite existiert leider nicht.
                    </Card.Text>
                    <Link to="/">
                        Zurück zur Startseite
                    </Link>
                </Card.Body>
            </Card>
        </Container>
    );
  }
}

export default NoMatch;