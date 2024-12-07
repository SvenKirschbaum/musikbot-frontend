import {Route, Routes} from "react-router-dom";
import StatsOverview from "../views/StatsOverview";
import NoMatch from "./NoMatch";
import {StatsDetails} from "../views/StatsList";

function Stats() {
    return (
        <Routes>
            <Route path={`/`} exact element={<StatsOverview/>}/>
            <Route path={`/played`} element={<StatsDetails subRoute="played"/>}>
            </Route>
            <Route path={`/skipped`} element={<StatsDetails subRoute="skipped"/>}/>
            <Route element={<NoMatch/>}/>
        </Routes>
    );
}

export default Stats;