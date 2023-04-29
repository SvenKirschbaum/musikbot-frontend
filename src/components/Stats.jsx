import {Switch, useRouteMatch} from "react-router";
import {Route} from "react-router-dom";
import StatsOverview from "../views/StatsOverview";
import NoMatch from "./NoMatch";
import {StatsDetails} from "../views/StatsList";

function Stats() {
    let match = useRouteMatch();
    return (
        <Switch>
            <Route path={`${match.path}/`} exact component={StatsOverview}/>
            <Route path={`${match.path}/played`}>
                <StatsDetails subRoute="played"/>
            </Route>
            <Route path={`${match.path}/skipped`}>
                <StatsDetails subRoute="skipped"/>
            </Route>
            <Route component={NoMatch}/>
        </Switch>
    );
}

export default Stats;