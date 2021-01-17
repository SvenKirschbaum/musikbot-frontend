import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import {LinkContainer} from "react-router-bootstrap";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false}
    }

    static getDerivedStateFromError(error) {
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        //TODO: Report error so some service
    }

    render() {
        if (this.state.hasError) {
            if (this.props.small) return "An error occured";
            return (
                <Container className="NoMatch vertical-center">
                    <Card>
                        <Card.Header>Ein Fehler ist aufgetreten</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                An error occured during the rendering of this page. Please report this to the developer.
                            </Card.Text>
                            <LinkContainer to="/">
                                <Card.Link>Zurück zur Startseite</Card.Link>
                            </LinkContainer>
                        </Card.Body>
                    </Card>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;