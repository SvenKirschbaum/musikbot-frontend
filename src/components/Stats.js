import {Switch, useRouteMatch} from "react-router";
import {Route} from "react-router-dom";
import React from "react";
import StatsOverview from "../views/StatsOverview";
import NoMatch from "./NoMatch";
import StatsList from "../views/StatsList";

function Stats() {
    let match = useRouteMatch();
    return (
        <Switch>
            <Route path={`${match.path}/`} exact component={StatsOverview}/>
            <Route path={`${match.path}/played`}>
                <StatsList subRoute="played"/>
            </Route>
            <Route path={`${match.path}/skipped`}>
                <StatsList subRoute="skipped"/>
            </Route>
            <Route component={NoMatch}/>
        </Switch>
    );
}

export default Stats;