import {Component} from "react";

/**
 * A Component that can be used to warp a functional component as a class
 */
class ClassWrapper extends Component {
    render() {
        return (
            this.props.children
        );
    }
}

export default ClassWrapper;