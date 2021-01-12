import React from "react";
import { Route } from "react-router-dom";
import Home from "../Home";

const Routes = (props) => {
  console.log("Router props", props);
  return (
    <>
      <Route exact path="/">
        <Home />
      </Route>
    </>
  );
};

export default Routes;
