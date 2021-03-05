import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import NewTransaction from "./components/newTransaction";
import ViewTransaction from "./components/viewTransaction";

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={NewTransaction} />
        <Route exact path="/transacoes" component={ViewTransaction} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
