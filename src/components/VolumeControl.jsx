import './VolumeControl.css';
import {FaVolumeUp} from "react-icons/fa";

export default function VolumeControl(props) {
    const {setVolume, onVolume, volume} = props;

    return (
        <div className="d-none d-sm-flex volume-slider-container">
            <FaVolumeUp className="volume-slider-icon"/>
            <input onInput={(e) => setVolume(e.target.value)} onMouseUp={(e) => onVolume(e.target.value)} value={volume}
                   className="volume-slider" type="range" min={0} max={100}/>
        </div>
    );
}