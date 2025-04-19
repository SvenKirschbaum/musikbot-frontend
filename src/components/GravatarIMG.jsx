import {Component} from 'react';

class GravatarIMG extends Component {

    render() {
        return (
            <img ref={this.props.ref} key={this.props.children}
                 width={(this.props.size === undefined ? "20" : this.props.size)}
                 height={(this.props.size === undefined ? "20" : this.props.size)} alt="profilbild"
                 src={"https://www.gravatar.com/avatar/" + this.props.children + "?s=" + (this.props.size === undefined ? "20" : this.props.size) + "&d=" + encodeURIComponent("https://musikbot.elite12.de/favicon.png")}/>
        );
    }
}

export default GravatarIMG;