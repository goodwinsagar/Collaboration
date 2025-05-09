import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Pages from "./pages";
import "./utils/appStyles.css";
import utils from "./utils";

function Navigation() {
  const [isSession, setIsSession] = useState(true);
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    // localStorage.clear() // to clear all the localstorage items
    let token = localStorage.getItem("token");
    setIsSession(token !== null && token != "");
    setShowHeader(window.location.pathname !== utils.constants.path.storyBoard);
    console.log(":: TOKEN ", token);
    if(token
    && (window.location.pathname === utils.constants.path.login
            || window.location.pathname === utils.constants.path.register)
    ){
      window.open(utils.constants.path.story,"_self")
    }
  }, []);

  return (
    <Router>
      {!isSession ? (
        <Routes>
          <Route
            exact
            path={utils.constants.path.login}
            element={<Pages.Login />}
          />
          <Route
            path={utils.constants.path.register}
            element={<Pages.Register />}
          />
        </Routes>
      ) : (
        <>
          <div className={"container"}>
            {showHeader && <div className={"header"} />}
            <div className={"content-container"}>
              <Routes>
                <Route
                  path={utils.constants.path.story}
                  element={<Pages.Story />}
                />
                <Route
                  path={utils.constants.path.storyBoard}
                  element={<Pages.StoryBoard />}
                />
                <Route
                    path={utils.constants.path.storyBoardId}
                    element={<Pages.StoryBoard />}
                />
              </Routes>
            </div>
          </div>
        </>
      )}
    </Router>
  );
}

export default Navigation;
